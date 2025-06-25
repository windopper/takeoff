import * as d3 from "d3";
import { useEffect, useState } from "react";
// Country,Alpha-2 code,Alpha-3 code,Numeric,Organizations,All ML Systems (from Organizations)

interface Country {
  Country: string;
  "Alpha-2 code": string;
  "Alpha-3 code": string;
  Numeric: string;
  Organizations: string;
  "All ML Systems (from Organizations)": string;
}

export default function useCountry() {
  const [data, setData] = useState<Country[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const csvData = await d3.csv("/data/countries.csv", {
        'cache': 'force-cache'
      });
      setData(
        csvData.map((d) => ({
          Country: d.Country,
          "Alpha-2 code": d["Alpha-2 code"],
          "Alpha-3 code": d["Alpha-3 code"],
          Numeric: d.Numeric,
          Organizations: d.Organizations,
          "All ML Systems (from Organizations)":
            d["All ML Systems (from Organizations)"],
        }))
      );
    };
    fetchData();
  }, []);

  const findCountryFromAllMLSystems = (allMLSystems: string) => {
    const results = data.filter((d) =>
      d["All ML Systems (from Organizations)"].split(",").map((s) => s.trim()).includes(allMLSystems)
    );
    if (results.length === 0) return null;
    if (results.length === 1) return results[0].Country;
    return "Multinational";
  };

  return {
    data,
    findCountryFromAllMLSystems,
  };
}
