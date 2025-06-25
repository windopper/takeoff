import { useState } from "react";

export default function useGraphSetting() {
    const [color, setColor] = useState<boolean>(true);
    const [groupBy, setGroupBy] = useState<"organization" | "country" | "public">("organization");
    const [viewType, setViewType] = useState<"table" | "graph">("graph");

    return { color, setColor, groupBy, setGroupBy, viewType, setViewType };
}