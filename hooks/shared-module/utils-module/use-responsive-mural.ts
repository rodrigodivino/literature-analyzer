import {RefObject, useEffect, useState} from "react";

/**
 * Get the size state of an SVG element.
 *  The SVG must be a child of HTMLDivElement
 * @param mural - The SVG to listen to changes in the parent and to obtain the size
 * @returns [width, height] - The state of the SVG size
 */
export const useResponsiveMural = (mural: RefObject<SVGSVGElement> | RefObject<HTMLCanvasElement>) => {
  const [width, setWidth] = useState<number>(100);
  const [height, setHeight] = useState<number>(100);
  
 
  useEffect(() => {
    if(!mural.current) return;
    
    setWidth(mural.current.clientWidth);
    setHeight(mural.current.clientHeight);
    
    const resizeObserver = new ResizeObserver(() => {
      if(!mural.current) return;
      
      setWidth(mural.current.clientWidth);
      setHeight(mural.current.clientHeight);
    });

    if(mural.current.parentElement && mural.current.parentElement.tagName === 'DIV') {
      resizeObserver.observe(mural.current.parentElement);
    } else {
      throw new Error('useResponsiveSVG requires the SVG to be a child of HTMLDivElement')
    }

    return () => {
      resizeObserver.disconnect();
    }
  }, [mural])
  
  
  return [width, height]
}
