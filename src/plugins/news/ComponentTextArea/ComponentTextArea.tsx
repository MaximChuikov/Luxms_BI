import * as React from "react";
import './ComponentTextArea.scss';

interface IProps {
  autofocus?: boolean;
  style?: object;
  className: string;
  text: string;
  placeholder: string;
  handlerChange: (event: any) => void;
  readonly?: boolean;
}

const MIN_TEXTAREA_HEIGHT = 32;

const ComponentTextArea = (props: IProps) => {
  const { className, style, text, placeholder, handlerChange, readonly} = props;
  const textareaRef = React.useRef(null);
  const [value, setValue] = React.useState("");
  const onChange = (event) => {
    handlerChange(event);
    setValue(event.target.value);
  }

  React.useLayoutEffect(() => {
    textareaRef.current.style.height = "inherit";
    textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, MIN_TEXTAREA_HEIGHT)}px`;
  }, [value]);

  return (
    <textarea className={`ComponentTextarea ${className}`}
              ref={textareaRef}
              maxLength={1500}
              style={{minHeight: MIN_TEXTAREA_HEIGHT, ...style}}
              value={text}
              placeholder={placeholder}
              readOnly={readonly}
              onChange={onChange}
    />
  );
}

export default ComponentTextArea;