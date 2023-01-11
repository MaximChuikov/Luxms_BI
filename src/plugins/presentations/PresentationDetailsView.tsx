/// <reference path="../../defs/iscroll.d.ts" />

/**
 *
 *
 *
 */

import * as React from 'react';
import { IPresentationModel, ISlideModel } from './models';
import { SlidesListService, ISlidesListModel, SlidesListModel } from 'bi-internal/services';
import { disposeAll } from 'bi-internal/core';
import { lang } from 'bi-internal/utils';
import './PresentationDetailsView.scss';
import { BIIcon } from 'bi-internal/ui';
import IScroll from 'iscroll';


function hasClass(el: HTMLElement, className: string): boolean {
  let elClassName = el.className || '';
  if (typeof elClassName !== 'string') {
    elClassName = el.getAttribute('class') || '';
  }
  const classNames: string[] = elClassName.split(' ');
  return (classNames.indexOf(className) !== -1);
}


function getParentsList(el: HTMLElement, includeSelf: boolean = false): HTMLElement[] {
  let result: HTMLElement[] = [];
  if (includeSelf) {
    result.push(el);
  }
  while ((el = el.parentElement)) {
    result.push(el);
  }
  return result;
}


function isParentHasClass(el: HTMLElement, className: string, includeSelf: boolean = false): boolean {
  const parents: HTMLElement[] = getParentsList(el, includeSelf);
  return !!parents.find(p => hasClass(p, className));
}


const SlideCtrl2Element = ({slide, onYes, onNo}) => (
  <div className="ctrl2">
    <BIIcon href="javascript:void(0)"
            className="start white"
            style={{width: '3.08rem', height: '3.08rem', border: '2px solid white', borderRadius: 20}}
            hint={lang('yes')}
            icon="yes"
            onPress={onYes} />
    <BIIcon href="javascript:void(0)"
            className="start white"
            style={{width: '3.08rem', height: '3.08rem', border: '2px solid white', borderRadius: 20}}
            hint={lang('no')}
            icon="no"
            onPress={onNo} />
  </div>
);


const SlideCtrlElement = ({slide, onRemoveSlide, onEditSlide, isAttendingToRemove, isAttendingToEdit}) => (
  <div className="SlideCtrlElement ctrl">
    <BIIcon href="javascript:void(0)"
            className={'start white' + (isAttendingToEdit ? ' active' : '')}
            shape="circle"
            style={{width: '3.08rem', height: '3.08rem', border: '2px solid white', borderRadius: 20}}
            hint={lang('bm-edit-slide')}
            icon="bookmarks-edit"
            onPress={onEditSlide} />
    <BIIcon href={`#/bm/${slide.id}+`}
            className="start white"
            shape="circle"
            style={{width: '3.08rem', height: '3.08rem', border: '2px solid white', borderRadius: 20}}
            hint={lang('bm-open-presentation')}
            icon="bookmarks-play"/>
    <BIIcon href="javascript:void(0)"
            className={'start white' + (isAttendingToRemove ? ' active' : '')}
            shape="circle"
            style={{width: '3.08rem', height: '3.08rem', border: '2px solid white', borderRadius: 20}}
            hint={lang('bm-remove')}
            icon="bookmarks-remove"
            onPress={onRemoveSlide} />
  </div>);


interface ISlideElementProps {
  slide: ISlideModel;
  isAttendingToRemove: boolean;
  isAttendingToEdit: boolean;
  onAttendToRemove: (slide: ISlideModel) => void;
  onAttendToEdit: (slide: ISlideModel) => void;
  onRemoveSlide: () => void;
  onPressMoveLeft: (slide: ISlideModel) => void;
  onPressMoveRight: (slide: ISlideModel) => void;
  onUpdateTitleAndDescription: (slide: ISlideModel, title: string, description: string) => void;
}


class SlideElement extends React.PureComponent<ISlideElementProps> {
  public props: ISlideElementProps;
  public state: {
    title: string;
    description: string;
    imgLoad: boolean;
    imgTextError: string;
    imgSrc: string;
  };

  constructor(props: ISlideElementProps) {
    super(props);
    const {slide} = props;
    this.state = {
      imgLoad: true,
      imgTextError: '',
      imgSrc: slide.tinyImageUrl,
      title: slide.title,
      description: slide.description,
    };
  }

  componentDidMount() {
    this._loadImage()
  }

