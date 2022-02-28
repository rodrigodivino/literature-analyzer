import {FunctionComponent, useMemo, useRef} from "react";
import styles from "./table.module.css";
import {TableTypes} from "./table.types";
import {useResponsiveSVG} from "../../../hooks/shared-module/utils-module/use-responsive-svg";
import {TableConst} from "./table.const";
import {getMarginConvention} from "../../../hooks/shared-module/utils-module/get-margin-convention";
import {extent, max, range} from "d3";
import {TrendCellTypes} from "../../shared-module/trend-cell/trend-cell.types";


const Table: FunctionComponent<TableTypes.Props> = ({data}) => {
  const svg = useRef<SVGSVGElement>(null);
  
  const [width, height] = useResponsiveSVG(svg);
  
  const [innerWidth, innerHeight, translate] = getMarginConvention(width, height, TableConst.MARGIN);
  
  const maxOccurrenceInRecent = max(data.keywords, k => k.occurrencesInRecent)!;
  const maxOccurrenceInSurvey = max(data.keywords, k => k.occurrencesInSurveys)!;
  
  const occurrencesOverTime = useMemo(() => {
    return data.keywords.flatMap(k => k.occurrencesOverTime);
  }, [data.keywords]);
  
  const trendTimeDomain = useMemo(() => {
    return extent(occurrencesOverTime, o => o.year) as [number, number];
  }, [occurrencesOverTime]);
  
  const trendValueDomain = useMemo(() => {
    return extent(occurrencesOverTime, o => o.occurrences) as [number, number];
  }, [occurrencesOverTime]);
  
  const trendCellData = useMemo(() => {
    return data.keywords.reduce((acc, keyword) => {
      acc[keyword.keyword] = keyword.occurrencesOverTime.map(o => ({time: o.year, value: o.occurrences, d: o}));
      return acc;
    }, {} as Record<string, TrendCellTypes.TrendDatum[]>);
  }, [data.keywords]);
  
  const trendCellList = useMemo(() => {
    return Object.values(trendCellData);
  }, [trendCellData]);
  
  return <div className={styles.container}>
    
    <table className={styles.table}>
      <tr>
        <th>
          Keyword
        </th>
        <th>
          Recent Occurrences
        </th>
        <th>
          Survey Occurrences
        </th>
        <th>
          Trend
        </th>
      </tr>
      {
        range(50).map(d => {
          return <tr key={d}>
            <td>
              Test
            </td>
            <td>
              Test
            </td>
            <td>
              Test
            </td>
            <td>
              Test
            </td>
          </tr>;
        })
      }
    
    </table>
    
    
    {/*<svg ref={svg} className={styles.svg}>*/}
    {/*  <g transform={translate} >*/}
    {/*    <g>*/}
    {/*      <g className="zoom-area" ref={zoomElement}>*/}
    {/*        <rect className={styles.zoomBackground} width={innerWidth} height={innerHeight}/>*/}
    {/*        {*/}
    {/*          tableLayout.map((cell, i) => {*/}
    {/*            return <g key={cell.key} className="table-cell"*/}
    {/*                      transform={`translate(${cell.x},${cell.y})`}>*/}
    {/*              {(() => {*/}
    {/*                switch (cell.column) {*/}
    {/*                  case TableTypes.ColumnType.TITLE:*/}
    {/*                    return <LabelCell*/}
    {/*                        width={cell.width}*/}
    {/*                        height={cell.height}*/}
    {/*                        label={cell.d.keyword}*/}
    {/*                    />;*/}
    {/*                  case TableTypes.ColumnType.RECENT:*/}
    {/*                    return <BarCell*/}
    {/*                        width={cell.width}*/}
    {/*                        height={cell.height}*/}
    {/*                        value={cell.d.occurrencesInRecent}*/}
    {/*                        max={maxOccurrenceInRecent}*/}
    {/*                    />;*/}
    {/*                  case TableTypes.ColumnType.SURVEY:*/}
    {/*                    return <BarCell*/}
    {/*                        width={cell.width}*/}
    {/*                        height={cell.height}*/}
    {/*                        value={cell.d.occurrencesInSurveys}*/}
    {/*                        max={maxOccurrenceInSurvey}*/}
    {/*                        color={'steelblue'}*/}
    {/*                    />;*/}
    {/*                  case TableTypes.ColumnType.TREND:*/}
    {/*                    return <TrendCell*/}
    {/*                        width={cell.width}*/}
    {/*                        height={cell.height}*/}
    {/*                        contextData={trendCellList}*/}
    {/*                        highlightedData={trendCellData[cell.d.keyword]}*/}
    {/*                        valueDomain={trendValueDomain}*/}
    {/*                        timeDomain={trendTimeDomain}*/}
    {/*                    />;*/}
    {/*                }*/}
    {/*              })()}*/}
    {/*            </g>;*/}
    {/*    */}
    {/*          })*/}
    {/*        }*/}
    {/*      </g>*/}
    {/*    </g>*/}
    {/*  </g>*/}
    {/*</svg>*/}
  </div>;
};

export default Table;
