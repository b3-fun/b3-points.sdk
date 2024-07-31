export const BPSContractABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
      {
        name: "registryAddress_",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "advanceSession",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "cancelTransfer",
    inputs: [
      {
        name: "uid",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "currentSession",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAvailablePoint",
    inputs: [
      {
        name: "session",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "appId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCurrentSession",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTotalPoint",
    inputs: [
      {
        name: "session",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "appId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTransfer",
    inputs: [
      {
        name: "uid",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Transfer",
        components: [
          {
            name: "uid",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "session",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "appId",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "recipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "point",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "createdAt",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "canceledAt",
            type: "uint64",
            internalType: "uint64",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "grantPoints",
    inputs: [
      {
        name: "requests",
        type: "tuple[]",
        internalType: "struct GrantRequest[]",
        components: [
          {
            name: "appId",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "point",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "registryAddress",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferPoints",
    inputs: [
      {
        name: "appId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "requests",
        type: "tuple[]",
        internalType: "struct TransferRequest[]",
        components: [
          {
            name: "recipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "point",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes32[]",
        internalType: "bytes32[]",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateRegistry",
    inputs: [
      {
        name: "registryAddress_",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PointGranted",
    inputs: [
      {
        name: "session",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "appId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "point",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PointTransferred",
    inputs: [
      {
        name: "session",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "appId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "recipient",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "uid",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
      {
        name: "point",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RegistryUpdated",
    inputs: [
      {
        name: "oldRegistry",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "newRegistry",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SessionUpdated",
    inputs: [
      {
        name: "oldSession",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "newSession",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TransferCanceled",
    inputs: [
      {
        name: "appId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "recipient",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "uid",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "AppNotRegistered",
    inputs: [
      {
        name: "id",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "InsufficientBalance",
    inputs: [
      {
        name: "session",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "appId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "recipient",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "InvalidInput",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidRegistry",
    inputs: [
      {
        name: "registry",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "NotAuthorized",
    inputs: [
      {
        name: "id",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "caller",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "TransferAlreadyCanceled",
    inputs: [
      {
        name: "uid",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
  },
  {
    type: "error",
    name: "TransferAlreadyFinalized",
    inputs: [
      {
        name: "uid",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
  },
] as const;
