import * as React from 'react';
import cn from 'classnames';
import $ from 'jquery';
import { lang } from 'bi-internal/utils';
import { SlidesListService, ISlidesListModel } from 'bi-internal/services';
import { PresentationsListService, withPresentationsListService } from 'bi-internal/services';
import { DatePicker } from '../../components/clndr/DatePicker';
import { IPresentationModel } from './models';
import { UsersService } from 'bi-internal/services';
import { BIIcon } from 'bi-internal/ui';
import { AppConfig } from 'bi-internal/core';
import { shell } from 'bi-internal/services';
import '../../components/PanelPeriods.scss';

const Icon1 = () =>
  <svg width="25" viewBox="0 0 33 37" fill="none" xmlns="http://www.w3.org/2000/svg" className={'openPresentationBtn'}>
    <path d="M30.6429 37H2.35714C1.71875 37 1.16629 36.7772 0.699777 36.3315C0.233259 35.8859 0 35.3379 0 34.6875V2.34863C0 1.69824 0.233259 1.15023 0.699777 0.70459C1.16629 0.258952 1.71875 0.0361328 2.35714 0.0361328H18.8571V12.7549C18.8571 13.068 18.9738 13.339 19.207 13.5679C19.4403 13.7967 19.7165 13.9111 20.0357 13.9111H33V34.6875C33 35.3379 32.7729 35.8859 32.3186 36.3315C31.8644 36.7772 31.3058 37 30.6429 37ZM27.1071 30.0625H25.9286V21.9688C25.9286 21.6556 25.8119 21.3846 25.5787 21.1558C25.3454 20.9269 25.0692 20.8125 24.75 20.8125H22.3929C22.0737 20.8125 21.7974 20.9269 21.5642 21.1558C21.3309 21.3846 21.2143 21.6556 21.2143 21.9688V30.0625H18.8571V17.3438C18.8571 17.0306 18.7405 16.7596 18.5073 16.5308C18.274 16.3019 17.9978 16.1875 17.6786 16.1875H15.3214C15.0022 16.1875 14.726 16.3019 14.4927 16.5308C14.2595 16.7596 14.1429 17.0306 14.1429 17.3438V30.0625H11.7857V24.2812C11.7857 23.9681 11.6691 23.6971 11.4358 23.4683C11.2026 23.2394 10.9263 23.125 10.6071 23.125H8.25C7.9308 23.125 7.65458 23.2394 7.42132 23.4683C7.18806 23.6971 7.07143 23.9681 7.07143 24.2812V30.0625H5.89286C5.57366 30.0625 5.29743 30.1769 5.06417 30.4058C4.83092 30.6346 4.71429 30.9056 4.71429 31.2188C4.71429 31.5319 4.83092 31.8029 5.06417 32.0317C5.29743 32.2606 5.57366 32.375 5.89286 32.375H27.1071C27.4509 32.375 27.7333 32.2606 27.9542 32.0317C28.1752 31.8029 28.2857 31.5319 28.2857 31.2188C28.2857 30.9056 28.1691 30.6346 27.9358 30.4058C27.7026 30.1769 27.4263 30.0625 27.1071 30.0625ZM21.2143 0C21.8527 0 22.3929 0.216797 22.8348 0.650391L32.3002 9.93652C32.7667 10.3942 33 10.9482 33 11.5986H21.2143V0Z" fill="white"/>
  </svg>;

const Icon7 = () =>
  <svg width="25" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={'openItBtn'}>
    <path d="M12.2222 0L16.247 4.02478L7.69141 12.5803L9.41963 14.3086L17.9752 5.753L22 9.77778V0H12.2222Z" fill="white"/>
    <path d="M19.5556 19.5556H2.44444V2.44444H11L8.55556 0H2.44444C1.09633 0 0 1.09633 0 2.44444V19.5556C0 20.9037 1.09633 22 2.44444 22H19.5556C20.9037 22 22 20.9037 22 19.5556V13.4444L19.5556 11V19.5556Z" fill="white"/>
  </svg>;

