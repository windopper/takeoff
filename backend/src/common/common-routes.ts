import { Env } from '..';
import { PostManager } from '../manager/post-manager';

export class CommonRoutes {
	static async getPosts(req: Request, env: Env): Promise<Response> {
		const url = new URL(req.url);
		const limit = parseInt(url.searchParams.get('limit') || '10');
		const offset = parseInt(url.searchParams.get('offset') || '0');
		const platform = url.searchParams.get('platform');
		const community = url.searchParams.get('community');

		const postManager = new PostManager(env.DB);

		let posts;
		if (platform && community) {
			// 새로운 스키마의 platform/community로 필터링
			posts = await postManager.getPostsByPlatformCommunity(platform, community, limit);
		} else if (community) {
			// 레거시 호환성: community를 subreddit으로 처리
			posts = await postManager.getPostsBySubreddit(community, limit);
		} else {
			posts = await postManager.getPosts(limit, offset);
		}

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
}
