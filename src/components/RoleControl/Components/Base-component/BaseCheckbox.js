import React from 'react'
import './base-component.css'
import { CHECK } from '../../icon/icons';

function BaseCheckbox({ checked, onChange }) {
  return (
    <div
      className={'base-checkbox-wrapper'}
      onClick={(e) => {
        e.stopPropagation()
        onChange(!checked)}
      }
    >
      {checked ?
        (
          CHECK('checkbox-icon') || null
        ) : ('')
      }
    </div>
  )
}

export default BaseCheckbox
