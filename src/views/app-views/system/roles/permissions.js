import React, { useState, useEffect } from 'react'
import { Card, Table, Button, message, Popconfirm } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import AxiosClient from 'services/AxiosClient';
import EditModal from './edit';
import { useParams, useHistory } from 'react-router-dom';
import Flex from 'components/shared-components/Flex'

const RolePermissions = () => {
  const params = useParams();
  const history = useHistory();

  const [permissions, setPermissions] = useState([])
  const [role, setRole] = useState()
  const [loading, setLoading] = useState(false)

  const fetchRole = async () => {
    setLoading(true)
    try {
      const client = await AxiosClient();
      const response = await client.get(`teams/roles/${params.id}`);
      setPermissions(response.data.data)
    } catch (error) {
      setPermissions([])
    }
    setLoading(false)
  }
  const removePermission = async (role_id, permission_id) => {
    const hide = message.loading("Processing")
    try {
      const client = await AxiosClient();
      const response = await client.patch(`/teams/roles/permissions/remove`, { permission_id, role_id });
      if (response.data.status !== "success") throw new Error(response?.data?.message)
      message.success(response?.data?.message)
      fetchRole();
    } catch (error) {
      message.error(error.response?.data?.message || error.response?.statusText
        || error.message
        || 'Seems like something went wrong with your request. Please try again.')
    }
    hide()
  }

  const tableColumns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'name', sorter: false },
    {
      title: 'Date',
      dataIndex: 'created_on',
      render: (_, record) => <span>{moment.parseZone(record.created_on).format('MMM, Do YYYY, hh:mm A')}</span>,
      sorter: false
    },
    {
      title: 'Delete',
      render: (_, record) => <><Popconfirm
        placement="right"
        title={"Are you sure you want to remove this permission?"}
        onConfirm={() => removePermission(permissions.id, record.id)}
        okText="Yes"
        cancelText="No"
        okButtonProps={{ danger: true }}>
        <Button size="small" danger icon={<CloseOutlined />} />
      </Popconfirm></>
    },
  ];

  useEffect(() => {
    fetchRole()
  }, [])

  return (
    <Card>
      <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">

          </div>
        </Flex>
        <div>
          <Button onClick={() => setRole(permissions)} type="primary" >Add Permission</Button>
        </div>
      </Flex>
      <div className="table-responsive">
        <Table
          columns={tableColumns}
          dataSource={permissions.permissions}
          rowKey='id'
          rowSelection={false}
          loading={loading}
          pagination={false}
        />
      </div>
      <EditModal
        initialValues={role}
        onClose={() => setRole()}
        onFinish={fetchRole} />
    </Card>
  )
}

export default RolePermissions
