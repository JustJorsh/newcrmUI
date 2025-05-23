import React, { useState, useEffect } from 'react';
import { Card, Table, Select, Input, Button, Badge, Menu, Tag, Rate } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import AxiosClient from 'services/AxiosClient';
import { useHistory, useParams } from 'react-router-dom';


const SurveyList = () => {
  const history = useHistory();
  const params = useParams();
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(10);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(3);
  const [tickets, setTickets] = useState([]);

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

  function getRating(data) {
    let rating = "";
    data.forEach(element => {
      rating = rating + returnRating(element) + ",";
    });

    return rating.trimEnd(',');
  }

  const fetchSurvey = async () => {
    setLoading(true);
    try {
      const client = await AxiosClient();
      const response = await client.get(`customers/freshdesk/survey/active`);
      setList(response?.data?.data);
    } catch (error) {
      setList([]);
      setLoading(false);
    }
    setLoading(false);
  };

  const tableColumns = [
    {
      title: 'Title',
      dataIndex: 'title'
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
      title: 'View',
      dataIndex: 'action',
      render: (_, record) => (<>
        <span style={{ cursor: 'pointer', color: 'green' }} onClick={() => history.push(`/survey/rating/${record.id}`)}><EyeOutlined /></span></>),
    },
  ];

  const questiontableColumns = [
    {
      title: 'Question',
      dataIndex: 'question',
      render: (_, record) => (
        <span>
          {record?.label}
        </span>
      )
    },
    {
      title: 'Accepted Ratings',
      dataIndex: 'accepted_rating',
      render: (_, record) => (
        <span>
          {getRating(record?.accepted_ratings)}
        </span>
      )
    }
  ];

  const expandedRowRender = (record, index, indent, expanded) => {
    console.log(`record, index, indent, expanded`, record, index, indent, expanded);
    return <Table columns={questiontableColumns} dataSource={record?.questions} pagination={false} />;
  };

  useEffect(() => {
    fetchSurvey();
  }, []);

  return (
    <>
      <Card>
        <h2 className='mb-5'>Survey</h2>
        <div className='table-responsive' style={{ overflow: 'auto' }}>
          <Table
            columns={tableColumns}
            expandable={{ expandedRowRender }}
            dataSource={list}
            loading={loading}
            rowKey='id'
          />
        </div>
      </Card>
    </>
  );
};

export default SurveyList;
