import {FunctionComponent, useEffect, useRef, useState} from "react";
import {BarColumnTypes} from "./bar-column.types";
import {getMarginConvention} from "../../../hooks/shared-module/get-margin-convention";
import {BarColumnConst} from "./bar-column.const";
import styles from './bar-column.module.css';
import {max, scaleLinear, select, zoom, ZoomBehavior, zoomIdentity, ZoomTransform} from "d3";
import {useWrapperState} from "../../../hooks/shared-module/use-wrapper-state";

export const BarColumn: FunctionComponent<BarColumnTypes.Props> = ({width, height, data, color}) => {
  const [innerWidth, innerHeight, translate] = getMarginConvention(width, height, BarColumnConst.MARGIN);
  
  const scale = scaleLinear<number, number>()
      .domain([0, max(data, d => d.value) ?? 0])
      .range([0, innerWidth - BarColumnConst.VALUE_LABEL_WIDTH]);
  
  const g = useRef<SVGGElement>(null);
  
  
  const [transform, setTransform] = useState<ZoomTransform>(zoomIdentity);
  const [zoomBehavior, setZoomBehavior] = useWrapperState<ZoomBehavior<SVGGElement, unknown>>();
  
  useEffect(() => {
    if (!g.current) {
      return;
    }
    
    const zoomBehavior = zoom<SVGGElement, unknown>()
        .on('zoom', (event) => {
          setTransform(event.transform);
        });
  
  
    select(g.current).call(zoomBehavior)
        .on('wheel.zoom', null)
        .on('wheel', (event) => {
          if(!g.current) return;
          select(g.current).call(zoomBehavior.translateBy, event.wheelDeltaX * 0.4, event.wheelDeltaY * 0.4)
        });
    
    setZoomBehavior(zoomBehavior);
  }, [g, setZoomBehavior]);
  
  useEffect(() => {
    if (!zoomBehavior) {
      return;
    }
    
    const worldHeight = BarColumnConst.CELL_HEIGHT * data.length;
    
    zoomBehavior
        .scaleExtent([1, 1])
        .extent([[0, 0], [innerWidth, innerHeight]])
        .translateExtent([[0, 0], [innerWidth, worldHeight]]);
    
  }, [zoomBehavior, innerWidth, innerHeight, data]);
  
  return <g ref={g} transform={translate}>
    {data.map((d, i) => {
      return <g shapeRendering={'crispEdges'} key={d.id}
                transform={`translate(0,${i * BarColumnConst.CELL_HEIGHT + transform.y})`}>
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
