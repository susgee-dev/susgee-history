export type ApiRequestOptions = {
	method?: string;
	headers?: Record<string, string>;
	body?: string;
	[key: string]: any;
};
