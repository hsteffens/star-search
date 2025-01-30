import React from 'react';
import styles from "./Table.module.css";

type TableProps = {
  data: { name: string; id: string }[];
  onButtonClick: (id: string) => void;
};

const Table: React.FC<TableProps> = ({ data, onButtonClick }) => {
    return (
        <table className={styles.tableContainer}>
        <tbody>
            {data.map((item, index) => (
            <tr key={index} className={styles.tableRow}>
                <td className={styles.tableColumnName}>
                    {item.name}</td>
                <td className={styles.tableColumnAction}>
                <button
                    onClick={() => onButtonClick(item.id)}
                    className={styles.tableButton}
                >
                    <span className={styles.tableColumnActionLabel}>
                        SEE DETAILS
                    </span>
                </button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    );
};

export default Table;
