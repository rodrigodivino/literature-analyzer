import {ReactElement} from "react";

export namespace WidgetColumnTypes {
  export interface Props<WidgetData> {
    width: number;
    height: number;
    data: {
      widgetData: WidgetData[],
      widgetComponent: ReactElement<WidgetData>
    };
  }
}
