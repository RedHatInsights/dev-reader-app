// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import {
  Page,
  PageHeader,
  PageHeaderTools,
  PageSidebar,
  PageSection,
  PageSectionVariants
} from '@patternfly/react-core';

import SqlBuilder from '../../assets/javascripts/pages/sql_builder';

import '@patternfly/patternfly/patternfly.css';
import '@patternfly/patternfly/patternfly-addons.css';
import '@redhat-cloud-services/frontend-components/index.css';

const App = () => {
  const [isNavOpen, setNavOpen] = useState(false);

  const Header = (
    <PageHeader
      logo="TopoSourcesDbReader"
      headerTools={<PageHeaderTools>User</PageHeaderTools>}
      showNavToggle
      isNavOpen={isNavOpen}
      onNavToggle={() => setNavOpen(!isNavOpen)}
    />
  );

  const Sidebar = <PageSidebar nav="Navigation" isNavOpen={isNavOpen} />;

  return (
    <Page header={Header} sidebar={Sidebar}>
      <PageSection variant={PageSectionVariants.light}>
        <SqlBuilder />
      </PageSection>
    </Page>
  )
};

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.getElementById('root'),
  )
})
