// src/graphql/customMutations.js
import { gql } from 'graphql-tag';


export const updateListingMinimal = gql`
  mutation UpdateListingMinimal($input: UpdateListingInput!) {
    updateListing(input: $input) {
      id
      mainImageUrl
      galleryImageUrls
      updatedAt
    }
  }
`;

export const deleteListingMinimal = gql`
  mutation DeleteListingMinimal($input: DeleteListingInput!) {
    deleteListing(input: $input) {
      id
      __typename
    }
  }
`;

export const updateListingUser = gql`
  mutation UpdateListingMinimal($input: UpdateListingInput!) {
    updateListing(input: $input) {
      id
      title,
      description,
      price,
      currency,
      condition,
      contactPhone,
      location,
      region
    }
  }
`;

export const updateListingMinimalApproval = gql`
  mutation UpdateListingMinimal($input: UpdateListingInput!) {
    updateListing(input: $input) {
      id
      status
      approvedBy
      approvedAt
    }
  }
`;

export const updateListingApproval = `
  mutation UpdateListingApproval(
    $id: ID!
    $status: ListingStatus!
    $approvedBy: ID!
    $approvedAt: AWSDateTime!
  ) {
    updateListingApproval(
      id: $id
      status: $status
      approvedBy: $approvedBy
      approvedAt: $approvedAt
    ) {
      id
      title
      status
      approvedBy
      approvedAt
    }
  }
`;


export const approveListingMinimal = gql `
  mutation ApproveListing($input: ApproveListingInput!) {
    approveListing(input: $input) {
      id
      title
      description
      price
      currency
      categoryId
      ownerId
      ownerName
      mainImageUrl
      galleryImageUrls
      status
      statusReason
      approvedBy
      approvedAt
      location
      region
      condition
      views
      isFeatured
      specs
      features
      contactPhone
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const createListingMinimal = gql`
  mutation CreateListingMinimal($input: CreateListingInput!) {
    createListing(input: $input) {
      id
      title
      description
      price
      currency
      categoryId
      condition
      location
      region
      status
      mainImageUrl
      ownerId
      ownerName
      features
      contactPhone
      specs
    }
  }
`;
