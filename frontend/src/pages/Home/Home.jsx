import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import SearchFilter from "../../components/SearchFilter/SearchFilter";
import Hero from "../../components/Hero/Hero";
import InspirationSection from "../../components/InspirationSection/InspirationSection";
import ExperiencesSection from "../../components/ExperiencesSection/ExperiencesSection";
import GiftCardsSection from "../../components/GiftCardsSection/GiftCardsSection";
import HostingSection from "../../components/HostingSection/HostingSection";
import FutureGetaways from "../../components/FutureGetaways/FutureGetaways";
import Footer from "../../components/Footer/Footer";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  function handleSearch(filters) {
    // Carry the user's preferences to the results page via the URL
    const loc =
      filters.location && filters.location !== "All Location"
        ? filters.location
        : "all";

    const params = new URLSearchParams();
    if (filters.checkIn) params.set("checkIn", filters.checkIn);
    if (filters.checkOut) params.set("checkOut", filters.checkOut);
    if (filters.guests) params.set("guests", String(filters.guests));

    const query = params.toString();
    navigate(
      `/locations/${encodeURIComponent(loc)}${query ? `?${query}` : ""}`
    );
  }

  return (
    <div className="home">
      {/* Black top band: header nav + search pill (matches Figma) */}
      <div className="home__top">
        <Header />
        <div className="home__search">
          <SearchFilter onSearch={handleSearch} />
        </div>
      </div>

      <Hero onCta={() => console.log("Flexible search")} />

      <main>
        <InspirationSection />
        <ExperiencesSection />
        <GiftCardsSection />
        <HostingSection />
        <FutureGetaways />
      </main>

      <Footer />
    </div>
  );
}

export default Home;
