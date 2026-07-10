import "./ExperiencesSection.css";
import Discover1 from "../../assets/discover-1.jpg"
import Discover2 from "../../assets/discover-2.jpg"
const CARDS = [
  {
    title: "Things to do\non your trip",
    cta: "Experiences",
    image: Discover1,
  },
  {
    title: "Things to do\nfrom home",
    cta: "Online Experiences",
    image: Discover2,
  },
];

function ExperiencesSection() {
  return (
    <section className="experiences container">
      <h2 className="section-title">Discover Airbnb Experiences</h2>

      <div className="experiences__grid">
        {CARDS.map((card) => (
          <article
            key={card.cta}
            className="exp-card"
            style={{ backgroundImage: `url(${card.image})` }}
          >
            <div className="exp-card__content">
              <h3 className="exp-card__title">{card.title}</h3>
              <button className="exp-card__btn" type="button">
                {card.cta}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ExperiencesSection;
