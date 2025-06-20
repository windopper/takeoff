import { Env } from '..';
import { retrieveSimilarPosts, vectorizeAllPostNotIndexedAndSave, vectorizeAllPostNotIndexedAndSaveInBatch, vectorizeText } from './vectorize-service';

export class VectorizeRoutes {
	static async vectorizeText(req: Request, env: Env): Promise<Response> {
		const body = (await req.json().catch(() => ({}))) as any;
		const text = body.text;

		if (!text) {
			return Response.json(
				{
					error: 'text is required',
				},
				{ status: 400 }
			);
		}

		const vector = await vectorizeText(text);
		return Response.json({
			vector,
		});
	}

	static async vectorizeAllPostNotIndexedAndSave(req: Request, env: Env): Promise<Response> {
		try {
			await vectorizeAllPostNotIndexedAndSave();
			return Response.json({
				message: 'Vectorized all posts not indexed and saved',
			});
		} catch (error) {
			console.error(error);
			return Response.json(
				{
					error: 'Failed to vectorize all posts not indexed and save',
				},
				{ status: 500 }
			);
		}
	}

	static async vectorizeAllPostNotIndexedAndSaveInBatch(req: Request, env: Env): Promise<Response> {
		try {
			await vectorizeAllPostNotIndexedAndSaveInBatch();
			return Response.json({
				message: 'Vectorized all posts not indexed and saved',
			});
		} catch (error) {
			console.error(error);
			return Response.json(
				{
					error: 'Failed to vectorize all posts not indexed and save',
				},
				{ status: 500 }
			);
		}
	}

    static async retrieveSimilarPosts(req: Request, env: Env): Promise<Response> {
        const body = (await req.json().catch(() => ({}))) as any;
        const query = body.query;

        if (!query) {
            return Response.json(
                {
                    error: 'query is required',
                },
                { status: 400 }
            );
        }

        const posts = await retrieveSimilarPosts(query);
        return Response.json({
            posts,
        });
    }
}
