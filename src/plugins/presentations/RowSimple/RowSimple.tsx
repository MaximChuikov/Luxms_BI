import * as React from "react";

const RowSimple = (props) => {
  const {style, classNameTR, classNameTD, dataBind, } = props;
  return <tr
      style={style}
      className={classNameTR}
      data-bind={dataBind}>
    <td colSpan={8} style={{textAlign: 'center'}} className={classNameTD}>{props.children}</td>
  </tr>
}

export default RowSimple;