import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "3sg6ldia", // Replace with your Sanity project ID
  dataset: "production", // Replace with your dataset name
  useCdn: true,
  apiVersion: "2023-01-01", // Set an API version (latest)
});
