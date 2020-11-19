import React, { useEffect, useState } from 'react';
import {
  Alert,
  Bullseye,
  Modal,
  Spinner,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Button
} from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/cjs/DateFormat';

import useSqlStore from '../store/sql_store';

const dataFormatters = (key, value, setDetail) => {
  if(key.endsWith('_at')) {
    return <DateFormat type="relative" date={value} />
  }

  if(key.endsWith('_id')) {
    return (
      <Button
        variant="link"
        isInline
        onClick={() => setDetail({type: key.replace(/_id$/, 's'), id: value})}
      >
        {value}
      </Button>
    )
  }

  if(typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }

  return value;
}

const renderData = (data, setDetail) => (
  <DescriptionList isHorizontal>
    {
      Object.keys(data).map((key) => <DescriptionListGroup key={key}>
        <DescriptionListTerm>{key}</DescriptionListTerm>
        <DescriptionListDescription>{dataFormatters(key, data[key], setDetail)}</DescriptionListDescription>
      </DescriptionListGroup>)
    }
  </DescriptionList>
)

const DetailModal = () => {
  const detail = useSqlStore((state) => state.detail);
  const detailIsOpen = useSqlStore((state) => state.detailIsOpen);
  const closeDetail = useSqlStore((state) => state.closeDetail);
  const setDetail = useSqlStore((state) => state.setDetail);

  const [state, setState] = useState(() => ({
    loading: false,
    data: undefined,
    error: undefined
  }));

  const refreshDetail = () => {
    setState({error: undefined, data: undefined, loading: true});

    return Rails.ajax({
      url: `/${process.env.PATH_PREFIX || 'app'}/${process.env.APP_NAME || ''}`,
      type: 'POST',
      data: new URLSearchParams({query: `SELECT * FROM ${detail.type} WHERE id = '${detail.id}'`}).toString(),
      contentType: 'application/json',
      cache: false,
      success: (data) => setState({loading: false, data, error: undefined}),
      error: (data) => setState({loading: false, error: data, data: undefined})
    })
  }

  useEffect(() => {
    if(detail?.id) {
      refreshDetail()
    }
  }, [detail?.id])

  return (
    <Modal
      title={`${detail?.type} - ${detail?.id}`}
      isOpen={detailIsOpen}
      onClose={closeDetail}
    >
      {state.loading && <Bullseye><Spinner /></Bullseye>}
      {state.error && <Alert className="pf-u-m-md" variant="danger" isInline title={state.error} />}
      {state.data && renderData(state.data[0], setDetail)}
    </Modal>
  )
}

export default DetailModal;
