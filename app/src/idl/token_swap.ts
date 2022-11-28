export type TokenSwap = {
  "version": "0.1.0",
  "name": "token_swap",
  "instructions": [
    {
      "name": "initializePool",
      "accounts": [
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "solReserveAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintReserveAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "initPrice",
          "type": "u64"
        }
      ]
    },
    {
      "name": "swap",
      "accounts": [
        {
          "name": "poolState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "swapAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userMintAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "swapSolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "swapMintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "inputAmount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "poolState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "mintToken",
            "type": "publicKey"
          },
          {
            "name": "mintReserveAccount",
            "type": "publicKey"
          },
          {
            "name": "solReserveAccount",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "tokenProgramId",
            "type": "publicKey"
          },
          {
            "name": "systemProgramId",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "PoolInitialized",
      "msg": "Pool account is initialized"
    },
    {
      "code": 6001,
      "name": "InvalidOwner",
      "msg": "Invalid owner account"
    },
    {
      "code": 6002,
      "name": "InvalidDelegate",
      "msg": "Invalid delegate"
    },
    {
      "code": 6003,
      "name": "InvalidCloseAuthority",
      "msg": "Invalid close authority"
    },
    {
      "code": 6004,
      "name": "InvalidPrice",
      "msg": "Invalid Price"
    },
    {
      "code": 6005,
      "name": "InvalidTokenProgram",
      "msg": "Invalid token program account"
    },
    {
      "code": 6006,
      "name": "InvalidSystemProgram",
      "msg": "Invalid system program account"
    },
    {
      "code": 6007,
      "name": "CreatePDAFailed",
      "msg": "Create PDA failed"
    },
    {
      "code": 6008,
      "name": "InvalidSwapAuthority",
      "msg": "Invalid swap authority"
    },
    {
      "code": 6009,
      "name": "InvalidInputAccount",
      "msg": "Invalid input account"
    }
  ]
};

export const IDL: TokenSwap = {
  "version": "0.1.0",
  "name": "token_swap",
  "instructions": [
    {
      "name": "initializePool",
      "accounts": [
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "solReserveAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintReserveAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "initPrice",
          "type": "u64"
        }
      ]
    },
    {
      "name": "swap",
      "accounts": [
        {
          "name": "poolState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "swapAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userMintAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "swapSolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "swapMintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "inputAmount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "poolState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "mintToken",
            "type": "publicKey"
          },
          {
            "name": "mintReserveAccount",
            "type": "publicKey"
          },
          {
            "name": "solReserveAccount",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "tokenProgramId",
            "type": "publicKey"
          },
          {
            "name": "systemProgramId",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "PoolInitialized",
      "msg": "Pool account is initialized"
    },
    {
      "code": 6001,
      "name": "InvalidOwner",
      "msg": "Invalid owner account"
    },
    {
      "code": 6002,
      "name": "InvalidDelegate",
      "msg": "Invalid delegate"
    },
    {
      "code": 6003,
      "name": "InvalidCloseAuthority",
      "msg": "Invalid close authority"
    },
    {
      "code": 6004,
      "name": "InvalidPrice",
      "msg": "Invalid Price"
    },
    {
      "code": 6005,
      "name": "InvalidTokenProgram",
      "msg": "Invalid token program account"
    },
    {
      "code": 6006,
      "name": "InvalidSystemProgram",
      "msg": "Invalid system program account"
    },
    {
      "code": 6007,
      "name": "CreatePDAFailed",
      "msg": "Create PDA failed"
    },
    {
      "code": 6008,
      "name": "InvalidSwapAuthority",
      "msg": "Invalid swap authority"
    },
    {
      "code": 6009,
      "name": "InvalidInputAccount",
      "msg": "Invalid input account"
    }
  ]
};
