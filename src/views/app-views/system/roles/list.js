import React, { useState, useEffect } from 'react'
import { Card, Table } from 'antd';
import moment from 'moment';
import AxiosClient from 'services/AxiosClient';
import { useHistory } from "react-router-dom";

const Roles = () => {
  const history = useHistory();
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchRoles = async (page = 1, search = '', sortBy = 'id', sortDir = 'ASC', limit = 10) => {
    setLoading(true)
    try {
      const client = await AxiosClient();
      const response = await client.get(`teams/roles?page=${page}&limit=${limit}&sort_by=${sortBy}&sort_dir=${sortDir}`);
      console.log(response);
      setRoles(response.data.data.roles)
    } catch (error) {
      setRoles([])
    }
    setLoading(false)
  }

  const tableColumns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'name', sorter: true },
    {
      title: 'Date',
      dataIndex: 'created_on',
      render: (_, record) => <span>{moment.parseZone(record.created_on).format('MMM, Do YYYY, hh:mm A')}</span>,
      sorter: true
    }
  ];

  useEffect(() => {
    fetchRoles()
  }, [])

  return (
    <Card>
        <h2 className="mb-5">Roles</h2>
      <div className="table-responsive">
        <Table
          columns={tableColumns}
          dataSource={roles}
          rowKey='id'
          rowSelection={false}
          loading={loading}
          onChange={(pagination, _, sort) => fetchRoles(pagination.current, '', sort?.field, sort?.order?.slice(0, -3))}
          pagination={false}
          style={{cursor: 'pointer'}}
          onRow={(r) => ({
            onClick: () => history.push(`/system/roles/permissions/${r.id}`)
          })}
        />
      </div>
    </Card>
  )
}

export default Roles
