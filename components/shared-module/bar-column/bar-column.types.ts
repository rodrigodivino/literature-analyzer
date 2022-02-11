import {ZoomTransform} from "d3";
import {ZoomDetails} from "../../../hooks/shared-module/zoom-module/zoom-details";

export namespace BarColumnTypes {
  export interface Props {
    width: number;
    height: number;
    data: BarColumnTypes.Datum[];
    color?: string;
    $onZoomEvent$?: (t: ZoomDetails) => void;
    inputTransform?: ZoomTransform
  }
  
  export interface Datum {
    label: string,
    value: number,
    id: string,
  }
}
