import {RefObject, useEffect} from "react";

import {select, ZoomBehavior, ZoomTransform, zoomTransform} from "d3";

/**
 * Modifies a zoom programmatically to match an input transform
 * @param zoomBehavior - The behavior to update the zoom
 * @param inputTransform - The input transform to set the zoom
 * @param zoomElement - The zoom element to update the zoom
 * @param blockZoomEvent - A function that toggle zoom events on/off to avoid recursion
 */
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

