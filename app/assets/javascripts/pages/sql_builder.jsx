import React from 'react';
import { Bullseye, Spinner, Card, CardBody } from '@patternfly/react-core';

import SqlForm from '../components/sql_form';
import useSqlStore from '../store/sql_store';
import ResultTable from '../components/result_table';

const SqlBuilder = () => {
  const loading = useSqlStore((state) => state.loading);

  return <div>
    <Card isFlat className="pf-u-m-md">
      <CardBody>
        <SqlForm />
      </CardBody>
    </Card>
    { loading
      ? <Bullseye className="pf-u-mt-xl"><Spinner /></Bullseye>
      : <ResultTable />
    }
  </div>
}

export default SqlBuilder;
