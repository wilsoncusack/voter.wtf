import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Cursor: any;
  DateTime: any;
  EnsAddress: any;
  HexAddress: any;
  Json: any;
  LogTopic: any;
  Wei: any;
};

/** Address on the blockchain, contains info about tokens and ENS profiles */
export type Address = {
  __typename?: 'Address';
  /** EIP55 checksummed hexadecimal address */
  address: Scalars['HexAddress'];
  /**
   * ENS profile which was used to refer to this address in a top-level argument, null if this address was queried as a hex address instead of an ENS name.
   *
   * *Example:*
   * `address(name: "vitalik.eth") { profile { name } }` will return vitalik.eth as the profile's name.
   */
  profile?: Maybe<Profile>;
  /** ENS profile for the reverse-record set in ENS for this address */
  reverseProfile?: Maybe<Profile>;
  tokens?: Maybe<Array<NonFungibleToken>>;
};


/** Address on the blockchain, contains info about tokens and ENS profiles */
export type AddressTokensArgs = {
  limit?: InputMaybe<Scalars['Int']>;
};

export type Contract = {
  address: Scalars['HexAddress'];
};

export type Cursors = {
  __typename?: 'Cursors';
  /** Returns the elements in the list that come after the specified cursor. */
  after?: Maybe<Scalars['String']>;
  /** Returns the elements in the list that come before the specified cursor. */
  before?: Maybe<Scalars['String']>;
};

export type Erc20Balance = {
  __typename?: 'Erc20Balance';
  amount: Scalars['Wei'];
  contract: Contract;
  owner: Address;
};

export type Erc20BalancesFilter = {
  /** Owner address */
  ownerAddress: Scalars['EnsAddress'];
};

export type Erc20Contract = Contract & {
  __typename?: 'Erc20Contract';
  address: Scalars['HexAddress'];
  decimals?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
};

/** A transfer of an ERC20 token from one address to another, as defined in EIP20. */
export type Erc20Transfer = TransactionEvent & Transfer & {
  __typename?: 'Erc20Transfer';
  /** Block Number in which this transaction was included */
  blockNumber: Scalars['Int'];
  contract?: Maybe<Contract>;
  /** Address containing this token's contract code */
  contractAddress: Scalars['HexAddress'];
  /** Address sending this token, when this contains the "null address" this token was minted during this transfer */
  from: Address;
  /** Position of the log within a block in which this transfer was logged */
  logIndex: Scalars['Int'];
  /** Address receiving this token, when this contains the "null address" this token was burned during this transfer */
  to?: Maybe<Address>;
  /** Transaction in which this transfer occurred */
  transaction: Transaction;
  /** Hash signature of the transaction in which this transfer did occur */
  transactionHash: Scalars['String'];
  /** The amount of tokens sent in this transfer in WEI */
  value: Scalars['Wei'];
};

export type Erc20TransferPage = {
  __typename?: 'Erc20TransferPage';
  /** Cursors for use in Pagination */
  cursors: Cursors;
  /** List of transfers within this page, use the `after` cursor to fetch more tokens */
  erc20Transfers: Array<Erc20Transfer>;
  /** Total amount of items within the given filters. Capped at 10000 for performance reasons. */
  totalCount: Scalars['Int'];
};

export type Erc20TransfersFilter = {
  /** A list of block numbers to include transfers from */
  blockNumbers?: InputMaybe<Array<Scalars['Int']>>;
  /** A contract to include transfers from. */
  contractAddresses?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Categories to exclude transfers from */
  exclude?: InputMaybe<Array<ExcludeTransferFilter>>;
  /** A list of addresses who received the NFT. Ignored when empty. */
  fromAddresses?: InputMaybe<Array<InputMaybe<Scalars['EnsAddress']>>>;
  /** A list of addresses who received the NFT. */
  toAddresses?: InputMaybe<Array<InputMaybe<Scalars['EnsAddress']>>>;
};

