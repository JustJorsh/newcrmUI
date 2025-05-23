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

  const update = async (data) => {
    setLoading(true)
    try {
      const client = await AxiosClient();
      const response = await client.patch(`/team/${initialValues.id}`, data);
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
      title={'Update User Role'}
      visible
      closable
      footer={null}
      width={425}
      destroyOnClose
      onCancel={onClose}
    >
      <div>
        <Form layout="vertical" onFinish={update} initialValues={initialValues}>
          <Form.Item name="role_id" label="Select Role" rules={[{ required: true }]}>
            <Select>
              {roles.map((item, i) => (
              <Select.Option value={item.id}>{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
              <Button type="primary" htmlType="submit" disabled={loading} loading={loading}>Update</Button>
            </Form.Item>
        </Form>
      </div>

    </Modal>
  )
}

export default EditModal;
