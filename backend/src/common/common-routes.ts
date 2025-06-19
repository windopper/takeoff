import { Env } from '..';
import { PostManager } from '../manager/post-manager';

export class CommonRoutes {
	static async getPosts(req: Request, env: Env): Promise<Response> {
		const url = new URL(req.url);
		const limit = parseInt(url.searchParams.get('limit') || '10');
		const offset = parseInt(url.searchParams.get('offset') || '0');
		const sort = url.searchParams.get('sort') || 'createdAt';
		const order = url.searchParams.get('order') || 'desc';
		const q = url.searchParams.get('q');
		const platform = url.searchParams.get('platform');
		const community = url.searchParams.get('community');
		const category = url.searchParams.get('category');

		const postManager = new PostManager(env.DB);

		let posts;
		posts = await postManager.getPosts({
			limit,
			offset,
			query: q || '',
			platform: platform || '',
			community: community || '',
			sort,
			order,
			category: category || '',
		});

		return Response.json({
			posts,
			pagination: {
				limit,
				offset,
				platform,
				community,
			},
		});
	}

	static async getPostCount(req: Request, env: Env): Promise<Response> {
		const postManager = new PostManager(env.DB);
		const url = new URL(req.url);
		const q = url.searchParams.get('q');
		const category = url.searchParams.get('category');
		const count = await postManager.getPostCount({ query: q || '', category: category || '' });
		return Response.json({ count });
	}

    static async getPostById(req: Request, env: Env): Promise<Response> {
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();

        if (!id) {
            return Response.json({
                error: 'id is required',
            }, { status: 400 });
        }

        const postManager = new PostManager(env.DB);
        const post = await postManager.getPostById(id);

        return Response.json({
            post,
        });
    }   

	static async deletePost(req: Request, env: Env): Promise<Response> {
		const url = new URL(req.url);
		const id = url.pathname.split('/').pop();

		if (!id) {
			return Response.json({
				error: 'id is required',
			}, { status: 400 });
		}

		const postManager = new PostManager(env.DB);
		await postManager.deletePost(id);
		return Response.json({
			message: 'Post deleted successfully',
		});
	}
}
