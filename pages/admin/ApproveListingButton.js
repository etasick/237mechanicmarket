'use client';

import { API, graphqlOperation } from 'aws-amplify';
import { updateListing } from '@/src/graphql/mutations';
import { useAuthenticator } from '@aws-amplify/ui-react';

export default function ApproveListingButton({ listing }) {
  const { user } = useAuthenticator((context) => [context.user]);
  const isAdmin = user?.signInUserSession?.accessToken?.payload["cognito:groups"]?.includes('admin');

  const approveListing = async () => {
    if (!isAdmin) return alert("Only admins can approve listings");

    try {
      await API.graphql(graphqlOperation(updateListing, {
        input: {
          id: listing.id,
          approved: true
        }
      }));
      alert("Listing approved");
    } catch (err) {
      console.error("Failed to approve:", err);
      alert("Approval failed");
    }
  };

  if (!isAdmin || listing.approved) return null;

  return <button onClick={approveListing}>Approve</button>;
}
