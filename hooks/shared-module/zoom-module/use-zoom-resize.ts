import {useEffect} from "react";
export const useZoomResize = (
    zoomBehavior: ZoomBehavior<SVGGraphicsElement, unknown> | undefined,
    scaleExtent: [number, number],
    extent: [[number, number], [number, number]],
    translateExtent: [[number, number], [number, number]]
): void => {
  useEffect(() => {
    if (!zoomBehavior) {
      return;
    }
    
    zoomBehavior
        .scaleExtent(scaleExtent)
        .extent(extent)
        .translateExtent(translateExtent);
  }, [zoomBehavior, extent, scaleExtent, translateExtent]);
};

import {ZoomBehavior} from "d3";
