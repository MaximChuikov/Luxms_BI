import * as React from "react";
import './ButtonPrimitive.scss';

const ButtonPrimitive = (props) => {
  const {title, onButtonClick} = props;
  return (
          <button className="ButtonPrimitive" onClick={onButtonClick}>{title}</button>
  )
}

export default ButtonPrimitive;