import React, { useState, useEffect } from 'react'
import {
    Modal,
    Form,
    Select,
    Input,
    Button,
    message
} from 'antd';
import AxiosClient from 'services/AxiosClient';

const AddModal = ({ initialValues, onClose, onFinish }) => {
    const [loading, setLoading] = useState(false);
    const [document, setDocument] = useState("");
    if (!initialValues) return null

    const add = async (data) => {
        setLoading(true)
        try {
            if(document == "") message.error("Select a document to upload")
            
            const client = await AxiosClient();
            const response = await client.post(`/customers/save-general-document`, {  policyNumber:data.policyNumber, attachments:[document] });
            console.log(response);
            if (response.data.status !== "success") throw new Error(response?.data?.message)
            message.success(response?.data?.message)
            onClose()
            onFinish()
        } catch (error) {
            message.error(error.response?.data?.message || error.response?.statusText
                || error.message
                || 'Seems like something went wrong with your request. Please try again.')
        }
        setLoading(false)
    }

    const handleFileChange = (e) => {
        console.log(e.target.files);
        if (e.target.files) {
            console.log(e);
            getBase64(e.target.files[0]).then(
                data => setDocument(data)
            );
        }
    };


    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    return (
        <Modal
            title={'Add Document'}
            visible
            closable
            footer={null}
            width={425}
            destroyOnClose
            onCancel={onClose}
        >
            <div>
                <Form layout="vertical" onFinish={add} initialValues={initialValues}>
                    <Form.Item name="policyNumber" label="Policy No" rules={[{ required: true }]}>
                        <Input autoComplete="off" />
                    </Form.Item>
                    <Form.Item name="image" label="Documents" rules={[{ required: true }]}>
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
