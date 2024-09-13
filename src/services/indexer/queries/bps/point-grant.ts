export const aggregateAppPointGrantQuery = `
  query AggregateAppPointGrants(
    $appId: String,
    $chainId: Int,
    $pageNumber: Int = 1,
    $pageSize: Int = 20,
    $session: String,
    $rankings: AggregateAppPointsGrantsRankingArgs
  ) {
    data: aggregateAppPointGrants(
      appId: $appId,
      chainId: $chainId,
      pageNumber: $pageNumber,
      pageSize: $pageSize,
      session: $session,
      rankings: $rankings
    ){
      pageInfo {
      hasNextPage
      hasPreviousPage
      pageNumber
      pageSize
    }
    results {
      appId
      points
    }
  }
}  
`;
export const aggregateSessionPointGrantQuery = `
  query AggregateSessionPointGrants(
    $appId: String,
    $chainId: Int,
    $pageNumber: Int = 1,
    $pageSize: Int = 20,
    $session: String,
    $rankings: AggregateSessionPointsGrantsRankingArgs
  ) {
    data: aggregateAppPointGrants(
      appId: $appId,
      chainId: $chainId,
      pageNumber: $pageNumber,
      pageSize: $pageSize,
      session: $session,
      rankings: $rankings
    ){
      pageInfo {
      hasNextPage
      hasPreviousPage
      pageNumber
      pageSize
    }
    results {
      session
      points
    }
  }
}  
`;
export const listPointGrantsQuery = `
  query ListAppPointGrants(
    $id: String
    $appId: String,
    $chainId: Int,
    $pageNumber: Int = 1,
    $pageSize: Int = 20,
    $session: String,
    $rankings: ListPointsGrantsRankingArgs
  ) {
    data: listPointGrants(
      id: $id,
      appId: $appId,
      chainId: $chainId,
      pageNumber: $pageNumber,
      pageSize: $pageSize,
      session: $session,
      rankings: $rankings
    ){
      pageInfo {
      hasNextPage
      hasPreviousPage
      pageNumber
      pageSize
    }
    results {
      session
      points
      id
      createdAt
      chainId
      appId
    }
  }
}  
`;
export const getAppAvailablePointsQuery = `
  query GetAppAvailablePoints(
    $appId: String!,
    $session: String,
    $chainId: Int,
  ) {
    data: getAppAvailablePoints(
      appId: $appId,
      chainId: $chainId,
      session: $session,
    ){
      appId
      points
  }
}  
`;
