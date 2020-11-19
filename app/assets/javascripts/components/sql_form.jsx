import React from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/dist/cjs/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';

import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';
import SubForm from '@data-driven-forms/pf4-component-mapper/dist/cjs/sub-form';
import Switch from '@data-driven-forms/pf4-component-mapper/dist/cjs/switch';
import Textarea from '@data-driven-forms/pf4-component-mapper/dist/cjs/textarea';

import SqlBuilder from './sql_builder';
import sqlValidator from '../utilities/sql_validator';
import SqlButton from './sql-button';

const SqlForm = () => (
  <FormRenderer
    componentMapper={{
      [componentTypes.TEXTAREA]: Textarea,
      [componentTypes.SWITCH]: Switch,
      [componentTypes.SUB_FORM]: SubForm,
      'query-builder': SqlBuilder,
      'sql-button': SqlButton
    }}
    FormTemplate={(props) => <FormTemplate {...props} showFormControls={false} />}
    schema={{
      fields: [{
        component: componentTypes.TEXTAREA,
        name: 'query',
        label: 'Perform a query',
        initialValue: 'SELECT * FROM sources',
        validate: [{type: 'required'}, sqlValidator],
        isRequired: true
      }, {
        component: componentTypes.SWITCH,
        name: 'show-query',
        label: 'Show query builder'
      }, {
        component: componentTypes.SUB_FORM,
        name: 'advanced-query-builder',
        title: 'Query builder',
        description: 'Allows to easily build WHERE statement',
        condition: {when: 'show-query', isNotEmpty: true},
        fields: [
          {
            name: 'query-builder',
            component: 'query-builder'
          }
        ]
      }, {
        component: 'sql-button',
        name: 'button'
      }]
    }}
    onSubmit={console.log} //submit is not used
  />
);

export default React.memo(SqlForm);
