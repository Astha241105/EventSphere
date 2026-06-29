import { configureStore } from "@reduxjs/toolkit";
import seatBookingReducer from "../seatbooking/seatBookingSlice";

// Add other reducers you already have here alongside seatBooking
// e.g.  import myEventsReducer from "../dashboard_for_host/myEventsSlice";

const store = configureStore({
  reducer: {
    seatBooking: seatBookingReducer,
    // myEvents: myEventsReducer,   ← uncomment when you add other slices
  },
});

export default store;