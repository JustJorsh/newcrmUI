import React, { useState, useEffect } from 'react';
import { Card, Table, Select, Input, Button, Badge, Menu, Tag } from 'antd';
import { EyeOutlined, MessageOutlined } from '@ant-design/icons';
import moment from 'moment';
import AxiosClient from 'services/AxiosClient';
import { useHistory, useParams } from 'react-router-dom';
import NotesModal from './notes';

const Tickets = () => {
  const history = useHistory();
  const params = useParams();
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(10);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(3);
  const [tickets, setTickets] = useState([]);
  const [notes, setNotes] = useState();

  let ticket_status = returnStatus(params?.status);
//freshdesk/conversations/:id
  function returnSource(sts) {
    switch (sts) {
      case 1:
        return 'Email';
      case 2:
        return 'Portal';
      case 3:
        return 'Phone';
      case 7:
        return 'Chat';
      case 9:
        return 'Feedback Widget';
      case 10:
        return 'Outbound Email';
    }
  }

  function returnStatus(sts) {
    switch (sts) {
      case 2:
        return 'Open';
      case 3:
        return 'Pending';
      case 4:
        return 'Resolved';
      case 5:
        return 'Closed';
      case 6:
        return 'Waiting on Customer';
      case 7:
        return 'Waiting on Third Party'
      case 8:
        return 'Issue escalated';
      case 9:
        return 'Awaiting Resolver Group Feedback'
      case 10:
        return 'Escalated to Finance';
      case 11:
        return 'Escalated to Operation'
      case 12:
        return 'Escalated to IT';
      case 13:
        return 'Escalated to Legal';
      case 14:
        return 'Escalated to Marketing'
      case 15:
        return 'Escalated to Brand'
      case 16:
        return 'Escalated to Claims';
      case 17:
        return 'Unresolved but closed';

    }
  }

  const Status = [
    { name: "Open", value: 2 },
    { name: "Pending", value: 3 },
    { name: "Resolved", value: 4 },
    { name: "Closed", value: 5 },
    { name: 'Waiting on Customer', value: 6 },
    { name: 'Waiting on Third Party', value: 7 },
    { name: 'Issue escalated', value: 8 },
    { name: 'Awaiting Resolver Group Feedback', value: 9 },
    { name: 'Escalated to Finance', value: 10 },
    { name: 'Escalated to Operation', value: 11 },
    { name: 'Escalated to IT', value: 12 },
    { name: 'Escalated to Legal', value: 13 },
    { name: 'Escalated to Marketing', value: 14 },
    { name: 'Escalated to Brand', value: 15 },
    { name: 'Escalated to Claims', value: 16 },
    { name: 'Unresolved but closed', value: 17 }
  ]

  const fetchTickets = async (
    page = 1,
    status = 3
  ) => {
    setLoading(true);
    try {

      console.log(page, status);
      const client = await AxiosClient();
      const response = await client.post(
        `customers/freshdesk/tickets`, { status, page }
      );
      console.log(response?.data?.data)
      setList(response?.data?.data?.results);
      setTickets(response?.data?.data?.results)
      // const tot = response?.data?.data?.results.length > 30
      if (response?.data?.data?.results.length == 30) setTotal(response.data?.data?.total);
      else setTotal(0);
    } catch (error) {
      setList([]);
      setLoading(false);
    }
    setLoading(false);
  };

  // const onChange = (pagination, filters, sorter, extra) => {
  //   console.log('params', pagination, filters, sorter, extra);
  // };

  const sortBySource = async (e) => {
    const data = tickets.filter(x => x.source == +e);
    setList(data);
  }

  const tableColumns = [
    {
      title: 'No',
      dataIndex: 'id',
      render: (_, record, index) => <div>{index + 1}</div>,
    },
    {
      title: 'Subject',
      dataIndex: 'subject'
    },
    { title: 'Type', Key: 3, dataIndex: 'type' },
    {
      title: 'Priority',
      dataIndex: 'priority',
      render: (_, record) => <div>{record?.priority == 1 ? "Low" : record?.priority == 2 ? "Medium" : record?.priority == 3 ? "High" : record?.priority == 4 ? "Urgent" : ""}</div>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (_, record) => <div>{returnStatus(record?.status)}</div>
    },
    {
      title: 'Date Created',
      dataIndex: 'created_at',
      render: (_, record) => (
        <span>
          {moment.parseZone(record.created_at).format('MMM, Do YYYY, hh:mm A')}
        </span>
      )
    },
    {
      title: 'Source',
      dataIndex: 'source',
      render: (_, record) => (
        <span>
          {returnSource(record?.source)}
        </span>
      ), sorter: (a, b) => a.source - b.source
    },
    {
      title: 'Date Updated',
      dataIndex: 'updated_at',
      render: (_, record) => (
        <span>
          {moment.parseZone(record.updated_at).format('MMM, Do YYYY, hh:mm A')}
        </span>
      )
    },
    {
      title: 'Details',
      dataIndex: 'action',
      render: (_, record) => (<>
        <span style={{ cursor: 'pointer', color: 'green' }} onClick={() => history.push(`/tickets/details/${record.id}`)}><EyeOutlined /></span></>),
    },
    {
      title: 'Notes',
      dataIndex: 'action',
      render: (_, record) => (<>
        <span style={{ cursor: 'pointer', color: 'green' }} onClick={() => setNotes(record)}><MessageOutlined  /></span></>),
    },
  ];

  const onSearch = (e) => {
    setStatus(e);
    fetchTickets(1, e);
  };

  useEffect(() => {
    fetchTickets(page, status);
  }, [page]);

  return (
    <>
     <h2 className='mb-5'>Tickets</h2>
    <Card  style={{ backgroundColor: 'whitesmoke' }}>
    <div className='container'>
          <div className='row'>
            <div className='col-md-3'>
              <div className='form-group'>
                <label>Select Status</label>
                <Select
                  style={{ width: '100%' }}
                  onChange={(e) => onSearch(e)}
                >
                  {Status.map((r, i) =>
                    <Select.Option value={`${r.value}`}>
                      {r.name}
                    </Select.Option>
                  )}
                </Select>
              </div>
            </div>
            <div className='col-md-2'>
              <div className='form-group'>
                <label>Sort current record by source</label>
                <Select
                  style={{ width: '100%' }}
                  onChange={(e) => sortBySource(e)}
                >
                  <Select.Option value={1}>
                    Email
                  </Select.Option>
                  <Select.Option value={2}>
                    Portal
                  </Select.Option>
                  <Select.Option value={3}>
                    Phone
                  </Select.Option>
                  <Select.Option value={7}>
                    Chat
                  </Select.Option>
                  <Select.Option value={9}>
                    Feedback Widget
                  </Select.Option>
                  <Select.Option value={10}>
                    Outbound Email
                  </Select.Option>
                </Select>
              </div>
            </div>
            <div className='col-md-2'>
              <label>Total Pages</label>
              <Input value={total} />
            </div>
            <div className='col-md-2'>
              <label>Goto next page</label>
              <Input type='number'
                onChange={(e) => setPage(e.target.value)}

                onKeyDown={(e) => e.key === 'Enter' && setPage(e.target.value)}
                className='mr-3'
              />
            </div>
          </div>
        </div>
    </Card>
      <Card>
       

        <div className='table-responsive' style={{ overflow: 'auto' }}>
          <Table
            columns={tableColumns}
            dataSource={list}
            // pagination={{
            //   position: 'bottomRight',
            //   onChange: (page) => fetchTickets(page + 1, status),
            //   hideOnSinglePage: true,
            // }}
            loading={loading}
            rowKey='id'
          />
        </div>
      </Card>
      <NotesModal
        initialValues={notes}
        onClose={() => setNotes()}
         />
    </>
  );
};

export default Tickets;
