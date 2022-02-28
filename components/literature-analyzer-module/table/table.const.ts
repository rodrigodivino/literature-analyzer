import {TableTypes} from "./table.types";
import {BibTexStats, KeywordStats} from "../../../hooks/literature-analyzer-module/get-bibtex-stats";

export namespace TableConst {
  export const ROW_HEIGHT: number = 30;
  export const MARGIN = {TOP: 20, LEFT: 20, RIGHT: 20, BOTTOM: 20};
  
  export const COLUMN_TO_KEY = new Map<TableTypes.ColumnType, keyof KeywordStats>(
      [
        [TableTypes.ColumnType.SURVEY, 'occurrencesInSurveys'],
        [TableTypes.ColumnType.RECENT, 'occurrencesInRecent'],
        [TableTypes.ColumnType.KEYWORD, 'keyword'],
        [TableTypes.ColumnType.TREND, 'occurrencesOverTime'],
      ]
  );
}
