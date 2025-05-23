import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Popconfirm, PageHeader, Button, message, Table, Tag } from 'antd';
import AxiosClient from 'services/AxiosClient';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import Flex from 'components/shared-components/Flex'
import moment from 'moment';

const StatementDetails = (record) => {
  const params = useParams();
  const history = useHistory();

  useEffect(() => {
    
  }, [])

  return (
    <>
      <div className="container">
        <Card title="Customer Information">
          <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
            <Col className="gutter-row" span={6}>
              <p>INSURED NAME</p>
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
        

        <Card title="Policy Detail">
          <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
          <Col className="gutter-row" span={6}>
              <p>NAME</p>
              <span className="font-weight-semibold">{record?.productName}</span>
            </Col>
            <Col className="gutter-row" span={6}>
              <p>PREMIUM</p>
              <span className="font-weight-semibold">{record?.premium}</span>
            </Col>
            <Col className="gutter-row" span={6}>
              <p>PREMIUM AMOUNT</p>
              <span className="font-weight-semibold">{record?.premiumAmount}</span>
            </Col>
            <Col className="gutter-row" span={6}>
              <p>PREMIUM FREQUENCY</p>
              <span className="font-weight-semibold">{record?.PremiumFrequency}</span>
            </Col>
            <Col className="gutter-row" span={6}>
              <p>PREMIUM POSITION</p>
              <span className="font-weight-semibold">{record?.PremiumPosition}</span>
            </Col>
            <Col className="gutter-row" span={6}>
              <p>EFFECTIVE DATE</p>
              <span className="font-weight-semibold">{moment.parseZone(record?.effectiveDate).format('MMM, Do YYYY, hh:mm A')}</span>
            </Col>
            <Col className="gutter-row" span={6}>
              <p>EXPIRY DATE</p>
              <span className="font-weight-semibold">{moment.parseZone(record?.expiryDate).format('MMM, Do YYYY, hh:mm A')}</span>
            </Col>
            <Col className="gutter-row" span={6}>
              <p>CUMMULATIVE MISSED PREMIUM</p>
              <span className="font-weight-semibold">{record?.cummulative_missed_premium}</span>
            </Col>
          </Row>
        </Card>

        <Card title="Statement Data">
          <div className='table-responsive'>
        <Table
          columns={[
            {
              title: 'Amount',
              dataIndex: 'productName',
              render: (_, record) => <span>{Number(record?.amount).toLocaleString()}</span>,
            },
            {
              title: 'Description',
              dataIndex: 'description',
              render: (_, record) => <span>{record?.description}</span>,
            },
            {
              title: 'Date',
              dataIndex: 'date',
              render: (_, record) =>   <span>
              {moment.parseZone(record.date).format('MMM, Do YYYY')}
            </span>,
            }
          ]}
          dataSource={record?.statementsData}
          rowKey='id'
          rowSelection={false}
          loading={loading}
          style={{ cursor: 'pointer' }}
        />
      </div>
        </Card>
           
    </div>
    </>
  )
}

export default StatementDetails