const PICKER_CFG = {
  // dateFormat: 'D.MM.YYYY',
  dateFormat: 'L',
  defaultColor: 'rgba(141, 234, 255, 0.3)',
  errorColor: '#ff0000',
  hideDelay: 99999999,
  locale: AppConfig.getModel().language.substring(0, 2),
  selectedColor: '#8deaff',
  timeFormat: 'H:mm',
};


export const RemoveButton = ({onRemovePress, onRemoveApprovePress, onRemoveCancelPress, isAttendingToRemove, isEditing}) => (
  <div className={cn('PresentationControlElement__Remove', {disabled: isEditing})}  onClick={e => e.stopPropagation()}>
    <a href={void(0)} title={'Удалить шаблон'}
       onClick={ isEditing ? void (0) : onRemovePress }>
      <svg width="25" viewBox="0 0 22 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.57143 22.6562C1.57143 23.2779 1.81977 23.874 2.26182 24.3135C2.70387 24.7531 3.30342 25 3.92857 25H18.0714C18.6966 25 19.2961 24.7531 19.7382 24.3135C20.1802 23.874 20.4286 23.2779 20.4286 22.6562V6.25001H1.57143V22.6562ZM14.9286 10.1563C14.9286 9.94905 15.0114 9.75034 15.1587 9.60383C15.3061 9.45731 15.5059 9.375 15.7143 9.375C15.9227 9.375 16.1225 9.45731 16.2699 9.60383C16.4172 9.75034 16.5 9.94905 16.5 10.1563V21.0938C16.5 21.301 16.4172 21.4997 16.2699 21.6462C16.1225 21.7927 15.9227 21.875 15.7143 21.875C15.5059 21.875 15.3061 21.7927 15.1587 21.6462C15.0114 21.4997 14.9286 21.301 14.9286 21.0938V10.1563ZM10.2143 10.1563C10.2143 9.94905 10.2971 9.75034 10.4444 9.60383C10.5918 9.45731 10.7916 9.375 11 9.375C11.2084 9.375 11.4082 9.45731 11.5556 9.60383C11.7029 9.75034 11.7857 9.94905 11.7857 10.1563V21.0938C11.7857 21.301 11.7029 21.4997 11.5556 21.6462C11.4082 21.7927 11.2084 21.875 11 21.875C10.7916 21.875 10.5918 21.7927 10.4444 21.6462C10.2971 21.4997 10.2143 21.301 10.2143 21.0938V10.1563ZM5.5 10.1563C5.5 9.94905 5.58278 9.75034 5.73013 9.60383C5.87748 9.45731 6.07733 9.375 6.28571 9.375C6.4941 9.375 6.69395 9.45731 6.8413 9.60383C6.98865 9.75034 7.07143 9.94905 7.07143 10.1563V21.0938C7.07143 21.301 6.98865 21.4997 6.8413 21.6462C6.69395 21.7927 6.4941 21.875 6.28571 21.875C6.07733 21.875 5.87748 21.7927 5.73013 21.6462C5.58278 21.4997 5.5 21.301 5.5 21.0938V10.1563ZM21.2143 1.56251H15.3214L14.8598 0.649422C14.762 0.454214 14.6114 0.29001 14.4249 0.175281C14.2384 0.0605526 14.0233 -0.00014785 13.804 8.56089e-06H8.19107C7.97224 -0.000827891 7.7576 0.0596462 7.57173 0.174502C7.38587 0.289359 7.23631 0.453951 7.14018 0.649422L6.67857 1.56251H0.785714C0.57733 1.56251 0.37748 1.64482 0.23013 1.79133C0.0827804 1.93784 0 2.13656 0 2.34376L0 3.90626C0 4.11346 0.0827804 4.31217 0.23013 4.45868C0.37748 4.6052 0.57733 4.68751 0.785714 4.68751H21.2143C21.4227 4.68751 21.6225 4.6052 21.7699 4.45868C21.9172 4.31217 22 4.11346 22 3.90626V2.34376C22 2.13656 21.9172 1.93784 21.7699 1.79133C21.6225 1.64482 21.4227 1.56251 21.2143 1.56251Z" fill="#FEB0B0"/>
      </svg>
    </a>

    {isAttendingToRemove &&
    <div className="PresentationControlElement__RemoveApprove">
      <h4 className="PresentationControlElement__RemoveTitle">Вы точно хотите удалить шаблон?</h4>
      <button className="PresentationControlElement__RemoveYes" onClick={onRemoveApprovePress}>Да</button>
      <button className="PresentationControlElement__RemoveNo" onClick={onRemoveCancelPress}>Нет</button>
    </div>}
  </div>);


