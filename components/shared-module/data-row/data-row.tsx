import {FunctionComponent} from "react";
import {DataRowTypes} from "./data-row.types";

const DataRow: FunctionComponent<DataRowTypes.Props> = ({width, height, cells}) => {
  const cellWidth = width / cells.length;
  return <g className='data-row'>
    {cells.map(cell => {
      return <g key={cell.key}>
        <rect width={cellWidth} height={height}/>
      </g>
    })}
  
  </g>
}

export default DataRow;

