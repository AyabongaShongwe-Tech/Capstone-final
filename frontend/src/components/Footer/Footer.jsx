import "./Footer.css";

// Link columns
const COLUMNS = [
  {
    title: "Support",
    links: [
      "Help Center",
      "Safety information",
      "Cancellation options",
      "Our COVID-19 Response",
      "Supporting people with disabilities",
      "Report a neighborhoood concern",
    ],
  },
  {
    title: "Community",
    links: [
      "Airbnb.org: disaster relief housing",
      "Support: Afghan refugees",
      "Celebrating diversity & belonging",
      "Combating discriminatino",
    ],
  },
  {
    title: "Hosting",
    links: [
      "Try hosting",
      "AirCover: protection for Hosts",
      "Explore hosting resources",
      "Visit our community forum",
      "How to host responsibly",
    ],
  },
  {
    title: "About",
    links: [
      "Newsroom",
      "Learn about new features",
      "Letter from our founders",
      "Careers",
      "Investors",
      "Airbnb Luxe",
    ],
  },
];

function Footer() {
  return (
    <footer className="footer">
      {/* Static footer: 4 link columns */}
      <div className="footer__columns container">
        {COLUMNS.map((col) => (
          <div key={col.title} className="footer__col">
            <h4 className="footer__col-title">{col.title}</h4>
            <ul className="footer__list">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="footer__link">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Copyright bar */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner container">
          <div className="footer__legal">
            <span>© 2022 Airbnb, Inc.</span>
            <span className="footer__dot">·</span>
            <a href="#" className="footer__link">
              Privacy
            </a>
            <span className="footer__dot">·</span>
            <a href="#" className="footer__link">
              Terms
            </a>
            <span className="footer__dot">·</span>
            <a href="#" className="footer__link">
              Sitemap
            </a>
          </div>

          <div className="footer__prefs">
            <button className="footer__pref-btn" type="button">
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M8 .25a7.77 7.77 0 0 1 7.75 7.78 7.75 7.75 0 0 1-7.52 7.72h-.25A7.75 7.75 0 0 1 .25 8.24v-.25A7.75 7.75 0 0 1 7.75.25H8Zm1.95 8.5H6.05c.15 2.9 1.17 5.34 1.88 5.5H8c.68 0 1.72-2.37 1.93-5.23zM4.55 8.75h-2.8c.14 1.3.68 2.5 1.5 3.44.5-.4 1.07-.72 1.7-.96-.24-.75-.37-1.6-.4-2.48zm9.7 0h-2.8c-.03.88-.16 1.73-.4 2.48.63.24 1.2.56 1.7.96.82-.94 1.36-2.14 1.5-3.44zM4.94 4.16l-.14.05c-.44.17-.85.4-1.22.67l-.19.15a6.25 6.25 0 0 0-1.64 3.72h2.8c.04-1.02.2-2 .4-2.8zm2.75-2.28c-.7.16-1.72 2.6-1.87 5.5h3.9c-.15-2.9-1.19-5.34-1.88-5.5zm3.05.44.04.09c.28.68.5 1.5.66 2.42l.05.35c.06.42.1.85.13 1.29h2.8a6.25 6.25 0 0 0-3.68-4.15zm-6.5-.01-.08.03a6.26 6.26 0 0 0-2.16 1.4L3.83 4c.4-.28.85-.5 1.32-.68l-.16-.4z"
                />
              </svg>
              <span className="footer__underline">English (US)</span>
            </button>

            <button className="footer__pref-btn" type="button">
              <span className="footer__currency">$</span>
              <span className="footer__underline">USD</span>
            </button>

            <div className="footer__social">
              <a href="#" aria-label="Facebook" className="footer__social-link">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"
                  />
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="footer__social-link">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M23.95 4.57a10 10 0 0 1-2.83.78 4.93 4.93 0 0 0 2.16-2.72c-.95.56-2 .96-3.13 1.18a4.92 4.92 0 0 0-8.39 4.49A13.97 13.97 0 0 1 1.64 3.16a4.92 4.92 0 0 0 1.52 6.57 4.9 4.9 0 0 1-2.23-.62v.06a4.93 4.93 0 0 0 3.95 4.83 4.94 4.94 0 0 1-2.22.08 4.93 4.93 0 0 0 4.6 3.42A9.87 9.87 0 0 1 0 19.54a13.94 13.94 0 0 0 7.55 2.21c9.06 0 14-7.5 14-14 0-.21 0-.42-.02-.63A9.94 9.94 0 0 0 24 4.59z"
                  />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="footer__social-link">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
