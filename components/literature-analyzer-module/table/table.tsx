import {FunctionComponent, useCallback, useRef, useState} from "react";
import styles from "./table.module.css";
import {TableTypes} from "./table.types";
import {useResponsiveSVG} from "../../../hooks/shared-module/utils-module/use-responsive-svg";
import {TableConst} from "./table.const";
import {getMarginConvention} from "../../../hooks/shared-module/utils-module/get-margin-convention";
import {ZoomDetails} from "../../../hooks/shared-module/zoom-module/zoom-details";
import {getTableLayout} from "../../../hooks/getTableLayout";
import LabelCell from "../../shared-module/label-cell/label-cell";
import BarCell from "../../shared-module/bar-cell/bar-cell";
import TrendCell from "../../shared-module/trend-cell/trend-cell";
import {TrendCellConst} from "../../shared-module/trend-cell/trend-cell.const";
import {KeywordStats} from "../../../hooks/literature-analyzer-module/get-bibtex-stats";
import {extent, max, min} from "d3";


const Table: FunctionComponent<TableTypes.Props> = ({data}) => {
  const svg = useRef<SVGSVGElement>(null);
  const [width, height] = useResponsiveSVG(svg);
  
  const [innerWidth, innerHeight, translate] = getMarginConvention(width, height, TableConst.MARGIN);
  
  const [zoomDetails, setZoomDetails] = useState<ZoomDetails>();
  
  const handleZoomEvent = useCallback((newZoomDetails: ZoomDetails) => {
    setZoomDetails(newZoomDetails);
  }, []);
  
  const tableLayout = getTableLayout<KeywordStats, TableTypes.ColumnType>(
      data.keywords,
      TableConst.COLUMNS,
      innerWidth / 4,
      TableConst.ROW_HEIGHT
  );
  
  const maxOccurrenceInRecent = max(data.keywords, k => k.occurrencesInRecent)!;
  const maxOccurrenceInSurvey = max(data.keywords, k => k.occurrencesInSurveys)!;
  
  const occurrencesOverTime = data.keywords.flatMap(k => k.occurrencesOverTime);
  const [minTrendTime, maxTrendTime] = extent(occurrencesOverTime, o => o.year) as [number, number];
  const [minTrendValue, maxTrendValue] = extent(occurrencesOverTime, o => o.occurrences) as [number, number];
  
  return <div className={styles.container}>
    <svg ref={svg} className={styles.svg}>
      <g transform={translate}>
        {
          tableLayout.map((cell, i) => {
            return <g key={cell.key} className="table-cell" transform={`translate(${cell.x},${cell.y})`}>
              {(() => {
                switch (cell.column) {
                  case TableTypes.ColumnType.TITLE:
                    return <LabelCell
                        width={cell.width}
                        height={cell.height}
                        label={cell.d.keyword}
                    />;
                  case TableTypes.ColumnType.RECENT:
                    return <BarCell
                        width={cell.width}
                        height={cell.height}
                        value={cell.d.occurrencesInRecent}
                        max={maxOccurrenceInRecent}
                    />;
                  case TableTypes.ColumnType.SURVEY:
                    return <BarCell
                        width={cell.width}
                        height={cell.height}
                        value={cell.d.occurrencesInSurveys}
                        max={maxOccurrenceInSurvey}
                        color={'steelblue'}
                    />;
                  case TableTypes.ColumnType.TREND:
                    return <TrendCell
                        width={cell.width}
                        height={cell.height}
                        contextData={data.keywords.filter(k => k.keyword !== cell.d.keyword).map(keyword => {
                          return keyword.occurrencesOverTime.map(o => ({time: o.year, value: o.occurrences, d: o}));
                        })}
                        highlightedData={[cell.d.occurrencesOverTime.map(o => ({time: o.year, value: o.occurrences, d: o}))]}
                        valueDomain={[minTrendValue, maxTrendValue]}
                        timeDomain={[minTrendTime, maxTrendTime]}
                    />;
                }
              })()}
            </g>;
            
          })
        }
      </g>
    </svg>
  </div>;
};

export default Table;
