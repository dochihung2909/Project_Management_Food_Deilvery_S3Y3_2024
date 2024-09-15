import React, { useState } from 'react'
import Modal from 'react-modal'

Modal.setAppElement('#root')

const Dialog = ({ msg, isOpen, onConfirm, onCancel }) => {
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    return (
        <Modal
            isOpen={isOpen}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <div>{msg}</div>
            <form>
                <button onClick={onCancel}>Cancel</button>
                <button onClick={onConfirm}>OK</button>
            </form>
        </Modal>
    )
}

export default Dialog