import {FunctionComponent, useRef} from "react";
import {BarCellTypes} from "./bar-cell.types";
import {useResponsiveMural} from "../../../hooks/shared-module/utils-module/use-responsive-mural";
import BarCell from "./bar-cell";

const SVGBarCell: FunctionComponent<BarCellTypes.SVGProps> = ({max, value, color}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [width, height] = useResponsiveMural(svgRef);
  
  return <svg ref={svgRef} style={{width: '100%', height: '100%'}}>
    <BarCell width={width} height={height} max={max} value={value} color={color}/>
  </svg>;
};

export default SVGBarCell;
