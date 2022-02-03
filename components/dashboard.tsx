import {FunctionComponent} from "react";
import styles from "../styles/dashboard.module.css"
import {ParsedBibtex} from "@orcid/bibtex-parse-js";

export interface DashboardProps {
  data: ParsedBibtex[];
}


const Dashboard: FunctionComponent<DashboardProps> = ({data}) => {
  return <div className={styles.container}>{JSON.stringify(data)}</div>
}

export default Dashboard;
