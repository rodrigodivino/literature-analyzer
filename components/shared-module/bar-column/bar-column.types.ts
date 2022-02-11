import {ZoomTransform} from "d3";

export namespace BarColumnTypes {
  export interface Props {
    width: number;
    height: number;
    data: BarColumnTypes.Datum[];
    color?: string;
    $onZoomEvent$?: (t: ZoomTransform) => void;
    inputTransform?: ZoomTransform
  }
  
  export interface Datum {
    label: string,
    value: number,
    id: string,
  }
}
