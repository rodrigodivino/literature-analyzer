import {FunctionComponent, MouseEventHandler, useMemo, useState} from "react";
import styles from "./table.module.css";
import {TableTypes} from "./table.types";
import {ascending, descending, extent, max} from "d3";
import {TrendCellTypes} from "../../shared-module/trend-cell/trend-cell.types";
import SVGBarCell from "../../shared-module/bar-cell/svg-bar-cell";
import SVGTrendCell from "../../shared-module/trend-cell/trend-cell-svg";
import {MouseEvent} from 'React';
import ColumnType = TableTypes.ColumnType;


const Table: FunctionComponent<TableTypes.Props> = ({data}) => {
  const [sortedColumn, setSortedColumn] = useState<TableTypes.ColumnType>(ColumnType.RECENT);
  const [descentSortMode, setDescentSortMode] = useState<boolean>(true);
  
  data.keywords.sort((a,b) => {
    const sortingFunction = descentSortMode ? descending : ascending;
    switch(sortedColumn) {
      case TableTypes.ColumnType.KEYWORD:
        return sortingFunction(b.keyword, a.keyword);
      case TableTypes.ColumnType.RECENT:
        return sortingFunction(a.occurrencesInRecent, b.occurrencesInRecent);
      case TableTypes.ColumnType.SURVEY:
        return sortingFunction(a.occurrencesInSurveys, b.occurrencesInSurveys);
        // TODO: Quantify trend and sort by it
      case TableTypes.ColumnType.TREND:
        return sortingFunction(a.occurrencesInRecent, b.occurrencesInRecent);
      default:
        return sortingFunction(a.occurrencesInRecent, b.occurrencesInRecent);
    }
  })
  
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
  
  const handleHeaderClick: MouseEventHandler<HTMLTableRowElement> = (e: MouseEvent<HTMLTableRowElement>) => {
    const column = (e.target as HTMLElement).id as TableTypes.ColumnType;
    if(column === sortedColumn) {
      setDescentSortMode(!descentSortMode);
    } else {
      setDescentSortMode(true);
      setSortedColumn(column);
    }
  }
  
  const sortClass = descentSortMode ? styles.sortDescent : styles.sortAscent;
  return <div className={styles.container}>
    <table className={styles.table}>
      <thead>
      <tr onClick={handleHeaderClick}>
        <th id={TableTypes.ColumnType.KEYWORD} className={
          `${sortedColumn === TableTypes.ColumnType.KEYWORD ? sortClass : ''}`
        }>
          Keyword
        </th>
        <th id={TableTypes.ColumnType.RECENT} className={
          `${sortedColumn === TableTypes.ColumnType.RECENT ? sortClass : ''}`
        }>
          Recent Occurrences
        </th>
        <th id={TableTypes.ColumnType.SURVEY} className={
          `${sortedColumn === TableTypes.ColumnType.SURVEY ? sortClass : ''}`
        }>
          Survey Occurrences
        </th>
        <th id={TableTypes.ColumnType.TREND} className={
          `${sortedColumn === TableTypes.ColumnType.TREND ? sortClass : ''}`
        }>
          Trend
        </th>
      </tr>
      </thead>
      <tbody>
      {
        data.keywords.map(d => {
          return <tr key={d.keyword}>
            <td>
              {d.keyword}
            </td>
            <td>
              <div className={styles.cellDIV}>
                <SVGBarCell value={d.occurrencesInRecent} max={maxOccurrenceInRecent}/>
              </div>
      
            </td>
            <td>
              <div className={styles.cellDIV}>
                <SVGBarCell value={d.occurrencesInSurveys} max={maxOccurrenceInSurvey}/>
              </div>
            </td>
            <td>
              <div className={styles.cellDIV}>
                <SVGTrendCell contextData={trendCellList}
                              highlightedData={trendCellData[d.keyword]}
                              valueDomain={trendValueDomain}
                              timeDomain={trendTimeDomain}/>
              </div>
            </td>
          </tr>;
        })
      }
      </tbody>
     
    
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
