import React, { useState, useEffect } from 'react'
import { Card, Table, message, Button } from 'antd';
import moment from 'moment';
import AxiosClient from 'services/AxiosClient';
import Flex from 'components/shared-components/Flex'
import EditModal from './edit';
import AddModal from './add';
import { ReloadOutlined, EditOutlined, KeyOutlined } from '@ant-design/icons';

const Users = () => {
  const [users, setUsers] = useState([])
  const [user, setUser] = useState()
  const [addUser, setAddUser] = useState()
  const [loading, setLoading] = useState(false)

  const fetchUsers = async (page = 1, search = '', sortBy = 'full_name', sortDir = 'ASC', limit = 10) => {
    setLoading(true)
    try {
      const client = await AxiosClient();
      const response = await client.get(`teams?page=${page}&limit=${limit}&sort_by=${sortBy}&sort_dir=${sortDir}`);
      setUsers(response.data.data.admins)
    } catch (error) {
      setUsers([])
    }
    setLoading(false)
  }

  const tableColumns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Full Name', dataIndex: 'full_name' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (_, record) => <span>{record.role.name}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (_, record) => (<span> {record.activated ? 'Activated' : 'Pending'} </span>),
    },
    {
      title: 'Date',
      dataIndex: 'created_on',
      render: (_, record) => <span>{moment.parseZone(record.created_on).format('MMM, Do YYYY, hh:mm A')}</span>,
      sorter: true
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => (<>
      <span style={{ cursor: 'pointer', color: 'green' }} onClick={() => setUser(record)} ><EditOutlined /></span></>),
    },
  ];

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <Card>
        <h2 className="mb-5">Admin Users</h2>
      <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">

          </div>
        </Flex>
        <div>
          <Button onClick={() => setAddUser({ add: true })} type="primary" >Add User</Button>
        </div>
      </Flex>
      <div className="table-responsive">
        <Table
          columns={tableColumns}
          dataSource={users}
          rowKey='id'
          rowSelection={false}
          loading={loading}
          onChange={(pagination, _, sort) => fetchUsers(pagination.current, '', sort?.field, sort?.order?.slice(0, -3))}
          pagination={false}
          style={{ cursor: 'pointer' }}
        // onRow={(r) => ({
        //   onClick: () => setUser(r)
        // })}
        />
      </div>
      <EditModal
        initialValues={user}
        onClose={() => setUser()}
        onFinish={fetchUsers} />
      <AddModal
        initialValues={addUser}
        onClose={() => setAddUser()}
        onFinish={fetchUsers} />
    </Card>
  )
}

export default Users
