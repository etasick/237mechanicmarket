/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage(
    $filter: ModelSubscriptionMessageFilterInput
    $ownerId: String
  ) {
    onCreateMessage(filter: $filter, ownerId: $ownerId) {
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
export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage(
    $filter: ModelSubscriptionMessageFilterInput
    $ownerId: String
  ) {
    onUpdateMessage(filter: $filter, ownerId: $ownerId) {
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
export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage(
    $filter: ModelSubscriptionMessageFilterInput
    $ownerId: String
  ) {
    onDeleteMessage(filter: $filter, ownerId: $ownerId) {
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
export const onCreateAppUser = /* GraphQL */ `
  subscription OnCreateAppUser(
    $filter: ModelSubscriptionAppUserFilterInput
    $id: String
  ) {
    onCreateAppUser(filter: $filter, id: $id) {
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
export const onUpdateAppUser = /* GraphQL */ `
  subscription OnUpdateAppUser(
    $filter: ModelSubscriptionAppUserFilterInput
    $id: String
  ) {
    onUpdateAppUser(filter: $filter, id: $id) {
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
export const onDeleteAppUser = /* GraphQL */ `
  subscription OnDeleteAppUser(
    $filter: ModelSubscriptionAppUserFilterInput
    $id: String
  ) {
    onDeleteAppUser(filter: $filter, id: $id) {
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
export const onCreateCategory = /* GraphQL */ `
  subscription OnCreateCategory($filter: ModelSubscriptionCategoryFilterInput) {
    onCreateCategory(filter: $filter) {
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
export const onUpdateCategory = /* GraphQL */ `
  subscription OnUpdateCategory($filter: ModelSubscriptionCategoryFilterInput) {
    onUpdateCategory(filter: $filter) {
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
export const onDeleteCategory = /* GraphQL */ `
  subscription OnDeleteCategory($filter: ModelSubscriptionCategoryFilterInput) {
    onDeleteCategory(filter: $filter) {
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
export const onCreateListing = /* GraphQL */ `
  subscription OnCreateListing(
    $filter: ModelSubscriptionListingFilterInput
    $ownerId: String
  ) {
    onCreateListing(filter: $filter, ownerId: $ownerId) {
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
export const onUpdateListing = /* GraphQL */ `
  subscription OnUpdateListing(
    $filter: ModelSubscriptionListingFilterInput
    $ownerId: String
  ) {
    onUpdateListing(filter: $filter, ownerId: $ownerId) {
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
export const onDeleteListing = /* GraphQL */ `
  subscription OnDeleteListing(
    $filter: ModelSubscriptionListingFilterInput
    $ownerId: String
  ) {
    onDeleteListing(filter: $filter, ownerId: $ownerId) {
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
