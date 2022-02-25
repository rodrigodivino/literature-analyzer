import {FunctionComponent, memo, useEffect} from "react";
import {TrendCellTypes} from "./trend-cell.types";
import {getMarginConvention} from "../../../hooks/shared-module/utils-module/get-margin-convention";
import {TrendCellConst} from "./trend-cell.const";
import {line, scaleLinear} from "d3";
import styles from './trend-cell.module.css'

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
  const valueScale = scaleLinear<number, number>().domain(valueDomain).range([innerHeight, 0]);
  
  const lineGen = line<TrendCellTypes.TrendDatum>()
      .x(d => timeScale(d.time))
      .y(d => valueScale(d.value))
  
  
  return <g className="trend-cell" transform={translate}>
    <rect className={styles.background} width={innerWidth} height={innerHeight}/>
    {
      contextData.map((contextDatum, i) => {
        return <g key={i}>
          <path className={styles.contextLine} d={lineGen(contextDatum) ?? ''}/>
        </g>
      })
    }
    <g>
      <path className={styles.highlightedLine} d={lineGen(highlightedData) ?? ''}/>
    </g>
  </g>;
};

export default memo(TrendCell);
