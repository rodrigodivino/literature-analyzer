import {FunctionComponent, memo, useRef} from "react";
import {TrendCellTypes} from "./trend-cell.types";
import {useResponsiveMural} from "../../../hooks/shared-module/utils-module/use-responsive-mural";
import TrendCell from "./trend-cell";

const SVGTrendCell: FunctionComponent<TrendCellTypes.SVGProps> = (
    {
      contextData,
      highlightedData,
      timeDomain,
      valueDomain
    }
) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [width, height] = useResponsiveMural(svgRef);
  return <svg ref={svgRef} style={{width: '100%', height: '100%'}}>
    <TrendCell width={width} height={height} contextData={contextData} highlightedData={highlightedData}
               timeDomain={timeDomain} valueDomain={valueDomain}/>
  </svg>;
};

export default memo(SVGTrendCell);
