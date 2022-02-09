import {BarColumnTypes} from "./bar-column.types";

export namespace BarColumnConst {
  export const MARGIN = {TOP: 20, LEFT: 20, RIGHT: 20, BOTTOM: 20};
  export const BAR_HEIGHT = 30;
  export const LABEL_HEIGHT = 30;
  export const BAR_PADDING = 10;
  export const CELL_HEIGHT = BarColumnConst.BAR_HEIGHT + BarColumnConst.LABEL_HEIGHT + BarColumnConst.BAR_PADDING;
  
  export const VALUE_LABEL_WIDTH = 30;
  
  export const TEST_DATA: Array<BarColumnTypes.Datum> = new Array(35)
      .fill(0)
      .map((d, i) => ({label: `Bar Nº ${i}`, value: i * 2, id: `Bar Nº ${i}`}));
}
