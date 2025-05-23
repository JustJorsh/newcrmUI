import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Button,
  Card,
  Avatar,
  Dropdown,
  Table,
  Menu,
  Tag,
  Select, Input
} from 'antd';
import { apexLineChartDefaultOption, COLOR_2 } from 'constants/ChartConstant';
import Flex from 'components/shared-components/Flex';
import { withRouter } from 'react-router-dom';
import ActivityReport from 'views/app-views/users/activity-report';
import UserCountReport from 'views/app-views/users/user-count';
import GeneralReport from 'views/app-views/users/general-policy';
import LifeReport from 'views/app-views/users/life-policy';
import AxiosClient from 'services/AxiosClient';
import { useHistory } from 'react-router-dom';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import Loading from 'components/shared-components/Loading';
import moment from 'moment';

const report_dates = [2022, 2023, 2024, 2025, 2026, 2027]
const memberChartOption = {
  ...apexLineChartDefaultOption,
  ...{
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    colors: [COLOR_2],
  },
};

export const DefaultDashboard = () => {
  const history = useHistory();
  const [statusReport, setStatusReport] = useState([]);
  const [priorityReport, setPriorityReport] = useState([]);
  const [userStat, setUserStats] = useState({});
  const [policylife, setPolicylife] = useState(0);
  const [policygeneral, setPolicyGeneral] = useState(0);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userCount, setuserCount] = useState([])
  const [year, SetYear] = useState(moment().format("YYYY"));


  const getStatusReport = async () => {
    try {
      const client = await AxiosClient();
      const response = await client.get('dashboard/freshdesk/status');
      console.log(response.data.data);
      setStatusReport(response.data.data);
    } catch (error) {
      setStatusReport([]);
    }
  };

  const getPriorityReport = async () => {
    try {
      const client = await AxiosClient();
      const response = await client.get('dashboard/freshdesk/priority');
      setPriorityReport(response.data.data);
    } catch (error) {
      setPriorityReport([]);
    }
  };

  const getUserStats = async () => {
    try {
      const client = await AxiosClient();
      const response = await client.get(`dashboard/users/count`);
      setUserStats(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };


  const getUserStats2 = async () => {
    try {
      const client = await AxiosClient();
      const response = await client.get(`customers/count_per_month`);
      console.log("count", response?.data?.data);
      setuserCount(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getPolicyLife = async () => {
    try {
      const client = await AxiosClient();
      const response = await client.get('dashboard/policy/life/count');
      console.log(response.data.data);
      setPolicylife(response.data.data);
    } catch (error) {
      setPolicylife(0);
    }
  };

  const getPolicyGeneral = async () => {
    try {
      const client = await AxiosClient();
      const response = await client.get('dashboard/policy/general/count');
      console.log(response.data.data);
      setPolicyGeneral(response.data.data);
    } catch (error) {
      setPolicyGeneral(0);
    }
  };

  const getReport = async () => {
    try {
      const client = await AxiosClient();
      const response = await client.get('dashboard/freshdesk/date');
      console.log("freshdesk", response);
      setReports(response.data.data?.slice(0, 12));
    } catch (error) {
      setReports([]);
    }
  };

  const getEverything = async () => {
    setLoading(true);
    Promise.all([
      getPolicyLife(),
      getPolicyGeneral(),
      getPriorityReport(),
      getStatusReport(),
      getUserStats(),
      getReport(),
      getUserStats2(),
    ]).then(() => setLoading(false));
  };

  useEffect(() => {
    getPolicyLife();
    getPolicyGeneral();
    getPriorityReport();
    getStatusReport();
    getUserStats();
    getReport();
    getUserStats2();
  }, []);

  return loading ? (
    <Loading cover='content' />
  ) : (
    <div style={{ backGroundColor: 'whitesmoke' }}>
      <Row gutter={12}>
        <Col xs={24} sm={12} md={12} lg={6} xl={6} onClick={() =>
            history.push(
              `/users?cnfk=1`
            )
          } style={{ cursor: 'pointer' }}>
          <StatisticWidget
            title={'CUSTOMERS (HGI)'}
            value={Number(userStat?.[0]?.count || 0).toLocaleString()}
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6} onClick={() =>
            history.push(
              `/users?cnfk=2`
            )
          } style={{ cursor: 'pointer' }}>
          <StatisticWidget
            title={'CUSTOMERS (HLA)'}
            value={Number(userStat?.[1]?.count || 0).toLocaleString()}
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6} onClick={() =>
            history.push(
              `/policy?cnfk=1`
            )
          } style={{ cursor: 'pointer' }}>
          <StatisticWidget
            title={'POLICY (HGI)'}
            value={Number(policygeneral || 0).toLocaleString()}
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6} onClick={() =>
            history.push(
              `/policy?cnfk=2`
            )
          } style={{ cursor: 'pointer' }}>
          <StatisticWidget
            title={'POLICY (HLA)'}
            value={Number(policylife || 0).toLocaleString()}
          />
        </Col>
      </Row>
      <Flex alignItems='center' justifyContent='between' mobileFlex={false}>
        <Flex
          lassName='mr-md-3 mb-3'
          alignItems='center'
          key='search containers'
          mobileFlex={false}
        >
        </Flex>
        <div className='row'>
          <div className='col-md-12'>
            <div className='form-group'>
              <label>Select year</label>
              <Select
                defaultValue='2023'
                style={{ width: '100%' }}
                onChange={(e) => SetYear(e)} 
                >
                {
                  report_dates.map(elm => (
                    <Select.Option value={elm} key={elm}>
                      {elm}
                    </Select.Option>
                  ))
                }
              </Select>
            </div>
          </div>
        </div>
      </Flex>

      <Row gutter={16}>
        <Col xs={24}>
          {
            userCount?.data != null ? <UserCountReport propReport={userCount} year={+year} /> : ""
          }
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24}>
          <GeneralReport year={+year} />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24}>
          <LifeReport year={+year} />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24}>
          <ActivityReport />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={12} sm={12} md={12} lg={12}>
          <Card title='Freshdesk By Status'>
            <Table
              className='no-border-last'
              columns={[
                { title: 'Status', dataIndex: 'status' },
                {
                  title: 'Count',
                  dataIndex: 'count',
                },
              ]}
              onRow={(r) => ({
                onClick: () => history.push(`/tickets/${r.status}`),
              })}
              dataSource={statusReport}
              rowKey='count'
              loading={loading}
              pagination={false}
              style={{ cursor: 'pointer' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <Card title='Freshdesk By Priority'>
            <Table
              className='no-border-last'
              columns={[
                { title: 'Priority', dataIndex: 'priority' },
                {
                  title: 'Count',
                  dataIndex: 'count',
                },
              ]}
              dataSource={priorityReport}
              rowKey='count'
              loading={loading}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default withRouter(DefaultDashboard);