class PdfMenu extends React.PureComponent<{presentationId: number, presentationTitle: string}> {
  public datepickerComponent: DatePicker = null;
  private _date: moment.Moment;

  public componentDidMount(): void {
    const container: HTMLElement = this.refs.container as HTMLElement;
    const $container: JQuery = $(container);
    const datePicker: HTMLElement = $container.find('#datePicker')[0];
    const dateInput: HTMLElement = $container.find('#dateInput')[0];
    const cfg = PICKER_CFG;

    const isSelectable: (d: moment.Moment, pt: PeriodType) => boolean = (d: moment.Moment, pt: PeriodType) => {
      return true;
    };

    const dp: DatePicker = new DatePicker(datePicker, dateInput, cfg, isSelectable);

    dp.onDisplay(() => {
      // debugger;
    });
    dp.onChange((value) => {
      this._date = value;
    });

    const endDate: moment.Moment = moment().subtract(1, 'day');
    const startDate: moment.Moment = moment().subtract(3, 'year');
    dp.setRange(startDate, endDate);
    dp.toggleDays(false);
    dp.setDate(endDate);
    this._date = endDate;

    this.datepickerComponent = dp;
  }

  private _onClickPdf = () => {
    if (!this._date) return;
    const periodId = this._date.format('YYYYMMDD00000054');
    const {presentationId, presentationTitle} = this.props;
    // too early
    //const link = AppConfig.fixRequestUrl(`/srv/imagifier/presentations/${ presentationId }.pdf?period.end=${ periodId }`);
    const link = AppConfig.fixRequestUrl(`/srv/resources/ds_res/preloader.html?period.end=${ periodId }&type=pdf&id=${ presentationId }&templateTitle=${presentationTitle}`);
    window.open(link, '_blank');
  };

  private _onClickPptx = () => {
    if (!this._date) return;
    const periodId = this._date.format('YYYYMMDD00000054');
    const {presentationId, presentationTitle} = this.props;
    // too early
    //const link = AppConfig.fixRequestUrl(`/srv/imagifier/presentations/${ presentationId }.pptx?period.end=${ periodId }`);
    const link = AppConfig.fixRequestUrl(`/srv/resources/ds_res/preloader.html?period.end=${ periodId }&type=pptx&id=${ presentationId }&templateTitle=${presentationTitle}`);
    window.open(link, '_blank');
  };

