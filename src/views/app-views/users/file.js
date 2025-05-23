import React, { useEffect } from 'react'
import {
    Modal,
    Card,
    Row,
    Col
} from 'antd';

const FileModal = ({ initialValues, onClose, onFinish }) => {
    if (!initialValues) return null

    return (
        <Modal
            title={''}
            visible
            closable
            footer={null}
            width={800}
            destroyOnClose
            onCancel={onClose}
        >
            <div>
                <>
                    <div className="container">
                        <Card title="Email Message" style={{overflow:"hidden"}}>
                            <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                                <Col className="gutter-row">
                                    <div className="table-responsive">
                                        <div dangerouslySetInnerHTML={{ __html: initialValues?.message }} />
                                    </div>
                                </Col>

                            </Row>
                        </Card>
                    </div>
                </>
            </div>
        </Modal>
    )
}

export default FileModal;
