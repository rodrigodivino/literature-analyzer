import {FunctionComponent} from "react";
import {BarCellTypes} from "./bar-cell.types";
import {getMarginConvention} from "../../../hooks/shared-module/utils-module/get-margin-convention";
import {BarCellConst} from "./bar-cell.const";
import styles from './bar-cell.module.css';

const BarCell: FunctionComponent<BarCellTypes.Props> = ({width, height, max, value, color}) => {
  const [innerWidth, innerHeight, translate] = getMarginConvention(width, height, BarCellConst.MARGIN);
  
  const barEndX = (innerWidth - BarCellConst.LABEL_WIDTH) * (value / max);
  
  return <g className='bar-cell' transform={translate}>
    <rect className={styles.bar} style={{fill: color}} width={barEndX} height={innerHeight}/>
    <foreignObject x={barEndX} y={0} width={BarCellConst.LABEL_WIDTH} height={innerHeight}>
      <div className={`${styles.labelOuter}`}>
        <p className={styles.labelInner}>
          {value}
        </p>
      </div>
    </foreignObject>
  </g>;
};

export default BarCell;
