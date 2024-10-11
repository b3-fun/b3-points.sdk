import type { Address, Hex } from "viem";

export type Session = {
  createdAt: number;
  id: string;
  sessionId: string;
};

export type GrantRequest = {
  appId: bigint;
  point: bigint;
};

export type TransferRequest = {
  recipient: Address;
  point: bigint;
};

export type Pagination = {
  pageNumber?: number;
  pageSize?: number;
};

export interface UserPointsOptions {
  account: Address;
  appId?: bigint;
  session?: bigint;
}

export interface AppPointsOptions {
  appId: bigint;
  session?: bigint;
}

export type AggregateUserPointsOptions = Pagination & {
  user?: string;
  appId?: bigint;
  session?: bigint;
  rankings?: {
    attribute: "points";
    direction: "ASC" | "DESC";
  };
};

export type AggregateAppPointsOptions = Pagination & {
  session?: bigint;
  rankings?: {
    attribute: "points";
    direction: "ASC" | "DESC";
  };
};

export type ListAppsOptions = Pagination & {
  operator?: Hex;
  ensName?: string;
  rankings?: {
    attribute: "createdAt";
    direction: "ASC" | "DESC";
  };
};

export type ListPointTransfersOptions = Pagination & {
  appId: bigint;
  session?: bigint;
  user?: string;
  status?: "active" | "canceled";
  chainId?: number;
  rankings?: {
    attribute: "points";
    direction: "ASC" | "DESC";
  };
};

export type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageNumber: number;
  pageSize: number;
};

export type ListQueryResponse<T> = {
  pageInfo: PageInfo;
  results: T[];
};

export type UserPoints = {
  user: string;
  points: string;
};

export type PointTransfer = {
  id: string;
  user: string;
  points: string;
  status: string;
  session: string;
  appId: string;
  chainId: string;
};

export type AppPoints = {
  appId: string;
  points: string;
};

export type App = {
  appId: string;
  ensName: string;
  creator: string;
  operator: string;
  createdAt: number;
};
