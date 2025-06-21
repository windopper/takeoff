const getApiKeyHeader = () => {
	return {
		'Takeoff-Api-Key': process.env.TAKEOFF_API_KEY || '',
	};
};

export const takeoffFetch = async (url: string, options?: RequestInit) => await fetch(url, {
    ...options,
    headers: {
        ...options?.headers,
        ...getApiKeyHeader(),
    },
})