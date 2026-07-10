import "./ExploreOptions.css";

// Country / continent + nearby cities per listing location
const REGIONS = {
  France: {
    continent: "Europe",
    cities: [
      "Paris", "Nice", "Lyon", "Marseille",
      "Lille", "Aix-en-Provence", "Rouen", "Amiens",
      "Toulouse", "Montpellier", "Dijon", "Grenoble",
    ],
  },
  "United States": {
    continent: "North America",
    cities: [
      "Los Angeles", "San Francisco", "Miami", "Chicago",
      "Boston", "Seattle", "Austin", "Denver",
      "San Diego", "Portland", "Nashville", "New Orleans",
    ],
  },
  Japan: {
    continent: "Asia",
    cities: [
      "Osaka", "Kyoto", "Sapporo", "Fukuoka",
      "Nagoya", "Yokohama", "Hiroshima", "Nara",
      "Kobe", "Sendai", "Kanazawa", "Hakone",
    ],
  },
  Thailand: {
    continent: "Asia",
    cities: [
      "Bangkok", "Phuket", "Chiang Mai", "Krabi",
      "Pattaya", "Koh Samui", "Hua Hin", "Ayutthaya",
      "Koh Phi Phi", "Chiang Rai", "Kanchanaburi", "Sukhothai",
    ],
  },
};

// Map a listing location to its country
const LOCATION_COUNTRY = {
  bordeaux: "France",
  paris: "France",
  "new york": "United States",
  tokoyo: "Japan",
  thailand: "Thailand",
};

const UNIQUE_STAYS = [
  "Beach House Rentals", "Camper Rentals", "Glamping Rentals", "Treehouse Rentals",
  "Cabin Rentals", "Tiny House Rentals", "Lakehouse Rentals", "Mountain Chalet Rentals",
];

function ExploreOptions({ location = "Bordeaux" }) {
  const country = LOCATION_COUNTRY[location.toLowerCase()] || "France";
  const region = REGIONS[country];

  return (
    <section className="explore container">
      <h2 className="explore__title">Explore other options in {country}</h2>
      <div className="explore__grid">
        {region.cities.map((city) => (
          <a key={city} href="#" className="explore__link">
            {city}
          </a>
        ))}
      </div>

      <h2 className="explore__title explore__title--sm">Unique stays on Airbnb</h2>
      <div className="explore__grid">
        {UNIQUE_STAYS.map((stay) => (
          <a key={stay} href="#" className="explore__link">
            {stay}
          </a>
        ))}
      </div>

      <nav className="explore__breadcrumb" aria-label="Breadcrumb">
        <a href="#">Airbnb</a>
        <span className="explore__crumb-sep">›</span>
        <a href="#">{region.continent}</a>
        <span className="explore__crumb-sep">›</span>
        <a href="#">{country}</a>
        <span className="explore__crumb-sep">›</span>
        <span className="explore__crumb-current">{location}</span>
      </nav>
    </section>
  );
}

export default ExploreOptions;
