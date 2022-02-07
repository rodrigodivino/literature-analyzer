import {FunctionComponent, useRef} from "react";
import styles from "./dashboard.module.css"
import {DashboardTypes} from "./dashboard.types";
import {useResponsiveSVG} from "../../hooks/use-responsive-svg";



const Dashboard: FunctionComponent<DashboardTypes.Props> = ({data}) => {
  const svg = useRef<SVGSVGElement>(null);
  
  const [width, height] = useResponsiveSVG(svg);
  
  return <div className={styles.container}>
    <svg ref={svg} className={styles.svg}>
      <rect width={width} height={height}/>
    </svg>
  </div>
}

export default Dashboard;
