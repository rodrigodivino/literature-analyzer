import {FunctionComponent} from "react";
import {VerticalScrollerTypes} from "./vertical-scroller.types";
import styles from './vertical-scroller.module.css'

export const VerticalScroller: FunctionComponent<VerticalScrollerTypes.Props> = (
    {
      width,
      height,
      y}
) => {
  const foregroundHeight = height * (y[1] - y[0]);
  const foregroundY = y[0] * height;
  return <g>
    <rect className={styles.background} width={width} height={height}/>
    <rect className={styles.foreground} width={width} height={foregroundHeight} y={foregroundY}/>
  </g>
}
