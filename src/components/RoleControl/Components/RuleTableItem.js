import React, { useState, useEffect } from 'react'
import { EDIT_BUTTON, REMOVE_BUTTON } from "../icon/icons"

function RuleTableItem({ rule, onEditRule, onRemoveRule, isNew}) {
  const [showRemove, setShowRemove] = useState(false)

  const tooltipHide = event => {
    setShowRemove(false)
  }
  useEffect(() => {
    window.addEventListener('click', tooltipHide)

    return () => {
      window.removeEventListener('click', tooltipHide)
    }
  }, [])

    return (
      <tr
        className={isNew ? 'new-item' : ''}
      >
        <td
          style = {
            {
              textAlign: !rule.domainName ? 'center' : 'left',
              wordBreak: 'inherit'
            }
          }
        >{!rule.domainName ? 'Все' : rule.domainName}</td>
        <td
          style = {
            {
              textAlign: !rule.groupName ? 'center' : 'left',
              wordBreak: 'inherit'
            }
          }
        >{!rule.groupName ? 'Все' : rule.groupName}</td>
        <td>{rule.topicTitle}</td>
        <td>{rule.datasetTitle}</td>
        <td>{rule.dashboardTitle}</td>
        <td>{rule.dashletTitle}</td>
        <td>{rule.locationTitle}</td>

        <td className="row-button-set-wrapper">
          <div className="row-button-set">
            <div
              className="row-button-edit row-button-set-item"
              title="Редактировать"
              onClick={() => {onEditRule(rule)}}
            >
              {EDIT_BUTTON('row-button-edit-svg') || null}
            </div>
            <div
              className="row-button-remove row-button-set-item tooltip-role"
              title="Удалить"
              onClick={(event) => {
                  event.stopPropagation()
                  setShowRemove(true)
                }
              }
            >
              <div
                className={`input-tooltip ${showRemove ? 'showed' : ''}`}
              >
                <div className="tooltip-text">
                  Вы точно хотите удалить запись?
                </div>
                <div className="tooltip-button-set">
                  <button
                    className="tooltip-success-button"
                    onClick={(event) => {
                      event.stopPropagation()
                      onRemoveRule(rule)
                      setShowRemove(false)
                    }}
                  >
                    Да
                  </button>
                  <button
                    className="tooltip-cancel-button"
                    onClick={(event) => {
                      event.stopPropagation()
                      setShowRemove(false)
                    }}
                  >
                    Нет
                  </button>
                </div>
              </div>
              {REMOVE_BUTTON('array-item-remove-icon') || null}
            </div>
          </div>
        </td>
      </tr>
    )
}

export default RuleTableItem
