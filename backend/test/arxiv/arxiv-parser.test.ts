import { expect, test } from "vitest";
import { ArxivParser } from "../../src/arxiv/arxiv-parser";

test('arxiv parser', async () => {
    const parser = new ArxivParser();
    const paper = await parser.fetchPaper('https://arxiv.org/pdf/2506.09879');
    
    expect(paper.url).toBe('https://arxiv.org/pdf/2506.09879');
    expect(paper.pdfBase64).toBeDefined();
})

test('arxiv parser checkUrlValid', () => {
    const parser = new ArxivParser();
    const isValid = parser.checkUrlValid('https://arxiv.org/pdf/2506.09879');
    expect(isValid).toBe(true);
})