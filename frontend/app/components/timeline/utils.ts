import { CATEGORIES } from "@/data/timelineData";

export const START_YEAR = 2015;
export const END_YEAR = 2025;


// const cards: {
//     date: Date;
//     start_date: {
//         year: string;
//         month: string;
//         day: string;
//     };
//     text: {
//         headline: {
//             url: string;
//             text: string;
//         };
//         text: string;
//     };
//     korean: {
//         headline: {
//             url: string;
//             text: string;
//         };
//         text: string;
//     };
//     importance: number;
//     category: CATEGORIES;
// }[]
export interface TimelineCard {
    start_date: { year: string; month: string; day: string };
    text: { headline: { url: string; text: string }; text: string };
    korean: { headline: { url: string; text: string }; text: string };
    importance: number;
    category: CATEGORIES;
    date: Date;
}