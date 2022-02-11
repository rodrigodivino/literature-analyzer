import {useEffect} from "react";
import {ZoomBehavior} from "d3";

/**
 * Resizes a zoom behavior
 * @param zoomBehavior - The behavior to resize
 * @param scaleExtent - The value of the zoomBehavior.scaleExtent()
 * @param extent - The value of the zoomBehavior.extent()
 * @param translateExtent - The value of the zoomBehavior.translateExtent()
 *
 * @returns A function to compute ZoomInfo from a transform
 */
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


