import * as React from "react";
import cn from 'classnames';
import './Pagination.scss';
import IconPrev from "../IconPrev/IconPrev";
import IconNext from "../IconNext/IconNext";
import IconFirstPage from "../IconFirstPage/IconFirstPage";
import IconLastPage from "../IconLastPage/IconLastPage";

const Pagination = (props) => {
  const {pages, activePage, onPrevClick, onPageClick, onNextClick, className, style,
    classNamePrev, classNameNext, classNameFirstLastPage, onFirstPageClick, onLastPageClick
  } = props;
  return (
          <footer className={className}>
            <ul>
              <li onClick={onFirstPageClick} className={classNameFirstLastPage} >
                <IconFirstPage/>
              </li>
              <li onClick={onPrevClick} className={classNamePrev} >
                <IconPrev/>
              </li>
              {pages.map((pid) =>
                      pid != null ?
                              <li key={pid} className={cn({active: activePage === pid})}
                                  onClick={() => onPageClick(pid)}
                                  style={style}
                              >
                                {pid + 1}
                              </li> : <li key={`nullPagination`} style={style}>...</li>)}

              <li onClick={onNextClick} className={classNameNext}>
                <IconNext/>
              </li>
              <li onClick={onLastPageClick} className={classNameFirstLastPage} >
                <IconLastPage/>
              </li>
            </ul>
          </footer>
  );
};

export default Pagination;