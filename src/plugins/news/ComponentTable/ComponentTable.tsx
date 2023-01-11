import * as React from "react";
import "./ComponentTable.scss";

interface IComponentTableProps {
  children: any;
  classNameArticle: string;
  classNameTable: string;
  minimalMode?: boolean;
}

const ComponentTable = (props: IComponentTableProps) => {
  const { minimalMode, classNameArticle, classNameTable,} = props;
  const elements = props.children.filter((item) => item !== false);
  const header = elements.splice(0,1);
  const footer = elements.splice(elements.length-1,1);
  return (
    <>
      <article className={classNameArticle}>
        <table className={classNameTable}>
          {!minimalMode &&
          <thead>
          {header}
          </thead>
          }
          <tbody>
          {elements}
          </tbody>
        </table>
      </article>
      {footer}
    </>);
}

export default ComponentTable;