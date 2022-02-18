import {FunctionComponent} from "react";
import {DataRowTypes} from "./data-row.types";

const DataRow: FunctionComponent<DataRowTypes.Props> = ({width, height, cells}) => {
  
  const cellWidth = width / cells.length;
  
  return <g className='data-row'>
    <rect width={width} height={height} fill={`rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`}/>
    {
      cells.map((cell, i) => {
        return <g key={cell.key}  transform={`translate(${cellWidth * i},0)`}>
          <cell.component width={cellWidth} height={height} {...cell.componentProps}/>
        </g>
       
      })
    }
  </g>
}


export default DataRow;
