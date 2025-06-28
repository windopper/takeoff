import ScatterPlot from "./ScatterPlot";
import Link from "next/link";
import useEpochAIExternalBenchmarks from "@/app/hooks/useEpochAIExternalBenchmarks";
import { GraphSettingWrapper } from "./components/GraphSetting";
import useGraphSetting from "./hooks/useGraphSetting";
import BenchmarkTable from "./components/BenchmarkTable";
import { useTranslations } from "next-intl";

interface VPCTData {
  id: string;
  modelVersion: string;
  correct: string;
  date: Date;
  organization: string;
  color: string;
  source: string;
  sourceLink: string;
  label: string;
}

export default function VPCT() {
  const t = useTranslations('benchmarking.tooltips');
  const { color, setColor, groupBy, setGroupBy, viewType, setViewType } = useGraphSetting();

  const { data, legends } = useEpochAIExternalBenchmarks({
    enableColor: color,
    groupBy: groupBy,
    filepath: "/data/external_benchmark_vpct.csv",
    scoreName: "Correct",
    sourceName: "Source",
    sourceLinkName: "Source link",
  });

  return (
    <>
      <GraphSettingWrapper
        filters={[]}
        isGroupColorSetting={color}
        setIsGroupColorSetting={setColor}
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        legends={legends}
        viewType={viewType}
        setViewType={setViewType}
      />
      {viewType === "table" ? (
        <BenchmarkTable
          data={data.map((d) => ({
            id: d.id,
            "Model version": d.modelVersion,
            [t('accuracy')]: parseFloat(d.score),
            organization: d.organization,
            country: d.country,
            date: d.date,
          }))}
          viewFields={[
            "Model version",
            t('accuracy'),
            "organization",
            "country",
          ]}
          defaultSortBy={t('accuracy')}
        />
      ) : (
        <ScatterPlot
          data={data.map((d) => ({
            id: d.id,
            x: d.date,
            y: parseFloat(d.score),
            label: d.label,
            color: d.color,
            extra: {
              [t('modelName')]: d.label,
              [t('modelVersion')]: d.modelVersion,
              [t('accuracy')]: `${d.score}%`,
              [t('source')]: (
                <Link
                  href={d.sourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {d.source}
                </Link>
              ),
            },
          }))}
        />
      )}
    </>
  );
}
