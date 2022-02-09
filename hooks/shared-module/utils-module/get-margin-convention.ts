/**
 * Computes a margin convention layout
 * @param width - The width of view
 * @param height - The height of the view
 * @param margin - The inner margins of the view
 * @returns [innerWidth, innerHeight, translate] - The inner sizes of the layout and the translation string of the content
 */
export const getMarginConvention = (
    width: number,
    height: number,
    margin: MarginConvention
): [number, number, string] => {
  const innerWidth = width - margin.LEFT - margin.RIGHT;
  const innerHeight = height - margin.TOP - margin.BOTTOM;
  const translate = `translate(${margin.LEFT},${margin.TOP})`;
  
  return [innerWidth, innerHeight, translate];
};

interface MarginConvention {
  TOP: number,
  LEFT: number,
  RIGHT: number,
  BOTTOM: number
}
