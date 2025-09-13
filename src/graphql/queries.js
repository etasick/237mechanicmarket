/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
      id
      listingId
      listingTitle
      fromUserId
      fromName
      fromEmail
      body
      ownerId
      sentAt
      answered
      answeredAt
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        listingId
        listingTitle
        fromUserId
        fromName
        fromEmail
        body
        ownerId
        sentAt
        answered
        answeredAt
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getAppUser = /* GraphQL */ `
  query GetAppUser($id: ID!) {
    getAppUser(id: $id) {
      id
      username
      displayName
      phone
      avatarUrl
      isAdmin
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listAppUsers = /* GraphQL */ `
  query ListAppUsers(
    $filter: ModelAppUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAppUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        displayName
        phone
        avatarUrl
        isAdmin
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getCategory = /* GraphQL */ `
  query GetCategory($id: ID!) {
    getCategory(id: $id) {
      id
      name
      description
      slug
      listings {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listCategories = /* GraphQL */ `
  query ListCategories(
    $filter: ModelCategoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCategories(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        slug
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getListing = /* GraphQL */ `
  query GetListing($id: ID!) {
    getListing(id: $id) {
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
      __typename
    }
  }
`;
export const listListings = /* GraphQL */ `
  query ListListings(
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
      nextToken
      __typename
    }
  }
`;
export const listingsByCategoryIdAndCreatedAt = /* GraphQL */ `
  query ListingsByCategoryIdAndCreatedAt(
    $categoryId: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelListingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listingsByCategoryIdAndCreatedAt(
      categoryId: $categoryId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const listingsByOwnerIdAndCreatedAt = /* GraphQL */ `
  query ListingsByOwnerIdAndCreatedAt(
    $ownerId: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelListingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listingsByOwnerIdAndCreatedAt(
      ownerId: $ownerId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const listingsByStatusAndCreatedAt = /* GraphQL */ `
  query ListingsByStatusAndCreatedAt(
    $status: ListingStatus!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelListingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listingsByStatusAndCreatedAt(
      status: $status
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
