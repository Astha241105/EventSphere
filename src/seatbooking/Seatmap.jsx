import { useDispatch, useSelector } from "react-redux";
import {
  toggleSeat,
  cancelBooking,
  selectSelectedSeats,
  selectMyBookings,
} from "./seatbookingslice";
import "./SeatMap.css";

const ROW_LABELS = "ABCDEFGHIJKLMNOPQRST";

// ── Single Seat button ────────────────────────────────────────────────────────
const Seat = ({ seat, isSelected, isMyBooking, onToggle }) => {
  const label     = `${ROW_LABELS[seat.row] || seat.row + 1}${seat.col + 1}`;
  const disabled  = seat.occupied && !isMyBooking;

  let cls = "sm-seat";
  if (isMyBooking)   cls += " sm-seat--mine";
  else if (seat.occupied) cls += " sm-seat--occupied";
  else if (isSelected)    cls += " sm-seat--selected";
  else if (seat.vip)      cls += " sm-seat--vip";
  else                    cls += " sm-seat--free";

  const title = isMyBooking
    ? `Your seat · ${label} · ${seat.ticketId}`
    : seat.occupied
    ? `${label} · Occupied`
    : `${label}${seat.vip ? " · VIP" : ""} · Available`;

  return (
    <button
      className={cls}
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={() => !seat.occupied && onToggle(seat._id)}
    >
      {isMyBooking ? "★" : label}
    </button>
  );
};

// ── SeatMap ───────────────────────────────────────────────────────────────────
const SeatMap = ({ room, eventId }) => {
  const dispatch      = useDispatch();
  const selectedSeats = useSelector(selectSelectedSeats);
  const myBookings    = useSelector(selectMyBookings);

  if (!room) return null;

  const myBookedIds = new Set(
    myBookings
      .filter((b) => b.roomId?.toString() === room._id?.toString())
      .map((b) => b.seatId?.toString())
  );

  // Group seats into rows
  const rowMap = {};
  room.seats.forEach((s) => {
    if (!rowMap[s.row]) rowMap[s.row] = [];
    rowMap[s.row].push(s);
  });
  const rows = Object.keys(rowMap)
    .map(Number)
    .sort((a, b) => a - b)
    .map((r) => rowMap[r].sort((a, b) => a.col - b.col));

  const aisleAfter = Math.ceil(room.cols / 2) - 1;

  const handleToggle = (seatId) => dispatch(toggleSeat(seatId));

  const handleCancel = (b) => {
    if (window.confirm(`Cancel your seat ${b.seatLabel}?`)) {
      dispatch(cancelBooking({ eventId, roomId: b.roomId, seatId: b.seatId }));
    }
  };

  const myBookingInRoom = myBookings.find(
    (b) => b.roomId?.toString() === room._id?.toString()
  );

  return (
    <div className="sm-wrap">

      {/* Stage */}
      <div className="sm-stage">◀ &nbsp; STAGE / FRONT &nbsp; ▶</div>

      {/* Grid */}
      <div className="sm-grid" role="grid" aria-label="Seat map">
        {rows.map((rowSeats, ri) => (
          <div key={ri} className="sm-row" role="row">
            {/* Left row label */}
            <span className="sm-row-label" aria-hidden="true">
              {ROW_LABELS[ri] || ri + 1}
            </span>

            {rowSeats.map((seat, ci) => (
              <span key={seat._id}>
                {/* Aisle gap */}
                {ci === aisleAfter + 1 && <span className="sm-aisle" aria-hidden="true" />}
                <Seat
                  seat={seat}
                  isSelected={selectedSeats.includes(seat._id)}
                  isMyBooking={myBookedIds.has(seat._id?.toString())}
                  onToggle={handleToggle}
                />
              </span>
            ))}

            {/* Right row label */}
            <span className="sm-row-label" aria-hidden="true">
              {ROW_LABELS[ri] || ri + 1}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="sm-legend" aria-label="Seat legend">
        <span className="sm-legend-item">
          <i className="sm-dot sm-dot--free" /> Available
        </span>
        {room.vipRows > 0 && (
          <span className="sm-legend-item">
            <i className="sm-dot sm-dot--vip" /> VIP
          </span>
        )}
        <span className="sm-legend-item">
          <i className="sm-dot sm-dot--selected" /> Selected
        </span>
        <span className="sm-legend-item">
          <i className="sm-dot sm-dot--mine" /> Your seat
        </span>
        <span className="sm-legend-item">
          <i className="sm-dot sm-dot--occupied" /> Occupied
        </span>
      </div>

      {/* Your existing booking in this room */}
      {myBookingInRoom && (
        <div className="sm-my-booking-banner">
          <div className="sm-my-booking-info">
            <span className="sm-my-booking-icon">★</span>
            <div>
              <p className="sm-my-booking-seat">
                Seat&nbsp;<strong>{myBookingInRoom.seatLabel}</strong>
                {myBookingInRoom.vip && <span className="sm-vip-tag">VIP</span>}
              </p>
              <p className="sm-my-booking-ticket">Ticket: {myBookingInRoom.ticketId}</p>
            </div>
          </div>
          <button
            className="sm-cancel-btn"
            onClick={() => handleCancel(myBookingInRoom)}
          >
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default SeatMap;