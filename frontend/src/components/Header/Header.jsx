import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

// Airbnb "bélo" logo mark
function Logo() {
  return (
    <Link to="/" className="header__logo" aria-label="Airbnb home">
      <svg
        viewBox="0 0 24 24"
        role="presentation"
        aria-hidden="true"
        focusable="false"
        className="header__logo-mark"
      >
        <path d="M12.001 18.275c-1.353-1.697-2.148-3.184-2.413-4.457-.263-1.027-.16-1.848.291-2.465.477-.71 1.152-1.056 2.121-1.056.97 0 1.644.345 2.12 1.055.472.625.575 1.435.292 2.464-.278 1.335-1.072 2.82-2.412 4.46zm9.601 1.503c-.244 1.487-1.256 2.694-2.607 3.278-2.657 1.163-5.281-.68-7.52-3.174-2.32 2.611-4.99 4.264-7.522 3.171-1.349-.582-2.36-1.79-2.606-3.275-.13-.816-.057-1.66.216-2.58l-.001-.005c.078-.264.213-.63.386-1.075l.014-.036c.912-2.318 2.492-5.947 4.734-9.867l.058-.104.058-.1c.756-1.322 1.32-2.325 1.755-3.026.505-.813 1.096-1.478 2.116-1.478 1.02 0 1.612.665 2.117 1.478.435.701.999 1.704 1.755 3.026l.058.1.058.104c2.242 3.92 3.822 7.549 4.734 9.867l.014.036c.173.445.308.811.386 1.075l-.001.005c.273.92.346 1.764.216 2.58zm-1.017-1.955c-.077-.26-.216-.634-.4-1.107-.877-2.226-2.416-5.746-4.582-9.539l-.05-.089-.05-.089c-.752-1.315-1.303-2.297-1.716-2.963-.462-.744-.717-.957-1.171-.957-.454 0-.71.213-1.171.957-.413.666-.964 1.648-1.716 2.963l-.05.089-.05.089c-2.166 3.793-3.705 7.313-4.582 9.539-.184.473-.323.847-.4 1.107l-.005.017c-.207.7-.264 1.334-.166 1.944.163.99.838 1.796 1.741 2.184 1.667.716 3.72-.635 5.67-2.859l.216-.247.008-.01c-1.593-1.945-2.54-3.716-2.856-5.242l-.006-.028c-.379-1.483-.218-2.75.508-3.844.727-1.094 1.867-1.641 3.269-1.641s2.542.547 3.269 1.641c.726 1.094.887 2.361.508 3.844l-.006.028c-.316 1.526-1.263 3.297-2.856 5.242l.008.01.216.247c1.95 2.224 4.003 3.575 5.67 2.859.903-.388 1.578-1.195 1.741-2.184.098-.61.041-1.244-.166-1.944z" />
      </svg>
      <span className="header__logo-text">airbnb</span>
    </Link>
  );
}

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm5.5 11.5L21 20"
    />
  </svg>
);

// Compact search shown in the light header.
// With `summary` → shows location/dates/guests; without → "Start your search".
function CompactSearch({ summary }) {
  if (!summary) {
    return (
      <Link
        to="/"
        className="header__compact header__compact--placeholder"
        aria-label="Start your search"
      >
        <span className="header__compact-placeholder">Start your search</span>
        <span className="header__compact-btn" aria-hidden="true">
          <SearchIcon />
        </span>
      </Link>
    );
  }

  const { location = "Anywhere", dates = "Any week", guests = "Add guests" } =
    summary;
  return (
    <Link to="/" className="header__compact" aria-label="Edit search">
      <span className="header__compact-item">{location}</span>
      <span className="header__compact-sep" />
      <span className="header__compact-item">{dates}</span>
      <span className="header__compact-sep" />
      <span className="header__compact-item header__compact-muted">
        {guests}
      </span>
      <span className="header__compact-btn" aria-hidden="true">
        <SearchIcon />
      </span>
    </Link>
  );
}

