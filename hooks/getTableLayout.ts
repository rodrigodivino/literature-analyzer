export const getTableLayout = <Row>(
    data: Row[],
    columns: string[],
    cellWidth: number,
    cellHeight: number
): TableCellData<Row>[]  => {
  return data.flatMap((d, i) => {
    return columns.map((column, j) => {
      return {
        key: `row:${i}column:${j}`,
        x: i * cellWidth,
        y: j * cellHeight,
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

export interface TableCellData<Row> {
  key: string,
  i: number,
  j: number,
  column: string,
  d: Row,
  x: number,
  y: number,
  width: number,
  height: number
}
