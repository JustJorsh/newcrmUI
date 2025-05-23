import React, { useState, useEffect } from 'react';
import { Card, Table, Select, Input, Button, Menu, Radio } from 'antd';
import { EyeOutlined, SearchOutlined, FileExcelOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import AxiosClient from 'services/AxiosClient';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import ViewDocumentModal from '../users/viewDocuments';
import StatementModel from '../users/statement';
import Flex from 'components/shared-components/Flex';

const PolicyList = () => {
    let cnfk = parseInt(localStorage.getItem('COMPANY_ID')) === 19 ? '1' : parseInt(localStorage.getItem('COMPANY_ID')) === 20 ? '1' : parseInt(localStorage.getItem('COMPANY_ID')) === 50 ? '2' : 0;

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }
    let query = useQuery();
    if (query.get("cnfk") != null) cnfk = query.get("cnfk");
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(10);
    const [loading, setLoading] = useState(false);
    const [companyId, setCompanyId] = useState(cnfk);
    const [status, setStatus] = useState("1");
    const [policyNumber, setPolicyNumber] = useState('');
    const [period, setPeriod] = useState('');
    const [viewDocument, setViewDocument] = useState();
    const [statement, setStatement] = useState();
    const [fromDate, setFromDate] = useState("null")
    const [toDate, setToDate] = useState("null");

    const fetchPolicy = async (pageNo, status, policyNo, expireNO, download) => {
        setLoading(true);
        try {
            const client = await AxiosClient();
            let company = companyId === '1' ? 'general' : 'life';
            let policyNumber = policyNo === 'null' ? '' : policyNo
            let response = await client.get(`/customers/all-policies?pageNo=${pageNo}&policyNumber=${policyNumber}&company=${company}&expiring=${expireNO}`);
            let result = response?.data.data?.data
            setList(result);
            if (result.length > 0) {
                setTotal(100);
                setPage(pageNo);
            }
        } catch (error) {
            setList([]);
            console.log(error)
            setTotal(0);
            setLoading(false);
        }
        setLoading(false);
    };

    const fetchDocument = async (record) => {
        try {
            setLoading(true);
            const client = await AxiosClient();
            const response = await client.get(`customers/document/${record?.CompanyID}/${record?.SegmentCode}/${record?.ClassID}`);
            setViewDocument(response?.data?.data?.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            return '';
        }
        setLoading(false);
    };

    const ViewDocuments = async (file) => {
        window.open(file, '_blank', 'noopener,noreferrer');
    }

    const fetchStatement = async (record) => {
        setLoading(true);
        try {
            const client = await AxiosClient();
            const response = await client.get(`customers/statement/life/${record?.SegmentCode}`);
            setStatement(response?.data?.data);
        } catch (error) {
            setStatement();
        }
        setLoading(false);
    };

    const generalMissedPremuim = async (row) => {
        try {
            console.log(row);
            const client = await AxiosClient();
            const response = await client.get(`customers/missed-premium/life/${row?.id}`);
            console.log(response)
        } catch (error) {
            return '';
        }
    };

    const dropdownMenu = (row) => (
        <Menu>
            {
                (companyId) === 1 ?
                    <Menu.Item key='1'>
                        <Flex alignItems='center'>
                            <EyeOutlined />
                            <span className='ml-2' onClick={() => fetchDocument(row)}>View Document</span>
                        </Flex>
                    </Menu.Item> : ""
            }
            {
                (companyId) === 2 ?
                    <Menu.Item key='2'>
                        <Flex alignItems='center'>
                            <EyeOutlined />
                            <span className='ml-2' onClick={() => fetchStatement(row)}>View Statement</span>
                        </Flex>
                    </Menu.Item> : ""
            }
            {
                (companyId) === 2 ?
                    <Menu.Item key='2'>
                        <Flex alignItems='center'>
                            <EyeOutlined />
                            <span className='ml-2' onClick={() => window.open(row?.NOTE, '_blank', 'noopener,noreferrer')}>View Note</span>
                        </Flex>
                    </Menu.Item> : ""
            }
            {/* {
            (user?.CompanyId || customer?.CompanyId) === 2 ?
              <Menu.Item key='3'>
                <Flex alignItems='center'>
                  <EyeOutlined />
                  <span className='ml-2' onClick={() => fetchCancellationHistory(row)}>View Cancellation History</span>
                </Flex>
              </Menu.Item> : ""
          } */}
            {
                (companyId) === 2 ?
                    <Menu.Item key='1'>
                        <Flex alignItems='center'>
                            <EyeOutlined />
                            <span className='ml-2' onClick={() => generalMissedPremuim(row)}>Missed Premium</span>
                        </Flex>
                    </Menu.Item> : ""
            }
        </Menu>
    );

    const tableColumns = [
        {
            title: 'Customer Name',
            dataIndex: 'Customer_Name',
            render: (_, record) => <span>{record?.Customer_Name}</span>,
        },
        {
            title: 'Policy Number',
            dataIndex: 'Policy_Number',
            render: (_, record) => <span>{record?.Policy_Number}</span>,
        },
        {
            title: 'Policy Name',
            dataIndex: 'Policy_Name',
            render: (_, record) => <span>{record?.Policy_Name}</span>,
        },
        {
            title: 'Premium',
            dataIndex: 'periodic_premium',
            render: (_, record) => <span>{record?.periodic_premium}</span>,
        },
        {
            title: 'EffectiveDate',
            dataIndex: 'effective_date',
            render: (_, record) => (
                <span>
                    {moment
                        .parseZone(record?.effective_date)
                        .format('MMM, Do YYYY')}
                </span>
            ),
        },
        {
            title: 'ExpiryDate',
            dataIndex: 'expiry_date',
            render: (_, record) => (
                <span>
                    {moment.parseZone(record?.expiry_date).format('MMM, Do YYYY')}
                </span>
            ),
        },
        {
            title: 'Account Officer',
            dataIndex: 'account_officer',
            render: (_, record) => (
                <span>
                    {record?.Account_Officer}
                </span>
            ),
        },
        {
            title: 'Acc.Officer.NO',
            dataIndex: 'account_officer',
            render: (_, record) => (
                <span>
                    {record?.AgentPhoneNumber}
                </span>
            ),
        },
        {
            title: 'Pay Frequency',
            dataIndex: 'payment_frequency',
            render: (_, record) => (
                <span>
                    {record?.payment_frequency}
                </span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'policy_status',
            render: (_, record) => <span>{moment(record?.expiry_date).isAfter(new Date()) ? "Active" : "Expired"}</span>,
        },
        // {
        //     title: '',
        //     dataIndex: 'actions',
        //     render: (_, elm) => (
        //         <div className='text-right' onClick={(e) => e.stopPropagation()}>
        //             <EllipsisDropdown menu={dropdownMenu(elm)} />
        //         </div>
        //     ),
        // }
    ];

    const downloadDocument = async () => {
        setLoading(true);
        try {
            const url = companyId === 1 ? `https://crmbackend.services.heirslifeassurance.com/customers/general-policies/${page}/${status}/${policyNumber}/${period}/${fromDate}/${toDate}/1` : companyId === 2 ? `https://crmbackend.services.heirslifeassurance.com/customers/life-policies/${page}/${status}/${policyNumber}/${period}/${fromDate}/${toDate}/1` : "";
            window.open(url, '_blank', 'noopener,noreferrer');

        } catch (error) {
            setLoading(false);
        }
        setLoading(false);
    };

    const onChange = (e) => {
        setPeriod(e.target.value);
        fetchPolicy(page, status, policyNumber, e.target.value, 0);
    };

    const viewRecord = () => {
        console.log("ijiji")
        fetchPolicy(page, status, policyNumber, period, 0);
    }

    useEffect(() => {
        fetchPolicy(page, status, policyNumber, period, 0);
    }, [companyId]);

    return (
        <>
            <h2 className='mb-5'>Policies</h2>
            <Card style={{ backgroundColor: 'whitesmoke' }}>
                <Flex alignItems='center' justifyContent='between' mobileFlex={false}>
                    <Flex
                        lassName='mr-md-3 mb-3'
                        alignItems='center'
                        key='search containers'
                        mobileFlex={false}
                    >
                        <div className="form-group mr-3">
                            <label>Company</label>
                            <Select
                                defaultValue={companyId}
                                style={{ width: '100%' }}
                                onChange={(e) => setCompanyId(e)}
                            >
                                <Select.Option value='1' key='insurance'>
                                    Heirs General
                                </Select.Option>
                                <Select.Option value='2' key='life insurance'>
                                    Heirs Life Assurance
                                </Select.Option>
                            </Select>
                        </div>
                        {/* <div className="form-group mr-3">
                            <label>Status</label>
                            <Select
                                defaultValue={status}
                                style={{ width: '100%' }}
                                onChange={(e) => setStatus(e)}
                            >
                                <Select.Option value='1' key='active'>
                                    Active
                                </Select.Option>
                                <Select.Option value='0' key='not active'>
                                    Not Active
                                </Select.Option>
                            </Select>
                        </div> */}
                        {/* <div className="form-group mr-3">
                            <label>From Date</label>
                            <Input
                                type="date"
                                onChange={(e) => setFromDate(e.target.value)}
                            /></div>
                        <div className="form-group mr-3">
                            <label>To Date</label>
                            <Input
                                type="date"
                                onChange={(e) => setToDate(e.target.value)} />
                        </div> */}
                        <div className="form-group mr-3">
                            <label>Policy Due Date(days)</label>
                            <Input
                                placeholder="Enter due period(days)"
                                prefix={<SearchOutlined />}
                                onChange={(e) => setPeriod(e.target.value)}
                            />
                        </div>
                        <div className="form-group mr-3">
                            <label>Policy number</label>
                            <Input
                                placeholder="Enter policy number"
                                prefix={<SearchOutlined />}
                                onChange={(e) => setPolicyNumber(e.target.value)}
                            />
                        </div>
                        <Button className="mr-3" onClick={() => viewRecord()} type="primary">View</Button>
                        {/* {
                            companyId === '1' ?
                                <div className="form-group">
                                    <label>Policy due date</label><br/>
                                    <Radio.Group onChange={onChange} value={period} optionType="button"
                                        buttonStyle="solid">
                                        <Radio value={30}>30</Radio>
                                        <Radio value={60}>60</Radio>
                                        <Radio value={90}>90</Radio>
                                    </Radio.Group>
                                </div> : ""
                        } */}
                    </Flex>

                    {/* <Button onClick={() => downloadDocument()}> <FileExcelOutlined />Export</Button> */}
                </Flex>

            </Card>
            <Card>
                <div className='table-responsive' style={{ overflow: 'auto', marginTop: '30px' }}>
                    <Table
                        columns={tableColumns}
                        dataSource={list}
                        onChange={(pagination, _, sort) => fetchPolicy(pagination.current + 1, status, policyNumber, period, 0)}
                        loading={loading}
                    />
                </div>
            </Card>
            <ViewDocumentModal
                initialValues={viewDocument}
                onClose={() => setViewDocument()} />
            <StatementModel
                initialValues={statement}
                onClose={() => setStatement()} />
        </>
    );
};

export default PolicyList;
