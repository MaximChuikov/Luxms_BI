import * as React from "react";
import Field from "../Field/Field";
import ComponentTextArea from "../ComponentTextArea/ComponentTextArea";
import ControlElements from "../ControlElements/ControlElements";
import {IRawNewsItem} from "../../../repositories/vcp/news";
import NewsService from "../../../services/vcp/NewsService";
import Row from "./Row";
import Calendar from '../../../components/Calendar';
import { DateUtils } from '../../../components/DatePicker/DateUtils';
import cn from 'classnames';

interface IRowCVProps {
  children: any;
  item: IRawNewsItem;
  isEditing: boolean;
  onEditClick: (date: Date, description: string) => any;
  isAttendingToRemove: boolean;
  onRemovePress: () => void;
  onRemoveApprovePress: () => void;
  onRemoveCancelPress: () => void;
  onPublishPress: () => void;
  isAttendingToPublish: boolean;
  onPublishCancelPress: () => void;
  onPublishApprovePress: () => void;
  textPublishDialog: string;
  textRemoveDialog: string;
  isHidden: number;
  minimalMode?: boolean;
  className: string;
  onClick?: () => void;
}

export default class RowCV extends React.Component<IRowCVProps> {
  public props: IRowCVProps;
  public state: {
    date: null | Date;
    description: string | null;
  } = {
    date: null,
    description: null,
  };

  constructor(props: IRowCVProps) {
    super(props);
    const {item, minimalMode} = props;
    if (minimalMode) {
      this.state.date = new Date(item.config.updated);
      this.state.description = item.description;
    } else {
      // в случае режима редактирования, мы будем редактировать config.pendingDescription
      // он может быть не задан для старых новостей
      this.state.description = item.config.pendingDescription ?? item.description ?? '';
      if (item.config.pendingUpdated === undefined || item.config.pendingUpdated === null) {
        if (item.config.updated === undefined || item.config.updated === null){
          this.state.date = new Date();
        } else {
          this.state.date = new Date(item.config.updated);
        }
      } else {
        this.state.date = new Date(item.config.pendingUpdated);
      }
    }
  }

  // Два события используются для удаления новых пустых новостей
  // если пользователь переходит на другую страницу
  // Ошибка - https://trello.com/c/0okSpAvs
  public componentDidMount() {
    let presEl = this;
    setTimeout(function () {
      if (presEl.props.item.title == '' && presEl.props.item.description == '' && !presEl.props.isEditing) {
        const pls = NewsService.getInstance();
        pls.remove(presEl.props.item.id);
      }
    }, 1000);
  }

  // public componentWillUnmount() {
  //   let presEl = this;
  //   if (presEl.props.presentation.description === null && presEl.props.isEditing) {
  //     const pls = NewsService.getInstance();
  //     if (presEl.props.presentation.id != null) {
  //       pls.remove(presEl.props.presentation.id);
  //     }
  //   }
  // }

  private _handleDateChanged = (p: string) => {
    this.setState({date: new Date(p + 'T00:00:00')});
  };

  private _handleDescriptionChanged = (event) => {
    this.setState({description: event.target.value});
  };

  public render() {
    const {
      isEditing, onEditClick, isAttendingToRemove, onRemovePress,
      onRemoveCancelPress, onRemoveApprovePress, onPublishPress,
      isAttendingToPublish, onPublishCancelPress, onPublishApprovePress,
      textPublishDialog, textRemoveDialog, isHidden, minimalMode,
      className, onClick
    } = this.props;

    let description = this.state.description;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    return (
      <Row minimalMode={minimalMode}
           className={className}
           onClick={onClick}
      >
          {this.props.children}
          {!isEditing
            ? <Field className="PresentationElement__TitleText folder title"
                     text={moment(this.state.date).format('DD.MM.YYYY')}/>
            : <Calendar p={DateUtils.makeDayFromDate(this.state.date)}
                        min="2020-01-01"
                        max={DateUtils.makeDay(year, month, DateUtils.getDaysInMonth(year, month))}
                        onChange={this._handleDateChanged}
                        formatTitle={(p: string) => p.match(/^(\d\d\d\d)-(\d\d)-(\d\d)/) ? `${RegExp.$3}.${RegExp.$2}.${RegExp.$1}` : ''}
            />
          }
          <ComponentTextArea
            autofocus={isEditing}
            readonly={!isEditing}
            className={cn(`folder description`, {isEditing, minimalMode})}
            text={description}
            placeholder={description ? description : `Описание новости`}
            handlerChange={this._handleDescriptionChanged}
          />
          <ControlElements isEditing={isEditing}
                           canSave={!!this.state.description}
                           onEditClick={() => onEditClick(this.state.date, this.state.description)}
                           onRemovePress={onRemovePress}
                           isAttendingToRemove={isAttendingToRemove}
                           onRemoveCancelPress={onRemoveCancelPress}
                           onRemoveApprovePress={onRemoveApprovePress}
                           onPublishPress={onPublishPress}
                           isAttendingToPublish={isAttendingToPublish}
                           onPublishCancelPress={onPublishCancelPress}
                           onPublishApprovePress={onPublishApprovePress}
                           textPublishDialog={textPublishDialog}
                           textRemoveDialog={textRemoveDialog}
                           isHidden={isHidden}
          />
      </Row>);
  }
}