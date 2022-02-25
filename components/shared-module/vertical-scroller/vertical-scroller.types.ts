export namespace VerticalScrollerTypes {
  export interface Props {
    width: number;
    height: number;
    position: [number, number];
    
    $onNewPosition$: (newPosition: [number, number]) => void;
  }
}
