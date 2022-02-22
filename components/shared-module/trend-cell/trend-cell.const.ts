import {TrendCellTypes} from "./trend-cell.types";

export namespace TrendCellConst {
  export const MARGIN = {TOP: 2, LEFT: 10, BOTTOM: 2, RIGHT: 10};
  
  export const SAMPLE_DATA: TrendCellTypes.Props = {
    contextData: [[{time: 0, value: 2, d: {}}, {time: 1, value: 3, d: {}}, {time: 2, value: 4, d: {}}]],
    highlightedData: [[{time: 0, value: 0, d: {}}, {time: 1, value: 2, d: {}}, {time: 2, value: 5, d: {}}]],
    timeDomain: [0, 2],
    valueDomain: [0, 5],
    width: 100,
    height: 100
  };
}
