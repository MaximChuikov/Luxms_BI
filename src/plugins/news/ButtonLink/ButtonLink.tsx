import * as React from "react";

const ButtonLink = (props) => {
  const {onButtonClick, style} = props;
  return (
          <a className="ButtonLink" style={style}
             href={void(0)}
             onClick={onButtonClick}>
            {props.children}
          </a>
  )
}

export default ButtonLink;