// Profile pill with a menu that opens on hover.
// Logged out → Log in / Sign up. Logged in → My Reservations / Logout
// (plus an Admin Dashboard shortcut for hosts).
function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isHost, user, logout } = useAuth();
  const navigate = useNavigate();

  // Hosts view reservations inside the admin dashboard; users at /reservations.
  const reservationsPath = isHost ? "/admin/reservations" : "/reservations";

  function handleLogout() {
    logout();
    setOpen(false);
    toast.success("You have been logged out.");
    navigate("/");
  }

  return (
    <div
      className="header__profile-wrap"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Greeting with the username once logged in (matches the mockup) */}
      {isAuthenticated && (
        <span className="header__greeting">{user.username}</span>
      )}

      <button
        className="header__profile"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            d="M2 4h12M2 8h12M2 12h12"
          />
        </svg>
        <span className="header__avatar" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="30" height="30">
            <path
              fill="currentColor"
              d="M16 .7C7.56.7.7 7.56.7 16S7.56 31.3 16 31.3 31.3 24.44 31.3 16 24.44.7 16 .7zm0 28c-4.02 0-7.6-1.88-9.93-4.81a12.43 12.43 0 0 1 6.45-4.4A6.5 6.5 0 0 1 9.5 14a6.5 6.5 0 0 1 13 0 6.5 6.5 0 0 1-3.02 5.49 12.42 12.42 0 0 1 6.45 4.4A12.67 12.67 0 0 1 16 28.7z"
            />
          </svg>
        </span>
      </button>

      {open && (
        <ul className="header__menu" role="menu">
          {isAuthenticated ? (
            <>
              {isHost && (
                <li role="none">
                  <Link
                    role="menuitem"
                    to="/admin"
                    className="header__menu-item is-bold"
                    onClick={() => setOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                </li>
              )}
              <li role="none">
                <Link
                  role="menuitem"
                  to={reservationsPath}
                  className="header__menu-item"
                  onClick={() => setOpen(false)}
                >
                  My Reservations
                </Link>
              </li>
              <li className="header__menu-divider" role="separator" />
              <li role="none">
                <button
                  role="menuitem"
                  type="button"
                  className="header__menu-item header__menu-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li role="none">
                <Link
                  role="menuitem"
                  to="/login"
                  className="header__menu-item is-bold"
                  onClick={() => setOpen(false)}
                >
                  Log in
                </Link>
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
}

// Center navigation links (dark/home header only)
const NAV_LINKS = ["Places to stay", "Experiences", "Online Experiences"];

/**
 * Header
 * @param {"dark"|"light"} variant - "dark" = home (black bar + nav),
 *   "light" = results page (white bar + compact search summary)
 * @param {object} searchSummary - { location, dates, guests } for the compact search
 */
function Header({ variant = "dark", searchSummary,user }) {
  const isLight = variant === "light";

  return (
    <header className={`header${isLight ? " header--light" : ""}`}>
      <div className="header__inner">
        <Logo />

        {isLight && user != 'admin'? (
          <CompactSearch summary={searchSummary} />
        ) : (
          user != 'admin' && (
            <nav className="header__nav" aria-label="Primary">
              {NAV_LINKS.map((label, i) => (
                <a
                  key={label}
                  href="#"
                  className={`header__nav-link${i === 0 ? " is-active" : ""}`}
                >
                  {label}
                </a>
              ))}
            </nav>
          )
        )}

        <div className="header__right">
          { user != 'admin' &&
          <a href="#" className="header__host-link">
            {isLight ? "Become a Host" : "Become a host"}
          </a>
          }

          <button className="header__icon-btn" aria-label="Choose a language">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path
                fill="currentColor"
                d="M8 .25a7.77 7.77 0 0 1 7.75 7.78 7.75 7.75 0 0 1-7.52 7.72h-.25A7.75 7.75 0 0 1 .25 8.24v-.25A7.75 7.75 0 0 1 7.75.25H8Zm1.95 8.5H6.05c.15 2.9 1.17 5.34 1.88 5.5H8c.68 0 1.72-2.37 1.93-5.23zM4.55 8.75h-2.8c.14 1.3.68 2.5 1.5 3.44.5-.4 1.07-.72 1.7-.96-.24-.75-.37-1.6-.4-2.48zm9.7 0h-2.8c-.03.88-.16 1.73-.4 2.48.63.24 1.2.56 1.7.96.82-.94 1.36-2.14 1.5-3.44zM4.94 4.16l-.14.05c-.44.17-.85.4-1.22.67l-.19.15a6.25 6.25 0 0 0-1.64 3.72h2.8c.04-1.02.2-2 .4-2.8zm2.75-2.28c-.7.16-1.72 2.6-1.87 5.5h3.9c-.15-2.9-1.19-5.34-1.88-5.5zm3.05.44.04.09c.28.68.5 1.5.66 2.42l.05.35c.06.42.1.85.13 1.29h2.8a6.25 6.25 0 0 0-3.68-4.15zm-6.5-.01-.08.03a6.26 6.26 0 0 0-2.16 1.4L3.83 4c.4-.28.85-.5 1.32-.68l-.16-.4z"
              />
            </svg>
          </button>

          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}

export default Header;
