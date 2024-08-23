export type BasicParams = {
  chainId?: number;
  pageNumber?: number;
  pageSize?: number;
  rankings?: Ranking;
};

export type RequestParams = BasicParams & {
  appId?: string;
  session?: string;
  user?: string;
  operator?: string;
  ensName?: string;
};

export type Ranking = {
  attribute: (typeof Attribute)[keyof typeof Attribute];
  direction: (typeof Direction)[keyof typeof Direction];
};

export const Attribute = {
  appId: "appId",
  points: "points",
  createdAt: "createdAt",
} as const;

export const Direction = {
  ASC: "ASC",
  DESC: "DESC",
} as const;

export type QueryResponse<T> = {
  data: {
    data: T;
  };
};
