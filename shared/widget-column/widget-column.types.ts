import {FunctionComponent, ReactComponentElement, ReactElement} from "react";

export namespace WidgetColumnTypes {
  export interface Props<WidgetData> {
    width: number;
    height: number;
    widget: ReactElement<WidgetData>;
    widgetData: WidgetData;
  }
}
