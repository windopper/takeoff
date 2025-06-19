'use server';

export const getApiKeyHeader = () => {
	return {
		'Takeoff-Api-Key': process.env.TAKEOFF_API_KEY || '',
	};
};