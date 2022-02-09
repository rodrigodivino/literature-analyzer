export namespace BarColumnTypes {
  export interface Props {
    width: number;
    height: number;
    data: BarColumnTypes.Datum[];
    color?: string;
  }
  
  export interface Datum {
    label: string,
    value: number,
    id: string,
  }
}
