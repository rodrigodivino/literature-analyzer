import {FunctionComponent, useCallback, useRef, useState} from "react";
import styles from "./table.module.css";
import {TableTypes} from "./table.types";
import {useResponsiveSVG} from "../../../hooks/shared-module/utils-module/use-responsive-svg";
import {TableConst} from "./table.const";
import {getMarginConvention} from "../../../hooks/shared-module/utils-module/get-margin-convention";
import {ZoomDetails} from "../../../hooks/shared-module/zoom-module/zoom-details";
import {getTableLayout} from "../../../hooks/getTableLayout";
import LabelCell from "../../shared-module/label-cell/label-cell";


const Table: FunctionComponent<TableTypes.Props> = ({data}) => {
  const svg = useRef<SVGSVGElement>(null);
  const [width, height] = useResponsiveSVG(svg);
  
  const [innerWidth, innerHeight, translate] = getMarginConvention(width, height, TableConst.MARGIN);
  
  const [zoomDetails, setZoomDetails] = useState<ZoomDetails>();
  
  const handleZoomEvent = useCallback((newZoomDetails: ZoomDetails) => {
    setZoomDetails(newZoomDetails);
  }, []);
  
  console.log("data", data);
  
  const tableLayout = getTableLayout(data, ['title', 'recent', 'survey', 'trend'], innerWidth / 4, 40);
  
  
  return <div className={styles.container}>
    <svg ref={svg} className={styles.svg}>
      <g transform={translate}>
        {
          tableLayout.map(cell => {
            return <g key={cell.key} transform={`translate(${cell.x},${cell.y})`}>
              <LabelCell fontSize={14} label={cell.d.entryTags?.title} width={cell.width} height={cell.height}/>
            </g>;
          })
        }
      </g>
    </svg>
  </div>;
};

export default Table;
