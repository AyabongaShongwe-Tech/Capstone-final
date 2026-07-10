import { useState } from "react";
import "./FutureGetaways.css";

const TABS = [
  "Destinations for arts & culture",
  "Destinations for outdoor adventure",
  "Mountain cabins",
  "Beach destinations",
  "Popular destinations",
  "Unique Stays",
];

// Cities per tab (arts & culture matches the Figma design)
const CITIES = {
  "Destinations for arts & culture": [
    { city: "Phoenix", region: "Arizona" },
    { city: "Hot Springs", region: "Arkansas" },
    { city: "Los Angeles", region: "California" },
    { city: "San Diego", region: "California" },
    { city: "San Francisco", region: "California" },
    { city: "Barcelona", region: "Catalonia" },
    { city: "Prague", region: "Czechia" },
    { city: "Washington", region: "District of Columbia" },
    { city: "Keswick", region: "England" },
    { city: "London", region: "England" },
    { city: "Scarborough", region: "England" },
  ],
  "Destinations for outdoor adventure": [
    { city: "Aspen", region: "Colorado" },
    { city: "Banff", region: "Alberta" },
    { city: "Queenstown", region: "New Zealand" },
    { city: "Interlaken", region: "Switzerland" },
  ],
  "Mountain cabins": [
    { city: "Gatlinburg", region: "Tennessee" },
    { city: "Big Bear Lake", region: "California" },
    { city: "Whistler", region: "British Columbia" },
  ],
  "Beach destinations": [
    { city: "Malibu", region: "California" },
    { city: "Bali", region: "Indonesia" },
    { city: "Cancún", region: "Mexico" },
  ],
  "Popular destinations": [
    { city: "New York", region: "New York" },
    { city: "Paris", region: "France" },
    { city: "Tokyo", region: "Japan" },
  ],
  "Unique Stays": [
    { city: "Joshua Tree", region: "California" },
    { city: "Reykjavík", region: "Iceland" },
    { city: "Santorini", region: "Greece" },
  ],
};

function FutureGetaways() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const cities = CITIES[activeTab] || [];

  return (
    <section className="getaways container">
      <h2 className="section-title">Inspiration for future getaways</h2>

      <div className="getaways__tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={tab === activeTab}
            className={`getaways__tab${tab === activeTab ? " is-active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="getaways__grid">
        {cities.map(({ city, region }) => (
          <a key={`${city}-${region}`} href="#" className="getaways__item">
            <span className="getaways__city">{city}</span>
            <span className="getaways__region">{region}</span>
          </a>
        ))}
        <a href="#" className="getaways__item getaways__more">
          Show more
        </a>
      </div>
    </section>
  );
}

export default FutureGetaways;
