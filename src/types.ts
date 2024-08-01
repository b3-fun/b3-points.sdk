import type { Hex } from "viem";

export type GrantRequest = {
  appId: bigint;
  point: bigint;
};

export type TransferRequest = {
  recipient: Hex;
  point: bigint;
};

export type UserPoints = {
  points: string;
};
