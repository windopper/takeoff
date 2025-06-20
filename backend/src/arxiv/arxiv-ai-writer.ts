import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { generateArxivPostPrompt } from '../prompts/arxiv-prompt';
import { ArxivPaper } from './arxiv-parser';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { XmlParseError } from '../exceptions/xml-parse-error';
import { ProcessedPost } from '../manager/post-manager';

export interface AIWriteConfig {
	geminiApiKey: string;
	model?: string;
	temperature?: number;
}

export class ArxivAIWriter {
	private llm: ChatGoogleGenerativeAI;

	constructor(config: AIWriteConfig) {
		this.llm = new ChatGoogleGenerativeAI({
			apiKey: config.geminiApiKey,
			model: config.model || 'gemini-2.5-flash-preview-05-20',
			temperature: config.temperature || 0.4,
		});
	}

	async processPaper(paper: ArxivPaper): Promise<ProcessedPost> {
		let response: string;

		try {
			const prompt = ChatPromptTemplate.fromMessages([
				{
					role: 'user',
					content: [
						{
							type: 'text',
							text: generateArxivPostPrompt(),
						},
						{
							type: 'image_url',
							image_url: {
								url: `data:application/pdf;base64,${paper.pdfBase64}`,
							},
						},
					],
				},
			]);
			response = await prompt.pipe(this.llm).pipe(new StringOutputParser()).invoke({});
		} catch (error) {
			console.error('Arxiv AI Writer: 포스트 생성 중 오류', error);
			throw new Error('Failed to process paper');
		}

		if (!response) {
			throw new Error('Failed to process paper: response is empty');
		}

		const titleMatch = response.match(/<title>\s*(.*?)\s*<\/title>/s);
		const contentMatch = response.match(/<content>\s*(.*?)\s*<\/content>/s);
		const categoryMatch = response.match(/<category>\s*(.*?)\s*<\/category>/s);
		const errorMatch = response.match(/<error>\s*(.*?)\s*<\/error>/s);
		
		if (errorMatch) {
			throw new Error(errorMatch[1].trim());
		}

		if (!titleMatch || !contentMatch || !categoryMatch) {
			throw new XmlParseError('Failed to parse title or content or category');
		}


		const category = categoryMatch[1]
			.trim()
			.split(',')
			.map((c) => c.trim());

		return {
			title: titleMatch[1].trim(),
			content: contentMatch[1].trim(),
			author: 'takeoff-writer',
			category: category.join(','),
			platform: 'arxiv',
			community: 'arxiv',
			originalUrl: paper.url,
			originalTitle: '',
			originalAuthor: '',
			postScore: 0,
		};
	}
}
