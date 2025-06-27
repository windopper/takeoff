import { PromptTemplate } from '@langchain/core/prompts';

export const WEEKLY_NEWS_SELECTION_PROMPT = PromptTemplate.fromTemplate(
	`
You are an expert AI news analyst. Your task is to identify the 10 most significant and buzzworthy events from the provided list of posts from the last week.

Here are the criteria for selection:
1.  **High Score**: Posts with a higher 'Score' are more likely to be significant.
2.  **Topic Diversity**: Select events covering a range of topics (e.g., new model releases, major company announcements, open-source projects, AI research trends). Avoid selecting multiple posts about the same event.
3.  **Significance**: Prioritize news that is likely to have a lasting impact on the AI industry.

Analyze the following posts and provide a list of the top 10 events.
Posts:
{posts}

Please provide your output in JSON format, as an array of objects. Each object should represent an event and include the 'title', 'summary', and 'url'.
Example format:
{{
    "events": [
        {{
            "title": "Example Event Title",
            "summary": "A brief summary of why this event is important.",
            "url": "http://example.com/original_post"
        }}
    ]
}}
`
); 