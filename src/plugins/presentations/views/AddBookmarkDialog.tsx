/**
 *    AddBookmarkDialog
 *
 *
 */


import * as React from 'react';
import cn from 'classnames';
import { IAddBookmarkDialogVM } from '../view-controllers/AddBookmarkDialogVC';
import { $eid } from 'bi-internal/utils';
import { lang } from 'bi-internal/utils';
import './AddBookmarkDialog.scss';
import { BIIcon } from 'bi-internal/ui';


export class AddBookmarkDialog extends React.PureComponent<IAddBookmarkDialogVM> {
  public props: IAddBookmarkDialogVM;
  public state: {
    title: string;
    description: string;
  };

  public constructor(props: IAddBookmarkDialogVM) {
    super(props);
    this.state = {
      // title: props.initialTitle,
      title: '',
      description: '',
    };
  }

  public componentDidMount() {
    window.setTimeout(() => {
      // debugger;
      // this._$titleInput.current.focus();
    }, 0);
    // window.setTimeout(() => this.foldersVM(new FoldersVM(this._$container.find('.folder-selector'))), 0);
  }

  public UNSAFE_componentWillReceiveProps(props: IAddBookmarkDialogVM) {
    // if (props.initialTitle !== this.props.initialTitle) {
    //   this.setState({title: props.initialTitle});
    // }
  }

  private _handleKeypress = (event: any): boolean => {
    const {title, description} = this.state;

    if (event.keyCode == 13 && this.props.onSaveAndClose) {
      this.props.onSaveAndClose(title, description);
    }

    return true;
  };

  private _onTitleChanged = (event) => {
    this.setState({title: event.target.value});
  };

  protected _onDescriptionChanged = (event) => {
    this.setState({description: event.target.value});
  };

  private _onNewFolderTitleChange = (event) => {
    if (this.props.onNewFolderTitleChange) {
      this.props.onNewFolderTitleChange(event.target.value.length > 60 ? event.target.value.substr(0, 60) : event.target.value);
    }
  };

  private _onPressSave = () => {
    const {title, description} = this.state;

    if (this.props.onSaveAndClose) {
      this.props.onSaveAndClose(title, description);
    }
  };

  private _onInitRefTitleInput = (input) => {
    if (input) {
      input.focus();
    }
  };

  private _onInitRefNewFolderTitleInput = (input) => {
    if (input) {
      try {
        input.parentElement.parentElement.scrollTo(input);
      } catch (err) {
        input.parentElement.parentElement.scrollTop = 1000000;
      }
      input.focus();
    }
  };

  public render() {
    const {error, loading, isFoldersOpened, folders, activeFolderId} = this.props;
    const {onClose, onToggleFolders, onCreateFolder, onSelectFolder} = this.props;
    const {title, description} = this.state;

    if (loading) {
      return null;
    }

    const activeFolder = $eid(folders, activeFolderId);
    const hasNewFolder: boolean = !!$eid(folders, 'fake');
    const saveButtonDisabled: boolean = !title || !activeFolder || !activeFolder.title;             // кнопка активна только если есть title и выбрана презентация
    const invalidTitle = !title.trim();
    const InvalidValue = !activeFolder || invalidTitle;

    return (
      <article className="AddBookmarkDialog">

        {/*<header className="AddBookmarkDialog__Header dark">*/}
        {/*<BIIcon icon="x"*/}
        {/*className="close bi-icon light"*/}
        {/*onPress={onClose}/>*/}
        {/*<h4>{lang('save-bookmark')}</h4>*/}
        {/*</header>*/}

        <section className="AddBookmarkDialog__Body">
          {/*<BIIcon icon="bookmark"*/}
          {/*className="bi-icon"*/}
          {/*style={{cursor: 'default', position: 'absolute', width: 40, height: 20, left: 0, top: 14}}/>*/}
          {/*<BIIcon icon="bookmarks-folder"*/}
          {/*className="bi-icon"*/}
          {/*style={{cursor: 'default', position: 'absolute', width: 40, height: 25, left: 0, top: 158}}/>*/}

          <input ref={this._onInitRefTitleInput}
                 className={cn("AddBookmarkDialog__Title form-control",{InvalidValue: invalidTitle})}
                 type="text"
                 style={{width: '90%'}}
                 value={title}
                 onChange={this._onTitleChanged}
                 placeholder={'Название слайда'}
                 onKeyUp={this._handleKeypress}/>

          <textarea className="AddBookmarkDialog__Description form-control"
                    value={description}
                    onChange={this._onDescriptionChanged}
                    placeholder={lang('bookmark-description-placeholder')}/>

          {/* folders */}
          <article className={cn('AddBookmarkDialog__Presentations folder-selector', {opened: isFoldersOpened})} >
            <span className="AddBookmarkDialog__PresentationsTitle">{lang('bm-append-bookmark-to-presentation')}</span>
            <span className={cn("AddBookmarkDialog__SelectedPresentation",{InvalidValue: !activeFolder})}
                  title={!!activeFolder ? activeFolder.title : ''}
                  onClick={onToggleFolders}>
              {!!activeFolder ? activeFolder.title : ''}
            </span>

            <section className="AddBookmarkDialog__PresentationsSelect expandable">
              <ul className={cn('AddBookmarkDialog__PresentationsList', 'AddBookmarkDialog__FoldersList', {hasNewFolder: hasNewFolder})}>
                { folders.map(folder =>
                  (folder.id !== -1 ?
                    <li key={folder.id}
                        className={cn('AddBookmarkDialog__Presentation', 'folder', 'ug', 'pressable', {active: activeFolder === folder})}
                        onClick={() => onSelectFolder(folder)}
                        title={folder.title}>
                      {folder.title}
                    </li>
                    :
                    <li key={folder.id}
                        className={cn('AddBookmarkDialog__NewPresentation new-folder', {active: activeFolder === folder})}>
                      <input ref={this._onInitRefNewFolderTitleInput}
                             className="AddBookmarkDialog__NewPresentationTitle edit-new-folder-title"
                             type="text"
                             value={folder.title}
                             onFocus={() => onSelectFolder(folder)}
                             onChange={this._onNewFolderTitleChange} />
                    </li>))}
              </ul>

              {!hasNewFolder &&
              <a className="create-folder"
                 href={void(0)}
                 onClick={onCreateFolder}>
                {lang('create-bookmark-folder')}
              </a>}
            </section>
          </article>

          {!!error &&
          <div style={{color: 'red'}}>{error}</div>}

        </section>

        <footer className="AddBookmarkDialog__Footer">
          <a style={{display: 'inline-block'}}
             className={cn('AddBookmarkDialog__SaveButton', 'btn', 'btn-primary', {disabled: saveButtonDisabled || InvalidValue})}
             onClick={InvalidValue ? void(0) : this._onPressSave}>
            {lang('save')}
          </a>
        </footer>
      </article>);
  }
}

export default AddBookmarkDialog;
