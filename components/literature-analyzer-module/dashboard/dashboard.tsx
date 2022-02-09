import {FunctionComponent, useRef} from "react";
import styles from "./dashboard.module.css"
import {DashboardTypes} from "./dashboard.types";
import {useResponsiveSVG} from "../../../hooks/shared-module/utils-module/use-responsive-svg";
import {DashboardConst} from "./dashboard.const";
import {getMarginConvention} from "../../../hooks/shared-module/utils-module/get-margin-convention";
import {BarColumn} from "../../shared-module/bar-column/bar-column";
import {BarColumnConst} from "../../shared-module/bar-column/bar-column.const";



const Dashboard: FunctionComponent<DashboardTypes.Props> = ({data}) => {
  const svg = useRef<SVGSVGElement>(null);
  const [width, height] = useResponsiveSVG(svg);
  
  const [innerWidth, innerHeight, translate] = getMarginConvention(width, height, DashboardConst.MARGIN);
  
  const columnWidth = Math.max(DashboardConst.MIN_COLUMN_WIDTH, innerWidth / 3)
  
  return <div className={styles.container}>
    <svg ref={svg} className={styles.svg}>
      <g transform={translate}>
        <g transform={`translate(0,0)`}>
          <BarColumn width={columnWidth} height={innerHeight} color={'steelblue'} data={BarColumnConst.TEST_DATA}/>
        </g>
        <g transform={`translate(${columnWidth},0)`}>
          <BarColumn width={columnWidth} height={innerHeight} color={'firebrick'} data={BarColumnConst.TEST_DATA}/>
        </g>
        <g transform={`translate(${columnWidth * 2},0)`}>
          <BarColumn width={columnWidth} height={innerHeight} color={'mediumseagreen'} data={BarColumnConst.TEST_DATA}/>
        </g>
      </g>
     
    </svg>
  </div>
}

export default Dashboard;
