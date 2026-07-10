import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PLACE_TYPES, AMENITIES } from "../../utils/listingsData";
import "./ListingForm.css";

// Fields that must be positive whole-ish numbers.
const COUNT_FIELDS = ["bedrooms", "bathrooms", "guests"];
// Money fields that must be present and >= 0.
const MONEY_FIELDS = ["price", "weeklyDiscount", "cleaningFee", "serviceFee", "occupancyTaxes"];

const EMPTY = {
  title: "",
  location: "",
  description: "",
  type: "",
  bedrooms: "",
  bathrooms: "",
  guests: "",
  price: "",
  weeklyDiscount: "",
  cleaningFee: "",
  serviceFee: "",
  occupancyTaxes: "",
  amenities: [],
  images: [],
};

// Centralized validation → { field: message }. Empty object means valid.
function validate(v) {
  const e = {};

  if (!v.title.trim()) e.title = "Listing name is required";
  if (!v.location.trim()) e.location = "Location is required";

  if (!v.description.trim()) e.description = "Description is required";
  else if (v.description.trim().length < 20)
    e.description = "Description must be at least 20 characters";

  if (!v.type) e.type = "Please select a type";

  COUNT_FIELDS.forEach((f) => {
    const n = Number(v[f]);
    if (v[f] === "" || v[f] === null) e[f] = "Required";
    else if (!Number.isFinite(n) || n < 1) e[f] = "Must be at least 1";
  });

  MONEY_FIELDS.forEach((f) => {
    const n = Number(v[f]);
    const required = f === "price";
    if (v[f] === "" || v[f] === null) {
      if (required) e[f] = "Required";
      else e[f] = "Required";
    } else if (!Number.isFinite(n) || n < 0) {
      e[f] = "Must be 0 or more";
    } else if (required && n <= 0) {
      e[f] = "Must be greater than 0";
    }
  });

  if (v.amenities.length === 0) e.amenities = "Select at least one amenity";

  return e;
}

// Existing images (Update) arrive from the backend as URL strings; freshly
// uploaded ones are stored as { name, url } with a base64 data URL. Normalize
// both into { name, url } objects for rendering.
function toImageObjects(images = []) {
  return images.map((img) =>
    typeof img === "string"
      ? { name: img.split("/").pop() || "image", url: img }
      : img
  );
}

/**
 * ListingForm — shared by Create and Update Listing pages.
 *
 * @param {object}   initialValues - pre-fill values (Update); merged over EMPTY
 * @param {string}   submitLabel   - primary button text ("Create" / "Update")
 * @param {boolean}  submitting    - disables the form while the request runs
 * @param {function} onSubmit      - called with the cleaned listing payload
 */
