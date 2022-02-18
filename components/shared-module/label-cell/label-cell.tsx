import {FunctionComponent} from "react";
import {LabelCellTypes} from "./label-cell-types";
import styles from './label-cell.module.css';

const LabelCell: FunctionComponent<LabelCellTypes.Props> = (
    {
      width,
      height,
      label,
      fontSize = 12
    }
) => {
  
  const lineClamp = Math.floor(height / (fontSize + 2));
  
  return <g className="label-cell">
    <foreignObject width={width} height={height}>
      <div className={styles.outer}>
        <p style={{fontSize: fontSize + 'px', WebkitLineClamp: lineClamp}} className={styles.text}>
          {label}
        </p>
      </div>
    </foreignObject>
  
  </g>;
};

export default LabelCell;
