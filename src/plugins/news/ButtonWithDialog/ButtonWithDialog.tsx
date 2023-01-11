import * as React from "react";
import cn from 'classnames';
import './ButtonWithDialog.scss'

const ButtonWithDialog = (props) => {
  const {title, className, onRemovePress, isAttendingToRemove, disabled} = props;
  const elements = [...props.children];
  // ниже делаю умный рендеринг
  // начиная со второго child'а (элементы диалога) будут выведен только если флаг не выставлен
  if(!isAttendingToRemove) {
    elements.splice(1);
  }
  return (
          <div className={cn('ButtonWithDialog', className, {disabled})} onClick={e => e.stopPropagation()}>
            {elements}
            <a href={void(0)} title={title}
               onClick={disabled ? () => null : onRemovePress}>
            </a>
          </div>
  );
}

export default ButtonWithDialog;