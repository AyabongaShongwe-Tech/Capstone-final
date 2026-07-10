import "./Hero.css";
import heroImg from "../../assets/hero.jpg";

/**
 * Hero — full-width background image with a heading and CTA button.
 * Replace `src/assets/hero.png` with the real hero image from the Figma design.
 */
function Hero({
  title = "Not sure where to go? Perfect.",
  ctaLabel = "I'm flexible",
  onCta,
}) {
  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${heroImg})` }}
    >
      <div className="hero__overlay" />
      <div className="hero__content">
        <h1 className="hero__title">{title}</h1>
        <button className="hero__cta" type="button" onClick={onCta}>
          {ctaLabel}
        </button>
      </div>
    </section>
  );
}

export default Hero;
