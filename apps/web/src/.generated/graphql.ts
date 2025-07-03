import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTime: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

/** Root Mutation */
export type Mutation = {
  __typename?: 'Mutation';
  createReport?: Maybe<Report>;
  syncProducts?: Maybe<Array<Product>>;
  syncReport?: Maybe<Report>;
};


/** Root Mutation */
export type MutationCreateReportArgs = {
  month: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
};


/** Root Mutation */
export type MutationSyncProductsArgs = {
  input: MutationSyncProductsInput;
};


/** Root Mutation */
export type MutationSyncReportArgs = {
  input: MutationSyncReportInput;
};

export type MutationSyncProductsInput = {
  deleteProductIds: Array<Scalars['String']['input']>;
  upsertProducts: Array<ProductInput>;
};

export type MutationSyncReportInput = {
  deleteReportItemIds: Array<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  upsertReportItems: Array<ReportItemInput>;
};

export type PendingReportItem = {
  __typename?: 'PendingReportItem';
  inInventory?: Maybe<Scalars['Float']['output']>;
  inQuantity?: Maybe<Scalars['Float']['output']>;
  isPending?: Maybe<Scalars['Boolean']['output']>;
  orderIndex?: Maybe<Scalars['Int']['output']>;
  outInventory?: Maybe<Scalars['Float']['output']>;
  outQuantity?: Maybe<Scalars['Float']['output']>;
  product?: Maybe<Product>;
  productId?: Maybe<Scalars['String']['output']>;
  reportId?: Maybe<Scalars['String']['output']>;
  yearInQuantity?: Maybe<Scalars['Float']['output']>;
};

export type Product = {
  __typename?: 'Product';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  items?: Maybe<Array<ReportItem>>;
  name?: Maybe<Scalars['String']['output']>;
  observations?: Maybe<Scalars['String']['output']>;
  packagingType?: Maybe<Scalars['String']['output']>;
  registeredAt?: Maybe<Scalars['DateTime']['output']>;
  storageType?: Maybe<Scalars['String']['output']>;
  unit?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  usageType?: Maybe<Scalars['String']['output']>;
};

export type ProductInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  observations?: InputMaybe<Scalars['String']['input']>;
  packagingType?: InputMaybe<Scalars['String']['input']>;
  registeredAt?: InputMaybe<Scalars['DateTime']['input']>;
  storageType?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  usageType?: InputMaybe<Scalars['String']['input']>;
};

/** Root Query */
export type Query = {
  __typename?: 'Query';
  product?: Maybe<Product>;
  products?: Maybe<Array<Product>>;
  report?: Maybe<Report>;
  reportItems?: Maybe<Array<ReportItem>>;
  reports?: Maybe<Array<Report>>;
};


/** Root Query */
export type QueryProductArgs = {
  id: Scalars['String']['input'];
};


/** Root Query */
export type QueryReportArgs = {
  month: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
};

export type Report = {
  __typename?: 'Report';
  id?: Maybe<Scalars['ID']['output']>;
  items?: Maybe<Array<ReportItem>>;
  month?: Maybe<Scalars['Int']['output']>;
  pendingItems?: Maybe<Array<PendingReportItem>>;
  year?: Maybe<Scalars['Int']['output']>;
};

export type ReportItem = {
  __typename?: 'ReportItem';
  inInventory?: Maybe<Scalars['Float']['output']>;
  inQuantity?: Maybe<Scalars['Float']['output']>;
  isPending?: Maybe<Scalars['Boolean']['output']>;
  orderIndex?: Maybe<Scalars['Int']['output']>;
  outInventory?: Maybe<Scalars['Float']['output']>;
  outQuantity?: Maybe<Scalars['Float']['output']>;
  product?: Maybe<Product>;
  productId?: Maybe<Scalars['String']['output']>;
  report?: Maybe<Report>;
  reportId?: Maybe<Scalars['String']['output']>;
  yearInQuantity?: Maybe<Scalars['Float']['output']>;
};

export type ReportItemInput = {
  inQuantity: Scalars['Float']['input'];
  outQuantity: Scalars['Float']['input'];
  productId: Scalars['String']['input'];
};

