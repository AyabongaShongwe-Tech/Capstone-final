import "./Gallery.css";

/** Image gallery: 1 large image (left) + 4 smaller (right 2x2). */
function Gallery({ images = [] }) {
  const [main, ...rest] = images;
  const thumbs = rest.slice(0, 4);
  console.log("rest of images",thumbs)
  return (
    <div className="gallery">
      <div
        className="gallery__main"
        style={{ backgroundImage: `url(${main})` }}
      />
      <div className="gallery__grid">
        {thumbs.map((src, i) => (
          <div
            key={i}
            className="gallery__thumb"
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
      <button className="gallery__show-all" type="button">
        <span className="gallery__grid-icon" aria-hidden="true">
          ▦
        </span>
        Show all photos
      </button>
    </div>
  );
}

export default Gallery;
