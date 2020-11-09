import React from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/dist/cjs/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';

import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';
import componentMapper from '@data-driven-forms/pf4-component-mapper/dist/cjs/component-mapper';
import useSqlStore from '../store/sql_store';

const SqlForm = () => {
    const setData = useSqlStore((state) => state.setData);
    const setLoading = useSqlStore((state) => state.setLoading);

    return <FormRenderer
            componentMapper={componentMapper}
            FormTemplate={(props) => <FormTemplate {...props} submitLabel="Perform a query" />}
            schema={{
                fields: [{
                    component: componentTypes.TEXTAREA,
                    name: 'query',
                    label: 'Perform a query',
                    initialValue: 'SELECT * FROM sources'
                }]
            }}
            onSubmit={(values) => {
            setLoading(true);
            return Rails.ajax({
                url: `${process.env.PATH_PREFIX || 'app'}/${process.env.APP_NAME || ''}`,
                type: 'POST',
                data: new URLSearchParams(values).toString(),
                contentType: 'application/json',
                cache: false,
                success: (data) => setData(data),
            })
        }}
        />
}

export default SqlForm;
