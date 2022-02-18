import {ParsedBibtex} from "@orcid/bibtex-parse-js";

export namespace TableTypes {
  export interface Props {
    data: ParsedBibtex[];
  }
  
  export enum ColumnType {
    TITLE,
    RECENT,
    SURVEY,
    TREND
  }
}
