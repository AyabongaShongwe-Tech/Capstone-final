import "./InspirationSection.css";
import img1 from "../../assets/inspiration.jpg";
import img2 from '../../assets/inspiration2.jpg';
import img3 from '../../assets/inspiration3.jpg';
import img4 from '../../assets/inspiration4.jpg';
// Card data — colors match the Figma design; images live in /public/images/inspiration/
const CARDS = [
  {
    name: "Sandton City Hotel",
    distance: "53 km away",
    color: "#C42B5C",
    image: img1,
  },
  {
    name: "Joburg City Hotel",
    distance: "168 km away",
    color: "#B02D86",
    image: img2,
  },
  {
    name: "Woodmead Hotel",
    distance: "30 miles away",
    color: "#DE4A56",
    image: img3,
  },
  {
    name: "Hyde Park Hotel",
    distance: "34 km away",
    color: "#E1533C",
    image: img4,
  },
];

function InspirationSection() {
  return (
    <section className="inspiration container">
      <h2 className="section-title">Inspiration for your next trip</h2>

      <div className="inspiration__grid">
        {CARDS.map((card) => (
          <a key={card.name} href="#" className="insp-card">
            <div
              className="insp-card__image"
              style={{ backgroundImage: `url(${card.image})` }}
            />
            <div
              className="insp-card__body"
              style={{ backgroundColor: card.color }}
            >
              <h3 className="insp-card__name">{card.name}</h3>
              <p className="insp-card__distance">{card.distance}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default InspirationSection;