export type Erc721Token = NonFungibleToken & {
  __typename?: 'Erc721Token';
  animation?: Maybe<Media>;
  animationUrl?: Maybe<Scalars['String']>;
  attributes?: Maybe<Array<NonFungibleTokenAttribute>>;
  backgroundColor?: Maybe<Scalars['String']>;
  contract: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  externalUrl?: Maybe<Scalars['String']>;
  image?: Maybe<Media>;
  imageStorageType?: Maybe<TokenStorageType>;
  mintPrice: Scalars['Wei'];
  mintTransaction?: Maybe<Transaction>;
  name?: Maybe<Scalars['String']>;
  owner?: Maybe<Address>;
  sales?: Maybe<Array<NonFungibleTokenSale>>;
  tokenId: Scalars['String'];
  tokenUri?: Maybe<Scalars['Json']>;
  youtubeUrl?: Maybe<Scalars['String']>;
};

/** A transfer of an ERC721 non fungible token from one token to another, as defined in EIP721. */
export type Erc721Transfer = TransactionEvent & Transfer & {
  __typename?: 'Erc721Transfer';
  /** Block hash in which this transaction was included */
  blockHash?: Maybe<Scalars['String']>;
  /** Block Number in which this transaction was included */
  blockNumber: Scalars['Int'];
  /** Address containing this token's contract code */
  contract: Address;
  /** Address containing this token's contract code */
  contractAddress: Scalars['HexAddress'];
  /** Address sending this token, when this contains the "null address" this token was minted during this transfer */
  from: Address;
  /** Whether this was a mint initiated by an address that was not the receiver of this transfer */
  isAirdrop: Scalars['Boolean'];
  /** Position of the log within a block in which this transfer was logged */
  logIndex: Scalars['Int'];
  /** Sale log found to be associated with this transfer */
  sale?: Maybe<NonFungibleTokenSale>;
  /** Address receiving this token, when this contains the "null address" this token was burned during this transfer */
  to?: Maybe<Address>;
  /** Metadata for the token which was transferred */
  token: NonFungibleToken;
  /** Token ID which was transferred */
  tokenId: Scalars['String'];
  /** Transaction in which this transfer occurred */
  transaction: Transaction;
  /** Hash signature of the transaction in which this transfer did occur */
  transactionHash: Scalars['String'];
};

export type Erc721TransferPage = {
  __typename?: 'Erc721TransferPage';
  /** Cursors for use in Pagination */
  cursors: Cursors;
  /** List of transfers within this page, use the `after` cursor to fetch more tokens */
  erc721Transfers: Array<Erc721Transfer>;
  /** Total amount of items within the given filters. Capped at 10000 for performance reasons. */
  totalCount: Scalars['Int'];
};

export enum ExcludeTransferFilter {
  /** Mints where the initiatior of the transaction does not match the recipient of the token. We may include transactions that were executed through a trusted contract, such as a marketplace. */
  Airdrop = 'AIRDROP',
  /** Transfers without an associated sale or where the value of the transaction is zero. We may include transactions where there is no indexed sale if it's coming from a trusted contract. */
  ZeroEthTransfer = 'ZERO_ETH_TRANSFER'
}

export enum Marketplace {
  /** Trade made through the Blur marketplace */
  Blur = 'BLUR',
  /** Trade made through the Looksrare marketplace */
  Looksrare = 'LOOKSRARE',
  /** Trade made through a wyvern or seaport contract */
  Opensea = 'OPENSEA'
}

export type Media = {
  __typename?: 'Media';
  /** Blurhash for showing a gradient while images are fetching, uses formatting from https://blurhash.io */
  blurhash?: Maybe<Scalars['String']>;
  /** An arbitrary checksum for this media, useful for caching */
  checksum: Scalars['String'];
  /** Image's height, nil if this media is not an image */
  height?: Maybe<Scalars['Int']>;
  /** A large render for this token */
  largeUrl?: Maybe<Scalars['String']>;
  /** Content-Type as returned by the host of this media */
  mimeType?: Maybe<Scalars['String']>;
  /** A small render for this token */
  smallUrl?: Maybe<Scalars['String']>;
  /** A thumbnail render for this token */
  thumbnailUrl?: Maybe<Scalars['String']>;
  /** Original file stored on Basement's cdn */
  url?: Maybe<Scalars['String']>;
  /** Image's width, nil if this media is not an image */
  width?: Maybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  nonFungibleTokenRefresh?: Maybe<Scalars['String']>;
};


export type MutationNonFungibleTokenRefreshArgs = {
  contract: Scalars['String'];
  tokenId: Scalars['String'];
};