export type MutationKeySpecifier = ('createReport' | 'syncProducts' | 'syncReport' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	createReport?: FieldPolicy<any> | FieldReadFunction<any>,
	syncProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	syncReport?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PendingReportItemKeySpecifier = ('inInventory' | 'inQuantity' | 'isPending' | 'orderIndex' | 'outInventory' | 'outQuantity' | 'product' | 'productId' | 'reportId' | 'yearInQuantity' | PendingReportItemKeySpecifier)[];
export type PendingReportItemFieldPolicy = {
	inInventory?: FieldPolicy<any> | FieldReadFunction<any>,
	inQuantity?: FieldPolicy<any> | FieldReadFunction<any>,
	isPending?: FieldPolicy<any> | FieldReadFunction<any>,
	orderIndex?: FieldPolicy<any> | FieldReadFunction<any>,
	outInventory?: FieldPolicy<any> | FieldReadFunction<any>,
	outQuantity?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productId?: FieldPolicy<any> | FieldReadFunction<any>,
	reportId?: FieldPolicy<any> | FieldReadFunction<any>,
	yearInQuantity?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductKeySpecifier = ('createdAt' | 'id' | 'items' | 'name' | 'observations' | 'packagingType' | 'registeredAt' | 'storageType' | 'unit' | 'updatedAt' | 'usageType' | ProductKeySpecifier)[];
export type ProductFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	items?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	observations?: FieldPolicy<any> | FieldReadFunction<any>,
	packagingType?: FieldPolicy<any> | FieldReadFunction<any>,
	registeredAt?: FieldPolicy<any> | FieldReadFunction<any>,
	storageType?: FieldPolicy<any> | FieldReadFunction<any>,
	unit?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	usageType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('product' | 'products' | 'report' | 'reportItems' | 'reports' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	report?: FieldPolicy<any> | FieldReadFunction<any>,
	reportItems?: FieldPolicy<any> | FieldReadFunction<any>,
	reports?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReportKeySpecifier = ('id' | 'items' | 'month' | 'pendingItems' | 'year' | ReportKeySpecifier)[];
export type ReportFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	items?: FieldPolicy<any> | FieldReadFunction<any>,
	month?: FieldPolicy<any> | FieldReadFunction<any>,
	pendingItems?: FieldPolicy<any> | FieldReadFunction<any>,
	year?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReportItemKeySpecifier = ('inInventory' | 'inQuantity' | 'isPending' | 'orderIndex' | 'outInventory' | 'outQuantity' | 'product' | 'productId' | 'report' | 'reportId' | 'yearInQuantity' | ReportItemKeySpecifier)[];
export type ReportItemFieldPolicy = {
	inInventory?: FieldPolicy<any> | FieldReadFunction<any>,
	inQuantity?: FieldPolicy<any> | FieldReadFunction<any>,
	isPending?: FieldPolicy<any> | FieldReadFunction<any>,
	orderIndex?: FieldPolicy<any> | FieldReadFunction<any>,
	outInventory?: FieldPolicy<any> | FieldReadFunction<any>,
	outQuantity?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productId?: FieldPolicy<any> | FieldReadFunction<any>,
	report?: FieldPolicy<any> | FieldReadFunction<any>,
	reportId?: FieldPolicy<any> | FieldReadFunction<any>,
	yearInQuantity?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	PendingReportItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PendingReportItemKeySpecifier | (() => undefined | PendingReportItemKeySpecifier),
		fields?: PendingReportItemFieldPolicy,
	},
	Product?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductKeySpecifier | (() => undefined | ProductKeySpecifier),
		fields?: ProductFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	Report?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReportKeySpecifier | (() => undefined | ReportKeySpecifier),
		fields?: ReportFieldPolicy,
	},
	ReportItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReportItemKeySpecifier | (() => undefined | ReportItemKeySpecifier),
		fields?: ReportItemFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;
export type MasterSidebarGetDataQueryVariables = Exact<{ [key: string]: never; }>;


export type MasterSidebarGetDataQuery = (
  { __typename?: 'Query' }
  & { reports?: Maybe<Array<(
    { __typename?: 'Report' }
    & Pick<Report, 'id' | 'year' | 'month'>
  )>> }
);


export const MasterSidebarGetDataDocument = gql`
    query MasterSidebarGetData {
  reports {
    id
    year
    month
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    MasterSidebarGetData(variables?: MasterSidebarGetDataQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<MasterSidebarGetDataQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MasterSidebarGetDataQuery>({ document: MasterSidebarGetDataDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'MasterSidebarGetData', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;