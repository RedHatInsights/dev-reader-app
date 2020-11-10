import React from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';

import SqlForm from '../components/sql_form';
import useSqlStore from '../store/sql_store';
import ResultTable from '../components/result_table';

const SqlBuilder = () => {
  const loading = useSqlStore((state) => state.loading);

  return <div>
    <SqlForm />
    { loading
      ? <Bullseye className="pf-u-mt-xl"><Spinner /></Bullseye>
      : <ResultTable />
    }
  </div>
}

export default SqlBuilder;
