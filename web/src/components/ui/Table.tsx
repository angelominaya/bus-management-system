import { Table as BsTable } from 'react-bootstrap';
import type { ReactNode } from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No hay datos',
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
        <p className="mb-0">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <BsTable hover className="mb-0 align-middle">
        <thead className="table-light">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="text-uppercase text-muted small fw-semibold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={keyExtractor(item)}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render
                    ? col.render(item)
                    : ((item as Record<string, unknown>)[col.key] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </BsTable>
    </div>
  );
}
