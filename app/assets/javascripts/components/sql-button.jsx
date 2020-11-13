import React from 'react';
import { Button } from '@patternfly/react-core';
import FormSpy from '@data-driven-forms/react-form-renderer/dist/cjs/form-spy';

import 'react-querybuilder/dist/query-builder.scss';
import useSqlStore from '../store/sql_store';

const SqlButton = () => {
  const setData = useSqlStore((state) => state.setData);
  const setError = useSqlStore((state) => state.setError);
  const setLoading = useSqlStore((state) => state.setLoading);
  const loading = useSqlStore((state) => state.loading);

  return (
    <FormSpy>
      {({invalid, values}) => <Button
        type="button"
        variant="primary"
        isDisabled={invalid || loading}
        onClick={() => {
          setLoading(true);
          return Rails.ajax({
            url: `/${process.env.PATH_PREFIX || 'app'}/${process.env.APP_NAME || ''}`,
            type: 'POST',
            data: new URLSearchParams(values).toString(),
            contentType: 'application/json',
            cache: false,
            success: (data) => setData(data),
            error: (data) => setError(data?.error?.message || data || 'Unknown error')
          })
        }}
      >
          Perform a query
      </Button>}
    </FormSpy>
  )
};

export default SqlButton;

