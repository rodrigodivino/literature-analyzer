import {FunctionComponent} from "react";
import {TrendCellTypes} from "./trend-cell.types";
import {getMarginConvention} from "../../../hooks/shared-module/utils-module/get-margin-convention";
import {TrendCellConst} from "./trend-cell.const";

const TrendCell: FunctionComponent<TrendCellTypes.Props> = (
    {
      width,
      height,
      contextData,
      highlightedData,
      timeDomain,
      valueDomain
    }
) => {
  const [innerWidth, innerHeight, translate] = getMarginConvention(width, height, TrendCellConst.MARGIN);
  
  return <g className="trend-cell" transform={translate}>
    <rect width={innerWidth} height={innerHeight}/>
  </g>;
};

export default TrendCell;
