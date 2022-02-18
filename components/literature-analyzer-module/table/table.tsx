import {FunctionComponent, useCallback, useRef, useState} from "react";
import styles from "./table.module.css";
import {TableTypes} from "./table.types";
import {useResponsiveSVG} from "../../../hooks/shared-module/utils-module/use-responsive-svg";
import {TableConst} from "./table.const";
import {getMarginConvention} from "../../../hooks/shared-module/utils-module/get-margin-convention";
import {ZoomDetails} from "../../../hooks/shared-module/zoom-module/zoom-details";
import {getTableLayout} from "../../../hooks/getTableLayout";
import DataRow from "../../shared-module/data-row/data-row";
import {DataRowTypes} from "../../shared-module/data-row/data-row.types";
import LabelCell from "../../shared-module/label-cell/label-cell";


const Table: FunctionComponent<TableTypes.Props> = ({data}) => {
  const svg = useRef<SVGSVGElement>(null);
  const [width, height] = useResponsiveSVG(svg);
  
  const [innerWidth, innerHeight, translate] = getMarginConvention(width, height, TableConst.MARGIN);
  
  const [zoomDetails, setZoomDetails] = useState<ZoomDetails>();
  
  const handleZoomEvent = useCallback((newZoomDetails: ZoomDetails) => {
    setZoomDetails(newZoomDetails);
  }, []);
  
  const tableLayout = getTableLayout(
      data,
      [TableConst.COLUMNS.TITLE, TableConst.COLUMNS.RECENT, TableConst.COLUMNS.SURVEY, TableConst.COLUMNS.TREND],
      innerWidth / 4,
      TableConst.ROW_HEIGHT
  );
  
  
  return <div className={styles.container}>
    <svg ref={svg} className={styles.svg}>
      <g transform={translate}>
        {
          data.map((d, i) => {
            const cells: DataRowTypes.Cell[] = [];
            
            cells.push({
              component: LabelCell,
              componentProps: {
                label: d.entryTags?.title,
                fontSize: 12
              },
              key: 'label'
            })
  
            
            return <g key={d.citationKey} transform={`translate(0,${TableConst.ROW_HEIGHT * i})`} className='table-row-translate'>
              <DataRow width={innerWidth} height={TableConst.ROW_HEIGHT} cells={cells}/>
            </g>;
          })
        }
      </g>
    </svg>
  </div>;
};

export default Table;
