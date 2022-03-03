import {FunctionComponent, MouseEventHandler, useMemo, useState} from "react";
import styles from "./table.module.css";
import {TableTypes} from "./table.types";
import {ascending, descending, extent, max} from "d3";
import {TrendCellTypes} from "../../shared-module/trend-cell/trend-cell.types";
import SVGBarCell from "../../shared-module/bar-cell/svg-bar-cell";
import SVGTrendCell from "../../shared-module/trend-cell/trend-cell-svg";
import {MouseEvent} from 'React';
import VirtualizationWrapper from "../../shared-module/virtualization-wrapper/virtualization-wrapper";
import ColumnType = TableTypes.ColumnType;


const Table: FunctionComponent<TableTypes.Props> = ({data}) => {
  const [sortedColumn, setSortedColumn] = useState<TableTypes.ColumnType>(ColumnType.OCCURRENCES);
  const [descentSortMode, setDescentSortMode] = useState<boolean>(true);
  
  data.sort((a, b) => {
    const sortingFunction = descentSortMode ? descending : ascending;
    switch (sortedColumn) {
      case TableTypes.ColumnType.KEYWORD:
        return sortingFunction(b.keyword, a.keyword);
      case TableTypes.ColumnType.OCCURRENCES:
        return sortingFunction(a.totalOccurrences, b.totalOccurrences);
      case TableTypes.ColumnType.SURVEY:
        return sortingFunction(a.occurrencesInSurveys, b.occurrencesInSurveys);
      case TableTypes.ColumnType.TREND:
        return sortingFunction(a.averageTrendStrength, b.averageTrendStrength) || sortingFunction(a.totalOccurrences, b.totalOccurrences);
      default:
        return sortingFunction(a.totalOccurrences, b.totalOccurrences);
    }
  });
  
  const maxOccurrence = max(data, k => k.totalOccurrences)!;
  const maxOccurrenceInSurvey = max(data, k => k.occurrencesInSurveys)!;
  
  const occurrencesOverTime = useMemo(() => {
    return data.flatMap(k => k.occurrencesOverTime);
  }, [data]);
  
  const trendTimeDomain = useMemo(() => {
    return extent(occurrencesOverTime, o => o.year) as [number, number];
  }, [occurrencesOverTime]);
  
  const trendValueDomain = useMemo(() => {
    return extent(occurrencesOverTime, o => o.occurrences) as [number, number];
  }, [occurrencesOverTime]);
  
  const trendCellData = useMemo(() => {
    return data.reduce((acc, keyword) => {
      acc[keyword.keyword] = keyword.occurrencesOverTime.map(o => ({time: o.year, value: o.occurrences, d: o}));
      return acc;
    }, {} as Record<string, TrendCellTypes.TrendDatum[]>);
  }, [data]);
  
  const trendCellList = useMemo(() => {
    return Object.values(trendCellData);
  }, [trendCellData]);
  
  const handleHeaderClick: MouseEventHandler<HTMLTableRowElement> = (e: MouseEvent<HTMLTableRowElement>) => {
    const column = (e.target as HTMLElement).id as TableTypes.ColumnType;
    if (column === sortedColumn) {
      setDescentSortMode(!descentSortMode);
    } else {
      setDescentSortMode(true);
      setSortedColumn(column);
    }
  };
  
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
        <th id={TableTypes.ColumnType.OCCURRENCES} className={
          `${sortedColumn === TableTypes.ColumnType.OCCURRENCES ? sortClass : ''}`
        }>
          Occurrences
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
        data.map(d => {
          return <tr key={d.keyword}>
            <td>
              <span className={styles.keywordName}>{d.keyword}</span>
            </td>
            <td>
              <div className={styles.cellDIV} title={d.totalOccurrencesTitles.map(s => '• ' + s).join('\n')}>
                <VirtualizationWrapper>
                  <SVGBarCell value={d.totalOccurrences} max={maxOccurrence}/>
                </VirtualizationWrapper>
              </div>
            </td>
            <td>
              
              <div className={styles.cellDIV} title={d.occurrencesInSurveysTitles.map(s => '• ' + s).join('\n')}>
                <VirtualizationWrapper>
                  <SVGBarCell value={d.occurrencesInSurveys} max={maxOccurrenceInSurvey}/>
                </VirtualizationWrapper>
              </div>
            
            </td>
            <td>
              <div className={styles.cellDIV}>
                <VirtualizationWrapper>
                  <SVGTrendCell contextData={trendCellList}
                                highlightedData={trendCellData[d.keyword]}
                                valueDomain={trendValueDomain}
                                timeDomain={trendTimeDomain}/>
                </VirtualizationWrapper>
              </div>
            </td>
          </tr>;
          
        })
      }
      </tbody>
    
    
    </table>
  </div>;
  
};

export default Table;

