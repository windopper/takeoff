import { CommonFilter } from "../common/common-filter";

export class HackernewsFilter extends CommonFilter {
    constructor() {
        super({
            minScore: 150,
            diffDays: 3,
        });
    }
}