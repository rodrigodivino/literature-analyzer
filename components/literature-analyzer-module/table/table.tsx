import {FunctionComponent, useCallback, useEffect, useMemo, useRef, useState} from "react";
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
import {KeywordStats} from "../../../hooks/literature-analyzer-module/get-bibtex-stats";
import {extent, max, zoom} from "d3";
import {useZoomBehavior} from "../../../hooks/shared-module/zoom-module/use-zoom-behavior";
import {TrendCellTypes} from "../../shared-module/trend-cell/trend-cell.types";
import {useZoomWheelAsPan} from "../../../hooks/shared-module/zoom-module/use-zoom-wheel-as-pan";
import {useZoomResize} from "../../../hooks/shared-module/zoom-module/use-zoom-resize";
import {useZoomInitializationNudge} from "../../../hooks/shared-module/zoom-module/use-zoom-initialization-nudge";
import {defaultZoomDetails, getZoomDetails} from "../../../hooks/shared-module/zoom-module/get-zoom-details";
import VerticalScroller from "../../shared-module/vertical-scroller/vertical-scroller";
import {useProgrammaticZoom} from "../../../hooks/shared-module/zoom-module/use-programmatic-zoom";


const Table: FunctionComponent<TableTypes.Props> = ({data}) => {
  const svg = useRef<SVGSVGElement>(null);
  const zoomElement = useRef<SVGGElement>(null);
  
  const [width, height] = useResponsiveSVG(svg);
  
  const [innerWidth, innerHeight, translate] = getMarginConvention(width, height, TableConst.MARGIN);
  
  const tableLayout = getTableLayout<KeywordStats, TableTypes.ColumnType>(
      data.keywords,
      TableConst.COLUMNS,
      innerWidth / 4,
      TableConst.ROW_HEIGHT
  );
  
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
  
  const [zoomBehavior, zoomTransform] = useZoomBehavior(zoomElement.current);
  const [zoomDetails, setZoomDetails] = useState<ZoomDetails>(defaultZoomDetails);
  
  useZoomWheelAsPan(zoomBehavior, zoomElement.current);
  useZoomResize(zoomBehavior,
      [1, 1],
      [[0,0], [innerWidth, innerHeight]],
      [[0, 0], [innerWidth, TableConst.ROW_HEIGHT * data.keywords.length]])
  useZoomInitializationNudge(zoomBehavior, zoomElement)
  
  useEffect(() => {
    setZoomDetails(getZoomDetails(zoomBehavior, zoomTransform));
  }, [zoomBehavior, zoomTransform])
  
  
  const trendCellData = useMemo(() => {
    return data.keywords.reduce((acc, keyword) => {
      acc[keyword.keyword] = keyword.occurrencesOverTime.map(o => ({time: o.year, value: o.occurrences, d: o}));
      return acc;
    }, {} as Record<string, TrendCellTypes.TrendDatum[]>);
  }, [data.keywords]);
  
  const trendCellList = useMemo(() => {
    return Object.values(trendCellData);
  }, [trendCellData]);
  
  const handleNewScrollerPosition = useCallback((newScrollerPosition) => {
    // TODO: Process scroller position into new zoom transform
    console.log("newScrollerPosition", newScrollerPosition);
    return;
  }, [])
  return <div className={styles.container}>
    <svg ref={svg} className={styles.svg}>
      <g transform={translate} >
        <g clipPath={`url(#table-clip)`}>
          <g className="zoom-area" ref={zoomElement}>
            <rect className={styles.zoomBackground} width={innerWidth} height={innerHeight}/>
            {
              tableLayout.map((cell, i) => {
                return <g key={cell.key} className="table-cell"
                          transform={`translate(${cell.x},${zoomTransform.y + cell.y})`}>
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
                            contextData={trendCellList}
                            highlightedData={trendCellData[cell.d.keyword]}
                            valueDomain={trendValueDomain}
                            timeDomain={trendTimeDomain}
                        />;
                    }
                  })()}
                </g>;
        
              })
            }
          </g>
        </g>
        
        <g transform={`translate(${innerWidth},0)`}>
          <VerticalScroller $onNewPosition$={handleNewScrollerPosition} width={20} height={innerHeight} position={zoomDetails.y}/>
        </g>
      </g>
  
      
     
      <defs>
        <clipPath id='table-clip'>
          <rect width={innerWidth} height={innerHeight}/>
        </clipPath>
      </defs>
    </svg>
  </div>;
};

export default Table;
