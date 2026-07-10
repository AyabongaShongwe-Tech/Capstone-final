import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ListingForm from "../../../components/ListingForm/ListingForm";
import { getAccommodation, updateListing } from "../../../utils/api";

// Convert a stored listing into form-friendly values (inputs want strings).
function toFormValues(listing) {
  const str = (v) => (v == null ? "" : String(v));
  return {
    title: listing.title || "",
    location: listing.location || "",
    description: listing.description || "",
    type: listing.type || "",
    bedrooms: str(listing.bedrooms),
    bathrooms: str(listing.bathrooms),
    guests: str(listing.guests),
    price: str(listing.price),
    weeklyDiscount: str(listing.weeklyDiscount),
    cleaningFee: str(listing.cleaningFee),
    serviceFee: str(listing.serviceFee),
    occupancyTaxes: str(listing.occupancyTaxes),
    amenities: listing.amenities || [],
    images: listing.images || [],
  };
}

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const listing = await getAccommodation(id);
        setInitialValues(toFormValues(listing));
      } catch {
        toast.error("Listing not found.");
        navigate("/admin/listings");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  async function handleSubmit(payload) {
    setSubmitting(true);
    try {
      await updateListing(id, payload);
      toast.success("Listing updated successfully!");
      navigate("/admin/listings");
    } catch (err) {
      toast.error(err.message || "Failed to update listing.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h1 className="admin__page-title">Update Listing</h1>
      {loading ? (
        <p className="admin__state">Loading listing…</p>
      ) : (
        <ListingForm
          initialValues={initialValues}
          submitLabel="Update"
          submitting={submitting}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  );
}

export default EditListing;