  private _loadImage() {
    console.log(1)
    let {imgSrc} = this.state;
    const img: any = this.refs.slideTinyImage;
    if (!img) return;
    imgSrc = imgSrc.replace(/\?.+/, '') + '?' + String(new Date().getTime());
    fetch(imgSrc)
      .then(response => {
        if (response.status === 500) throw new Error();
        if (response.status === 200) return response.blob()
        window.setTimeout(() => this._loadImage(), 5000);
        return null
      })
      .then(images => {
        if (!images) return;
        img.src = URL.createObjectURL(images);
        this.setState({imgSrc, imgLoad: false})
      })
      .catch((err) => {
        this.setState({imgSrc, imgTextError: 'Сервер не доступен', imgLoad: false});
      })
  }

  private _onPressAttendToRemove = () => this.props.onAttendToRemove(this.props.isAttendingToRemove ? null : this.props.slide);
  private _onPressAttendToEdit = () => this.props.onAttendToEdit(this.props.isAttendingToEdit ? null : this.props.slide);
  private _onPressNoRemove = () => this.props.onAttendToRemove(null);

  private _onTitleChange = (event) => {
    const title: string = event.target.value;
    this.setState({title});
    this.props.onUpdateTitleAndDescription(this.props.slide, title, this.state.description);
  };

  private _onDescriptionChange = (event) => {
    const description: string = event.target.value;
    this.setState({description});
    this.props.onUpdateTitleAndDescription(this.props.slide, this.state.title, description);
  };

  private _onPressMoveLeft = () => this.props.onPressMoveLeft(this.props.slide);
  private _onPressMoveRight = () => this.props.onPressMoveRight(this.props.slide);

  public render() {
    const {slide, onRemoveSlide, isAttendingToRemove, isAttendingToEdit} = this.props;
    const {title, description} = this.state;
    const {imgLoad, imgTextError} = this.state;

    const isFirst = slide.index() == 1;
    const isLast = slide.index() == slide.total();

    return (
      <div className="SlideElement">
        {!isFirst &&
        <BIIcon icon="blue-left"
                style={{position: 'absolute', left: 0, top: 0, width: '3.08rem', height: '3.08rem', zIndex: 1}}
                onPress={this._onPressMoveLeft}/>}

        {!isLast &&
        <BIIcon icon="blue-right"
                style={{position: 'absolute', right: 0, top: 0, width: '3.08rem', height: '3.08rem', zIndex: 1}}
                onPress={this._onPressMoveRight}/>}

        {!isAttendingToEdit ?
          <h4 className="SlideElement__Title">{title}</h4> :
          <input className="SlideElement__Title" value={title} onChange={this._onTitleChange} />}

        {!isAttendingToEdit ?
          <p className="SlideElement__Description">{description}</p> :
          <textarea className="SlideElement__Description"
                    value={description}
                    onChange={this._onDescriptionChange}/>}

        {!imgTextError
          ? <img ref="slideTinyImage"
                 className="SlideElement__Image"
                 style={{
                   background: imgLoad ? 'white url(assets/images/slide-preloader.gif) no-repeat center' : 'none',
                 }}
          />
          : <div className="SlideElement__ImageError">{imgTextError}</div>
        }
        <SlideCtrlElement slide={slide}
                          isAttendingToRemove={isAttendingToRemove}
                          isAttendingToEdit={isAttendingToEdit}
                          onRemoveSlide={this._onPressAttendToRemove}
                          onEditSlide={this._onPressAttendToEdit}/>
        {isAttendingToRemove &&
        <SlideCtrl2Element slide={slide}
                           onYes={onRemoveSlide}
                           onNo={this._onPressNoRemove}/>}
      </div>
    );
  }
}


interface IPresentationDetailsProps {
  presentation: IPresentationModel;
  onCancel: () => void;
  onRemoveSlide: (slide: ISlideModel) => void;
}

interface IPresentationDetailsState extends ISlidesListModel {
  attendingToRemoveSlideId: number | null;
  attendingToEditSlideId: number | null;
}

export class PresentationDetailsView extends React.Component<IPresentationDetailsProps> {
  public state: IPresentationDetailsState;
  private _svc: SlidesListService = null;
  private _subscriptions: IDisposable[] = [];
  private _scroll: any;

  constructor(props) {
    super(props);
    this.state = {
      ...SlidesListModel.withLoading(),
      attendingToRemoveSlideId: null,
      attendingToEditSlideId: null,
    };
  }

  // TODO: use React measure
  public componentDidMount() {
    this._scroll = new IScroll((this.refs.carouselWrapper as HTMLElement), {
      mouseWheel: true,
      scrollbars: true,
      interactiveScrollbars: true,
      scrollX: true,
      scrollY: false,
      click: true,
      useTransform: true,
      useTransition: false,
    });

    const {presentation} = this.props;
    console.assert(!this._svc);

    this._svc = SlidesListService.createInstance(presentation.id);

    this._subscriptions.push(this._svc.subscribeUpdatesAndNotify((model: ISlidesListModel) => {
      this.setState(model);
      // ??? redraw Scroll
    }));
  }

