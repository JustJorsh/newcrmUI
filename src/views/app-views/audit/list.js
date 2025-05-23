import React, { useState, useEffect } from 'react';
import { Card, Table, Select, Input, Button, Badge, Menu, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex';
import moment from 'moment';
import AxiosClient from 'services/AxiosClient';
import { useHistory } from 'react-router-dom';

const Audits = () => {
  const history = useHistory();
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(10);
  const [loading, setLoading] = useState(false);
  const [query_value, setQueryValue] = useState('');
  const [staff, setStaff] = useState('');
  const [date, setDate] = useState('');
  const [users, setUsers] = useState([]);

  const fetchUsers = async (
    page = 1,
    search = '',
    sortBy = 'full_name',
    sortDir = 'ASC',
    limit = 100
  ) => {
    try {
      const client = await AxiosClient();
      const response = await client.get(
        `teams?page=${page}&limit=${limit}&sort_by=${sortBy}&sort_dir=${sortDir}`
      );
      setUsers(response.data.data.admins);
    } catch (error) {
      setUsers([]);
    }
  };

  const fetchAudit = async (
    page = 1,
    search = '',
    sortBy = 'created_on',
    sortDir = 'DESC',
    limit = 10
  ) => {
    setLoading(true);
    try {
      const client = await AxiosClient();
      const response = await client.get(
        `teams/audit?page=${page}&limit=${limit}&sort_by=${sortBy}&sort_dir=${sortDir}&search=${search}&search_fields=admin_id,date&admin=${staff}&date=${date}`
      );
      console.log(response);
      setList(response.data.data.admins);
      setTotal(response.data.data.page_info.total);
      setPage(response.data.data.page_info.page);
    } catch (error) {
      setList([]);
    }
    setLoading(false);
  };

  const tableColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'StaffName',
      dataIndex: 'first_name',
      render: (_, record) => <div>{record?.admin?.full_name}</div>,
      sorter: true,
    },
    { title: 'Table', dataIndex: 'table' },
    { title: 'Action', dataIndex: 'action' },
    {
      title: 'Date',
      dataIndex: 'created_on',
      render: (_, record) => (
        <span>
          {moment.parseZone(record.created_on).format('MMM, Do YYYY, hh:mm A')}
        </span>
      ),
      sorter: true,
    },
  ];

  const onSearch = () => {
    if (staff !== '' && date != '') fetchAudit();
  };

  useEffect(() => {
    fetchAudit();
    fetchUsers();
  }, []);

  return (
    <>
      <Card>
        <h2 className='mb-5'>Audit Logs</h2>
        <div className='container-fluid'>
          <div className='row mb-5'>
            <div className='col-md-3'>
              <div className='form-group'>
                <label>Select Staff</label>
                <Select
                  defaultValue={staff}
                  style={{ width: '100%' }}
                  onChange={(e) => setStaff(e)}
                >
                  {users.map((item, i) => (
                    <Select.Option key={i} value={item.id}>
                      {item.full_name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className='col-md-3'>
              <div className='form-group'>
                <label>Date of action</label>
                <Input type='date' onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
            <div className='col-md-2'>
              <br />
              <Button
                type='primary'
                style={{
                  background: '#F00002',
                  borderColor: '#F00002',
                }}
                title='Click to view audit'
                onClick={() => onSearch()}
              >
                View
              </Button>
            </div>
          </div>
        </div>
        <div className='table-responsive' style={{ overflow: 'auto' }}>
          <Table
            columns={tableColumns}
            dataSource={list}
            loading={loading}
            rowKey='id'
            onChange={(pagination, filter, sort) =>
              fetchAudit(
                pagination.current,
                query_value,
                sort?.field,
                sort?.order?.slice(0, -3),
                pagination.pageSize
              )
            }
            pagination={{ total }}
          />
        </div>
      </Card>
    </>
  );
};

export default Audits;
