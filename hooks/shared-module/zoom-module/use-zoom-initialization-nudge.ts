import {RefObject, useEffect} from "react";
import {select, ZoomBehavior} from "d3";

export const useZoomInitializationNudge = (
    zoomBehavior: ZoomBehavior<SVGGraphicsElement, unknown> | undefined,
    zoomElementRef: RefObject<SVGGraphicsElement>,
): void => {
  useEffect(() => {
    if(!(zoomBehavior && zoomElementRef.current)) return;
    zoomBehavior?.translateBy(select(zoomElementRef.current), 0, 0);
  }, [zoomBehavior, zoomElementRef])
}
