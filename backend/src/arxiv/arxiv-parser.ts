export class ArxivParser {
    private readonly BASE_URL = 'https://arxiv.org/api/query';
    private readonly USER_AGENT = 'TakeoffBot/1.0';

    constructor() {

    }

    async getPapers({ category, limit }: { category: string, limit: number }) {
        const url = `${this.BASE_URL}?category=${category}&limit=${limit}`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': this.USER_AGENT,
            },
        });
        const data = await response.json();
        return data;
    }
}