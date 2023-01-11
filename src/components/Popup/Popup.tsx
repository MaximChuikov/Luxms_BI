import React from "react";
import cn from "classnames";
import nextTick from "next-tick";
import "./Popup.scss";


interface IPopupProps {
  className?: string;
  children?: any;
}


export class Popup extends React.Component<IPopupProps>{
  public state: {
    active: boolean;
  } = {
    active: false,
  };
  private _popupDiv: HTMLDivElement | null = null;

  public componentDidMount() {
    document.body.addEventListener('click', this._onBodyClick, false);
  }

  public componentWillUnmount() {
    document.body.removeEventListener('click', this._onBodyClick, false);
  }

  private _onSetupPopupRef = (popupDiv: HTMLDivElement) => {
    this._popupDiv = popupDiv;
  };

  private _onBodyClick = (event: any) => {
    const {active} = this.state;
    if (!active || !this._popupDiv) return;
    for (let el = event.target; !!el; el = el.parentElement) {
      if (el === this._popupDiv) {                                                                  // the click was inside popup area
        return;
      }
    }

    // TODO: debounce?
    nextTick(() => this.setState({active: false}));
  };


  private _onTargetClick = () => {
    const {active} = this.state;
    if (!active) {
      this.setState({active: true});
    }
  };

  public render() {
    const {children, className} = this.props;
    const {active} = this.state;

    let targetEl: any, popupEl: any;

    if (!children) {
      //
    } else if (Array.isArray(children)) {
      targetEl = children[0];
      popupEl = children.slice(1);
    } else {
      targetEl = children;
    }

    return (
      <div className={cn('Popup', className, {active: !!active && !!popupEl})}>
        <div className="Popup__Target" onClick={this._onTargetClick}>
          {targetEl}
        </div>
        {!!active && !!popupEl &&
        <div className="Popup__Popup" ref={this._onSetupPopupRef}>
          {popupEl}
        </div>}
      </div>);
  }
}
