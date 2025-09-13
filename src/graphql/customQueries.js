import { gql } from 'graphql-tag';



export const listListingsWithCategory = gql`
  query ListListingsWithCategory(
    $filter: ModelListingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listListings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        price
        currency
        categoryId
        category {
        id
        name
        description
        slug
        createdAt
        updatedAt
        __typename
      }
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
      }
      nextToken
    }
  }
`;





export const getListing = gql`
  query GetListing($id: ID!) {
    getListing(id: $id) {
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