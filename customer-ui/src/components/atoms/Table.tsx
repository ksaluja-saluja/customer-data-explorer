type TableCellValue = string | number | null | undefined;

type TableProps<T extends object> = {
  columns: Array<keyof T>;
  data: T[];
  className?: string;
  idKey?: keyof T;
  columnLabels?: Partial<Record<keyof T, string>>;
};

function formatCellValue(value: TableCellValue): string {
  if (value === null || value === undefined) {
    return "-";
  }

  return String(value);
}

function Table<T extends object>({
  columns,
  data,
  className,
  idKey = "id" as keyof T,
  columnLabels,
}: TableProps<T>) {
  return (
    <table className={className}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={String(column)}>
              {columnLabels?.[column] ?? String(column)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => {
          const rowId = String(row[idKey] ?? "");
          return (
            <tr key={rowId}>
              {columns.map((column) => (
                <td key={`${rowId}-${String(column)}`}>
                  {formatCellValue(row[column] as TableCellValue)}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Table;
