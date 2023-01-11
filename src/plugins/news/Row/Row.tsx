import * as React from "react";

const Row = (props) => {
  const {minimalMode, className, onClick} = props;
  const elements = [...props.children];
  const lastElement = elements.splice(props.children.length-1,1);
  return (
    <tr className={className} onClick={onClick}
    >
      {elements.map((elem,index) => <td key={index}>{elem}</td>)}
      {!minimalMode &&
      <td>
        {lastElement}
      </td>
      }
    </tr>)
}

export default Row;