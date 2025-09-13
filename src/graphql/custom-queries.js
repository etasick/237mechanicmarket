export const listMessagesByOwner = /* GraphQL */ `
  query ListMessagesByOwner(
    $userId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessagesByOwner(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        listingId
        senderName
        senderEmail
        senderPhone
        messageText
        messageRead
        createdAt
      }
      nextToken
    }
  }
`;
