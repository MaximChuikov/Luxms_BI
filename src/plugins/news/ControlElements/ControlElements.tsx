import * as React from "react";
import './ControlElements.scss';
import cn from "classnames";
import ButtonEdit from "../ButtonEdit/ButtonEdit";
import ButtonWithDialog from "../ButtonWithDialog/ButtonWithDialog";
import DialogApproveCV from "../DialogApprove/DialogApproveCV";
import IconPublish from '../IconPublish/IconPublish';
import IconRemove from "../IconRemove/IconRemove";

const ControlElements = (props) => {
  const {
    onEditClick, onRemovePress, isAttendingToRemove, onRemoveCancelPress,
    onRemoveApprovePress, isEditing, onPublishPress, isAttendingToPublish,
    onPublishApprovePress, onPublishCancelPress, textPublishDialog,
    textRemoveDialog, isHidden, canSave,
  } = props;

  return (
    <div className={cn('ControlElements', { secondary: isAttendingToRemove })}>
      <div className="main-block">
        <ButtonEdit isEditing={isEditing} onEditClick={onEditClick} disabled={!canSave}/>
        <ButtonWithDialog className="ControlElements__Publish" title={`Опубликовать новость`}
          disabled={isEditing}
          onRemovePress={onPublishPress}
          isAttendingToRemove={isAttendingToPublish}>
          <IconPublish className={Boolean(isHidden) ? `white` : `green`}/>
          <DialogApproveCV text={textPublishDialog}
                           onRemoveApprovePress={onPublishApprovePress}
                           onRemoveCancelPress={onPublishCancelPress} />
        </ButtonWithDialog>
        <ButtonWithDialog className="ControlElements__Remove"  title={`Удалить новость`}
          onRemovePress={onRemovePress}
          isAttendingToRemove={isAttendingToRemove}>
          <IconRemove />
          <DialogApproveCV
            text={textRemoveDialog}
            onRemoveApprovePress={onRemoveApprovePress}
            onRemoveCancelPress={onRemoveCancelPress} />
        </ButtonWithDialog>
      </div>
    </div>);
}

export default ControlElements;