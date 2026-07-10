import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ListingForm from "../../../components/ListingForm/ListingForm";
import { createListing } from "../../../utils/api";

function CreateListing() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(payload) {
    setSubmitting(true);
    try {
      await createListing(payload);
      toast.success("Listing created successfully!");
      navigate("/admin/listings");
    } catch (err) {
      toast.error(err.message || "Failed to create listing.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h1 className="admin__page-title">Create Listing</h1>
      <ListingForm
        submitLabel="Create"
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </section>
  );
}

export default CreateListing;