export type NativeTransfer = Transfer & {
  __typename?: 'NativeTransfer';
  /** Block Number in which this transaction was included */
  blockNumber: Scalars['Int'];
  /** Returns the error returned in this trace, null if execution was successful. */
  error?: Maybe<Scalars['String']>;
  errored: Scalars['Boolean'];
  /** Address sending ETH */
  from: Address;
  /** Complete calldata sent with this subcall */
  input?: Maybe<Scalars['String']>;
  /** This field always returns null for native transfers. */
  logIndex?: Maybe<Scalars['Int']>;
  /** First 4 bytes of the input, which refer to the function signature in the contract */
  methodId?: Maybe<Scalars['String']>;
  /** Address receiving ETH */
  to: Address;
  /** Position of this trace in the full tree of subtraces */
  traceAddress: Array<Maybe<Scalars['Int']>>;
  /** Transaction in which this transfer occurred */
  transaction: Transaction;
  /** Hash signature of the transaction in which this transfer did occur */
  transactionHash: Scalars['String'];
  /** Index of this transaction within a block */
  transactionIndex: Scalars['Int'];
  /** Type of event in which this eth was transferred */
  type: NativeTransferType;
  /** The amount of ETH sent in this transfer in WEI */
  value: Scalars['Wei'];
};

export type NativeTransferFilter = {
  /** A list of block numbers to include transfers from */
  blockNumbers?: InputMaybe<Array<Scalars['Int']>>;
  /** A list of addresses who received the native token. Ignored when empty. */
  fromAddresses?: InputMaybe<Array<Scalars['EnsAddress']>>;
  /** Whether to include traces that errored. */
  includeErroredTraces?: InputMaybe<Scalars['Boolean']>;
  /** Whether to include traces from failed transactions. */
  includeFailedTransactions?: InputMaybe<Scalars['Boolean']>;
  /** A list of addresses to whom the native token was sent. Ignored when empty. */
  toAddresses?: InputMaybe<Array<InputMaybe<Scalars['EnsAddress']>>>;
};

export type NativeTransferPage = {
  __typename?: 'NativeTransferPage';
  /** Cursors for use in Pagination */
  cursors: Cursors;
  /** List of transfers within this page, use the `after` cursor to fetch more tokens */
  nativeTransfers: Array<NativeTransfer>;
  /** Total amount of items within the given filters. Capped at 10000 for performance reasons. */
  totalCount: Scalars['Int'];
};

export enum NativeTransferType {
  /** ETH transferred through an internal call or a transaction with no calldata */
  Call = 'CALL',
  /** ETH deposited into a contract upon creation */
  Create = 'CREATE',
  None = 'NONE',
  /** ETH received by destroying a contract */
  Suicide = 'SUICIDE'
}

export enum Network {
  Mainnet = 'MAINNET',
  Sepolia = 'SEPOLIA',
  ZoraGoerli = 'ZORA_GOERLI'
}

/** Metadata of a token as defined in one of the non-fungible token EIPs */
export type NonFungibleToken = {
  /** Animation hosted on Basement CDN */
  animation?: Maybe<Media>;
  /** Token attributes */
  attributes?: Maybe<Array<NonFungibleTokenAttribute>>;
  /** Background color given to this token by the creator */
  backgroundColor?: Maybe<Scalars['String']>;
  /** Contract where token is hosted */
  contract: Scalars['String'];
  /** Description given to this token by the creator */
  description?: Maybe<Scalars['String']>;
  /** External URL given to this token by the creator */
  externalUrl?: Maybe<Scalars['String']>;
  /** Image hosted on Basement CDN */
  image?: Maybe<Media>;
  /** Place of storage for the image file */
  imageStorageType?: Maybe<TokenStorageType>;
  /** Price this token was minted for, inferred from the ether value of the transaction containing the first known transfer */
  mintPrice: Scalars['Wei'];
  /** Transaction containing the first known transfer */
  mintTransaction?: Maybe<Transaction>;
  /** Name given to this token by the creator */
  name?: Maybe<Scalars['String']>;
  /** Current owner of this token */
  owner?: Maybe<Address>;
  /** A list of previous sales for this token */
  sales?: Maybe<Array<NonFungibleTokenSale>>;
  /** Identifier of the token */
  tokenId: Scalars['String'];
  /** Raw metadata as returned by calling tokenUri on the token's contract */
  tokenUri?: Maybe<Scalars['Json']>;
  /** Youtube URL given to this token by the creator */
  youtubeUrl?: Maybe<Scalars['String']>;
};

