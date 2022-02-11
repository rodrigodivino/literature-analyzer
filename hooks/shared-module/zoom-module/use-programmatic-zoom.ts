import {RefObject, useEffect} from "react";

import {select, ZoomBehavior, ZoomTransform, zoomTransform} from "d3";

export const useProgrammaticZoom = (
    zoomBehavior: ZoomBehavior<SVGGraphicsElement, unknown> | undefined,
    inputTransform: ZoomTransform | undefined,
    zoomElement: RefObject<SVGGraphicsElement>,
    blockZoomEvent: (toggle: boolean) => void
) => {
  useEffect(() => {
    if (!(inputTransform && zoomElement.current && zoomBehavior)) {
      return;
    }
    if (inputTransform.toString() === zoomTransform(zoomElement.current).toString()) {
      return;
    }
    
    blockZoomEvent(true);
    select(zoomElement.current).call(zoomBehavior.transform, inputTransform);
    blockZoomEvent(false);
  
  }, [inputTransform, zoomElement, zoomBehavior, blockZoomEvent]);
};

