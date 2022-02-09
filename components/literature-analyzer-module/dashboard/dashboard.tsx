import {FunctionComponent, useRef} from "react";
import styles from "./dashboard.module.css"
import {DashboardTypes} from "./dashboard.types";
import {useResponsiveSVG} from "../../../hooks/shared-module/use-responsive-svg";
import {DashboardConst} from "./dashboard.const";
import {WidgetColumn} from "../../shared-module/widget-column/widget-column";
import {getMarginConvention} from "../../../hooks/shared-module/get-margin-convention";



const Dashboard: FunctionComponent<DashboardTypes.Props> = ({data}) => {
  const svg = useRef<SVGSVGElement>(null);
  const [width, height] = useResponsiveSVG(svg);
  
  const [innerWidth, innerHeight, translate] = getMarginConvention(width, height, DashboardConst.MARGIN);
  
  const columnWidth = Math.max(DashboardConst.MIN_COLUMN_WIDTH, innerWidth / 3)
  
  return <div className={styles.container}>
    <svg ref={svg} className={styles.svg}>
      <g transform={translate}>
        <g transform={`translate(0,0)`}>
          <WidgetColumn width={columnWidth} height={innerHeight} widget={null as any} widgetData={null as any}/>
        </g>
        <g transform={`translate(${columnWidth},0)`}>
          <WidgetColumn width={columnWidth} height={innerHeight} widget={null as any} widgetData={null as any}/>
        </g>
        <g transform={`translate(${columnWidth * 2},0)`}>
          <WidgetColumn width={columnWidth} height={innerHeight} widget={null as any} widgetData={null as any}/>
        </g>
      </g>
     
    </svg>
  </div>
}

export default Dashboard;