export type NonFungibleTokenAttribute = {
  __typename?: 'NonFungibleTokenAttribute';
  displayType?: Maybe<Scalars['String']>;
  traitType?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** Index of the log in a transaction signaling the sale. Such as OrdersMatched or OrderFulfilled. */
export type NonFungibleTokenSale = TransactionEvent & {
  __typename?: 'NonFungibleTokenSale';
  /** Currency used for this sale. When null this is the native currency */
  currencyContract?: Maybe<Address>;
  /** In the case of a batch sale, there are multiple sales in one log, this value returns the index within a given log. */
  eventIndex: Scalars['Int'];
  /** Index of the log in a transaction signaling the sale. Such as OrdersMatched or OrderFulfilled. */
  logIndex: Scalars['Int'];
  /** Maker of this sale as defined by the implementing marketplace contract */
  maker: Address;
  /** Marketplace in which this sale occurred */
  marketplace: Marketplace;
  /** Marketplace contract used for this sale */
  marketplaceContract: Address;
  /** Price in wei, always check currency_contract to check whether this price is in the native currency of the chain or an erc20 equivalent */
  price: Scalars['Wei'];
  /** Taker of this sale as defined by the implementing marketplace contract */
  taker: Address;
  /** Metadata for the token which was transferred due to this sale */
  tokenMetadata?: Maybe<NonFungibleToken>;
  transaction: Transaction;
  /** Hash signature of the transaction in which this sale occurred */
  transactionHash: Scalars['String'];
};

export type Profile = {
  __typename?: 'Profile';
  /** Avatar text record, as returned by the ENS resolver. */
  avatar?: Maybe<Scalars['String']>;
  /** Email text record, as returned by the ENS resolver. */
  email?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  /** Returns any text record stored in ENS with the given key. */
  text?: Maybe<Scalars['String']>;
};


export type ProfileTextArgs = {
  key: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  address?: Maybe<Address>;
  addresses?: Maybe<Array<Address>>;
  erc20Balances: Array<Erc20Balance>;
  erc20Transfers: Erc20TransferPage;
  erc721Transfers: Erc721TransferPage;
  nativeTransfers?: Maybe<NativeTransferPage>;
  token?: Maybe<NonFungibleToken>;
  tokens: TokensPage;
  /** Query a transaction */
  transaction?: Maybe<Transaction>;
  transactionLogs?: Maybe<TransactionLogPage>;
  transactions?: Maybe<TransactionPage>;
  transfers?: Maybe<TransferPage>;
};


export type QueryAddressArgs = {
  address: Scalars['String'];
};


export type QueryAddressesArgs = {
  addresses: Array<Scalars['String']>;
};


export type QueryErc20BalancesArgs = {
  filter: Erc20BalancesFilter;
  network?: InputMaybe<Network>;
};


export type QueryErc20TransfersArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<Erc20TransfersFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  network?: InputMaybe<Network>;
};


export type QueryErc721TransfersArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<TransfersFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  network?: InputMaybe<Network>;
};


export type QueryNativeTransfersArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<NativeTransferFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  network?: InputMaybe<Network>;
};


export type QueryTokenArgs = {
  contract: Scalars['String'];
  tokenId: Scalars['String'];
};


export type QueryTokensArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<TokensFilter>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryTransactionArgs = {
  hash: Scalars['String'];
  network?: InputMaybe<Network>;
};


export type QueryTransactionLogsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<TransactionLogFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  network?: InputMaybe<Network>;
  reversed?: InputMaybe<Scalars['Boolean']>;
};


export type QueryTransactionsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<TransactionFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  network?: InputMaybe<Network>;
  reversed?: InputMaybe<Scalars['Boolean']>;
};


export type QueryTransfersArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<TransfersInterfaceFilter>;
  limit?: InputMaybe<Scalars['Int']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  transactionAdded?: Maybe<Transaction>;
};

