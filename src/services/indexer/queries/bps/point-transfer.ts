export const aggregateUserPointQuery = `
  query AggregateUserPoint(
    $appId: String,
    $chainId: Int,
    $pageNumber: Int = 1,
    $pageSize: Int = 20,
    $session: String,
    $user: String,
    $rankings: AggregateUserPointRankingArgs
  ) {
    data: aggregateUserPoint(
      appId: $appId,
      chainId: $chainId,
      pageNumber: $pageNumber,
      pageSize: $pageSize,
      session: $session,
      user: $user,
      rankings: $rankings
    ){
      pageInfo {
      hasNextPage
      hasPreviousPage
      pageNumber
      pageSize
    }
    results {
      user
      points
    }
  }
}  
`;
