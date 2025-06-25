import * as d3 from "d3";

import { useEffect, useState } from "react";

// Organization,Country,Info,Organization categorization,All ML Systems
interface Organization {
  organization: string;
  country: string;
  info: string;
  organizationCategorization: string;
  allMLSystems: string;
}

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      const data = await d3.csv("/data/organizations.csv", {
        cache: 'force-cache'
      });
      setOrganizations((prevOrganizations) => {
        return data.map((d) => ({
          organization: d["Organization"] as string,
          country: d["Country"] as string,
          info: d["Info"] as string,
          organizationCategorization: d[
            "Organization categorization"
          ] as string,
          allMLSystems: d["All ML Systems"] as string,
        }));
      });
    };
    fetchOrganizations();
  }, []);

  const findOrganization = (allMLSystems: string) => {
    return organizations.find((o) => o.allMLSystems.split(',').map((s) => s.trim()).includes(allMLSystems));
  }

  return { organizations, findOrganization };
}
