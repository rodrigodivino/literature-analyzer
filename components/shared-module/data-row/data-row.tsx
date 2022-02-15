import {FunctionComponent} from "react";
import {DataRowTypes} from "./data-row.types";

const DataRow: FunctionComponent<DataRowTypes.Props> = ({width, height, cells}) => {
  const cellWidth = width / cells.length;
  
  return <g className="data-row">
    {
      cells.map((cell, i) => {
        return <g key={cell.key}>
          <g className="data-cell" transform={`translate(${cellWidth * i},0)`}>
            <rect fill={'#DEDEDE'} width={cellWidth} height={height}/>
            <cell.component {...cell.data} width={cellWidth} height={height}/>
          </g>
        
        </g>;
      })}
  
  </g>;
};

export default DataRow;

