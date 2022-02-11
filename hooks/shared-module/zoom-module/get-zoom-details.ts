import {ZoomDetails} from "./zoom-details";
import {ZoomBehavior, ZoomTransform} from "d3";

/**
 * Derives zoom details from a behavior and transform
 * @param zoomBehavior - the behavior to derive details of the transform
 * @param transform - the zoom transform
 *
 * @returns the zoom details
 */
export const getZoomDetails = (
    zoomBehavior: ZoomBehavior<SVGGraphicsElement, unknown>,
    transform: ZoomTransform
): ZoomDetails => {
  const scaleExtent = zoomBehavior.scaleExtent();
  const translateExtent = zoomBehavior.translateExtent();
  // @ts-ignore no types for the zoomBehavior.extent() signature that has no arguments and returns the constant extent
  const extent = zoomBehavior.extent()();
  
  const worldHeight = translateExtent[1][1] - translateExtent[0][1];
  const viewHeight = extent[1][1] - extent[0][1];
  const yStart = (-1 * transform.y) / transform.k;
  const yEnd = yStart + viewHeight / transform.k;
  
  const worldWidth = translateExtent[1][0] - translateExtent[0][0];
  const viewWidth = extent[1][0] - extent[0][0];
  const xStart = (-1 * transform.x) / transform.k;
  const xEnd = xStart + viewWidth / transform.k;
  
  return {
    extent,
    scaleExtent,
    transform,
    translateExtent,
    x: [xStart / worldWidth, xEnd / worldWidth],
    y: [yStart / worldHeight, yEnd / worldHeight]
  }
}
