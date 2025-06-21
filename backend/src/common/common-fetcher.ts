export class CommonFetcher {
    private readonly USER_AGENT = 'TakeoffBot/1.0';

    async fetch(url: string): Promise<Response> {
        const response = await fetch(url, {
            headers: { 'User-Agent': this.USER_AGENT }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }

        return response;
    }
}