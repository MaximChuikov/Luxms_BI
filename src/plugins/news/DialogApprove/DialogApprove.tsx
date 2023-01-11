import * as React from "react";
import './DialogApprove.scss'
interface IDialogApproveProps {
  onRemoveApprovePress: (event: any) => void;
  onRemoveCancelPress: (event: any) => void;
  text:string;
  dialogRef: (node: HTMLElement) => void;
}

const DialogApprove = (props:IDialogApproveProps) => {
    const {onRemoveApprovePress, onRemoveCancelPress, text, dialogRef} = props;
    return (
      <div className="DialogApprove" ref={dialogRef}>
        <h4 className="DialogApprove__Title">{text}</h4>
        <button className="DialogApprove__Yes" onClick={onRemoveApprovePress}>Да</button>
        <button className="DialogApprove__No" onClick={onRemoveCancelPress}>Нет</button>
      </div>
    )
 }

export default DialogApprove;