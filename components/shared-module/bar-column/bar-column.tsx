import {FunctionComponent} from "react";
import {BarColumnTypes} from "./bar-column.types";
import {getMarginConvention} from "../../../hooks/shared-module/get-margin-convention";
import {BarColumnConst} from "./bar-column.const";
import styles from './bar-column.module.css'
import {max, scaleLinear} from "d3";

export const BarColumn: FunctionComponent<BarColumnTypes.Props> = ({width, height, data, color}) => {
  const [innerWidth, innerHeight, translate] = getMarginConvention(width, height, BarColumnConst.MARGIN);
  
  const scale = scaleLinear<number, number>().domain([0, max(data, d => d.value) ?? 0]).range([0, innerWidth - BarColumnConst.VALUE_LABEL_WIDTH])
  
  return <g transform={translate}>
    {data.map((d, i) => {
      return <g key={d.id} transform={`translate(0,${i * BarColumnConst.CELL_HEIGHT})`}>
        <rect className={styles.cellBackground} width={innerWidth} height={BarColumnConst.CELL_HEIGHT}/>
        <rect className={styles.cellBar} style={{fill: color}} width={scale(d.value)} y={BarColumnConst.CELL_HEIGHT / 2} height={BarColumnConst.BAR_HEIGHT}/>
        <foreignObject width={innerWidth} height={BarColumnConst.CELL_HEIGHT / 2}>
          <div className={styles.labelOuter}>
            <div className={styles.labelInner}>
              {d.label}
            </div>
          </div>
        </foreignObject>
        <foreignObject x={scale(d.value)} y={BarColumnConst.CELL_HEIGHT / 2} width={BarColumnConst.VALUE_LABEL_WIDTH} height={BarColumnConst.BAR_HEIGHT}>
          <div className={styles.valueLabelOuter}>
            <div className={styles.valueLabelInner}>
              {d.value}
            </div>
          </div>
        </foreignObject>
        <rect className={styles.cellHitbox} width={innerWidth} height={BarColumnConst.CELL_HEIGHT}/>
      </g>;
    })}
  </g>;
};
