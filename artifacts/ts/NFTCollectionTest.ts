/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  Contract,
  ContractState,
  TestContractResult,
  HexString,
  ContractFactory,
  SubscribeOptions,
  EventSubscription,
  CallContractParams,
  CallContractResult,
  TestContractParams,
  ContractEvent,
  subscribeContractEvent,
  subscribeContractEvents,
  testMethod,
  callMethod,
  multicallMethods,
  fetchContractState,
  ContractInstance,
  getContractEventsCurrentCount,
} from "@alephium/web3";
import { default as NFTCollectionTestContractJson } from "../nft/NFTCollectionTest.ral.json";
import { getContractByCodeHash } from "./contracts";

// Custom types for the contract
export namespace NFTCollectionTestTypes {
  export type Fields = {
    nftTemplateId: HexString;
    collectionUri: HexString;
    totalSupply: bigint;
  };

  export type State = ContractState<Fields>;

  export interface CallMethodTable {
    getCollectionUri: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<HexString>;
    };
    totalSupply: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    nftByIndex: {
      params: CallContractParams<{ index: bigint }>;
      result: CallContractResult<HexString>;
    };
    mint: {
      params: CallContractParams<{ nftUri: HexString }>;
      result: CallContractResult<HexString>;
    };
  }
  export type CallMethodParams<T extends keyof CallMethodTable> =
    CallMethodTable[T]["params"];
  export type CallMethodResult<T extends keyof CallMethodTable> =
    CallMethodTable[T]["result"];
  export type MultiCallParams = Partial<{
    [Name in keyof CallMethodTable]: CallMethodTable[Name]["params"];
  }>;
  export type MultiCallResults<T extends MultiCallParams> = {
    [MaybeName in keyof T]: MaybeName extends keyof CallMethodTable
      ? CallMethodTable[MaybeName]["result"]
      : undefined;
  };
}

class Factory extends ContractFactory<
  NFTCollectionTestInstance,
  NFTCollectionTestTypes.Fields
> {
  consts = {
    ErrorCodes: { IncorrectTokenIndex: BigInt(0), NFTNotFound: BigInt(1) },
  };

  at(address: string): NFTCollectionTestInstance {
    return new NFTCollectionTestInstance(address);
  }

  tests = {
    getCollectionUri: async (
      params: Omit<
        TestContractParams<NFTCollectionTestTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<HexString>> => {
      return testMethod(this, "getCollectionUri", params);
    },
    totalSupply: async (
      params: Omit<
        TestContractParams<NFTCollectionTestTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "totalSupply", params);
    },
    nftByIndex: async (
      params: TestContractParams<
        NFTCollectionTestTypes.Fields,
        { index: bigint }
      >
    ): Promise<TestContractResult<HexString>> => {
      return testMethod(this, "nftByIndex", params);
    },
    mint: async (
      params: TestContractParams<
        NFTCollectionTestTypes.Fields,
        { nftUri: HexString }
      >
    ): Promise<TestContractResult<HexString>> => {
      return testMethod(this, "mint", params);
    },
  };
}

// Use this object to test and deploy the contract
export const NFTCollectionTest = new Factory(
  Contract.fromJson(
    NFTCollectionTestContractJson,
    "",
    "898896f2a322e795b7d2a8908214eff18fa0ff1e14c4e945380838fac6852023"
  )
);

// Use this class to interact with the blockchain
export class NFTCollectionTestInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<NFTCollectionTestTypes.State> {
    return fetchContractState(NFTCollectionTest, this);
  }

  methods = {
    getCollectionUri: async (
      params?: NFTCollectionTestTypes.CallMethodParams<"getCollectionUri">
    ): Promise<NFTCollectionTestTypes.CallMethodResult<"getCollectionUri">> => {
      return callMethod(
        NFTCollectionTest,
        this,
        "getCollectionUri",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    totalSupply: async (
      params?: NFTCollectionTestTypes.CallMethodParams<"totalSupply">
    ): Promise<NFTCollectionTestTypes.CallMethodResult<"totalSupply">> => {
      return callMethod(
        NFTCollectionTest,
        this,
        "totalSupply",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    nftByIndex: async (
      params: NFTCollectionTestTypes.CallMethodParams<"nftByIndex">
    ): Promise<NFTCollectionTestTypes.CallMethodResult<"nftByIndex">> => {
      return callMethod(
        NFTCollectionTest,
        this,
        "nftByIndex",
        params,
        getContractByCodeHash
      );
    },
    mint: async (
      params: NFTCollectionTestTypes.CallMethodParams<"mint">
    ): Promise<NFTCollectionTestTypes.CallMethodResult<"mint">> => {
      return callMethod(
        NFTCollectionTest,
        this,
        "mint",
        params,
        getContractByCodeHash
      );
    },
  };

  async multicall<Calls extends NFTCollectionTestTypes.MultiCallParams>(
    calls: Calls
  ): Promise<NFTCollectionTestTypes.MultiCallResults<Calls>> {
    return (await multicallMethods(
      NFTCollectionTest,
      this,
      calls,
      getContractByCodeHash
    )) as NFTCollectionTestTypes.MultiCallResults<Calls>;
  }
}