  public render() {
    return (
      <div className="PdfMenu" ref="container">
        <header className="PdfMenu__Header">Укажите отчетную дату</header>
        <div className="PdfMenu__Calendar DateTimePicker">
          <input className="DateTimePicker__DateInput form-control"
                 id="dateInput"
                 autoComplete="off"
                 readOnly={true}/>
          <div id="datePicker" className="dtpkr"/>
        </div>
        <div className={'PdfMenu__Buttons'}>
          <div data-id="pdf" className="PdfMenu__Button" onClick={this._onClickPdf} title="Скачать шаблон в формате PDF">
            PDF
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.875 9H1.125C0.814453 9 0.549316 8.89014 0.32959 8.67041C0.109863 8.45068 0 8.18555 0 7.875V7.03125C0 6.87891 0.0541992 6.74707 0.162598 6.63574C0.270996 6.52441 0.402832 6.46875 0.558105 6.46875C0.713379 6.46875 0.84668 6.52441 0.958008 6.63574C1.06934 6.74707 1.125 6.87891 1.125 7.03125V7.3125C1.125 7.4707 1.1792 7.604 1.2876 7.7124C1.396 7.8208 1.5293 7.875 1.6875 7.875H7.3125C7.46484 7.875 7.59668 7.8208 7.70801 7.7124C7.81934 7.604 7.875 7.4707 7.875 7.3125V7.03125C7.875 6.87891 7.9292 6.74707 8.0376 6.63574C8.146 6.52441 8.27783 6.46875 8.43311 6.46875C8.58838 6.46875 8.72168 6.52441 8.83301 6.63574C8.94434 6.74707 9 6.87891 9 7.03125V7.875C9 8.18555 8.89014 8.45068 8.67041 8.67041C8.45068 8.89014 8.18555 9 7.875 9ZM4.79004 6.62695C4.70801 6.70898 4.61133 6.75 4.5 6.75C4.38867 6.75 4.29199 6.70898 4.20996 6.62695L1.21289 3.59473C1.14258 3.51855 1.11768 3.46289 1.13818 3.42773C1.15869 3.39258 1.21289 3.375 1.30078 3.375H3.375V0.5625C3.375 0.404297 3.4292 0.270996 3.5376 0.162598C3.646 0.0541992 3.7793 0 3.9375 0H5.0625C5.2207 0 5.354 0.0541992 5.4624 0.162598C5.5708 0.270996 5.625 0.404297 5.625 0.5625V3.375H7.69043C7.77832 3.375 7.83398 3.39258 7.85742 3.42773C7.88086 3.46289 7.85742 3.51855 7.78711 3.59473L4.79004 6.62695Z" fill="white"/>
            </svg>
          </div>
          <div data-id="pptx" className="PdfMenu__Button" onClick={this._onClickPptx} title="Скачать шаблон в формате PPTX">
            PPTX
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.875 9H1.125C0.814453 9 0.549316 8.89014 0.32959 8.67041C0.109863 8.45068 0 8.18555 0 7.875V7.03125C0 6.87891 0.0541992 6.74707 0.162598 6.63574C0.270996 6.52441 0.402832 6.46875 0.558105 6.46875C0.713379 6.46875 0.84668 6.52441 0.958008 6.63574C1.06934 6.74707 1.125 6.87891 1.125 7.03125V7.3125C1.125 7.4707 1.1792 7.604 1.2876 7.7124C1.396 7.8208 1.5293 7.875 1.6875 7.875H7.3125C7.46484 7.875 7.59668 7.8208 7.70801 7.7124C7.81934 7.604 7.875 7.4707 7.875 7.3125V7.03125C7.875 6.87891 7.9292 6.74707 8.0376 6.63574C8.146 6.52441 8.27783 6.46875 8.43311 6.46875C8.58838 6.46875 8.72168 6.52441 8.83301 6.63574C8.94434 6.74707 9 6.87891 9 7.03125V7.875C9 8.18555 8.89014 8.45068 8.67041 8.67041C8.45068 8.89014 8.18555 9 7.875 9ZM4.79004 6.62695C4.70801 6.70898 4.61133 6.75 4.5 6.75C4.38867 6.75 4.29199 6.70898 4.20996 6.62695L1.21289 3.59473C1.14258 3.51855 1.11768 3.46289 1.13818 3.42773C1.15869 3.39258 1.21289 3.375 1.30078 3.375H3.375V0.5625C3.375 0.404297 3.4292 0.270996 3.5376 0.162598C3.646 0.0541992 3.7793 0 3.9375 0H5.0625C5.2207 0 5.354 0.0541992 5.4624 0.162598C5.5708 0.270996 5.625 0.404297 5.625 0.5625V3.375H7.69043C7.77832 3.375 7.83398 3.39258 7.85742 3.42773C7.88086 3.46289 7.85742 3.51855 7.78711 3.59473L4.79004 6.62695Z" fill="white"/>
            </svg>
          </div>
        </div>
      </div>);
  }
}


