import {FunctionComponent, useCallback, useRef, useState} from "react";
import styles from "./dashboard.module.css";
import {DashboardTypes} from "./dashboard.types";
import {useResponsiveSVG} from "../../../hooks/shared-module/utils-module/use-responsive-svg";
import {DashboardConst} from "./dashboard.const";
import {getMarginConvention} from "../../../hooks/shared-module/utils-module/get-margin-convention";
import {BarColumn} from "../../shared-module/bar-column/bar-column";
import {BarColumnConst} from "../../shared-module/bar-column/bar-column.const";
import {zoomIdentity, ZoomTransform} from "d3";
import {ZoomDetails} from "../../../hooks/shared-module/zoom-module/zoom-details";
import {VerticalScroller} from "../../shared-module/vertical-scroller/vertical-scroller";


const Dashboard: FunctionComponent<DashboardTypes.Props> = ({data}) => {
  const svg = useRef<SVGSVGElement>(null);
  const [width, height] = useResponsiveSVG(svg);
  
  const [innerWidth, innerHeight, translate] = getMarginConvention(width, height, DashboardConst.MARGIN);
  
  const [sharedTransform, setSharedTransform] = useState<ZoomTransform>(zoomIdentity);
  const [sharedZoomY, setSharedZoomY] = useState<[number, number]>([0, 0]);
  
  const columnWidth = Math.max(DashboardConst.MIN_COLUMN_WIDTH, innerWidth / 3);
  
  const handleSharedZoomEvent = useCallback((zoomInfo: ZoomDetails) => {
    setSharedTransform(zoomInfo.transform);
    setSharedZoomY(zoomInfo.y);
  }, []);
  
  return <div className={styles.container}>
    <svg ref={svg} className={styles.svg}>
      <g transform={translate}>
        <g transform={`translate(0,0)`}>
          <BarColumn $onZoomEvent$={handleSharedZoomEvent}
                     inputTransform={sharedTransform}
                     width={columnWidth}
                     height={innerHeight}
                     color={'steelblue'}
                     data={BarColumnConst.TEST_DATA}/>
        </g>
        <g transform={`translate(${columnWidth},0)`}>
          <BarColumn $onZoomEvent$={handleSharedZoomEvent}
                     inputTransform={sharedTransform}
                     width={columnWidth}
                     height={innerHeight}
                     color={'firebrick'}
                     data={BarColumnConst.TEST_DATA}/>
        </g>
        <g transform={`translate(${columnWidth * 2},0)`}>
          <BarColumn $onZoomEvent$={handleSharedZoomEvent}
                     inputTransform={sharedTransform}
                     width={columnWidth}
                     height={innerHeight}
                     color={'mediumseagreen'}
                     data={BarColumnConst.TEST_DATA}/>
        </g>
        <g transform={`translate(${innerWidth}, 0)`}>
          <VerticalScroller y={sharedZoomY} width={20} height={innerHeight}/>
        </g>
      </g>
    
    </svg>
  </div>;
};

export default Dashboard;
