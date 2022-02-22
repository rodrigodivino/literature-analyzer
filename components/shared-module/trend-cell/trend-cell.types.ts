export namespace TrendCellTypes {
  export interface Props {
    width: number;
    height: number;
    timeDomain: [TrendCellTypes.TimeUnit, TrendCellTypes.TimeUnit];
    valueDomain: [number, number];
    contextData: TrendCellTypes.TrendDatum[][];
    highlightedData: TrendCellTypes.TrendDatum[][];
  }
  
  export interface TrendDatum{
    time: TimeUnit,
    value: number,
    d: unknown
  }
  
  export type TimeUnit = string | number | Date;
}
