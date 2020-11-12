/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react';
import QueryBuilder, { formatQuery } from 'react-querybuilder';
import { Alert, Button, ClipboardCopy, FormGroup, InputGroup, FormSelectOption, FormSelect, TextInput } from '@patternfly/react-core';

import 'react-querybuilder/dist/query-builder.scss';
import useSqlStore from '../store/sql_store';

const prepareFields = (structure) => structure.map((column) => ({
  name: column.column_name,
  label: column.column_name,
  ...(column.data_type.includes('int') && {inputType: 'number'}),
  ...(column.data_type.includes('timestamp') && {inputType: 'date'}),
}))

const Select = ({options, handleOnChange, value}) => (
  <FormSelect value={value} style={{maxWidth: 150}} onChange={handleOnChange} aria-label='select'>
    {options.map(({label, name}) => <FormSelectOption key={name} value={name} label={label} />)}
  </FormSelect>
);

const ControlButton = ({title , handleOnClick, className}) => (
  <Button variant="control" isInline onClick={handleOnClick} className={className}>
    {title}
  </Button>
);

const controlElements = {
  addGroupAction: ControlButton,
  addRuleAction: ControlButton,
  removeRuleAction: ControlButton,
  removeGroupAction: ControlButton,
  valueEditor: ({value, inputType, handleOnChange, className}) => (
    <TextInput aria-label='text-input' style={{maxWidth: 150}} value={value} type={inputType} onChange={handleOnChange} className={className}/>
  ),
  combinatorSelector: Select,
  fieldSelector: Select,
  operatorSelector: Select
}

const SqlBuilder = () => {
  const state = useSqlStore((state) => state.queryBuilder);
  const setState = useSqlStore((state) => state.setQueryState);

  const loadTableStructure = () => {
    setState({ loading: true});

    return Rails.ajax({
      url: `/${process.env.PATH_PREFIX || 'app'}/${process.env.APP_NAME || ''}/load_structure`,
      type: 'POST',
      data: new URLSearchParams({ tableName: state.value?.toLowerCase?.() }).toString(),
      cache: false,
      success: (structure) => setState({ loading: false, structure: prepareFields(structure), loaded: true}),
      error: (data) => console.log(data)
    })
  }

  return (
    <React.Fragment>
      <FormGroup fieldId="table-name" label='Table name' helperText="Enter a table name you want to build queries for">
        <InputGroup>
          <TextInput name="table-name" id="table-name" value={state.value} onChange={value => setState({value})} />
          <Button
            onClick={loadTableStructure}
            variant="control"
            isDisabled={!state.value || state.loading}
            isLoading={state.loading}
          >
              Load table structure
          </Button>
        </InputGroup>
      </FormGroup>
      {state.loaded && state.structure.length === 0 && <Alert className="pf-u-mt-sm" variant="warning" isInline title="Selected table does not exist. Do not forget to use plural name" />}
      {state.loaded && state.structure.length > 0 && <React.Fragment>
        <QueryBuilder
          query={state.initialQuery}
          controlElements={controlElements}
          fields={state.structure}
          onQueryChange={(query) => setState({query: formatQuery(query, 'sql'), initialQuery: query})}
        />
        <ClipboardCopy isReadOnly>{state.query}</ClipboardCopy>
      </React.Fragment>}
      {!state.loaded && <Alert className="pf-u-mt-sm" variant="info" isInline title="No structure loaded" />}
    </React.Fragment>
  )
}

export default SqlBuilder;
