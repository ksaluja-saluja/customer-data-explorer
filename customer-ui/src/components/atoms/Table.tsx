type TableRow = {
  [key: string]: string | number | null | undefined;
};

type TableProps<T extends TableRow> = {
  columns: Array<keyof T>;
  data: T[];
  className?: string;
  idKey?: keyof T;
};

function formatCellValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return "-";
  }

  return String(value);
}

function Table<T extends TableRow>({
  columns,
  data,
  className,
  idKey = "id" as keyof T,
}: TableProps<T>) {
  return (
    <table className={className}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={String(column)}>{String(column)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => {
          const rowId = row[idKey];
          return (
            <tr key={rowId}>
              {columns.map((column) => (
                <td key={`${rowId}-${String(column)}`}>
                  {formatCellValue(
                    row[column] as string | number | null | undefined,
                  )}
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