function ListingForm({ initialValues, submitLabel = "Create", submitting, onSubmit }) {
  const navigate = useNavigate();
  const [values, setValues] = useState(() => {
    const merged = { ...EMPTY, ...initialValues };
    return { ...merged, images: toImageObjects(merged.images) };
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [customAmenity, setCustomAmenity] = useState("");

  // Amenity choices = the standard list + anything custom already selected.
  const amenityChoices = [
    ...AMENITIES,
    ...values.amenities.filter((a) => !AMENITIES.includes(a)),
  ];

  function setField(name, value) {
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name] || errors[name]) setErrors(validate(next));
  }

  function handleChange(e) {
    setField(e.target.name, e.target.value);
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(values));
  }

  function toggleAmenity(a) {
    const has = values.amenities.includes(a);
    const amenities = has
      ? values.amenities.filter((x) => x !== a)
      : [...values.amenities, a];
    setField("amenities", amenities);
  }

  function addCustomAmenity() {
    const a = customAmenity.trim();
    if (!a) return;
    if (!values.amenities.includes(a)) setField("amenities", [...values.amenities, a]);
    setCustomAmenity("");
  }

  function handleImages(e) {
    const files = Array.from(e.target.files || []);
    // Read each file as a base64 data URL so it can be sent in the JSON body
    // (backend reads req.body.images). Also doubles as the preview src.
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setValues((prev) => ({
          ...prev,
          images: [...prev.images, { name: file.name, url: reader.result }],
        }));
      };
      reader.readAsDataURL(file);
    });
    // Reset so picking the same file again still fires onChange.
    e.target.value = "";
  }

  function removeImage(idx) {
    setField(
      "images",
      values.images.filter((_, i) => i !== idx)
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    // Mark everything touched so all messages show on a failed submit.
    setTouched(
      Object.keys(EMPTY).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    );
    if (Object.keys(validationErrors).length > 0) return;

    // Normalize numeric fields + flatten images to an array of strings
    // (base64 data URLs for new uploads / existing URLs) for req.body.images.
    const payload = {
      ...values,
      bedrooms: Number(values.bedrooms),
      bathrooms: Number(values.bathrooms),
      guests: Number(values.guests),
      price: Number(values.price),
      weeklyDiscount: Number(values.weeklyDiscount),
      cleaningFee: Number(values.cleaningFee),
      serviceFee: Number(values.serviceFee),
      occupancyTaxes: Number(values.occupancyTaxes),
      images: values.images.map((img) => img.url),
    };
    onSubmit(payload);
  }

  // Small helper for the error text under a field.
  const err = (name) =>
    touched[name] && errors[name] ? (
      <p className="field__error">{errors[name]}</p>
    ) : null;

  const inputClass = (name) =>
    `field__input${touched[name] && errors[name] ? " field__input--error" : ""}`;

  return (
    <form className="listing-form" onSubmit={handleSubmit} noValidate>
      {/* Listing name */}
      <div className="field">
        <label className="field__label" htmlFor="title">
          Listing Name
        </label>
        <input
          id="title"
          name="title"
          className={inputClass("title")}
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {err("title")}
      </div>

      {/* Rooms / Baths / Guests / Type */}
      <div className="listing-form__grid-4">
        <div className="field">
          <label className="field__label" htmlFor="bedrooms">
            Rooms
          </label>
          <input
            id="bedrooms"
            name="bedrooms"
            type="number"
            min="1"
            className={inputClass("bedrooms")}
            value={values.bedrooms}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {err("bedrooms")}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="bathrooms">
            Baths
          </label>
          <input
            id="bathrooms"
            name="bathrooms"
            type="number"
            min="1"
            className={inputClass("bathrooms")}
            value={values.bathrooms}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {err("bathrooms")}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="guests">
            Guests
          </label>
          <input
            id="guests"
            name="guests"
            type="number"
            min="1"
            className={inputClass("guests")}
            value={values.guests}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {err("guests")}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="type">
            Type
          </label>
          <select
            id="type"
            name="type"
            className={`field__select${
              touched.type && errors.type ? " field__select--error" : ""
            }`}
            value={values.type}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="">Select…</option>
            {PLACE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {err("type")}
        </div>
      </div>

      {/* Location */}
      <div className="field">
        <label className="field__label" htmlFor="location">
          Location
        </label>
        <input
          id="location"
          name="location"
          className={inputClass("location")}
          value={values.location}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {err("location")}
      </div>

      {/* Description */}
      <div className="field">
        <label className="field__label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className={`field__textarea${
            touched.description && errors.description
              ? " field__textarea--error"
              : ""
          }`}
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {err("description")}
      </div>

      {/* Price + fees */}
      <div className="listing-form__grid-4">
        <div className="field">
          <label className="field__label" htmlFor="price">
            Price / night ($)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            className={inputClass("price")}
            value={values.price}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {err("price")}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="weeklyDiscount">
            Weekly discount ($)
          </label>
          <input
            id="weeklyDiscount"
            name="weeklyDiscount"
            type="number"
            min="0"
            className={inputClass("weeklyDiscount")}
            value={values.weeklyDiscount}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {err("weeklyDiscount")}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="cleaningFee">
            Cleaning fee ($)
          </label>
          <input
            id="cleaningFee"
            name="cleaningFee"
            type="number"
            min="0"
            className={inputClass("cleaningFee")}
            value={values.cleaningFee}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {err("cleaningFee")}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="serviceFee">
            Service fee ($)
          </label>
          <input
            id="serviceFee"
            name="serviceFee"
            type="number"
            min="0"
            className={inputClass("serviceFee")}
            value={values.serviceFee}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {err("serviceFee")}
        </div>
      </div>

      <div className="listing-form__grid-4">
        <div className="field">
          <label className="field__label" htmlFor="occupancyTaxes">
            Occupancy taxes ($)
          </label>
          <input
            id="occupancyTaxes"
            name="occupancyTaxes"
            type="number"
            min="0"
            className={inputClass("occupancyTaxes")}
            value={values.occupancyTaxes}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {err("occupancyTaxes")}
        </div>
      </div>

      {/* Amenities */}
      <div className="field">
        <span className="field__label">Amenities</span>
        <div className="listing-form__amenities">
          {amenityChoices.map((a) => (
            <label key={a} className="listing-form__amenity">
              <input
                type="checkbox"
                checked={values.amenities.includes(a)}
                onChange={() => toggleAmenity(a)}
              />
              {a}
            </label>
          ))}
        </div>

        <div className="listing-form__amenity-add">
          <input
            className="field__input"
            placeholder="Add another amenity"
            value={customAmenity}
            onChange={(e) => setCustomAmenity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomAmenity();
              }
            }}
          />
          <button
            type="button"
            className="btn btn--primary"
            onClick={addCustomAmenity}
          >
            Add
          </button>
        </div>
        {touched.amenities && errors.amenities && (
          <p className="field__error">{errors.amenities}</p>
        )}
      </div>

      {/* Images (optional) */}
      <div className="field">
        <span className="field__label">Images</span>
        <label className="listing-form__upload">
          <input type="file" accept="image/*" multiple onChange={handleImages} hidden />
          <span className="btn btn--primary">Upload Image</span>
        </label>

        {values.images.length > 0 && (
          <div className="listing-form__previews">
            {values.images.map((img, i) => (
              <div key={`${img.name}-${i}`} className="listing-form__preview">
                <img src={img.url} alt={img.name} />
                <button
                  type="button"
                  className="listing-form__preview-remove"
                  aria-label={`Remove ${img.name}`}
                  onClick={() => removeImage(i)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="listing-form__actions">
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </button>
        <button
          type="button"
          className="btn btn--danger"
          onClick={() => navigate("/admin/listings")}
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ListingForm;
