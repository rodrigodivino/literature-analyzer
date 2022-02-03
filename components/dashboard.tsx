import {FunctionComponent} from "react";
import styles from "../styles/dashboard.module.css"

export interface DashboardProps {
  data: any;
}


const Dashboard: FunctionComponent<DashboardProps> = ({data}) => {
  return <div className={styles.container}>{data}</div>
}

export default Dashboard;
