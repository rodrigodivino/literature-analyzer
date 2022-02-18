import {ComponentType} from "react";

export namespace DataRowTypes {
  export interface Props {
    width: number;
    height: number;
    cells: Array<DataRowTypes.Cell>;
  }
  
  export interface Cell {
    key: string;
    component: ComponentType<any> | ComponentType<CellAutoFillProps>;
    componentProps: Record<string, unknown>;
  }
  
  export interface CellAutoFillProps {
    width: number;
    height: number;
    
    [otherProp: string]: unknown;
  }
}
