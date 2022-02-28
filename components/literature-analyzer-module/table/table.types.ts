import {BibTexStats} from "../../../hooks/literature-analyzer-module/get-bibtex-stats";

export namespace TableTypes {
  export interface Props {
    data: BibTexStats;
  }
  
  export enum ColumnType {
    KEYWORD= 'KEYWORD',
    RECENT = "RECENT",
    SURVEY = "SURVEY",
    TREND = "TREND"
  }
  
  
}
