import { FetchError } from "../exceptions/fetch-error";

export interface ArxivPaper {
    url: string;
    pdfBase64: string;
}

export class ArxivParser {
    private readonly BASE_URL = 'https://arxiv.org/api/query';
    private readonly USER_AGENT = 'TakeoffBot/1.0';

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

    async fetchPaper(url: string): Promise<ArxivPaper> {
        try {
            url = this.changeArxivAbsToPdf(url);

            if (!this.checkUrlValid(url)) {
                throw new FetchError(`Invalid URL: ${url}`);
            }

            const pdfResp = await fetch(url).then(res => res.arrayBuffer());
            const pdf = Buffer.from(pdfResp).toString('base64');
            return {
                url,
                pdfBase64: pdf,
            }
        } catch (error) {
            throw new FetchError(`Failed to fetch paper: ${url}`);
        }
    }

    changeArxivAbsToPdf(url: string): string {
        return url.replace('/abs/', '/pdf/');
    }

    checkUrlValid(url: string): boolean {
        const regex = /^https:\/\/arxiv\.org\/pdf\/[0-9]{4}\.[0-9]{4,5}$/;
        return regex.test(url);
    }   
}