import React, { useState, useEffect, useContext, useRef } from 'react'
import {
  Modal,
  Form,
  Select,
  Button,
  message,
} from 'antd';
import AxiosClient from 'services/AxiosClient';

const EditModal = ({ initialValues, onClose, onFinish }) => {

  const [loading, setLoading] = useState(false)
  const [permissions, setPermissions] = useState([])
  useEffect(() => {
    fetchPermissions()
  }, [initialValues])
  if (!initialValues) return null

  const fetchPermissions = async (page = 1, search = '', sortBy = 'id', sortDir = 'ASC', limit = 100) => {
    setLoading(true)
    try {
      const client = await AxiosClient();
      const response = await client.get(`teams/permissions?page=${page}&limit=${limit}&sort_by=${sortBy}&sort_dir=${sortDir}`);
      setPermissions(response.data.data.permissions)
    } catch (error) {
      setPermissions([])
    }
    setLoading(false)
  }

  const update = async (data) => {
    setLoading(true)
    try {
      const client = await AxiosClient();
      data.role_id = initialValues.id;
      const response = await client.patch(`/teams/roles/permissions/add`, data);
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
      title={'Add Permission to Role'}
      visible
      closable
      footer={null}
      width={425}
      destroyOnClose
      onCancel={onClose}
    >
      <div>
        <Form layout="vertical" onFinish={update} initialValues={initialValues}>
          <Form.Item name="permission_id" label="Select Permision" rules={[{ required: true }]}>
            <Select>
              {permissions.map((item, i) => (
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

export default EditModal;
