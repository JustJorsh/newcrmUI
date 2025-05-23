import React, { useState, useEffect } from 'react'
import { Row, Col, Card, PageHeader, message, Table } from 'antd';
import AxiosClient from 'services/AxiosClient';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons';

import Flex from 'components/shared-components/Flex'
import moment from 'moment';

const TicketDetails = () => {
  const params = useParams();
  const history = useHistory();


  const [loading, setLoading] = useState(false)
  const [notification, setMessage] = useState()
  const [ticket, setTicket] = useState({});

  const fetchTicketById = async () => {
    const hide = message.loading("Fetching")
    try {
      const client = await AxiosClient();
      const response = await client.get(`customers/freshdesk/ticketbyid/${params.id}`);
      console.log(response);
      setTicket(response?.data?.data);
    } catch (error) {
      console.error(error)
      setTicket({})
    }
    hide()
  }

  useEffect(() => {
    fetchTicketById();
  }, []);

  const attachmentColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (_, record) => <div>{record?.name}</div>,
      sorter: true,
    },
    {
      title: 'Date Created',
      dataIndex: 'created_at',
      render: (_, record) => (
        <span>
          {moment.parseZone(record.created_at).format('MMM, Do YYYY, hh:mm A')}
        </span>
      ),
      sorter: true,
    },
    {
      title: 'Date Updated',
      dataIndex: 'updated_at',
      render: (_, record) => (
        <span>
          {moment.parseZone(record.updated_at).format('MMM, Do YYYY, hh:mm A')}
        </span>
      ),
      sorter: true,
    },
    {
      title: 'View',
      dataIndex: 'action',
      render: (_, record) => (<>
        <span style={{ cursor: 'pointer', color: 'green' }} onClick={() => ViewDocuments(record?.attachment_url)}><EyeOutlined /></span></>),
    },
  ];

  const ViewDocuments = async (file) => {
    window.open(file, '_blank', 'noopener,noreferrer');
  }

  return (
    <>
      <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
        <PageHeader onBack={history.goBack} subTitle=" " />
        <div className="mb-2">
          {/* <Button
            onClick={() => setMessage(loan?.user)}
            size="small"
            className="ml-2"
          >Message User</Button> */}
        </div>
      </Flex>
      <div className="container">
        <Card title="Customer Information">
          <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
            <Col className="gutter-row" span={6}>
              <p>FULL NAME</p>
              <span className="font-weight-semibold">{ticket?.requester?.name}</span>
            </Col>
            <Col className="gutter-row" span={6}>
              <p>PHONE NUMBER</p>
              <span className="font-weight-semibold">{ticket?.requester?.mobile || ticket?.requester?.phone}</span>
            </Col>
            <Col className="gutter-row" span={6}>
              <p>EMAIL ADDRESS</p>
              <span className="font-weight-semibold">{ticket?.requester?.email}</span>
            </Col>
          </Row>
        </Card>
        <Card title="Ticket Details">
          <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
            <Col className="gutter-row" span={6}>
              <p>Subject</p>
              <span className="font-weight-semibold">{ticket?.subject}</span>
            </Col>
            <Col className="gutter-row" span={6}>
              <p>Type</p>
              <span className="font-weight-semibold">{ticket?.type}</span>
            </Col>
            <Col className="gutter-row" span={6}>
              <p>Created On</p>
              <span className="font-weight-semibold">{moment.parseZone(ticket?.created_at).format('MMM, Do YYYY, hh:mm A')}</span>
            </Col>
            <Col className="gutter-row" span={6}>
              <p>Escalated</p>
              <span className="font-weight-semibold">{ticket?.is_escalated == false ? "No" : "Yes"}</span>
            </Col>
          </Row>
        </Card>
        <Card title="Ticket Status">
          <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
            <Col className="gutter-row" span={6}>
              <p>Pending Since</p>
              <span className="font-weight-semibold">{moment.parseZone(ticket?.stats?.pending_since).format('MMM, Do YYYY, hh:mm A') || ""}</span>
            </Col>
            <Col className="gutter-row" span={6}>
              <p>First Responded Time</p>
              <span className="font-weight-semibold">{moment.parseZone(ticket?.stats?.first_responded_at).format('MMM, Do YYYY, hh:mm A') || ""}</span>
            </Col>
            <Col className="gutter-row" span={6}>
              <p>Requester responded Time</p>
              <span className="font-weight-semibold">{moment.parseZone(ticket?.stats?.requester_responded_at).format('MMM, Do YYYY, hh:mm A') || ""}</span>
            </Col>
            <Col className="gutter-row" span={6}>
              <p>Agent Responded Time</p>
              <span className="font-weight-semibold">{moment.parseZone(ticket?.stats?.agent_responded_at).format('MMM, Do YYYY, hh:mm A') || ""}</span>

            </Col>
            <Col className="gutter-row" span={6}>
              <p>Resolved Time</p>
              <span className="font-weight-semibold">{moment.parseZone(ticket?.stats?.resolved_at).format('MMM, Do YYYY, hh:mm A') || ""}</span>

            </Col>
            <Col className="gutter-row" span={6}>
              <p>Closed On</p>
              <span className="font-weight-semibold">{moment.parseZone(ticket?.stats?.closed_at).format('MMM, Do YYYY, hh:mm A') || ""}</span>
            </Col>
          </Row>
        </Card>
        <Card title="Mail Trail">
          <div className="table-responsive">
            <div dangerouslySetInnerHTML={{ __html: ticket?.description }} />
          </div>
        </Card>

        <Card title="To Email">
          <div className="table-responsive">
            {ticket?.to_emails != undefined ? ticket?.to_emails.map((item, i) => (
              <div key={i} className="font-weight-semibold">{item}</div>
            )) : ""}
          </div>
        </Card>
        <Card title="Ticket CC Email">
          <div className="table-responsive">
            {ticket?.ticket_cc_emails != undefined ? ticket?.ticket_cc_emails.map((item, i) => (
              <div key={i} className="font-weight-semibold">{item}</div>
            )) : ""}
          </div>
        </Card>
        <Card title="CC Email">
          <div className="table-responsive">
            {ticket?.cc_emails != undefined ? ticket?.cc_emails.map((item, i) => (
              <div key={i} className="font-weight-semibold">{item}</div>
            )) : ""}
          </div>
        </Card>
        <Card title="Reply CC Email">
          <div className="table-responsive">
            {ticket?.reply_cc_emails != undefined ? ticket?.reply_cc_emails.map((item, i) => (
              <div key={i} className="font-weight-semibold">{item}</div>
            )) : ""}
          </div>
        </Card>
        <Card title="Attachements">
          <div className="table-responsive">
            {/* { ticket?.attachments != undefined ? ticket?.attachments.map((item, i) => (
              <div  key={i} className="font-weight-semibold">{item.name}</div>
            )) : ""} */}
            <div className='table-responsive'>
              <Table
                columns={[
                  {
                    title: 'ID',
                    dataIndex: 'id',
                  },
                  {
                    title: 'Name',
                    dataIndex: 'name',
                    render: (_, record) => <div>{record?.name}</div>,
                    sorter: true,
                  },
                  {
                    title: 'Date Created',
                    dataIndex: 'created_at',
                    render: (_, record) => (
                      <span>
                        {moment.parseZone(record.created_at).format('MMM, Do YYYY, hh:mm A')}
                      </span>
                    ),
                    sorter: true,
                  },
                  {
                    title: 'Date Updated',
                    dataIndex: 'updated_at',
                    render: (_, record) => (
                      <span>
                        {moment.parseZone(record.updated_at).format('MMM, Do YYYY, hh:mm A')}
                      </span>
                    ),
                    sorter: true,
                  },
                  {
                    title: 'View',
                    dataIndex: 'action',
                    render: (_, record) => (<>
                      <span style={{ cursor: 'pointer', color: 'green' }} onClick={() => ViewDocuments(record?.attachment_url)}><EyeOutlined /></span></>),
                  },
                ]}
                dataSource={ticket?.attachments}
                rowKey='id'
                rowSelection={false}
                loading={loading}
                style={{ cursor: 'pointer' }}
                pagination={false}
              />
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}

export default TicketDetails
