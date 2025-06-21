export interface ParserResult {
    title: string;
    description: string;
    url: string;
    score: number;
    by: string;
    publishedAt: string;
}

export abstract class CommonParser {
	abstract parse(text: string): ParserResult[];
}