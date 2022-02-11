import {FunctionComponent, useEffect, useRef} from "react";
import {VerticalScrollerTypes} from "./vertical-scroller.types";
import styles from './vertical-scroller.module.css';
import {drag, select} from "d3";

export const VerticalScroller: FunctionComponent<VerticalScrollerTypes.Props> = (
    {
      y,
      width,
      height
    }
) => {
  const foregroundRef = useRef<SVGRectElement>(null);
  const foregroundHeight = height * (y[1] - y[0]);
  const foregroundY = y[0] * height;
  
  const currentY = useRef<[number, number]>(y);
  
  useEffect(() => {
    currentY.current = y;
  }, [y]);
  
  useEffect(() => {
    if (!foregroundRef.current) {
      return;
    }
    
    const dragBehavior = drag<SVGRectElement, unknown>().on('drag', (event) => {
      // TODO: Refactor to better propagate the drag event to the parent component.
      console.log('dragging', event);
    });
    
    select(foregroundRef.current).call(dragBehavior);
  }, [foregroundRef]);
  
  return <g className={styles.container}>
    <rect className={styles.background} width={width} height={height}/>
    <rect ref={foregroundRef} className={styles.foreground} width={width} height={foregroundHeight} y={foregroundY}/>
  </g>
}
