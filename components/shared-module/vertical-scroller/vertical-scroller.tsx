import {FunctionComponent, useEffect, useRef} from "react";
import styles from './vertical-scroller.module.css';
import {drag, select} from "d3";
import {VerticalScrollerTypes} from "./vertical-scroller.types";
import useTracker from "../../../hooks/shared-module/utils-module/use-tracker";

const VerticalScroller: FunctionComponent<VerticalScrollerTypes.Props> = (
    {
      width,
      height,
      position,
      $onNewPosition$
    }) => {
  const handle = useRef<SVGRectElement>(null);
  
  const startingY = useRef<number>(0);
  const startingPosition = useRef<[number, number]>([0, 0]);
  
  const trackedHeight = useTracker<number>(height);
  const trackedPosition = useTracker<[number, number]>(position);
  
  useEffect(() => {
    if (!handle.current) {
      return;
    }
    
    const dragBehavior = drag<SVGRectElement, any, unknown>()
        .on('start', event => {
          startingY.current = event.y;
          startingPosition.current = trackedPosition.current;
        })
        .on('drag', event => {
          const dy = (event.y - startingY.current) / trackedHeight.current;
          const rawNewPosition = [trackedPosition.current[0] + dy, trackedPosition.current[1] + dy];
          const limitedNewPosition = rawNewPosition.map(p => {
            return p - Math.max(0, rawNewPosition[1] - 1);
          }).map(p => {
            return p + Math.max(0, -rawNewPosition[0]);
          }) as [number, number];
          
          $onNewPosition$(limitedNewPosition);
        });
    
    select(handle.current).call(dragBehavior);
  }, [$onNewPosition$,trackedPosition, handle, startingY, trackedHeight]);
  
  return <g>
    <rect className={styles.background} width={width} height={height}/>
    <rect ref={handle} className={styles.foreground} y={position[0] * (height)} width={width}
          height={height * (position[1] - position[0])}/>
  </g>;
};

export default VerticalScroller;
