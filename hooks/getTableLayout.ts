export const getTableLayout = <Row, Columns>(
    data: Row[],
    columns: Columns[],
    cellWidth: number,
    cellHeight: number
): TableCellData<Row, Columns>[]  => {
  return data.flatMap((d, i) => {
    return columns.map((column, j) => {
      return {
        key: `row:${i}column:${j}`,
        y: i * cellHeight,
        x: j * cellWidth,
        width: cellWidth,
        height: cellHeight,
        i,
        j,
        column,
        d
      }
    })
  })
};

export interface TableCellData<Row, Columns> {
  key: string,
  i: number,
  j: number,
  column: Columns,
  d: Row,
  x: number,
  y: number,
  width: number,
  height: number
}
