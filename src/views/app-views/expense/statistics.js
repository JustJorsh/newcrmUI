import React, { useState, useEffect } from 'react';
import { Card, Table, Select, Input, Row, Col, Collapse } from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import Flex from 'components/shared-components/Flex';
import AxiosClient from 'services/AxiosClient';
import YearPayment from './year-report';
import MonthPayment from './month-report';
import { useHistory, useParams } from 'react-router-dom';
import StatisticWidget from 'components/shared-components/StatisticWidget';

const ExpenseStatistics = () => {
    const history = useHistory();
    const params = useParams();
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(10);
    const [loading, setLoading] = useState(false);
    const [query_value, setQueryValue] = useState('');
    const [status, setStatus] = useState({});
    const { Panel } = Collapse;


    const fetchStatusCount = async (id) => {
        setLoading(true);
        try {
            const client = await AxiosClient();
            const response = await client.get(`dashboard/expense/status/${id}/claims`)
            const result = response?.data?.data;
            const paid = result.filter(x => x.status == "Paid")[0]?.count || 0;
            const approved = result.filter(x => x.status == "Approved")[0]?.count || 0;
            const pending = result.filter(x => x.status != "Paid" && x.status != "Approved")[0]?.count || 0;
            const total = paid + approved + pending;
            setStatus({ total, paid, approved, pending });
        } catch (error) {
            setStatus([]);
            setLoading(false);
        }
        setLoading(false);
    };

    const onChange = (key) => {
        console.log(key);
    };
    const onSearch = (e) => {
        console.log(e);
        setStatus(e);
    };

    const getSelectedCompany = (id) => {
        fetchStatusCount(id);
    }

    const getSelectedYear = (id) => {
        fetchStatusCount(id);
    }

    useEffect(() => {
        const cnfk = parseInt(localStorage.getItem('COMPANY_ID')) == 19 ? '1' : parseInt(localStorage.getItem('COMPANY_ID')) == 20 ? '1' : parseInt(localStorage.getItem('COMPANY_ID')) == 50 ? '2' : 0;
        fetchStatusCount(cnfk);
    }, []);

    return (
        <>
            <Card>
                <h2 className='mb-5'>Claims Statistics</h2>
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
                                <label>Select Company</label>
                                <Select
                                    defaultValue='1'
                                    style={{ width: '100%' }}
                                    onChange={(e) => getSelectedCompany(e)}
                                >
                                    <Select.Option value='1' key='insurance'>
                                        Heirs General
                                    </Select.Option>
                                    <Select.Option value='2' key='life insurance'>
                                        Heirs Life Assurance
                                    </Select.Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </Flex>
                <br />
                <Row gutter={12}>
                    <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                        <StatisticWidget
                            title={'TOTAL'}
                            value={Number(status?.total || 0).toLocaleString()}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                        <StatisticWidget
                            title={'PAID'}
                            value={Number(status?.paid || 0).toLocaleString()}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                        <StatisticWidget
                            title={'APPROVED'}
                            value={Number(status?.approved || 0).toLocaleString()}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                        <StatisticWidget
                            title={'PENDING'}
                            value={Number(status?.pending || 0).toLocaleString()}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col xs={12}>
                        <YearPayment CN={`HGI`} CNFK={20} />
                    </Col>
                    <Col xs={12}>
                        <YearPayment CN={`HLA`} CNFK={50} />
                    </Col>
                </Row>
                <Collapse defaultActiveKey={['1']} onChange={onChange}>
                    <Panel header="Monthly Payment Graph" key="1">
                        <p>
                            {/* <Flex alignItems='center' justifyContent='between' mobileFlex={false}>
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
                                            <label>Select Year</label>
                                            <Select
                                                defaultValue='1'
                                                style={{ width: '100%' }}
                                                onChange={(e) => getSelectedYear(e)}
                                            >
                                                <Option value='2022' key='2022'>
                                                    2022
                                                </Option>
                                                <Option value='2021' key='2021'>
                                                    2021
                                                </Option>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </Flex> */}
                            <Row gutter={16}>
                                <Col xs={24}>
                                    <MonthPayment CN={`HGI`} CNFK={20} YEAR={2023} />
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col xs={24}>
                                    <MonthPayment CN={`HLA`} CNFK={50} YEAR={2023} />
                                </Col>
                            </Row>
                        </p>
                    </Panel>
                </Collapse>
            </Card>
        </>
    );
};

export default ExpenseStatistics;
