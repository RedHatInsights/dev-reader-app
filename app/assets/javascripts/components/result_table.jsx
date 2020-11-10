import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant,
  sortable,
  SortByDirection
} from '@patternfly/react-table';
import { Alert, Bullseye, Spinner } from '@patternfly/react-core';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/components/cjs/PrimaryToolbar';

import useSqlStore from '../store/sql_store';

const prepareFilterConfig = (columns, onChange, values) => columns.map((column) => ({
  label: column.title,
  filterValues: {
    onChange: (_e, value) => onChange(column.title, value),
    value: values[column.title]
  }
}))

const prepareColumns = (data) => Object.keys(data[0]).map((title) => ({
  title,
  transforms: [sortable]
}));

const prepareRows = (data) => data.map((row, index) => ({ cells: Object.values(row), id: `${index}-`}));

const sortRows = (index, direction, rows) => {
  const sortedRows = rows.sort((a, b) => (a.cells[index] < b.cells[index] ? -1 : a.cells[index] > b.cells[index] ? 1 : 0));

  return direction === SortByDirection.asc ? sortedRows : sortedRows.reverse()
}

const prepareChips = (filters) => Object.keys(filters)
  .map((key) =>
    filters[key] && filters[key].length > 0 ? { key, category: key, chips: [{value: filters[key], name: filters[key]}] } : undefined
  )
  .filter(Boolean);

const removeChip = (filters, [{category}]) => ({ ...filters, [category]: undefined});

const filterData = (filters, data) => data.filter((node) => Object.keys(filters).every((key) => !filters[key] || String(node[key]).includes(filters[key])));

const ResultTable = () => {
  const data = useSqlStore((state) => state.data);
  const error = useSqlStore((state) => state.error);

  const [state, setState] = useState(() => ({
    columns: undefined,
    rows: undefined,
    sortBy: undefined,
    page: 1,
    perPage: 50,
    filter: {}
  }));

  useEffect(() => {
    if(data?.length > 0) {
      setState({
        ...state,
        columns: prepareColumns(data),
        rows: prepareRows(data),
        sortBy: undefined,
        page: 1,
        filter: {}
      })
    }
  }, data)

  if (error) {
    return <Alert className="pf-u-mt-xl" variant="danger" isInline title={error} />
  }

  if (!data || data.length === 0) {
    return <Alert className="pf-u-mt-xl" variant="info" isInline title="Please perform a query to load data" />
  }

  if(!state.rows) {
    return <Bullseye className="pf-u-mt-xl"><Spinner /></Bullseye>;
  }

  const onSort = (_e, index, direction) => setState({
    ...state,
    page: 1,
    sortBy: {
      index, direction
    },
    rows: sortRows(index, direction, state.rows)
  })

  const paginationConfig = {
    itemCount: state.rows.length,
    page: state.page,
    perPage: state.perPage,
    onSetPage: (_e, page) => setState({ ...state, page}),
    onPerPageSelect: (_e, perPage) => setState({ ...state, perPage, page: 1}),
  }

  const refilterRows = (filter) => state.sortBy ? sortRows(state.sortBy.index, state.sortBy.direction, prepareRows(filterData(filter, data))) : prepareRows(filterData(filter, data));

  const onFilter = (name, value) => {
    const filter = {...state.filter, [name]: value };

    return setState({
      ...state,
      filter,
      rows: refilterRows(filter)
    })
  }

  return (
    <div className="pf-u-mt-xl">
      <PrimaryToolbar
        pagination={paginationConfig}
        filterConfig={{items: prepareFilterConfig(state.columns, onFilter, state.filter)}}
        activeFiltersConfig={{
          filters: prepareChips(state.filter),
          onDelete: (_e, chips, deleteAll) => deleteAll
            ? setState({...state, filter: {}, rows: refilterRows({})})
            : setState({...state, filter: removeChip(state.filter, chips), rows: refilterRows(removeChip(state.filter, chips))})
        }}
      />
      <Table
        aria-label="Results table"
        cells={state.columns}
        rows={state.rows.slice((state.page - 1) * state.perPage, ((state.page - 1) * state.perPage + state.perPage))}
        variant={TableVariant.compact}
        onSort={onSort}
        sortBy={state.sortBy}
      >
        <TableHeader />
        <TableBody rowKey={({rowIndex}) => rowIndex} />
      </Table>
    </div>
  );
};

export default ResultTable;
