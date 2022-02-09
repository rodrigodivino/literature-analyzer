import {useEffect, useState} from "react";
import {select, zoom, ZoomBehavior, zoomIdentity, ZoomTransform} from "d3";
import {useWrapperState} from "../utils-module/use-wrapper-state";

export const useZoomBehavior = (
    zoomElement: SVGGraphicsElement | null,
): [ZoomBehavior<SVGGraphicsElement, unknown> | undefined, ZoomTransform] => {
  const [transform, setTransform] = useState<ZoomTransform>(zoomIdentity);
  const [zoomBehavior, setZoomBehavior] = useWrapperState<ZoomBehavior<SVGGraphicsElement, unknown>>();
  
  useEffect(() => {
    if (!zoomElement) {
      return;
    }
    
    const zoomBehavior = zoom<SVGGElement, unknown>()
        .on('zoom', (event) => {
          setTransform(event.transform);
        });
    
    select(zoomElement).call(zoomBehavior);
    
    setZoomBehavior(zoomBehavior);
  }, [zoomElement, setZoomBehavior]);
  
  return [zoomBehavior, transform]
}
