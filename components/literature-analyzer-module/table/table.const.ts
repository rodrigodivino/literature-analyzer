import {TableTypes} from "./table.types";

export namespace TableConst {
  export const ROW_HEIGHT: number = 30;
  export const MARGIN = {TOP: 20, LEFT: 20, RIGHT: 20, BOTTOM: 20};
  
  export const COLUMNS = [
    TableTypes.ColumnType.TITLE,
    TableTypes.ColumnType.RECENT,
    TableTypes.ColumnType.SURVEY,
    TableTypes.ColumnType.TREND
  ];
}
