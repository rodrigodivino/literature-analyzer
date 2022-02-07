import {FunctionComponent, PropsWithChildren} from "react";
import {WidgetColumnTypes} from "./widget-column.types";
import {getMarginConvention} from "../hooks/get-margin-convention";
import {WidgetColumnConst} from "./widget-column.const";

export const WidgetColumn: FunctionComponent<PropsWithChildren<WidgetColumnTypes.Props>> = ({width, height}) => {
  const [innerWidth, innerHeight, translate] = getMarginConvention(width, height, WidgetColumnConst.MARGIN);
  
  return <g transform={translate}>
    <rect width={innerWidth} height={innerHeight}/>
  </g>;
};
