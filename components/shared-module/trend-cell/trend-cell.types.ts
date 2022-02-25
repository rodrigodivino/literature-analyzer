export namespace TrendCellTypes {
  export interface Props {
    width: number;
    height: number;
    timeDomain: [number, number];
    valueDomain: [number, number];
    contextData: TrendCellTypes.TrendDatum[][];
    highlightedData: TrendCellTypes.TrendDatum[];
  }
  
  export interface TrendDatum{
    time: number,
    value: number,
    d: unknown
  }
}
