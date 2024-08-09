import type { Hex } from "viem";

export type GrantRequest = {
  appId: bigint;
  point: bigint;
};

export type TransferRequest = {
  recipient: Hex;
  point: bigint;
};

export type ListQueryResponse<T> = {
  pageInfo: PageInfo;
  results: T[];
};

export type Pagination = {
  pageNumber?: number;
  pageSize?: number;
};

export type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageNumber: number;
  pageSize: number;
};

export type UserPoints = {
  user: string;
  points: string;
};

export interface UserPointsOptions {
  account: Hex;
  appId?: bigint;
  session?: bigint;
}

export type AggregateUserPointsOptions = Pagination & {
  appId?: bigint;
  session?: bigint;
  rankings?: {
    attribute: "points";
    direction: "ASC" | "DESC";
  };
};
