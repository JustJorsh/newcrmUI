import React, { useState, useEffect } from 'react'
import { Card, PageHeader, message, Table } from 'antd';
import AxiosClient from 'services/AxiosClient';
import { useParams, useHistory} from 'react-router-dom';
import { ExportCSV } from '../reports/ExportCSV'
import Flex from 'components/shared-components/Flex'
import moment from 'moment';

const TicketDetails = () => {
  const params = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false)
  const [ticket, setTicket] = useState([]);

  function returnRating(sts) {
    switch (sts) {
      case 103:
        return 'Extremely Satisfied';
      case 102:
        return 'Very Satisfied';
      case 101:
        return 'Satisfied';
      case 100:
        return 'Neither satisfied nor dissatisfied';
      case -101:
        return 'Dissatisfied';
      case -102:
        return 'Very Dissatisfied';
      case -103:
        return 'Extremely Dissatisfied';
    }
  }

  const fetchRating = async () => {
    const hide = message.loading("Fetching")
    try {
      const client = await AxiosClient();
      const response = await client.get(`customers/freshdesk/satisfaction/rating`);
      console.log(response);
      setTicket(response?.data?.data);
    } catch (error) {
      console.error(error)
      setTicket([])
    }
    hide()
  }

  useEffect(() => {
    fetchRating();
  }, []);

  const ratingColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Feedback',
      dataIndex: 'feedback',
      render: (_, record) => <div>{record?.feedback}</div>,
      sorter: true,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      render: (_, record) => <div>{returnRating(record?.ratings?.default_question)}</div>,
      sorter: true,
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
    }
  ];

  return (
    <>
      <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
      <h2 className='mb-5'>Survey Rating</h2>
        <PageHeader onBack={history.goBack} subTitle=" " />
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
          </div>
        </Flex>
        <div>
          <ExportCSV csvData={ticket} fileName={`Survery_rating_${moment().format('YYYY-MM-DD hh:mm:ss tt')}`} />
        </div>
      </Flex>
      <Card>
        <div className='table-responsive' style={{ overflow: 'auto' }}>
          <Table
            columns={ratingColumns}
            dataSource={ticket}
            loading={loading}
            rowKey='id'
          />
        </div>
      </Card>
    </>
  )
}

export default TicketDetails
