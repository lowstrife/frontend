export type JSONObject = { [key: string]: JSONValue };
export type JSONValue = null | boolean | number | string | object;

export interface QueryState<TParams, TData> {
	// definition
	definition: QueryDefinition<TParams, TData> | null;
	params: TParams | null;
	// state
	data: TData | null;
	loading: boolean;
	error: Error | null;
	timestamp: number;
	expireTime?: number;
}

export interface QueryDefinition<TParams, TData> {
	key: (params?: TParams) => JSONValue;
	fetchFn: (params?: TParams) => Promise<TData>;
	autoRefetch?: boolean;
	expireTime?: number;
	persist?: boolean;
}
