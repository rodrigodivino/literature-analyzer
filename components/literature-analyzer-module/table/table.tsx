import {FunctionComponent, useCallback, useRef, useState} from "react";
import styles from "./table.module.css";
import {TableTypes} from "./table.types";
import {useResponsiveSVG} from "../../../hooks/shared-module/utils-module/use-responsive-svg";
import {TableConst} from "./table.const";
import {getMarginConvention} from "../../../hooks/shared-module/utils-module/get-margin-convention";
import {ZoomDetails} from "../../../hooks/shared-module/zoom-module/zoom-details";
import {getTableLayout} from "../../../hooks/getTableLayout";
import {ParsedBibtex} from "@orcid/bibtex-parse-js";
import LabelCell from "../../shared-module/label-cell/label-cell";
import BarCell from "../../shared-module/bar-cell/bar-cell";


const Table: FunctionComponent<TableTypes.Props> = ({data}) => {
  const svg = useRef<SVGSVGElement>(null);
  const [width, height] = useResponsiveSVG(svg);
  
  const [innerWidth, innerHeight, translate] = getMarginConvention(width, height, TableConst.MARGIN);
  
  const [zoomDetails, setZoomDetails] = useState<ZoomDetails>();
  
  const handleZoomEvent = useCallback((newZoomDetails: ZoomDetails) => {
    setZoomDetails(newZoomDetails);
  }, []);
  
  const tableLayout = getTableLayout<ParsedBibtex, TableTypes.ColumnType>(
      data,
      TableConst.COLUMNS,
      innerWidth / 4,
      TableConst.ROW_HEIGHT
  );
  
  
  return <div className={styles.container}>
    <svg ref={svg} className={styles.svg}>
      <g transform={translate}>
        {
          tableLayout.map((cell, i) => {
            return <g key={cell.key} className="table-cell" transform={`translate(${cell.x},${cell.y})`}>
              {(() => {
                switch (cell.column) {
                  case TableTypes.ColumnType.TITLE:
                    return <LabelCell
                        width={cell.width}
                        height={cell.height}
                        label={cell.d.entryTags?.title ?? ''}
                    />;
                  case TableTypes.ColumnType.RECENT:
                    return <BarCell
                        width={cell.width}
                        height={cell.height}
                        value={3}
                        max={6}
                    />;
                  case TableTypes.ColumnType.SURVEY:
                    return <BarCell
                        width={cell.width}
                        height={cell.height}
                        value={3}
                        max={6}
                        color={'mediumseagreen'}
                    />;
                  case TableTypes.ColumnType.TREND:
                    return <LabelCell
                        width={cell.width}
                        height={cell.height}
                        label={cell.d.entryTags?.title ?? ''}
                    />;
                }
              })()}
            </g>;
            
          })
        }
      </g>
    </svg>
  </div>;
};

export default Table;
