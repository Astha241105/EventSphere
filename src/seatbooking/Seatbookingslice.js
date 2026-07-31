import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE = "https://eventsphere-backend-he6w.onrender.com/api/events";
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

// ── Thunks ────────────────────────────────────────────────────────────────────

// Fetch all rooms + seat grid for an event (public)
export const fetchRooms = createAsyncThunk(
  "seatBooking/fetchRooms",
  async (eventId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE}/${eventId}/rooms`);
      return data.rooms;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load rooms");
    }
  }
);

// Book one or more seats (auth required)
export const bookSeats = createAsyncThunk(
  "seatBooking/bookSeats",
  async ({ eventId, roomId, seatIds }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE}/${eventId}/rooms/${roomId}/book`,
        { seatIds },
        auth()
      );
      return {
        roomId,
        bookedSeats:    data.bookedSeats,
        ticketId:       data.ticketId,
        roomName:       data.roomName,
        registrationId: data.registrationId,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Booking failed");
    }
  }
);

// Cancel a booking (auth required)
export const cancelBooking = createAsyncThunk(
  "seatBooking/cancelBooking",
  async ({ eventId, roomId, seatId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE}/${eventId}/rooms/${roomId}/book/${seatId}`, auth());
      return { roomId, seatId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Cancel failed");
    }
  }
);

// Fetch the current user's booking for this event
export const fetchMyBooking = createAsyncThunk(
  "seatBooking/fetchMyBooking",
  async (eventId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE}/${eventId}/my-booking`, auth());
      return data.bookings;   // array (usually 1 entry)
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load booking");
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const seatBookingSlice = createSlice({
  name: "seatBooking",
  initialState: {
    rooms:          [],
    activeRoomId:   null,
    selectedSeats:  [],       // seat _ids clicked but not yet confirmed
    myBookings:     [],       // [{seatId, roomId, seatLabel, ticketId, ...}]
    loading:        false,
    bookingLoading: false,
    error:          null,
    successMessage: null,
    lastTicketId:   null,
  },
  reducers: {
    setActiveRoom(state, { payload }) {
      state.activeRoomId  = payload;
      state.selectedSeats = [];   // clear selection when switching rooms
    },
    toggleSeat(state, { payload: seatId }) {
      const idx = state.selectedSeats.indexOf(seatId);
      if (idx >= 0) state.selectedSeats.splice(idx, 1);
      else          state.selectedSeats.push(seatId);
    },
    clearSelectedSeats(state) {
      state.selectedSeats = [];
    },
    clearMessages(state) {
      state.error          = null;
      state.successMessage = null;
    },
    // Call when leaving the page so stale data doesn't persist
    resetSeatBooking(state) {
      state.rooms          = [];
      state.activeRoomId   = null;
      state.selectedSeats  = [];
      state.myBookings     = [];
      state.error          = null;
      state.successMessage = null;
      state.lastTicketId   = null;
    },
  },
  extraReducers: (builder) => {

    // fetchRooms
    builder
      .addCase(fetchRooms.pending,    (state) => { state.loading = true;  state.error = null; })
      .addCase(fetchRooms.fulfilled,  (state, { payload }) => {
        state.loading      = false;
        state.rooms        = payload;
        // Auto-select first room if none active
        if (payload.length > 0 && !state.activeRoomId)
          state.activeRoomId = payload[0]._id;
      })
      .addCase(fetchRooms.rejected,   (state, { payload }) => { state.loading = false; state.error = payload; });

    // bookSeats
    builder
      .addCase(bookSeats.pending,     (state) => { state.bookingLoading = true;  state.error = null; })
      .addCase(bookSeats.fulfilled,   (state, { payload }) => {
        state.bookingLoading = false;
        state.selectedSeats  = [];
        state.lastTicketId   = payload.ticketId;
        state.successMessage = `Booked! Ticket: ${payload.ticketId}`;

        // Update seat status in local rooms state so map re-renders immediately
        const room = state.rooms.find((r) => r._id === payload.roomId);
        if (room) {
          payload.bookedSeats.forEach((updated) => {
            const seat = room.seats.find((s) => s._id === updated._id);
            if (seat) {
              seat.occupied = true;
              seat.ticketId = updated.ticketId;
            }
          });
        }

        // Add to myBookings so the "Your Booking" panel shows immediately
        payload.bookedSeats.forEach((s) => {
          state.myBookings.push({
            roomId:    payload.roomId,
            roomName:  payload.roomName,
            seatId:    s._id,
            seatLabel: s.seatLabel,
            vip:       s.vip,
            ticketId:  payload.ticketId,
          });
        });
      })
      .addCase(bookSeats.rejected,    (state, { payload }) => { state.bookingLoading = false; state.error = payload; });

    // cancelBooking
    builder
      .addCase(cancelBooking.fulfilled, (state, { payload }) => {
        state.successMessage = "Booking cancelled successfully";
        // Free up seat in local state
        const room = state.rooms.find((r) => r._id === payload.roomId);
        if (room) {
          const seat = room.seats.find((s) => s._id === payload.seatId);
          if (seat) { seat.occupied = false; seat.ticketId = null; }
        }
        state.myBookings = state.myBookings.filter((b) => b.seatId !== payload.seatId);
      })
      .addCase(cancelBooking.rejected,  (state, { payload }) => { state.error = payload; });

    // fetchMyBooking
    builder
      .addCase(fetchMyBooking.fulfilled, (state, { payload }) => { state.myBookings = payload; });
  },
});

export const {
  setActiveRoom,
  toggleSeat,
  clearSelectedSeats,
  clearMessages,
  resetSeatBooking,
} = seatBookingSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectRooms          = (s) => s.seatBooking.rooms;
export const selectActiveRoom     = (s) =>
  s.seatBooking.rooms.find((r) => r._id === s.seatBooking.activeRoomId) || null;
export const selectSelectedSeats  = (s) => s.seatBooking.selectedSeats;
export const selectMyBookings     = (s) => s.seatBooking.myBookings;
export const selectLoading        = (s) => s.seatBooking.loading;
export const selectBookingLoading = (s) => s.seatBooking.bookingLoading;
export const selectError          = (s) => s.seatBooking.error;
export const selectSuccess        = (s) => s.seatBooking.successMessage;
export const selectLastTicket     = (s) => s.seatBooking.lastTicketId;

export default seatBookingSlice.reducer;