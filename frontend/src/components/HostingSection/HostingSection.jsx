import "./HostingSection.css";
import Hostimage from "../../assets/hosting.jpg"
function HostingSection() {
  return (
    <section className="hosting container">
      <div
        className="hosting__banner"
      >
        <div className="hosting__content">
          <h2 className="hosting__title">
            Questions
            <br />
            about
            <br />
            hosting?
          </h2>
          <button className="hosting__btn" type="button">
            Ask a Superhost
          </button>
        </div>
      </div>
    </section>
  );
}

export default HostingSection;