interface IPresentationControlElementProps {
  presentation: IPresentationModel;
  onEditClick: () => any;
  isEditing: boolean;
  isAttendingToRemove: boolean;
  onSharePress: () => void;
  onRemovePress: () => void;
  onRemoveCancelPress: () => void;
  onRemoveApprovePress: () => void;
  onStartPress: () => void;
}

class PresentationControlElement extends React.PureComponent<IPresentationControlElementProps> {
  public state: {
    pdfMenu: boolean;
    date: moment.Moment;
  } = {
    pdfMenu: false,
    date: null,
  };
  private _pdfButton;

  private _onClickBody = (event) => {
    if (this._pdfButton && $.contains(this._pdfButton, event.target)) {
      return;
    }
    this.setState({pdfMenu: false});
  };

  public componentDidMount(): void {
    $('body').on('click', this._onClickBody);
  }

  public componentWillUnmount(): void {
    $('body').off('click', this._onClickBody);
  }

  private _onClickPdf = (event) => {
    const {presentation} = this.props;
    if (presentation.id === null) {
      return false;
    }
    // window.open(presentation.pdfUrl);

    if (this.state.pdfMenu) {
      // this.setState({pdfMenu: false});
    } else {
      this.setState({pdfMenu: true});
    }

    event.preventDefault();
    return false;
  };

