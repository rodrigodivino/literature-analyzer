import {BibTexStats} from "../../../hooks/literature-analyzer-module/get-bibtex-stats";

export namespace TableTypes {
  export interface Props {
    data: BibTexStats;
  }
  
  export enum ColumnType {
    KEYWORD= 'KEYWORD',
    OCCURRENCES = "OCCURRENCES",
    SURVEY = "SURVEY",
    TREND = "TREND"
  }
  
  
}
