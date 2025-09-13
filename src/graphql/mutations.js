/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const approveListing = /* GraphQL */ `
  mutation ApproveListing($input: ApproveListingInput!) {
    approveListing(input: $input) {
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
export const createCategory = /* GraphQL */ `
  mutation CreateCategory(
    $input: CreateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    createCategory(input: $input, condition: $condition) {
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
export const updateCategory = /* GraphQL */ `
  mutation UpdateCategory(
    $input: UpdateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    updateCategory(input: $input, condition: $condition) {
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
export const deleteCategory = /* GraphQL */ `
  mutation DeleteCategory(
    $input: DeleteCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    deleteCategory(input: $input, condition: $condition) {
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
export const createListing = /* GraphQL */ `
  mutation CreateListing(
    $input: CreateListingInput!
    $condition: ModelListingConditionInput
  ) {
    createListing(input: $input, condition: $condition) {
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
export const updateListing = /* GraphQL */ `
  mutation UpdateListing(
    $input: UpdateListingInput!
    $condition: ModelListingConditionInput
  ) {
    updateListing(input: $input, condition: $condition) {
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
export const deleteListing = /* GraphQL */ `
  mutation DeleteListing(
    $input: DeleteListingInput!
    $condition: ModelListingConditionInput
  ) {
    deleteListing(input: $input, condition: $condition) {
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
export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage(
    $input: UpdateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    updateMessage(input: $input, condition: $condition) {
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
export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage(
    $input: DeleteMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    deleteMessage(input: $input, condition: $condition) {
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
export const createAppUser = /* GraphQL */ `
  mutation CreateAppUser(
    $input: CreateAppUserInput!
    $condition: ModelAppUserConditionInput
  ) {
    createAppUser(input: $input, condition: $condition) {
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
export const updateAppUser = /* GraphQL */ `
  mutation UpdateAppUser(
    $input: UpdateAppUserInput!
    $condition: ModelAppUserConditionInput
  ) {
    updateAppUser(input: $input, condition: $condition) {
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
export const deleteAppUser = /* GraphQL */ `
  mutation DeleteAppUser(
    $input: DeleteAppUserInput!
    $condition: ModelAppUserConditionInput
  ) {
    deleteAppUser(input: $input, condition: $condition) {
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
export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    createMessage(input: $input, condition: $condition) {
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
