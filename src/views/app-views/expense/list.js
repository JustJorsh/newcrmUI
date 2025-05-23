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

const Expense = () => {
    const history = useHistory();
    const params = useParams();
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(10);
    const [loading, setLoading] = useState(false);
    const [query_value, setQueryValue] = useState('');
    const [status, setStatus] = useState({});
    const { Panel } = Collapse;

    const fetchExpense = async (id) => {
        setLoading(true);
        try {
            const client = await AxiosClient();
            const response = await client.get(`customers/pending-expense/${id}/claims`)
            setList(response?.data?.data);
            //   setTotal(response.data.data.page_info.total);
            //   setPage(response.data.data.page_info.page);
        } catch (error) {
            setList([]);
            setLoading(false);
        }
        setLoading(false);
    };

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

    const tableColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Title',
            dataIndex: 'title',
            render: (_, record) => <div>{record?.title}</div>,
            sorter: true,
        },
        { title: 'Initiator', dataIndex: 'initiator' },
        {
            title: 'Amount',
            dataIndex: 'totalamount',
            render: (_, record) => <div>{Number(record?.totalamount || 0).toLocaleString()}</div>,
            sorter: true,
        },
        {
            title: 'Created On',
            dataIndex: 'datecreated',
            render: (_, record) => <div>{record?.datecreated}{" "}{record?.timecreated}</div>,
            sorter: true,
        },
        { title: 'Status', dataIndex: 'status' },
        { title: 'Approver', dataIndex: 'approver' },
        { title: 'Approver Date', dataIndex: 'approver_created_on_date' },

        // {
        //     title: 'View',
        //     dataIndex: 'action',
        //     render: (_, record) => (<>
        //         <span style={{ cursor: 'pointer', color: 'green' }} onClick={() => history.push(`/tickets/details/${record.id}`)}><EyeOutlined /></span></>),
        // },
    ];

    const onChange = (key) => {
        console.log(key);
    };
    const onSearch = (e) => {
        console.log(e);
        setStatus(e);
    };

    const getSelectedCompany = (id) => {
        fetchExpense(id);
        fetchStatusCount(id);
    }

    const getSelectedYear = (id) => {
        fetchExpense(id);
        fetchStatusCount(id);
    }

    useEffect(() => {
        const cnfk = parseInt(localStorage.getItem('COMPANY_ID')) == 19 ? '1' : parseInt(localStorage.getItem('COMPANY_ID')) == 20 ? '1' : parseInt(localStorage.getItem('COMPANY_ID')) == 50 ? '2' : 0;
        fetchExpense(cnfk);
        fetchStatusCount(cnfk);
    }, []);

    return (
        <>
            <Card>
               
                <Flex alignItems='center' justifyContent='between' mobileFlex={false}>
                    <Flex
                        lassName='mr-md-3 mb-3'
                        alignItems='center'
                        key='search containers'
                        mobileFlex={false}
                    >
                        {/* <Input
                            placeholder='Search title'
                            prefix={<SearchOutlined />}
                            onInput={(e) =>
                                e.currentTarget.value === '' && setMobile(e.target.value)
                            }
                            onKeyDown={(e) => e.key === 'Enter' && setMobile(e.target.value)}
                        /> */}
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
                                        Heirs Insurance
                                    </Select.Option>
                                    <Select.Option value='2' key='life insurance'>
                                        Heirs Life Assurance
                                    </Select.Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </Flex>
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

                <h2 className='mb-5'>Pending Claims Payments</h2>

                <div className='table-responsive' style={{ overflow: 'auto' }}>
                    <Table
                        columns={tableColumns}
                        dataSource={list}
                        loading={loading}
                        rowKey='id'
                    />
                </div>
            </Card>
        </>
    );
};

export default Expense;
