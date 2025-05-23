import React, { useState } from 'react'
import {
    Modal,
    Form,
    Input,
    Button,
    message
} from 'antd';
import AxiosClient from 'services/AxiosClient';

const ProfileUpdateModal = ({ initialValues, onClose, onFinish }) => {
    const [loading, setLoading] = useState(false);
    if (!initialValues) return null
    const saveRecord = async (data) => {
        setLoading(true)
        try {
            if (data?.description === "") message.error("Enter record")
            const client = await AxiosClient();
            const response = await client.post(`/customers/updates/save`, {
                description: data?.description,
                created_by: localStorage.getItem("CRM_StaffName"), 
                user_id: initialValues?.user_id,
                company_id: initialValues?.company_id
            });
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
    // ###
    // post {{baseUrl}}/customers/updates/save
    // Content-Type: application/json

    // {
    //     "description":"Testing", "created_by":"Test user", "user_id":0, "company_id":0
    // }


    // ###67000081716
    // get {{baseUrl}}/customers/updates/0/0
    // Content-Type: application/json

    // ###
    // delete {{baseUrl}}/customers/updates/2/0
    // Content-Type: application/json

    // {
    //   "created_by":"Ugo"
    // }
    return (
        <Modal
            title={'Add Record'}
            visible
            closable
            footer={null}
            width={425}
            destroyOnClose
            onCancel={onClose}
        >
            <div>
                <Form layout="vertical" onFinish={saveRecord} initialValues={initialValues}>
                    <Form.Item name="description" label="Enter Record" rules={[{ required: true }]}>
                        <Input.TextArea rows={4} autoComplete="off" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" disabled={loading} loading={loading}>Save</Button>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    )
}

export default ProfileUpdateModal;
