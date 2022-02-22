import {ScaleLinear, ScalePoint, ScaleTime} from "d3";

type FlexibleTimeUnit = number | string | Date;

// TODO: Continue with flexible time scale for the trend cell
export const getFlexibleTimeScale = (
    domain: [FlexibleTimeUnit, FlexibleTimeUnit],
    range: [number, number]
): ScaleLinear<number, number> | ScalePoint<string> | ScaleTime<number, number> => {
  return {} as any;
};
