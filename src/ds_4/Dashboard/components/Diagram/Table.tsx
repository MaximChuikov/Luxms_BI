import React from 'react'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import { dataInput } from './types'
import style from './style.module.scss'

const Table = (data: dataInput) => {
  return (
    <div className={style.diagram}>
      <div className={style.header} />
      <div className={style.table}>
        {data.data.map((e, ind) => (
          <div key={ind} className={style.col}>
            <div className={style.header}>
              <ArrowRightAltIcon className={style.arrow + e.coefficient >= 0 && style.arrow__dec} />
              {e.coefficient}
            </div>
            <div className={style.col} />
            <div className={style.footer}>
              <div className={style.number}>{e.workers}</div>
              <div>{e.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Table
