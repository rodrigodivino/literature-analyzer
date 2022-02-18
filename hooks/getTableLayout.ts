export const getTableLayout = <Datum, Column>(
    data: Datum[],
    columns: Column[],
    cellWidth: number,
    cellHeight: number
): TableCellData<Datum, Column>[]  => {
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

export interface TableCellData<Datum, Column> {
  key: string,
  i: number,
  j: number,
  column: Column,
  d: Datum,
  x: number,
  y: number,
  width: number,
  height: number
}
