import React from 'react';
import {
    Table,
    TableHeader,
    TableBody
} from '@patternfly/react-table';
import { Alert } from '@patternfly/react-core';

import useSqlStore from '../store/sql_store';

const prepareColumns = (data) => Object.keys(data[0]);

const prepareRows = (data) => data.map((row) => Object.values(row));

const ResultTable = () => {
    const data = useSqlStore((state) => state.data);

    if (!data || data.length === 0) {
        return <Alert className="pf-u-mt-xl" variant="info" isInline title="Please perform a query to load data" />
    }

    return (
        <Table
            aria-label="Results table"
            cells={prepareColumns(data)}
            rows={prepareRows(data)}
        >
          <TableHeader />
          <TableBody />
        </Table>
    );
};

export default ResultTable;