export enum TokenStorageType {
  /** Stored on IPFS */
  Arweave = 'ARWEAVE',
  /** Stored on IPFS */
  Ipfs = 'IPFS',
  /** Stored in a data-uri */
  OnChain = 'ON_CHAIN',
  /** Stored on the creator's server */
  Server = 'SERVER'
}

export type TokensFilter = {
  /** A list of addresses who own the returned tokens. */
  ownerAddresses?: InputMaybe<Array<Scalars['String']>>;
};

export type TokensPage = {
  __typename?: 'TokensPage';
  /** Cursors for use in Pagination */
  cursors: Cursors;
  /** List of tokens within this page, use the `after` cursor to fetch more tokens */
  tokens: Array<NonFungibleToken>;
  /** Total amount of items within the given filters. Capped at 10000 for performance reasons */
  totalCount: Scalars['Int'];
};

/** A transaction executed and stored on the blockchain */
export type Transaction = {
  __typename?: 'Transaction';
  /** Block Number in which this transaction was included */
  blockNumber: Scalars['Int'];
  /** UTC time at which this block was mined */
  blockTimestamp: Scalars['DateTime'];
  /** Gas price with which the transaction was executed by the miner in wei */
  effectiveGasPrice: Scalars['Wei'];
  /** Erc20 transfers within this transaction */
  erc20Transfers: Array<Erc20Transfer>;
  /** Native transfers within this transaction */
  erc721Transfers: Array<Erc721Transfer>;
  /** Indexed transaction events. See implementations of `TransactionEvent` for possible results, */
  events: Array<TransactionEvent>;
  /** Address which initiated this transaction */
  from: Address;
  /** Maximum amount of gas for which the address allowed the miner to execute */
  gas: Scalars['Int'];
  /** Amount of eth paid to execute this transaction, in wei */
  gasPaid: Scalars['Wei'];
  /** Gas price with which the transaction was sent by the address in wei */
  gasPrice: Scalars['Wei'];
  /** Gas used after execution by the miner */
  gasUsed: Scalars['Int'];
  /** Signature hash for this transaction */
  hash: Scalars['String'];
  /** Unique identifier within transactions in Basement. Can be useful for caching in for example Apollo Client. */
  id: Scalars['ID'];
  /** Position of this transaction within a block */
  index: Scalars['Int'];
  /** Complete calldata sent with this transaction */
  input?: Maybe<Scalars['String']>;
  /** Logs emitted while executing this transaction */
  logs: Array<TransactionLog>;
  /** First 4 bytes of the input, which refer to the function signature of the contract */
  methodId?: Maybe<Scalars['String']>;
  /** Native transfers within this transaction */
  nativeTransfers: Array<NativeTransfer>;
  parsedInput?: Maybe<Scalars['Json']>;
  /** Whether execution on this transaction succeeded */
  status: Scalars['Boolean'];
  /** Address to which this transaction was sent. This can be another wallet, a contract, or nil in the case of a contract creation. */
  to?: Maybe<Address>;
  /** Number of eth sent with the transaction in wei */
  value: Scalars['Wei'];
};


/** A transaction executed and stored on the blockchain */
export type TransactionParsedInputArgs = {
  abi: Scalars['String'];
};

/** An interface implemented by events within a transaction that were indexed in our graph */
export type TransactionEvent = {
  /** Hash signature of the transaction in which this sale occurred */
  transactionHash: Scalars['String'];
};

export type TransactionFilter = {
  /** A list of block numbers to include transactions from */
  blockNumbers?: InputMaybe<Array<Scalars['Int']>>;
  /** A list of addresses who initiated transactions. Ignored when empty. */
  fromAddresses?: InputMaybe<Array<Scalars['EnsAddress']>>;
  /** A list of methodIds as specified in the first 4 bytes of calldata. Note: this field is not verified to be a valid call. Addresses may send transactions with arbitrary data. */
  methodIds?: InputMaybe<Array<Scalars['String']>>;
  /** A list of addresses to whom a transaction was sent. Add `nil` to include contract creation transactions. Ignored when empty. */
  toAddresses?: InputMaybe<Array<InputMaybe<Scalars['EnsAddress']>>>;
};

