export namespace BarCellTypes {
  export interface Props {
    width: number;
    height: number;
    value: number;
    max: number;
    color?: string;
  }
  
  export type SVGProps = Omit<BarCellTypes.Props, 'width' | 'height'>
}
