import {FunctionComponent} from "react";
import {LabelCellTypes} from "./label-cell-types";
import styles from './label-cell.module.css';

const LabelCell: FunctionComponent<LabelCellTypes.Props> = ({width, height, label}) => {
  return <g className='label-cell'>
    <foreignObject width={width} height={height}>
      <div className={styles.outer}>
        <div className={styles.outer}>
          {label}
        </div>
      </div>
    </foreignObject>

  </g>;
};

export default LabelCell;
