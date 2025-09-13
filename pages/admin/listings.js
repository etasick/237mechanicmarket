import { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listListings } from "@/src/graphql/queries";
import { updateListing } from "@/src/graphql/mutations";

export default function AdminListings() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const result = await API.graphql(
          graphqlOperation(listListings, {
            filter: { approved: { eq: false } },
          })
        );
        setListings(result.data.listListings.items);
      } catch (err) {
        console.error("Error fetching listings", err);
      }
    };

    fetchListings();
  }, []);

  const handleApprove = async (id) => {
    try {
      await API.graphql(
        graphqlOperation(updateListing, {
          input: { id, approved: true },
        })
      );
      alert("Listing approved");
      setListings((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Approval error:", err);
      alert("Failed to approve.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Pending Listings</h1>
      {listings.length === 0 ? (
        <p>No pending listings to approve.</p>
      ) : (
        listings.map((listing) => (
          <div
            key={listing.id}
            className="border p-4 mb-4 rounded shadow-sm space-y-2"
          >
            <h2 className="font-semibold">{listing.title}</h2>
            <p>{listing.description}</p>
            <button
              className="bg-green-600 text-white px-4 py-1 rounded"
              onClick={() => handleApprove(listing.id)}
            >
              Approve
            </button>
          </div>
        ))
      )}
    </div>
  );
}
