import {ComponentType} from "react";

export namespace DataRowTypes {
  export interface Props {
    width: number;
    height: number;
    cells: Cell<unknown>[];
  }
  
  export interface Cell<T> {
    key: string;
    component: ComponentType<T>;
    data: Partial<T>
  }
}
