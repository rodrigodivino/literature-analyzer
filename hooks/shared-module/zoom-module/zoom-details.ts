import {ZoomTransform} from "d3";

/**
 * Defines details of a zoom state
 * @property scaleExtent - The scaleExtent of the zoom
 * @property extent - The extent of the zoom
 * @property translateExtent - The translate extent of the zoom
 * @property transform - The current transform of the zoom
 * @property x - The normalized [x1, x2] coordinates of the transform relative to the world width and view width.
 *  Example: x = [0.25, 0.75] says that the view shows from 25% to 75% of the world width.
 * @property y - The normalized [y1, y2] coordinates of the transform relative to the world height and view height.
 *  Example: y = [0.25, 0.75] says that the view shows from 25% to 75% of the world height.
 */
export interface ZoomDetails {
  scaleExtent: [number, number],
  extent: [[number, number], [number, number]],
  translateExtent: [[number, number], [number, number]],
  transform: ZoomTransform,
  x: [number, number],
  y: [number, number]
}

