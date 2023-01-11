import * as React from "react";
import './DialogApprove.scss'
import DialogApprove from "./DialogApprove";
interface IDialogApproveCVProps {
  onRemoveApprovePress: (event: any) => void;
  onRemoveCancelPress: (event: any) => void;
  text:string;
}

export default class DialogApproveCV extends React.PureComponent<IDialogApproveCVProps> {
  private dialog: HTMLElement | null;
  public dialogRef: (el: HTMLElement) => void;
  constructor(props) {
    super(props);

    this.dialog = null;
    this.dialogRef = (element) => {
      this.dialog = element;
    };
  }

  componentDidMount() { document.addEventListener("click", this.handleClickOutside, false); }
  componentWillUnmount() { document.removeEventListener("click", this.handleClickOutside, false); }
  handleClickOutside = (e) => {
    if(this.dialog.contains(e.target)) {
      return;
    }
    this.props.onRemoveCancelPress(e);
  }
  render() {
    const {onRemoveApprovePress, onRemoveCancelPress, text,} = this.props;
    return <DialogApprove
      onRemoveApprovePress={onRemoveApprovePress}
      onRemoveCancelPress={onRemoveCancelPress}
      text={text}
      dialogRef={this.dialogRef}
    />
  }
}