export type TransactionLog = {
  __typename?: 'TransactionLog';
  /** Address of the contract which emitted this log */
  address: Address;
  /** Block hash in which this log was included */
  blockHash?: Maybe<Scalars['String']>;
  /** Block number in which this log was included */
  blockNumber: Scalars['Int'];
  /** Hex encoded data included in the log. */
  data: Scalars['String'];
  /** Decoded log based on Basement's dataset of ABIs. Use `parsed_data` to decode using a custom ABI or send your ABI to founders (at) basementapp.xyz */
  decoded?: Maybe<Scalars['Json']>;
  /** Position of this log within the block */
  logIndex: Scalars['Int'];
  /** Returns a decoded log when a signature is passed in the abi field. */
  parsedData?: Maybe<Scalars['Json']>;
  /** Whether this log was removed during a block reorg */
  removed: Scalars['Boolean'];
  /** List of hex encoded topics, as indexed by this log event */
  topics: Array<Scalars['String']>;
  /** The transaction during which this log was emitted */
  transaction: Transaction;
  /** Hash signature of the transaction during which this log was emitted */
  transactionHash: Scalars['String'];
};


export type TransactionLogParsedDataArgs = {
  abi: Scalars['String'];
};

export type TransactionLogFilter = {
  /** A list of contract addresses from which this log was emitted.  Ignored when empty. */
  addresses?: InputMaybe<Array<Scalars['EnsAddress']>>;
  /** A list of block hashes to include transaction logs from. Cannot be used in combination with `blockNumbers` or `fromBlock/toBlock` */
  blockHashes?: InputMaybe<Array<Scalars['String']>>;
  /** A list of block numbers to include transaction logs from. Cannot be used in combination with `toBlock` and `fromBlock`. */
  blockNumbers?: InputMaybe<Array<Scalars['Int']>>;
  /** A lower bound on the block range to include logs from. Cannot be used in combination with `blockNumbers`. */
  fromBlock?: InputMaybe<Scalars['Int']>;
  /** Whether to include logs which were removed during a block reorg, defaults to false. */
  includeRemoved?: InputMaybe<Scalars['Boolean']>;
  /** An upper bound on the block range to include logs from. Cannot be used in combination with `blockNumbers`. */
  toBlock?: InputMaybe<Scalars['Int']>;
  /**
   * A list of topics to search for.
   *
   * ## Formatting
   * - Hex encoded: "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
   * - Address: "0xC02AAA39B223FE8D0A0E5C4F27EAD9083C756CC2"
   * - ENS address: "gotu.eth"
   * - Signature: "Transfer(address,address,uint256)"
   *
   * ## Filtering
   * Topics filter is a list of lists, similar to eth_getLogs. When a second, third or fourth topic has been specified, the first topic must be specified for performance reasons.
   * - `[[]]`: Any topic in the first position
   * - `[["Transfer(address,address,uint256)"], [], []]`: Must match the first topic, any topic in the second and third position, these cannot be null.`
   * - `[["Transfer(address,address,uint256)"], [], ["gotu.eth", "vitalik.eth"]]`: Must match the first topic, any topic in the second position, must match any of the addresses in the third position.`
   */
  topics?: InputMaybe<Array<Array<Scalars['LogTopic']>>>;
  /** Filter on the transactions in which a log was emitted. */
  transaction?: InputMaybe<TransactionLogTransactionFilter>;
};

export type TransactionLogPage = {
  __typename?: 'TransactionLogPage';
  /** Cursors for use in Pagination */
  cursors: Cursors;
  /** Total amount of items within the given filters. Capped at 10000 for performance reasons. */
  totalCount: Scalars['Int'];
  /** List of transaction logs within this page, use the `after` cursor to fetch more tokens */
  transactionLogs: Array<TransactionLog>;
};

export type TransactionLogTransactionFilter = {
  /** A list of addresses who initiated the transaction this log was emitted from. Ignored when empty. */
  fromAddresses?: InputMaybe<Array<Scalars['EnsAddress']>>;
  /** A list of addresses to whom a transaction which emitted this log was sent. Add `nil` to include contract creation transactions. Ignored when empty. */
  toAddresses?: InputMaybe<Array<InputMaybe<Scalars['EnsAddress']>>>;
};

export type TransactionPage = {
  __typename?: 'TransactionPage';
  /** Cursors for use in Pagination */
  cursors: Cursors;
  /** Total amount of items within the given filters. Capped at 10000 for performance reasons. */
  totalCount: Scalars['Int'];
  /** List of transactions within this page, use the `after` cursor to fetch more tokens */
  transactions: Array<Transaction>;
};

