import {FunctionComponent, useRef} from "react";
import styles from "./dashboard.module.css"
import {DashboardTypes} from "./dashboard.types";
import {useResponsiveSVG} from "../../hooks/use-responsive-svg";
import {DashboardConst} from "./dashboard.const";



const Dashboard: FunctionComponent<DashboardTypes.Props> = ({data}) => {
  const svg = useRef<SVGSVGElement>(null);
  const [width, height] = useResponsiveSVG(svg);
  
  const innerWidth = width - DashboardConst.MARGIN.LEFT - DashboardConst.MARGIN.RIGHT;
  const innerHeight = height - DashboardConst.MARGIN.TOP - DashboardConst.MARGIN.BOTTOM;
  
  const columnWidth = Math.max(DashboardConst.MIN_COLUMN_WIDTH, innerWidth / 3)
  
  return <div className={styles.container}>
    <svg ref={svg} className={styles.svg}>
      <g transform={`translate(${DashboardConst.MARGIN.LEFT},${DashboardConst.MARGIN.TOP})`}>
        <g transform={`translate(0,0)`}>
          <rect width={columnWidth} height={innerHeight}/>
        </g>
        <g transform={`translate(${columnWidth},0)`}>
          <rect width={columnWidth} height={innerHeight}/>
        </g>
        <g transform={`translate(${columnWidth * 2},0)`}>
          <rect width={columnWidth} height={innerHeight}/>
        </g>
      </g>
     
    </svg>
  </div>
}

export default Dashboard;
