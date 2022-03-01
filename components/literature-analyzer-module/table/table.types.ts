import {KeywordStats} from "../../../hooks/literature-analyzer-module/get-bibtex-stats";

export namespace TableTypes {
  export interface Props {
    data: KeywordStats[];
  }
  
  export enum ColumnType {
    KEYWORD= 'KEYWORD',
    OCCURRENCES = "OCCURRENCES",
    SURVEY = "SURVEY",
    TREND = "TREND"
  }
  
  
}
