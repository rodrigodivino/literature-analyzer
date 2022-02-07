import {FunctionComponent} from "react";
import {getMarginConvention} from "../hooks/get-margin-convention";
import {WidgetColumnConst} from "./widget-column.const";
import {WidgetColumnTypes} from "./widget-column.types";

// TODO: Continue from here with widget generics experiments

export const WidgetColumn: FunctionComponent<WidgetColumnTypes.Props<unknown>> = <T,>(
    {
      width,
      height,
      widget,
      widgetData
    }: WidgetColumnTypes.Props<T>
) => {
  
  const [innerWidth, innerHeight, translate] = getMarginConvention(width, height, WidgetColumnConst.MARGIN);
  
  const data = [{}, {}];
  return <g transform={translate}>
    <rect width={innerWidth} height={innerHeight}/>
  </g>;
};
