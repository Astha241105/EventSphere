import { useState, useEffect, useCallback } from "react";
import EventCard from "../eventcard/Eventcard";
import "./Discoverevents.css";
// 1. Add to imports:
import { useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";


const FILTERS = [
  "All Events",
  "Seminars",
  "Webinars",
  "Quizzes",
  "Hackathons",
];

// Map filter labels to backend category values
const FILTER_MAP = {
  "All Events": null,
  Seminars: "Seminar",
  Webinars: "Webinar",
  Quizzes: "Quiz",
  Hackathons: "Hackathon",
};

const DiscoverEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeFilter, setActiveFilter] = useState("All Events");

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const location = useLocation();

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const cat = params.get("category");
  if (cat && FILTERS.includes(cat)) {
    setActiveFilter(cat);
  }
}, [location.search]);
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch events from backend
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      // Category filter
      if (FILTER_MAP[activeFilter]) {
        params.set("category", FILTER_MAP[activeFilter]);
      }

      // Search filter
      if (debouncedSearch.trim()) {
        params.set("search", debouncedSearch.trim());
      }

      const res = await fetch(`http://localhost:5000/api/events?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await res.json();

      console.log("Fetched events:", data);

      // Backend response:
      // { success: true, count: x, events: [...] }
      setEvents(data.events || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, debouncedSearch]);

  // Fetch whenever filter or search changes
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="de-page">
      {/* Navbar */}
      <nav className="de-navbar">
        <div className="nav-logo">
                  <span className="logo-icon">
                    <img src={logo} alt="logo" id="logo" />
                  </span>
                  <span className="logo-text">EventSphere</span>
                </div>
      </nav>

      <main className="de-main">
        {/* Heading */}
        <h1 className="de-heading">Discover Events</h1>

        {/* Search */}
        <div className="de-search-wrap">
          <span className="de-search__icon">🔍</span>

          <input
            className="de-search__input"
            type="text"
            placeholder="Search seminars, webinars, quizzes, or hackathons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {searchQuery && (
            <button
              className="de-search__clear"
              onClick={() => setSearchQuery("")}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="de-filters">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              className={`de-filter-btn ${
                activeFilter === filter
                  ? "de-filter-btn--active"
                  : ""
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="de-state">
            <div className="de-spinner"></div>
            <p>Loading events...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="de-state">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && events.length === 0 && (
          <div className="de-state de-state--empty">
            <span className="de-state__icon">🔎</span>

            {activeFilter === "All Events" ? (
              <p>
                No events found
                {debouncedSearch
                  ? ` for "${debouncedSearch}"`
                  : ""}
                .
              </p>
            ) : (
              <p>
                No {activeFilter.toLowerCase()} found
                {debouncedSearch
                  ? ` for "${debouncedSearch}"`
                  : ""}
                .
              </p>
            )}
          </div>
        )}

        {/* Events list */}
        {!loading && !error && events.length > 0 && (
          <div className="de-list">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DiscoverEvents;
