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
import {useEffect} from "react";

import {select, ZoomBehavior} from "d3";
