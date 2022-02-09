import {useEffect} from "react";
import {select, ZoomBehavior} from "d3";

/**
 * Converts the wheel event in a zoom element to pan instead of scale
 * @param zoomBehavior - The zoom behavior to translate on pan events
 * @param zoomElement - The element to detect wheel events
 */
export const useZoomWheelAsPan = (
    zoomBehavior: ZoomBehavior<SVGGraphicsElement, unknown> | undefined,
    zoomElement: SVGGraphicsElement | null
) => {
  useEffect(() => {
    if (!(zoomElement && zoomBehavior)) {
      return;
    }
    
    select(zoomElement)
        .on('wheel.zoom', null)
        .on('wheel', (event) => {
          if (!zoomElement) {
            return;
          }
          select(zoomElement).call(zoomBehavior.translateBy, event.wheelDeltaX * 0.4, event.wheelDeltaY * 0.4);
        });
    
  }, [zoomElement, zoomBehavior]);
  
};
