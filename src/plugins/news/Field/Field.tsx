import * as React from "react";
import './Field.scss';

const Field = (props) => {
  const {className, style, text} = props;
  return (
          <span className={className} style={style}>
            {text}
            {props.children}
          </span>
  )
}

export default Field;