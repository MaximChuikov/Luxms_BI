import React, {useEffect} from 'react'
import './modal.css'
import  {useModal} from './ModalContext'
import { CLOSE } from '../../icon/icons'

function Modal() {
  const modal = useModal()

  const modalHide = event => {
    if (event.target.id === 'modal') {
      modal.hide()
    }
  }

  useEffect(() => {
    window.addEventListener('mousedown', modalHide)

    return () => {
      window.removeEventListener('mousedown', modalHide)
    }
    // eslint-disable-next-line
  }, [])

  if (!modal.visible) return null
  return (
    <div
      className="role-control-modal"
      id="modal"
     >
      <div
        className='role-control-modal-body-wrapper'
        id='modal-body-wrapper'
      >
        {CLOSE('close-modal-button', null, modal.hide) || null}
        <modal.modalContent data={modal.modalData} />
      </div>
    </div>

  )
}

export default Modal
