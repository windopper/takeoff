import { CommonFilter } from "../common/common-filter";

export class RedditFilter extends CommonFilter {

    // -1 means no score filter
    constructor(minScore: number = -1) {
        super({ minScore });
    }
}