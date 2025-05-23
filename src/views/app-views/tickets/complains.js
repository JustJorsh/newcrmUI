import React, { useState, useEffect } from 'react';
import { Card, Table, Select, Input } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import AxiosClient from 'services/AxiosClient';
import { useHistory } from 'react-router-dom';
import { ExportCSV } from '../reports/ExportCSV'

const ComplainTickets = () => {
  const history = useHistory();
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(10);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('5');
  const [reports, setReports] = useState([])

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
        return 'Waiting on Third Party';
      case 8:
        return 'Issue escalated';
      case 9:
        return 'Awaiting Resolver Group Feedback';
      case 10:
        return 'Escalated to Finance';
      case 11:
        return 'Escalated to Operation';
      case 12:
        return 'Escalated to IT';
      case 13:
        return 'Escalated to Legal';
      case 14:
        return 'Escalated to Marketing';
      case 15:
        return 'Escalated to Brand';
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

  const fetchTickets = async (status, pageNo) => {
    console.log(pageNo);
    setLoading(true);
    try {
      const client = await AxiosClient();
      const response = await client.get(`customers/freshdesk/complains/${pageNo}/${status}`);
      console.log(response?.data?.data)
      setList([]);
      setList(response?.data?.data?.results);
      setTotal(response.data.data?.total);

      if(response?.data?.data?.results.length > 0)
      {
      // let res = [];
      // response?.data?.data?.results.forEach(element => {
      //   res.push({
      //     subject: element?.subject,
      //     priority: element?.priority === 1 ? "Low" : element?.priority === 2 ? "Medium" : element?.priority === 3 ? "High" : element?.priority === 4 ? "Urgent" : "",
      //     Status: returnStatus(element.status),
      //     source: returnSource(element?.source),
      //     date_created: moment.parseZone(element.created_at).format('MMM, Do YYYY, hh:mm A'),
      //     update_on: moment.parseZone(element.updated_at).format('MMM, Do YYYY, hh:mm A')
      //   })
      // });
      const res = response?.data?.data?.results.map(element => ({
        subject: element?.subject,
        priority:
          element?.priority === 1
            ? "Low"
            : element?.priority === 2
            ? "Medium"
            : element?.priority === 3
            ? "High"
            : element?.priority === 4
            ? "Urgent"
            : "",
        Status: returnStatus(element.status),
        source: returnSource(element?.source),
        date_created: moment.parseZone(element.created_at).format('MMM, Do YYYY, hh:mm A'),
        update_on: moment.parseZone(element.updated_at).format('MMM, Do YYYY, hh:mm A')
      }));
      
      setReports(res);
    }

    } catch (error) {
      console.log(error);
      setList([]);
      setLoading(false);
    }
    setLoading(false);
  };

  const tableColumns = [
    {
      title: 'No',
      dataIndex: 'id',
      render: (_, record, index) => <div>{index + 1}</div>
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      render: (_, record) => <div>{record?.subject}</div>
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      render: (_, record) => <div>{record?.priority === 1 ? "Low" : record?.priority === 2 ? "Medium" : record?.priority === 3 ? "High" : record?.priority === 4 ? "Urgent" : ""}</div>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (_, record) => <div>{Status.filter(x => x.value === record.status)[0].name}</div>
    },
    {
      title: 'Source',
      dataIndex: 'source',
      render: (_, record) => (
        <span>
          {returnSource(record?.source)}
        </span>
      )
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
      title: 'Date Updated',
      dataIndex: 'updated_at',
      render: (_, record) => (
        <span>
          {moment.parseZone(record.updated_at).format('MMM, Do YYYY, hh:mm A')}
        </span>
      )
    },
    {
      title: 'TAT',
      dataIndex: 'updated_at',
      render: (_, record) => {
        const createdAt = moment(record.created_at);  // Parse 'created_at'
        const updatedAt = moment(record.updated_at);  // Parse 'updated_at'
        
        // Calculate the difference in milliseconds
        const duration = moment.duration(updatedAt.diff(createdAt));
  
        // Show difference in days, hours, and minutes
        let tatString = '';
        
        if (duration.days() > 0) {
          tatString = `${duration.days()} day${duration.days() > 1 ? 's' : ''}`;
        }
        if (duration.hours() > 0) {
          tatString += (tatString ? ', ' : '') + `${duration.hours()} hour${duration.hours() > 1 ? 's' : ''}`;
        }
        if (duration.minutes() > 0) {
          tatString += (tatString ? ', ' : '') + `${duration.minutes()} minute${duration.minutes() > 1 ? 's' : ''}`;
        }
        if (tatString === '') {
          tatString = 'Less than a minute';  // If the difference is too small
        }
  
        return <span>{tatString}</span>;
      }
    },  
    {
      title: 'View',
      dataIndex: 'action',
      render: (_, record) => (<>
        <span style={{ cursor: 'pointer', color: 'green' }} onClick={() => history.push(`/tickets/details/${record.id}`)}><EyeOutlined /></span></>),
    },
  ];

  const onSearch = (e) => {
    setStatus(e);
    fetchTickets(e, 1);
  };

  useEffect(() => {
    fetchTickets(5, page);
  }, [page]);

  return (
    <>
      <h2 className='mb-5'>Complain Tickets</h2>
    <Card  style={{ backgroundColor: 'whitesmoke' }}>
    <div className='container'>
          <div className='row'>
            <div className='col-md-3'>
              <div className='form-group'>
                <label>Select Status</label>
                <Select
                defaultValue={status}
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
              <label>Total Pages</label>
              <Input value={total} disabled />
            </div>
            <div className='col-md-2'>
              <label>Goto next page</label>
              <Input type='number'
              onChange={(e) => setPage(e.target.value)}
            
              onKeyDown={(e) => e.key === 'Enter' && setPage(e.target.value)}
              className='mr-3'
            />
            </div>
            <div className='col-md-2'>
              <br />
              <ExportCSV csvData={reports} fileName={`Complains_report_${moment().format('YYYY-MM-DD hh:mm:ss tt')}`} />
            </div>
          </div>
        </div>
    </Card>
      <Card>
      

        <div className='table-responsive' style={{ overflow: 'auto' }}>
          <Table
            columns={tableColumns}
            dataSource={list}
            loading={loading}
            onChange={(pagination, _, sort) => fetchTickets(status, pagination.current + 1)}
            rowKey='id'
          />
        </div>
      </Card>
    </>
  );
};

export default ComplainTickets;
