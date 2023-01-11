import * as React from "react";
import './NewsNotifications.scss';

const NewsNotifications = (props) => (
  <div className="NewsNotifications custom">
    {props.children}
  </div>
);

export default NewsNotifications;
