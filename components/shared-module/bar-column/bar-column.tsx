import {FunctionComponent, useEffect, useRef} from "react";
import {BarColumnTypes} from "./bar-column.types";
import {getMarginConvention} from "../../../hooks/shared-module/utils-module/get-margin-convention";
import {BarColumnConst} from "./bar-column.const";
import styles from './bar-column.module.css';
import {max, scaleLinear, select, zoomTransform} from "d3";
import {useZoomBehavior} from "../../../hooks/shared-module/zoom-module/use-zoom-behavior";
import {useZoomResize} from "../../../hooks/shared-module/zoom-module/use-zoom-resize";
import {useZoomWheelAsPan} from "../../../hooks/shared-module/zoom-module/use-zoom-wheel-as-pan";

export const BarColumn: FunctionComponent<BarColumnTypes.Props> = (
    {
      width,
      height,
      data,
      color,
      $onZoomEvent$,
      inputTransform
    }) => {
  const [innerWidth, innerHeight, translate] = getMarginConvention(width, height, BarColumnConst.MARGIN);
  
  const scale = scaleLinear<number, number>()
      .domain([0, max(data, d => d.value) ?? 0])
      .range([0, innerWidth - BarColumnConst.VALUE_LABEL_WIDTH]);
  
  const zoomElement = useRef<SVGGElement>(null);
  
  const [zoomBehavior, innerTransform] = useZoomBehavior(zoomElement.current);
  useZoomResize(
      zoomBehavior,
      [1, 1],
      [[0, 0], [innerWidth, innerHeight]],
      [[0, 0], [innerWidth, BarColumnConst.CELL_HEIGHT * data.length]]
  );
  useZoomWheelAsPan(zoomBehavior, zoomElement.current);
  
  
  useEffect(() => {
    if(!(zoomBehavior && $onZoomEvent$)) return;
    
    zoomBehavior.on('zoom.callback', (event) => {
      $onZoomEvent$?.(event.transform)
    })
  }, [zoomBehavior, $onZoomEvent$])
  
  useEffect(() => {
    if(!(inputTransform && zoomElement.current && zoomBehavior)) return;
    if(inputTransform.toString() === zoomTransform(zoomElement.current).toString()) return;
    
    select(zoomElement.current).call(zoomBehavior.transform, inputTransform);
  }, [inputTransform, zoomElement, zoomBehavior])
  
  return <g ref={zoomElement} transform={translate}>
    {data.map((d, i) => {
      return <g shapeRendering={'crispEdges'} key={d.id}
                transform={`translate(0,${i * BarColumnConst.CELL_HEIGHT + innerTransform.y})`}>
        <rect className={styles.cellBackground} width={innerWidth} height={BarColumnConst.CELL_HEIGHT}/>
        <rect className={styles.cellBar} style={{fill: color}} width={scale(d.value)} y={BarColumnConst.LABEL_HEIGHT}
              height={BarColumnConst.BAR_HEIGHT}/>
        <foreignObject width={innerWidth} height={BarColumnConst.LABEL_HEIGHT}>
          <div className={styles.labelOuter}>
            <div className={styles.labelInner}>
              {d.label}
            </div>
          </div>
        </foreignObject>
        <foreignObject x={scale(d.value)} y={BarColumnConst.LABEL_HEIGHT} width={BarColumnConst.VALUE_LABEL_WIDTH}
                       height={BarColumnConst.BAR_HEIGHT}>
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
