import * as React from 'react';
import cn from 'classnames';
import { DatasetsListService, IDatasetsListModel, IDatasetsListItem } from 'bi-internal/services';
import './NavDatasets.scss';
import { urlState, IUrl, AuthenticationService } from 'bi-internal/core';
import * as ah from 'bi-internal/ds-helpers';
import { getDaySwitchTitle, getMonthSwitchTitle, getQuarterSwitchTitle } from '../../ds_res/skimnSelector';


export class NavDatasets extends React.PureComponent<{schemaName: string}> {
  public userGroups = [];
  public state: {
    datasets: IDatasetsListItem[];
    locations: string[] | undefined;
    period?: {                                                  // start & end period or period type
      start?: string;
      end?: string;
      type?: number;
    } | undefined;
  };
  public constructor(props) {
    super(props);
    this.state = { datasets: [], locations: undefined , period: undefined };
    const authModel = AuthenticationService.getModel();
    this.userGroups = authModel.hasOwnProperty('sys_config') && authModel['sys_config'].hasOwnProperty('ext_groups') ? authModel['sys_config']['ext_groups'] : [];
  }

  public componentDidMount(): void {
    DatasetsListService.subscribeUpdatesAndNotify(this._onDsListSvcUpdated);
    urlState.subscribeUpdatesAndNotify(this._onUrlStateUpdated);
  }

  public componentWillUnmount(): void {
    DatasetsListService.unsubscribe(this._onDsListSvcUpdated);
    urlState.unsubscribe(this._onUrlStateUpdated);
  }

  private _onDsListSvcUpdated = (model: IDatasetsListModel) => {
    const {loading, error, datasets} = model;
    const {schemaName} = this.props;
    if (!loading && !error) {
      const ds = datasets.find(ds => ds.schema_name === schemaName);
      const parents = ds.parents;
      this.setState({datasets: Array.prototype.concat.apply([], parents.map(p => p.children))});
    }
  };

  private _onUrlStateUpdated = ({locations, period}: IUrl) => {
    this.setState({locations, period});
  };

  private _getDsHref = (ds: IDatasetsListItem) => {
    const configItems: tables.IConfigItem[] = [];
    const uiCfg = ds.uiCfg;
    for (let key in uiCfg) {
      if (uiCfg.hasOwnProperty(key)) {
        configItems.push({key: key, value: uiCfg[key]});
      }
    }
    const ch: ah.ConfigHelper = new ah.ConfigHelper(configItems, null);
    let url: any = ch.getEnterUrl(ds.schema_name);
    url.locations = this.state.locations || url.locations;                                          // override locations and period
    url.period = this.state.period && this.state.period.end ? this.state.period : url.period;

    if (!url.a) url.a = (urlState.getModel() as any).a || 'month';
    const quarterSwitchTitle: string = getQuarterSwitchTitle(url);
    const monthSwitchTitle: string = getMonthSwitchTitle(url);
    const daySwitchTitle = getDaySwitchTitle(url);
    if (url.a === 'month' && !monthSwitchTitle) url.a = 'quarter';
    if (url.a === 'quarter' && !quarterSwitchTitle) url.a = 'year';

    if (url.a === 'day' && !daySwitchTitle) url.a = 'month';                                        // Если в датасете нет дней - выбираем месяц
    url = {...urlState.getModel(), ...url};
    Object.keys(url).forEach((key) => {
      if(![`dataset`, `segment`,`segmentId`,`route`,`preset`,`locations`,`metrics`,`mf`,`period`,`dboard`,`loc`,`geo`,`dash`,`dashboards`,`a`].includes(key)) {
        url[key] = null;
      }
    });
    // обусловлено SL-783
    if (this.userGroups.length) {
      if (ds.schema_name == "ds_106") {
        if ((this.userGroups.includes("GVC-SKIMN-CT") || this.userGroups.includes("GVC-SKIMN-CZHD"))) {
          url['dboard'] = '6';
        } else if (this.userGroups.includes("GVC-SKIMN-CL")){
          url['dboard'] = '9';
        }
      } else if (ds.schema_name == "ds_109") {
        if ((this.userGroups.includes("GVC-SKIMN-CT") || this.userGroups.includes("GVC-SKIMN-CFTO"))) {
          url['dboard'] = '4';
        }
      }
    }
    //=======================
    const sUrl: string = urlState.buildUrl(url);
    return sUrl;
  };

  public render() {
    const {schemaName} = this.props;
    const {datasets} = this.state;
    if(datasets.length === 1 && (+datasets[0].id > 100 || +datasets[0].id === 50)) return null;
    return (
      <ul className="NavDatasets">
        {datasets.map(ds =>
          <li className={cn('NavDatasets__Item', {active: ds.schema_name === schemaName})} key={ds.id}>
            {!ds.config.disableClick &&
            <a className="NavDatasets__Link" href={this._getDsHref(ds)}>
              {ds.title}
            </a>}
            {ds.config.disableClick &&
            <span className="NavDatasets__Link">
              {ds.title}
            </span>}
          </li>)}
      </ul>);
  }
}
