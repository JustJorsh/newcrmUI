import React, { useState, useEffect } from 'react'
import {
    Modal,
    Form,
    Select,
    Input,
    Button,
    message
} from 'antd';


const AddModal = ({ initialValues, onClose, onFinish }) => {

    const [loading, setLoading] = useState(false);
    const [document, setDocument] = useState();
    if (!initialValues) return null

    const add = async (data) => {
        message.info("Processing... Please wait");
        setLoading(true)
        try {
            if (document == null) message.error("Select a document to upload")

            const fileInput = document[0];
            var formdata = new FormData();
            formdata.append("file", fileInput, "TestPhoneRecordTemplate.xlsx");

            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };

            fetch("https://www.eskabatch.services.heirslifeassurance.com/api/v1/general/phonerecs", requestOptions)
                .then(response => response.json())
                .then(result => handleFetchResult(result))
                .catch(error => console.log('error', error));
            // if (response.data.status !== "success") throw new Error(response?.data?.message)
            // message.success(response?.data?.message)
        } catch (error) {
            message.error(error.response?.data?.message || error.response?.statusText
                || error.message
                || 'Seems like something went wrong with your request. Please try again.')
        }
        setLoading(false)
    }

    function handleFetchResult(result) {
        // Your logic with the result goes here
        //console.log('Result:', result);
        onClose();
        onFinish(result);
    }

    const handleFileChange = (e) => {
        setDocument(e.target.files);
    };

    return (
        <Modal
            title={'Upload Phone Call'}
            visible
            closable
            footer={null}
            width={425}
            destroyOnClose
            onCancel={onClose}
        >
            <div>
                <Form layout="vertical" onFinish={add} initialValues={initialValues}>
                    <Form.Item name="file" label="Documents" rules={[{ required: true }]}>
                        <Input type="file" onChange={handleFileChange} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" disabled={loading} loading={loading}>Add</Button>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    )
}

export default AddModal;
