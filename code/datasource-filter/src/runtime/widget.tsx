/**
  Licensing
  Copyright 2021 Esri
  Licensed under the Apache License, Version 2.0 (the "License"); You
  may not use this file except in compliance with the License. You may
  obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
  implied. See the License for the specific language governing
  permissions and limitations under the License.
  A copy of the license is available in the repository's
  LICENSE file.
*/

/** @jsx jsx */
import { React, AllWidgetProps, jsx, DataSourceComponent, SqlQueryParams, DataSourceManager, QueriableDataSource, DataSource } from 'jimu-core'
import defaultMessages from './translations/default'
import { Label, Radio, defaultMessages as jimuUIMessages } from 'jimu-ui'

interface State {
  policyType: PolicyType

}

enum PolicyType {
  Auto = 'Auto',
  HO3 = 'HO-3',
  HO4 = 'HO-4',
  None = 'None'
}

export default class Widget extends React.PureComponent<AllWidgetProps<unknown>, State> {
  constructor (props) {
    super(props)

    this.state = {
      policyType: PolicyType.None
    }
  }

  componentWillUnmount () {
    const dataSourceId = this.props.useDataSources?.[0]?.dataSourceId
    const dataSource = dataSourceId && DataSourceManager.getInstance().getDataSource(dataSourceId) as QueriableDataSource
    if (dataSource) {
      // Reset query in data source
      dataSource.updateQueryParams(this.getQuery(PolicyType.None), this.props.id)
    }
  }

  getQuery = (policyType: PolicyType): SqlQueryParams => {
    return {
      where: this.getFilter(policyType)
    }
  }

  getFilter = (policyType: PolicyType): string => {
    if (policyType && policyType !== PolicyType.None) {
      return `(Policy_Type = '${policyType}')`
    }

    return '(1=1)'
  }

  onRadioButtonChange = e => {
    const policyType = e.target.value
    // Update radio button selected status
    this.setState({ policyType })

    const dataSourceId = this.props.useDataSources?.[0]?.dataSourceId
    const dataSource = dataSourceId && DataSourceManager.getInstance().getDataSource(dataSourceId) as QueriableDataSource
    if (dataSource) {
      // Update query in data source
      dataSource.updateQueryParams(this.getQuery(policyType), this.props.id)
    }
  }

  onDataSourceCreated = (ds: DataSource) => {
    if (this.state.policyType && ds) {
      const dataSource = ds as QueriableDataSource
      // Update query in data source
      dataSource.updateQueryParams(this.getQuery(this.state.policyType), this.props.id)
    }
  }

  render () {
    return (
      <div className='widget-demo jimu-widget m-2'>
        <DataSourceComponent // Create data source which is use by current widget
          useDataSource={this.props.useDataSources?.[0]}
          widgetId={this.props.id}
          onDataSourceCreated={this.onDataSourceCreated}
        />
        <div>
          <b>{this.props.intl.formatMessage({ id: 'selectPolicy', defaultMessage: defaultMessages.selectPolicy })}</b><br />
          <Label style={{ cursor: 'pointer' }}>
            <Radio
              style={{ cursor: 'pointer' }} value={PolicyType.None} checked={this.state.policyType === PolicyType.None} onChange={this.onRadioButtonChange}
            /> {this.props.intl.formatMessage({ id: 'none', defaultMessage: jimuUIMessages.none })}
          </Label>
          {' '}
          <Label style={{ cursor: 'pointer' }}>
            <Radio
              style={{ cursor: 'pointer' }} value={PolicyType.Auto} checked={this.state.policyType === PolicyType.Auto} onChange={this.onRadioButtonChange}
            /> {this.props.intl.formatMessage({ id: 'typeAuto', defaultMessage: defaultMessages.typeAuto })}
          </Label>
          {' '}
          <Label style={{ cursor: 'pointer' }}>
            <Radio
              style={{ cursor: 'pointer' }} value={PolicyType.HO3} checked={this.state.policyType === PolicyType.HO3} onChange={this.onRadioButtonChange}
            /> {this.props.intl.formatMessage({ id: 'typeHO3', defaultMessage: defaultMessages.typeHO3 })}
          </Label>
          {' '}
          <Label style={{ cursor: 'pointer' }}>
            <Radio
              style={{ cursor: 'pointer' }} value={PolicyType.HO4} checked={this.state.policyType === PolicyType.HO4} onChange={this.onRadioButtonChange}
            /> {this.props.intl.formatMessage({ id: 'typeHO4', defaultMessage: defaultMessages.typeHO4 })}
          </Label>
          <p />
        </div>
      </div>

    )
  }
}
