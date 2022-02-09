import {getMarginConvention} from "../../../hooks/shared-module/get-margin-convention";
import {WidgetColumnConst} from "./widget-column.const";
import {WidgetColumnTypes} from "./widget-column.types";

// TODO: Continue from here with widget generics experiments

export const WidgetColumn = <T,>(
    {
      width,
      height,
      data
    }: WidgetColumnTypes.Props<T>
) => {
  
  const [innerWidth, innerHeight, translate] = getMarginConvention(width, height, WidgetColumnConst.MARGIN);
  
  return <g transform={translate}>
    <rect width={innerWidth} height={innerHeight}/>
  </g>;
};
