import {ElementRef, FunctionComponent, PropsWithChildren, RefObject, useEffect, useRef, useState} from "react";
import styles from './virtualization-wrapper.module.css';

const VirtualizationWrapper: FunctionComponent = ({children}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isVisible = useBecomesVisible(wrapperRef);
  
  return <div ref={wrapperRef} className={styles.wrapper}>
    {isVisible ? children : <span className={styles.loading}>loading...</span>}
  </div>
}

export default VirtualizationWrapper;


const useBecomesVisible = (elementRef: RefObject<HTMLElement>) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (elementRef.current) {
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if(!(elementRef.current && elementRef.current.parentNode)) return;
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(elementRef.current);
          }
        });
      });
      observer.observe(elementRef.current.parentNode as HTMLElement);
    }
  }, [elementRef]);
  
  return isVisible;
};
