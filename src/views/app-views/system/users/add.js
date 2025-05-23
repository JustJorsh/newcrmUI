import React, { useState, useEffect, useContext, useRef } from 'react'
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
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState([])
  useEffect(() => {
    if (initialValues) {
      fetchRoles()
    }
  }, [initialValues]);
if (!initialValues) return null

  const fetchRoles = async (page = 1, search = '', sortBy = 'id', sortDir = 'ASC', limit = 100) => {
    setLoading(true)
    try {
      const client = await AxiosClient();
      const response = await client.get(`teams/roles?page=${page}&limit=${limit}&sort_by=${sortBy}&sort_dir=${sortDir}`);
      setRoles(response.data.data.roles)
    } catch (error) {
      setRoles([])
    }
    setLoading(false)
  }

  const add = async (data) => {
    setLoading(true)
    try {
      const client = await AxiosClient();
      const response = await client.post(`/teams`, data);
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

  return (
    <Modal
      title={'Add User'}
      visible
      closable
      footer={null}
      width={425}
      destroyOnClose
      onCancel={onClose}
    >
      <div>
        <Form layout="vertical" onFinish={add} initialValues={initialValues}>
          <Form.Item name="full_name" label="Enter User's Full Name" rules={[{ required: true }]}>
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item name="email" type="email" label="Enter User's Email" rules={[{ required: true }]}>
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item name="role_id" label="Select Role" rules={[{ required: true }]}>
            <Select>
              {roles.map((item, i) => (
                <Select.Option value={item.id}>{item.name}</Select.Option>
              ))}
            </Select>
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
