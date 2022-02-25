import {FunctionComponent} from "react";
import styles from './vertical-scroller.module.css';

const VerticalScroller: FunctionComponent<any> = ({width, height, position}) => {
  return <g>
    <rect className={styles.background} width={width} height={height}/>
    <rect className={styles.foreground} y={position[0] * (height)} width={width} height={height * (position[1] - position[0])}/>
  </g>
}

export default VerticalScroller