  public render() {
    const {
      presentation, onEditClick, onRemovePress, isAttendingToRemove, onRemoveCancelPress,
      onRemoveApprovePress, onStartPress, isEditing } = this.props;
    const {pdfMenu} = this.state;

    return (
      <div className={ cn('PresentationControlElement', 'ctrl', {secondary: isAttendingToRemove}) }>
        <div className="main-block">
          { presentation.isMine &&
          <a className="PresentationControlElement__Edit" title={ isEditing ? 'Сохранить шаблон' : 'Редактировать шаблон'}
             onClick={ onEditClick }>
            {!isEditing &&
            <svg width="25" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.14132 19.539L16.1416 9.03879L11.3916 4.05137L1.3914 14.5516C1.25373 14.6963 1.15593 14.8775 1.10839 15.0759L0 21L5.64093 19.8362C5.83033 19.7865 6.00358 19.6837 6.14132 19.539ZM19.3699 5.64906C19.7733 5.22528 20 4.65059 20 4.05137C20 3.45215 19.7733 2.87746 19.3699 2.45368L17.6632 0.661644C17.2596 0.237994 16.7122 0 16.1416 0C15.5709 0 15.0235 0.237994 14.6199 0.661644L12.9132 2.45368L17.6632 7.4411L19.3699 5.64906Z" fill="white"/>
            </svg>}
            { isEditing &&
            <svg width="25" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.4785 9.3418H18.1045C17.8057 9.3418 17.5215 9.48535 17.3457 9.73144L12.7402 16.1182L10.6543 13.2236C10.4785 12.9805 10.1973 12.834 9.89551 12.834H8.52149C8.33106 12.834 8.21973 13.0508 8.33106 13.2061L11.9815 18.2686C12.0677 18.3889 12.1814 18.487 12.3131 18.5546C12.4448 18.6223 12.5907 18.6576 12.7388 18.6576C12.8868 18.6576 13.0328 18.6223 13.1645 18.5546C13.2962 18.487 13.4099 18.3889 13.4961 18.2686L19.666 9.71387C19.7803 9.55859 19.6689 9.3418 19.4785 9.3418Z" fill="#78D64B"/>
              <path d="M14 0.875C6.75195 0.875 0.875 6.75195 0.875 14C0.875 21.248 6.75195 27.125 14 27.125C21.248 27.125 27.125 21.248 27.125 14C27.125 6.75195 21.248 0.875 14 0.875ZM14 24.8984C7.98242 24.8984 3.10156 20.0176 3.10156 14C3.10156 7.98242 7.98242 3.10156 14 3.10156C20.0176 3.10156 24.8984 7.98242 24.8984 14C24.8984 20.0176 20.0176 24.8984 14 24.8984Z" fill="#78D64B"/>
            </svg> }
          </a>}

          <a href={ presentation.id === null || isEditing ? void(0) : AppConfig.fixRequestUrl(`/srv/imagifier/presentations!/${ presentation.id }.pdf`) } title={'Скачать шаблон'}
             ref={(el) => this._pdfButton = el}
             className={cn('PresentationControlElement__Pdf', {disabled: presentation.id === null || isEditing})}
             onClick={ this._onClickPdf }>
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.875 25H3.125C2.26237 25 1.52588 24.6948 0.915527 24.0845C0.305176 23.4741 0 22.7376 0 21.875V19.5312C0 19.1081 0.150553 18.7419 0.45166 18.4326C0.752767 18.1234 1.11898 17.9688 1.55029 17.9688C1.98161 17.9688 2.35189 18.1234 2.66113 18.4326C2.97038 18.7419 3.125 19.1081 3.125 19.5312V20.3125C3.125 20.752 3.27555 21.1222 3.57666 21.4233C3.87777 21.7244 4.24805 21.875 4.6875 21.875H20.3125C20.7357 21.875 21.1019 21.7244 21.4111 21.4233C21.7204 21.1222 21.875 20.752 21.875 20.3125V19.5312C21.875 19.1081 22.0256 18.7419 22.3267 18.4326C22.6278 18.1234 22.994 17.9688 23.4253 17.9688C23.8566 17.9688 24.2269 18.1234 24.5361 18.4326C24.8454 18.7419 25 19.1081 25 19.5312V21.875C25 22.7376 24.6948 23.4741 24.0845 24.0845C23.4741 24.6948 22.7376 25 21.875 25ZM13.3057 18.4082C13.0778 18.6361 12.8092 18.75 12.5 18.75C12.1908 18.75 11.9222 18.6361 11.6943 18.4082L3.36914 9.98535C3.17383 9.77376 3.10466 9.61914 3.16162 9.52148C3.21859 9.42383 3.36914 9.375 3.61328 9.375H9.375V1.5625C9.375 1.12305 9.52555 0.752767 9.82666 0.45166C10.1278 0.150553 10.498 0 10.9375 0H14.0625C14.502 0 14.8722 0.150553 15.1733 0.45166C15.4744 0.752767 15.625 1.12305 15.625 1.5625V9.375H21.3623C21.6064 9.375 21.7611 9.42383 21.8262 9.52148C21.8913 9.61914 21.8262 9.77376 21.6309 9.98535L13.3057 18.4082Z" fill="white"/>
            </svg>
            {pdfMenu && <PdfMenu presentationId={presentation.id} presentationTitle={presentation.title}/>}
          </a>

          { presentation.isMine &&
          <RemoveButton onRemovePress={onRemovePress}
                        onRemoveApprovePress={onRemoveApprovePress}
                        onRemoveCancelPress={onRemoveCancelPress}
                        isAttendingToRemove={isAttendingToRemove}
                        isEditing={isEditing}/>}
          {/*<BIIcon href="javascript:void(0)"*/ }
          {/*className="start btn dark material blue"*/ }
          {/*text={lang('bm-open-presentation')}*/ }
          {/*icon="bookmarks-play"*/ }
          {/*onPress={onStartPress}*/ }
          {/*data-bind="anchorClick:function(event){$parent.handleBookmarksFolderStart($data)}"/>*/ }
        </div>
        {/*<div className="secondary-block">*/ }
        {/*<p>{lang('bm-remove-presentation')}</p>*/ }
        {/*<BIIcon href="javascript:void(0)"*/ }
        {/*className="bi-icon dark yes"*/ }
        {/*hint={lang('yes')}*/ }
        {/*icon="yes"*/ }
        {/*onPress={onRemoveApprovePress}/>*/ }
        {/*<BIIcon href="javascript:void(0)"*/ }
        {/*className="bi-icon dark no"*/ }
        {/*hint={lang('no')}*/ }
        {/*icon="no"*/ }
        {/*onPress={onRemoveCancelPress}/>*/ }
        {/*</div>*/ }
      </div>);
  }
}


