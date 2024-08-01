export type BasicParams = {
  chainId?: number;
  pageNumber?: number;
  pageSize?: number;
};

export type RequestParams = BasicParams & {
  appId?: string;
  session?: string;
  user?: string;
};

export type Ranking = {
  attribute: (typeof Attribute)[keyof typeof Attribute];
  direction: (typeof Direction)[keyof typeof Direction];
};

export const Attribute = {
  appId: "appId",
  points: "points",
} as const;

export const Direction = {
  appId: "appId",
  points: "points",
} as const;

export type QueryResponse<T> = {
  data: {
    data: T;
  };
};

export type ListQueryResponse<T> = {
  pageInfo: PageInfo;
  results: T[];
};

export type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageNumber: number;
  pageSize: number;
};
