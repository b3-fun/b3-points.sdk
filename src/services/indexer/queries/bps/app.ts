export const listAppsQuery = `
  query ListApps(
    $id: String
    $appId: String,
    $chainId: Int,
    $pageNumber: Int = 1,
    $pageSize: Int = 20,
    $operator: String,
    $rankings: ListAppRankingArgs
  ) {
    data: listApps(
      id: $id
      appId: $appId,
      chainId: $chainId,
      pageNumber: $pageNumber,
      pageSize: $pageSize,
      operator: $operator,
      rankings: $rankings
    ){
      pageInfo {
      hasNextPage
      hasPreviousPage
      pageNumber
      pageSize
    }
    results {
      operator
      id
      ensName
      creator
      createdAt
      chainId
      appId
    }
  }
}  
`;