interface IPresentationUserElementProps {
  user: User;
  presentation: IPresentationModel;
  onUnsharePress: () => void;
}


const PresentationUserElement = ({user, presentation, onUnsharePress}: IPresentationUserElementProps) => (
  <li key={user.id.toString()} className={cn('PresentationUserElement', {'folder-author': presentation.author() === user})}>
    <span className="user-title">{user.title}</span>
    {(presentation.author() !== user) && (presentation.isMine) &&
    <BIIcon className="bi-icon dark" icon="x" onPress={onUnsharePress}/>}
  </li>);


interface IPresentationUsersElementProps {
  presentation: IPresentationModel;
  onUnsharePress: (user: User) => void;
}

const PresentationUsersElement = ({presentation, onUnsharePress}: IPresentationUsersElementProps) => (
  <ul className="folder users">
    {
      !!presentation.author &&
      [presentation.author()]
        .concat(presentation.users())
        .map((user: User) => (
          <PresentationUserElement key={user.id}
                                   user={user}
                                   presentation={presentation}
                                   onUnsharePress={() => onUnsharePress(user)}/>))
    }
  </ul>);


interface IPresentationElementProps {
  idx: number;
  presentation: IPresentationModel;
  isEditing: boolean;
  onEditClick: (title: string, description: string) => any;
  isAttendingToRemove: boolean;
  onSharePress: () => void;
  onUnsharePress: (presentation: IPresentationModel, user: User) => void;
  onRemovePress: () => void;
  onMouseLeave: () => void;
  onRemoveApprovePress: () => void;
  onRemoveCancelPress: () => void;
  onSelectPresentation: () => void;
}


export class PresentationElement extends React.Component<IPresentationElementProps> {
  public props: IPresentationElementProps;
  public state: {
    title: string | null;
    description: string | null;
  } = {
    title: null,
    description: null,
  };

  public constructor(props: IPresentationElementProps) {
    super(props);
  }

  public componentDidMount() {
    // let presEl = this;
    // setTimeout(function () {
    //   if (presEl.props.presentation.title == '' && presEl.props.presentation.description == '' && !presEl.props.isEditing) {
    //     const pls = PresentationsListService.getInstance();
    //     pls.removePresentation(presEl.props.presentation.id);
    //   }
    // }, 1000);
  }

  public componentWillUnmount() {
    // let presEl = this;
    // if (presEl.props.presentation.title == '' && presEl.props.presentation.description == '' && presEl.props.isEditing) {
    //   const pls = PresentationsListService.getInstance();
    //   pls.removePresentation(presEl.props.presentation.id);
    // }
  }

  // public componentDidUpdate() {
  //   if (this.props.isEditing) {
  //     if (document.activeElement === (this.refs.editingTitle as HTMLInputElement)) return;
  //     if (document.activeElement === (this.refs.editingDescription as HTMLTextAreaElement)) return;
  //     const el = this.refs.editingTitle as HTMLInputElement;
  //     el.focus();
  //     el.setSelectionRange(el.value.length, el.value.length);
  //   }
  // }

  private _handleTitleChanged = (event) => {
    this.setState({title: event.target.value});
  };

  private _handleDescriptionChanged = (event) => {
    this.setState({description: event.target.value});
  };

  private _startPresentation = async () => {
    const { presentation } = this.props;

    let sSvc: SlidesListService;

    try {
      sSvc = SlidesListService.createInstance(presentation.id);

      const slidesListModel: ISlidesListModel = await sSvc.whenReady();
      const slides = slidesListModel.slides;
      if (!slides.length) {
        return;
      }

      // slides[0].navigate();
      shell.activateBookmark(slides[0]);

    } finally {
      if (sSvc) sSvc.release();
    }
  };

