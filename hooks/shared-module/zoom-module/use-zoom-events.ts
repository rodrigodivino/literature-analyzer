import {useCallback, useEffect, useRef} from "react";
import {ZoomBehavior, ZoomTransform} from "d3";

export const useZoomEvents = (
    zoomBehavior: ZoomBehavior<SVGGraphicsElement, unknown> | undefined,
    $onZoomEvent$?: ((zoomTransform: ZoomTransform) => void) | null,
    $onZoomStartEvent$?: ((zoomTransform: ZoomTransform) => void) | null,
    $onZoomEndEvent$?: ((zoomTransform: ZoomTransform) => void) | null,

): (zoomEvent: boolean) => void => {
  const blockZoomEvent = useRef<boolean>(false);
  
  useEffect(() => {
    if(!(zoomBehavior && $onZoomEvent$)) return;
    
    zoomBehavior.on('zoom.useZoomEvents', (event) => {
      if(blockZoomEvent?.current) return;
      $onZoomEvent$?.(event.transform)
    })
  }, [zoomBehavior, $onZoomEvent$, blockZoomEvent])
  
  useEffect(() => {
    if(!(zoomBehavior && $onZoomStartEvent$)) return;
    
    zoomBehavior.on('start.useZoomEvents', (event) => {
      if(blockZoomEvent?.current) return;
      $onZoomStartEvent$?.(event.transform)
    })
  }, [zoomBehavior, $onZoomStartEvent$, blockZoomEvent])
  
  useEffect(() => {
    if(!(zoomBehavior && $onZoomEndEvent$)) return;
    
    zoomBehavior.on('end.useZoomEvents', (event) => {
      if(blockZoomEvent?.current) return;
      $onZoomEndEvent$?.(event.transform)
    })
  }, [zoomBehavior, $onZoomEndEvent$, blockZoomEvent])

  return useCallback((toggle: boolean) => {
    blockZoomEvent.current = toggle;
  }, [])
}
