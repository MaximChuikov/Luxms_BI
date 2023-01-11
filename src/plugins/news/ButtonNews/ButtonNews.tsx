import * as React from "react";
import './ButtonNews.scss'

const ButtonNews = (props) => {
  const {onClickButton , className, children} = props;
  return <span onClick={onClickButton} className={className}>
    {children}
   </span>;
}


export default ButtonNews;