  private _saveTitle = async () => {
    return withPresentationsListService(async (pls: PresentationsListService) => {
      let title = (this.state.title != null) ? this.state.title : this.props.presentation.title;
      let description = (this.state.description != null) ? this.state.description : this.props.presentation.description;

      await pls.updatePresentationTitle(this.props.presentation.id, title, description);
      this.setState({title: null, description: null});
    });
  };

  private _onSetupRefEditableTitle = (el: HTMLInputElement | null) => {
    if (!el) return;
    let title = (this.state.title != null) ? this.state.title : this.props.presentation.title;
    let description = (this.state.description != null) ? this.state.description : this.props.presentation.description;
    if (!title) {
      el.focus();
    }
  };

  private _onSetupRefEditableDescription = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    let title = (this.state.title != null) ? this.state.title : this.props.presentation.title;
    let description = (this.state.description != null) ? this.state.description : this.props.presentation.description;
    if (title && !description) {
      el.focus();
    }
  };

  public render() {
    const {
      idx, presentation, isEditing, onEditClick, isAttendingToRemove, onRemovePress,
      onSharePress, onMouseLeave, onRemoveCancelPress, onRemoveApprovePress,
      onSelectPresentation,
    } = this.props;

    let title = (this.state.title != null) ? this.state.title : this.props.presentation.title;
    let description = (this.state.description != null) ? this.state.description : this.props.presentation.description;

    const modified: boolean = (title != presentation.title) || (description != presentation.description);

    return (
      <>
        <td onClick={this._startPresentation} title={'Посмотреть шаблон'}><Icon1/></td>
        <td>{idx + 1}</td>
        <td>
          {!isEditing &&
          <span className="PresentationElement__TitleText folder title">{title}</span>}

          {isEditing &&
          <input type="text"
                 ref={this._onSetupRefEditableTitle}
                 className="PresentationElement__TitleEdit folder title"
                 value={title}
                 maxLength={100}
                 onChange={this._handleTitleChanged} />}
        </td>
        <td>
          <span className="PresentationElement__Description folder description" style={{overflow: isEditing ? 'hidden' : 'auto', visibility: isEditing ? 'hidden' : 'visible'}}>
            {!isEditing && <span className="PresentationElement__DescriptionText">{description}</span>}
            {isEditing &&
            <textarea className="PresentationElement__DescriptionEdit folder description"
                      ref={this._onSetupRefEditableDescription}
                      maxLength={255}
                      style={{visibility: isEditing ? 'visible' : 'hidden'}}
                      value={description}
                      onChange={this._handleDescriptionChanged}/>}
          </span>
        </td>
        <td>
          {!!presentation.author && presentation.author().title}
          {/*<PresentationUsersElement*/}
          {/*presentation={presentation}*/}
          {/*onUnsharePress={(user) => this.props.onUnsharePress(presentation, user)}/>*/}
        </td>
        <td>
          <span className="PresentationElement__Created folder created">{moment(presentation.created).format('DD.MM.YYYY, [\n]HH:mm:ss')}</span>
        </td>
        <td>
          {!!presentation.filename &&
          <a href={AppConfig.fixRequestUrl(`/srv/presentations/${presentation.filename}`)} target="_blank" title={'Посмотреть последнюю публикацию'}>
            <Icon7/>
          </a>}
        </td>
        <td>
          <PresentationControlElement presentation={presentation}
                                      isEditing={isEditing}
                                      onEditClick={() => onEditClick(this.state.title, this.state.description)}
                                      onRemovePress={onRemovePress}
                                      onSharePress={onSharePress}
                                      isAttendingToRemove={isAttendingToRemove}
                                      onRemoveCancelPress={onRemoveCancelPress}
                                      onRemoveApprovePress={onRemoveApprovePress}
                                      onStartPress={this._startPresentation}/>
        </td>
      </>);
  }
}
