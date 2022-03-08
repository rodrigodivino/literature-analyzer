import {FunctionComponent, memo} from "react";
import {TrendCellTypes} from "./trend-cell.types";
import {getMarginConvention} from "../../../hooks/shared-module/utils-module/get-margin-convention";
import {TrendCellConst} from "./trend-cell.const";
import {line, max, scaleLinear} from "d3";
import styles from './trend-cell.module.css';

const TrendCell: FunctionComponent<TrendCellTypes.Props> = (
    {
      width,
      height,
      contextData,
      highlightedData,
      timeDomain,
      valueDomain
    }
) => {
  const [innerWidth, innerHeight, translate] = getMarginConvention(width, height, TrendCellConst.MARGIN);
  
  const timeScale = scaleLinear<number, number>().domain(timeDomain).range([0, innerWidth]);
  const valueScale = scaleLinear<number, number>().domain([0, max(highlightedData, d => d.value)] as [number, number]).range([innerHeight, 0]);
  
  const lineGen = line<TrendCellTypes.TrendDatum>()
      .x(d => timeScale(d.time))
      .y(d => valueScale(d.value))
      .defined(d => d.value !== 0);
  
  const contextMesh = contextData.map((contextDatum, i) => {
    return lineGen(contextDatum);
  }).join('');
  
  
  return <g className="trend-cell" transform={translate}>
    <rect className={styles.background} width={innerWidth} height={innerHeight}/>
    <g>
      <path className={styles.contextLine} d={contextMesh}/>
    </g>
    <g>
      <path className={styles.highlightedLine} d={lineGen(highlightedData) ?? ''}/>
      {
        highlightedData.filter(d => d.value !== 0).map((d, i) => {
          return <circle className={styles.highlightedMarker} key={i} cx={timeScale(d.time)} cy={valueScale(d.value)}
                         r={2}><title>{`Year: ${d.time}. Count: ${d.value}`}</title></circle>;
        })
      }
    </g>
  </g>;
};

export default memo(TrendCell);
