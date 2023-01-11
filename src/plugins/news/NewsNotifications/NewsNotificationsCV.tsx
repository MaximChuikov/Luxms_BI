import * as React from "react";
import ComponentNewsCV from "../ComponentNews/ComponentNewsCV";
import NewsNotifications from "./NewsNotifications";

const CHECK_TIME = 300;
interface  INewsNotificationsProps {
  onClickClose: () => void;
  onClickOutside: () => void;
}

export default class NewsNotificationsCV extends React.Component<INewsNotificationsProps> {
  private timer: NodeJS.Timer = null;
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      const elem = document.activeElement;
      if (elem && elem.tagName == 'IFRAME') {
        clearInterval(this.timer);
        this.props.onClickOutside();
      }
    }, CHECK_TIME);
  }
  componentWillUnmount() { clearInterval(this.timer); }
  render() {
    const {onClickClose,} = this.props;
    return (
      <NewsNotifications>
        <ComponentNewsCV
          minimalMode={true}
          onClickClose={onClickClose}
          className={`BackgroundBlack`}
        />
      </NewsNotifications>
    )
  }
}
