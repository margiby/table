import type { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

type TableComponentProps = {
  data: {
    id: string;
    data: {
      type: string;
      group: string;
      label: string;
    };
  }[];
  onClose: () => void;
};

/**
 * Die TableComponent zeigt Detailinformationen in einer übersichtlichen
 * Tabelle an. Sie ist dafür gedacht, in einer Seitenleiste platziert zu werden.
 */
const TableComponent = ({
  data,
  onClose,
}: TableComponentProps): ReactElement => (
  <div className="sidebar-table-container">
    <div className="sidebar-header">
      {/* Titel der Sidebar */}
      <h4 className="title is-4">
        <FormattedMessage id="table_details" defaultMessage="Details" />
      </h4>
      {/* Schließen-Schaltfläche */}
      <button
        type="button"
        className="button is-light close-button"
        aria-label="Schließen"
        onClick={onClose}
      >
        &times;
      </button>
    </div>
    {/* Tabelle mit den Daten */}
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>
              <FormattedMessage id="table_header_type" defaultMessage="Typ" />
            </th>
            <th>
              <FormattedMessage
                id="table_header_group"
                defaultMessage="Gruppe"
              />
            </th>
            <th>
              <FormattedMessage
                id="table_header_chain"
                defaultMessage="Kette"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.data.type}</td>
              <td>{item.data.group}</td>
              <td>{item.data.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TableComponent;