export type Transfer = {
  /** Block Number in which this transaction was included */
  blockNumber: Scalars['Int'];
  from: Address;
  /** Position of the log within a block in which this transfer was logged. Null for native transfers. */
  logIndex?: Maybe<Scalars['Int']>;
  to?: Maybe<Address>;
  /** Hash signature of the transaction in which this transfer did occur */
  transactionHash: Scalars['String'];
};

export type TransferPage = {
  __typename?: 'TransferPage';
  /** Cursors for use in Pagination */
  cursors: Cursors;
  /** Total amount of items within the given filters. Capped at 10000 for performance reasons. */
  totalCount: Scalars['Int'];
  /** List of transfers within this page, use the `after` cursor to fetch more tokens */
  transfers: Array<Transfer>;
};

export type TransfersFilter = {
  /** A list of block hashes to include erc721 transfers from. Cannot be used in combination with `blockNumbers` or `fromBlock/toBlock` */
  blockHashes?: InputMaybe<Array<Scalars['String']>>;
  /** A list of block numbers to include transfers from */
  blockNumbers?: InputMaybe<Array<Scalars['Int']>>;
  /** A contract to include transfers from. */
  contractAddresses?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Categories to exclude transfers from */
  exclude?: InputMaybe<Array<ExcludeTransferFilter>>;
  /** A list of addresses who received the NFT. Ignored when empty. */
  fromAddresses?: InputMaybe<Array<InputMaybe<Scalars['EnsAddress']>>>;
  /** A lower bound on the block range to include erc721 transfers from. Cannot be used in combination with `blockNumbers`. */
  fromBlock?: InputMaybe<Scalars['Int']>;
  /** A list of addresses who received the NFT. */
  toAddresses?: InputMaybe<Array<InputMaybe<Scalars['EnsAddress']>>>;
  /** An upper bound on the block range to include erc721 transfers from. Cannot be used in combination with `blockNumbers`. */
  toBlock?: InputMaybe<Scalars['Int']>;
  /** Token ids to include transfers from */
  tokenIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type TransfersInterfaceFilter = {
  /** A list of block numbers to include transfers from */
  blockNumbers?: InputMaybe<Array<Scalars['Int']>>;
  /** A list of addresses who received the asset. Ignored when empty. */
  fromAddresses?: InputMaybe<Array<InputMaybe<Scalars['EnsAddress']>>>;
  /** A list of addresses who received the NFT. */
  toAddresses?: InputMaybe<Array<InputMaybe<Scalars['EnsAddress']>>>;
};

export type ProfileFieldsFragment = { __typename?: 'Profile', name: string, avatar?: string | null, twitter?: string | null, email?: string | null };

export type GetEnsInfoQueryVariables = Exact<{
  addresses: Array<Scalars['String']> | Scalars['String'];
}>;


export type GetEnsInfoQuery = { __typename?: 'Query', addresses?: Array<{ __typename?: 'Address', reverseProfile?: { __typename?: 'Profile', name: string, avatar?: string | null, twitter?: string | null, email?: string | null } | null }> | null };

export const ProfileFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Profile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","alias":{"kind":"Name","value":"twitter"},"name":{"kind":"Name","value":"text"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"StringValue","value":"com.twitter","block":false}}]},{"kind":"Field","alias":{"kind":"Name","value":"email"},"name":{"kind":"Name","value":"text"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"StringValue","value":"email","block":false}}]}]}}]} as unknown as DocumentNode<ProfileFieldsFragment, unknown>;
export const GetEnsInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetENSInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"addresses"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addresses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"addresses"},"value":{"kind":"Variable","name":{"kind":"Name","value":"addresses"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reverseProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfileFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Profile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","alias":{"kind":"Name","value":"twitter"},"name":{"kind":"Name","value":"text"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"StringValue","value":"com.twitter","block":false}}]},{"kind":"Field","alias":{"kind":"Name","value":"email"},"name":{"kind":"Name","value":"text"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"StringValue","value":"email","block":false}}]}]}}]} as unknown as DocumentNode<GetEnsInfoQuery, GetEnsInfoQueryVariables>;