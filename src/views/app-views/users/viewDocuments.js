import React from 'react'
import { Modal } from 'antd';


const ViewDocumentModal = ({ initialValues, onClose, onFinish }) => {
    if (!initialValues) return null
    console.log(initialValues);
    return (
        <Modal
            title={'Documents'}
            visible
            closable
            footer={null}
            width={'80vw'}
            destroyOnClose
            onCancel={onClose}
        >
            <div style={{ width: '80vw', height: '70vh', overflow:'auto' }}>
                {initialValues.map((item, i) => (
                    <iframe style={{ width: '96%', height: '80vh', overflow: 'auto' }} src={item.documentLink}></iframe>
                ))}
                {initialValues.length == 0 ? "No Docuemnt avaliable": ""}
            </div>
        </Modal>
    )
}

export default ViewDocumentModal;
