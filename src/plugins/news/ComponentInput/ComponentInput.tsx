import * as React from "react";
import './ComponentInput.scss';

interface IComponentInputProps {
  inputRef?: React.RefObject<HTMLInputElement>
  className: string;
  value: string;
  handlerChange: (event: any) => void;
}

const ComponentInput = (props: IComponentInputProps) => {
  const {inputRef, className, value, handlerChange} = props;
  return (
    <input type="text"
           ref={inputRef}
           className={className}
           value={value || ``}
           maxLength={100}
           onChange={handlerChange}
    />
  )
}


export default ComponentInput;