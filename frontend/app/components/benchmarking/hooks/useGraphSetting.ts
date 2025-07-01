'use client';

import { useEffect, useState } from "react";

export default function useGraphSetting() {
    const [color, setColor] = useState<boolean>(true);
    const [groupBy, setGroupBy] = useState<"organization" | "country" | "public">("organization");
    const [viewType, setViewType] = useState<"table" | "graph">("graph");
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1280) {
                setViewType("table");
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return { color, setColor, groupBy, setGroupBy, viewType, setViewType, isMobile, setIsMobile };
}