  public componentWillUnmount() {
    console.assert(!!this._svc);
    disposeAll(this._subscriptions);
    this._svc.release();
    if (this._scroll) {
      this._scroll.destroy();
      this._scroll = null;
    }
  }

  private _onAttendToRemoveSlide = (attendingToRemoveSlide: ISlideModel) => {
    this.setState({
      attendingToRemoveSlideId: attendingToRemoveSlide ? attendingToRemoveSlide.id : null,
      attendingToEditSlideId: null,
    });
  };

  private _onAttendToEditSlide = (attendingToEditSlide: ISlideModel) => {
    this.setState({
      attendingToRemoveSlideId: null,
      attendingToEditSlideId: attendingToEditSlide ? attendingToEditSlide.id : null,
    });
  };

  private _onModalPress = (event) => {
    const {attendingToRemoveSlideId, attendingToEditSlideId} = this.state;
    if (attendingToRemoveSlideId === null && attendingToEditSlideId === null) {
      return;
    }
    if (isParentHasClass(event.target, 'ctrl2') ||
      isParentHasClass(event.target, 'bookmarks-remove') ||
      isParentHasClass(event.target, 'bookmarks-edit')) {
      // clicked ctrl2: skip
    } else {
      this.setState({
        attendingToRemoveSlideId: null,
        attendingToEditSlideId: null,
      });
    }
  };

  private _onPressMoveLeft = (slide: ISlideModel) => {
    const svc = this._svc;
    svc.lock(async () => {
      await svc.whenReady();
      const model: ISlidesListModel = svc.getModel();
      const slide2: ISlideModel = model.slides[slide.index() - 2];
      await svc.swapSlides(slide, slide2);
    });
  };

  private _onPressMoveRight = (slide: ISlideModel) => {
    const svc = this._svc;
    svc.lock(async () => {
      await svc.whenReady();
      const model: ISlidesListModel = svc.getModel();
      const slide2: ISlideModel = model.slides[slide.index()];
      await svc.swapSlides(slide, slide2);
    });
  };

  private _onUpdateTitleAndDescription = (slide: ISlideModel, title: string, description: string) => {
    const svc = this._svc;
    svc.lock(async () => {
      await svc.whenReady();
      await svc.updateOne(slide.id, {title, description});
    });
  };

  public render() {
    const {presentation, onRemoveSlide} = this.props;
    const {slides, attendingToRemoveSlideId, attendingToEditSlideId, loading} = this.state;

    window.requestAnimationFrame(() => {
      if (this._scroll) {
        this._scroll.refresh();
      }
    });

    return (
      <div className="PresentationDetailsView modal" style={{top: 0, width: '100%'}}>
        <div className="PresentationDetailsView__Shade" onClick={this.props.onCancel}></div>
        <div className="modal-content" onClick={this._onModalPress}>
          <header className="PresentationDetailsView__Header">
            <h4 className="PresentationDetailsView__Title presentation-title title">{presentation.title}</h4>
            <BIIcon icon="x"
                    className="white"
                    href="#/presentations/"
                    style={{width: '3.08rem', height: '3.08rem'}}/>
          </header>
          <div ref="carouselWrapper"
               className="PresentationDetailsView__Body"
               style={{flexGrow: 1, position: 'relative', width: '100%', overflow: 'hidden', minHeight: 400}}>
            <ul className="PresentationDetailsView__Carousel bi-slides-carousel" ref="carousel">
              {
                slides.map(slide => (
                  <li key={slide.id} className="PresentationDetailsView__Slide">
                    <SlideElement slide={slide}
                                  isAttendingToRemove={attendingToRemoveSlideId === slide.id}
                                  isAttendingToEdit={attendingToEditSlideId === slide.id}
                                  onAttendToRemove={this._onAttendToRemoveSlide}
                                  onAttendToEdit={this._onAttendToEditSlide}
                                  onRemoveSlide={() => onRemoveSlide(slide)}
                                  onPressMoveLeft={this._onPressMoveLeft}
                                  onPressMoveRight={this._onPressMoveRight}
                                  onUpdateTitleAndDescription={this._onUpdateTitleAndDescription}/>
                  </li>))
              }
            </ul>
            {slides.length == 0 && !loading &&
            <div className="magic-center PresentationDetailsView__Empty"
                 dangerouslySetInnerHTML={{__html: lang('bm-slides-empty')}}></div>}
          </div>
        </div>
      </div>);
  }
}
