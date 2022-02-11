import {useCallback, useEffect, useRef} from "react";
import {ZoomBehavior} from "d3";
import {ZoomDetails} from "./zoom-details";
import {getZoomDetails} from "./get-zoom-details";

/**
 * Listen to zoom events and call callbacks
 * @param zoomBehavior - The zoom behavior to listen to events
 * @param $onZoomEvent$ - Callback for the zoom event
 * @param $onZoomStartEvent$ - Callback for the start event
 * @param $onZoomEndEvent$ - Callback for the end event
 */
export const useZoomEvents = (
    zoomBehavior: ZoomBehavior<SVGGraphicsElement, unknown> | undefined,
    $onZoomEvent$?: ((zoomTransform: ZoomDetails) => void) | null,
    $onZoomStartEvent$?: ((zoomTransform: ZoomDetails) => void) | null,
    $onZoomEndEvent$?: ((zoomTransform: ZoomDetails) => void) | null
): ((toggle: boolean) => void) => {
  const blockZoomEvent = useRef<boolean>(false);
  
  useEffect(() => {
    if (!(zoomBehavior && $onZoomEvent$)) {
      return;
    }
    
    zoomBehavior.on('zoom.useZoomEvents', (event) => {
      if (blockZoomEvent?.current) {
        return;
      }
      $onZoomEvent$?.(getZoomDetails(zoomBehavior, event.transform));
    });
  }, [zoomBehavior, $onZoomEvent$, blockZoomEvent]);
  
  useEffect(() => {
    if (!(zoomBehavior && $onZoomStartEvent$)) {
      return;
    }
    
    zoomBehavior.on('start.useZoomEvents', (event) => {
      if (blockZoomEvent?.current) {
        return;
      }
      $onZoomStartEvent$?.(getZoomDetails(zoomBehavior, event.transform));
    });
  }, [zoomBehavior, $onZoomStartEvent$, blockZoomEvent]);
  
  useEffect(() => {
    if (!(zoomBehavior && $onZoomEndEvent$)) {
      return;
    }
    
    zoomBehavior.on('end.useZoomEvents', (event) => {
      if (blockZoomEvent?.current) {
        return;
      }
      $onZoomEndEvent$?.(getZoomDetails(zoomBehavior, event.transform));
    });
  }, [zoomBehavior, $onZoomEndEvent$, blockZoomEvent]);
  
  return useCallback((toggle: boolean) => {
    blockZoomEvent.current = toggle;
  }, [])
}
