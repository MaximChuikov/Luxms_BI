import * as React from 'react';
import cn from 'classnames';
import './MultiSelect.scss';

interface IMultiSelectProps {
  onChange: (id) => any;
  value: any[];
  children?;
  multiple: boolean;
  className?: string;
}

export class MultiSelect extends React.Component<IMultiSelectProps> {
  public state: {
    expanded: boolean;
  } = {
    expanded: false,
  };

  private _onClickValue = () => {
    this.setState({expanded: !this.state.expanded});
  };

  private _isSelected(v: any): boolean {
    const isSelected = this.props.value.indexOf(v) !== -1;
    return isSelected;
  }

  private _onToggle(id) {
    let value = this.props.value.slice(0);
    let idx = value.indexOf(id);
    if (idx === -1) {
      value.push(id);
    } else {
      value.splice(idx, 1);
    }
    this.props.onChange(value);
  }

  private _isSelectedAll() {
    return this.props.value.length === this.props.children.length;
  }

  private _onToggleAll() {
    if (this._isSelectedAll()) {
      this.props.onChange([]);
    } else {
      this.props.onChange(this.props.children.map(child => child.props.value));
    }
  }

  public render() {
    const {children, className} = this.props;
    const {expanded} = this.state;

    return (
      <div className={cn('MultiSelect', className)}>
        <ul className={cn('MultiSelect__ValueContainer', {expanded: !!expanded})} onClick={this._onClickValue}>
          {this._isSelectedAll() ?
            <li className="MultiSelect__ValueItem" title={'ВСЕ'}>
              ВСЕ
            </li> :
            children.filter(child => this._isSelected(child.props.value)).map(child =>
            <li className="MultiSelect__ValueItem" key={child.props.value} title={child.props.children}>
              {child.props.children}
            </li>)}
        </ul>

        {!!expanded &&
        <ul className="MultiSelect__Dropdown">
          <li  className="MultiSelect__DropdownItem all" title={'ВСЕ'}>
            <label>
              <input type="checkbox"
                     checked={this._isSelectedAll()}
                     onChange={() => this._onToggleAll()}/>
              ВСЕ
            </label>
          </li>

          {children.map(child =>
          <li className="MultiSelect__DropdownItem" key={child.props.value} title={child.props.children}>
            <label>
              <input type="checkbox"
                     checked={this._isSelected(child.props.value)}
                     onChange={() => this._onToggle(child.props.value)}/>
              {child.props.children || '\u00A0'}
            </label>
          </li>)}
        </ul>}

      </div>);
  }
}
