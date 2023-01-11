import React, {useState, useEffect} from 'react'
import '../styles/paginator.css'

function Paginator({pageCount, currentPage, onSetPage}) {
  const [numberList, setNumberList] = useState(calcNumberList)

  function calcNumberList() {
    const numbers = []
    if (currentPage - 2 >= 2) numbers.push(currentPage - 2)
    if (currentPage - 1 >= 2) numbers.push(currentPage - 1)
    if (currentPage  >= 2 && currentPage !== pageCount) numbers.push(currentPage)
    if (currentPage + 1 <= pageCount - 2) numbers.push(currentPage + 1)
    if (currentPage + 2 <= pageCount - 2) numbers.push(currentPage + 2)
    return numbers
  }

  useEffect(() => {
    setNumberList(calcNumberList)
    // eslint-disable-next-line
  }, [pageCount, currentPage])

  return (
    <div className="paginator-wrapper">
      <div
        className="paginator"
      >
        <div
          className="paginator-item"
          onClick={() => {
            if (currentPage !== 1) onSetPage(1)}
          }
        >
          <div className="first-page">&#9650;</div>
        </div>
        <div
          className="paginator-item"
          onClick={() => {
            if (currentPage !== 1) onSetPage(currentPage - 1)
          }}
        >
          <div className="prev-page">&#9650;</div>
        </div>
        {
          pageCount !== 1 && <div
            className={`paginator-item  ${currentPage === 1 ? 'number__selected' : ''}`}
            onClick={() => {
              if (currentPage !== 1) onSetPage(1)
            }}
          >
            <div className="number">1</div>
          </div>
        }
        {
          currentPage >= 5 && <div className="paginator-item">
          <div className="dots"
          onClick={() => {
            if (currentPage === 5) onSetPage(2)
          }}>
            {currentPage === 5 ? 2 : '...'}
          </div>
        </div>
        }
        <div className="paginator-number-list">
          {
            numberList.map(num => {
              return (
                <div
                  className={`paginator-item ${currentPage === num ? 'number__selected' : ''}`}
                  key={num}
                  onClick={() => {
                    if (currentPage !== num) onSetPage(num)
                  }}
                >
                  <div className="number">{num}</div>
                </div>
              )
            })
          }
        </div>
        {
          (currentPage < pageCount - 1) && <div className="paginator-item">
          <div
            className="dots"
            onClick={() => {
              if (currentPage === pageCount - 3 || currentPage === pageCount - 2) onSetPage(pageCount - 1)
            }}
          >
            {currentPage > pageCount - 4 ? pageCount - 1 : '...'}
          </div>
        </div>
        }
        {
          pageCount > 0 && <div
            className={`paginator-item ${currentPage === pageCount ? 'number__selected' : ''}`}
            onClick={() => {
              if (currentPage !== pageCount) onSetPage(pageCount)
            }}
          >
            <div className="number">{pageCount}</div>
          </div>
        }
        <div
          className="paginator-item"
          onClick={() => {
            if (currentPage !== pageCount) onSetPage(currentPage + 1)
          }}
        >
          <div className="next-page">&#9650;</div>
        </div>
        <div
          className="paginator-item"
          onClick={() => {
            if (currentPage !== pageCount) onSetPage(pageCount)
          }}
        >
          <div className="last-page">&#9650;</div>
        </div>
      </div>
    </div>
  )
}

export default Paginator
