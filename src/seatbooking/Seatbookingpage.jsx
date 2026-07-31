import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRooms,
  fetchMyBooking,
  bookSeats,
  setActiveRoom,
  toggleSeat,
  clearSelectedSeats,
  clearMessages,
  resetSeatBooking,
  selectRooms,
  selectActiveRoom,
  selectSelectedSeats,
  selectMyBookings,
  selectLoading,
  selectBookingLoading,
  selectError,
  selectSuccess,
  selectLastTicket,
} from "./seatbookingslice";
import SeatMap from "./SeatMap";
import "./SeatBookingPage.css";

const ROW_LABELS = "ABCDEFGHIJKLMNOPQRST";

const SeatBookingPage = () => {
  const { eventId } = useParams();
  const dispatch    = useDispatch();
  const navigate    = useNavigate();

  const rooms          = useSelector(selectRooms);
  const activeRoom     = useSelector(selectActiveRoom);
  const selectedSeats  = useSelector(selectSelectedSeats);
  const myBookings     = useSelector(selectMyBookings);
  const loading        = useSelector(selectLoading);
  const bookingLoading = useSelector(selectBookingLoading);
  const error          = useSelector(selectError);
  const success        = useSelector(selectSuccess);
  const lastTicket     = useSelector(selectLastTicket);

  // Fetch rooms + existing booking on mount
  useEffect(() => {
    dispatch(fetchRooms(eventId));
    // Only fetch my booking if logged in
    if (localStorage.getItem("token")) {
      dispatch(fetchMyBooking(eventId));
    }
    // Clean up on unmount
    return () => dispatch(resetSeatBooking());
  }, [dispatch, eventId]);

  // Auto-dismiss toasts
  useEffect(() => {
    if (!error && !success) return;
    const t = setTimeout(() => dispatch(clearMessages()), 4000);
    return () => clearTimeout(t);
  }, [error, success, dispatch]);

  // Derived stats
  const totalSeats    = rooms.reduce((a, r) => a + r.seats.length, 0);
  const occupiedSeats = rooms.reduce((a, r) => a + r.seats.filter((s) => s.occupied).length, 0);
  const availSeats    = totalSeats - occupiedSeats;

  // Already has a booking in any room
  const alreadyBooked = myBookings.length > 0;

  const handleConfirm = () => {
    if (!selectedSeats.length || !activeRoom) return;
    dispatch(bookSeats({ eventId, roomId: activeRoom._id, seatIds: selectedSeats }));
  };

  const getSeatLabel = (seatId) => {
    const seat = activeRoom?.seats.find((s) => s._id === seatId);
    if (!seat) return seatId;
    return `${ROW_LABELS[seat.row] || seat.row + 1}${seat.col + 1}${seat.vip ? " (VIP)" : ""}`;
  };

  return (
    <div className="sbp-page">

      {/* ── Toasts ── */}
      {error && (
        <div className="sbp-toast sbp-toast--error" role="alert">
          ⚠ {error}
        </div>
      )}
      {success && (
        <div className="sbp-toast sbp-toast--success" role="status">
          ✓ {success}
          {lastTicket && <code className="sbp-ticket-code">{lastTicket}</code>}
        </div>
      )}

      {/* ── Page header ── */}
      <div className="sbp-page-header">
        <button className="sbp-back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div>
          <h1 className="sbp-page-title">Choose Your Seat</h1>
          <p className="sbp-page-sub">Click a seat on the map, then confirm your booking.</p>
        </div>
      </div>

      {/* ── KPI bar ── */}
      <div className="sbp-kpis">
        <div className="sbp-kpi">
          <span className="sbp-kpi-num">{rooms.length}</span>
          <span className="sbp-kpi-lbl">Rooms</span>
        </div>
        <div className="sbp-kpi">
          <span className="sbp-kpi-num">{totalSeats}</span>
          <span className="sbp-kpi-lbl">Total Seats</span>
        </div>
        <div className="sbp-kpi sbp-kpi--taken">
          <span className="sbp-kpi-num">{occupiedSeats}</span>
          <span className="sbp-kpi-lbl">Booked</span>
        </div>
        <div className="sbp-kpi sbp-kpi--avail">
          <span className="sbp-kpi-num">{availSeats}</span>
          <span className="sbp-kpi-lbl">Available</span>
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="sbp-center-state">
          <div className="sbp-spinner" />
          <p>Loading seat map…</p>
        </div>
      )}

      {/* ── No rooms ── */}
      {!loading && rooms.length === 0 && (
        <div className="sbp-center-state">
          <span style={{ fontSize: 36 }}>🪑</span>
          <p>No rooms have been configured for this event.</p>
        </div>
      )}

      {/* ── Main layout ── */}
      {!loading && rooms.length > 0 && (
        <div className="sbp-layout">

          {/* LEFT: room selector + seat map */}
          <div className="sbp-left">

            {/* Room tabs (only if multiple rooms) */}
            {rooms.length > 1 && (
              <div className="sbp-room-tabs">
                {rooms.map((r) => {
                  const occ   = r.seats.filter((s) => s.occupied).length;
                  const total = r.seats.length;
                  const pct   = total ? Math.round((occ / total) * 100) : 0;
                  const isActive = activeRoom?._id === r._id;
                  return (
                    <button
                      key={r._id}
                      className={`sbp-room-tab${isActive ? " sbp-room-tab--active" : ""}`}
                      onClick={() => dispatch(setActiveRoom(r._id))}
                    >
                      <span className="sbp-room-tab-name">{r.name}</span>
                      <span className="sbp-room-tab-meta">{r.type} · {total - occ} free</span>
                      <div className="sbp-room-bar-track">
                        <div className="sbp-room-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Seat map card */}
            <div className="sbp-map-card">
              {activeRoom && (
                <div className="sbp-map-card-header">
                  <span className="sbp-map-card-title">{activeRoom.name}</span>
                  <span className="sbp-map-card-badge">{activeRoom.type}</span>
                  <span className="sbp-map-card-meta">
                    {activeRoom.rows} rows · {activeRoom.cols} seats/row
                    {activeRoom.vipRows > 0 && ` · ${activeRoom.vipRows} VIP row${activeRoom.vipRows > 1 ? "s" : ""}`}
                  </span>
                </div>
              )}
              <SeatMap room={activeRoom} eventId={eventId} />
            </div>
          </div>

          {/* RIGHT: booking panel */}
          <div className="sbp-right">

            {/* Already booked banner */}
            {alreadyBooked && (
              <div className="sbp-booked-banner">
                <span className="sbp-booked-icon">🎟</span>
                <div>
                  <p className="sbp-booked-title">You're registered!</p>
                  {myBookings.map((b) => (
                    <p key={b.seatId} className="sbp-booked-detail">
                      {b.roomName} · Seat <strong>{b.seatLabel}</strong>
                      {b.vip && <span className="sbp-vip-tag">VIP</span>}
                      <br />
                      <code className="sbp-ticket-inline">{b.ticketId}</code>
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Selection panel */}
            {!alreadyBooked && (
              <div className="sbp-panel">
                <h3 className="sbp-panel-title">Your Selection</h3>

                {selectedSeats.length === 0 ? (
                  <div className="sbp-panel-hint">
                    <span>👆</span>
                    <p>Click any available seat on the map to select it.</p>
                  </div>
                ) : (
                  <>
                    <div className="sbp-selected-list">
                      {selectedSeats.map((seatId) => (
                        <div key={seatId} className="sbp-selected-chip">
                          <span className="sbp-selected-label">{getSeatLabel(seatId)}</span>
                          <button
                            className="sbp-deselect-btn"
                            onClick={() => dispatch(toggleSeat(seatId))}
                            title="Remove"
                          >✕</button>
                        </div>
                      ))}
                    </div>

                    <p className="sbp-selection-count">
                      {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""} selected
                    </p>

                    <button
                      className="sbp-confirm-btn"
                      onClick={handleConfirm}
                      disabled={bookingLoading}
                    >
                      {bookingLoading
                        ? "Booking…"
                        : `Confirm · ${selectedSeats.length} seat${selectedSeats.length > 1 ? "s" : ""}`}
                    </button>

                    <button
                      className="sbp-clear-btn"
                      onClick={() => dispatch(clearSelectedSeats())}
                    >
                      Clear selection
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Occupancy for active room */}
            {activeRoom && (
              <div className="sbp-occ-card">
                <p className="sbp-occ-title">Room Occupancy — {activeRoom.name}</p>
                {(() => {
                  const occ   = activeRoom.seats.filter((s) => s.occupied).length;
                  const total = activeRoom.seats.length;
                  const pct   = total ? Math.round((occ / total) * 100) : 0;
                  return (
                    <>
                      <div className="sbp-occ-track">
                        <div className="sbp-occ-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="sbp-occ-row">
                        <span><strong>{occ}</strong> booked</span>
                        <span><strong>{total - occ}</strong> free</span>
                        <span><strong>{pct}%</strong> full</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatBookingPage;