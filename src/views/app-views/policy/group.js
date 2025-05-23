import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, Menu } from 'antd';
import { EyeOutlined, SearchOutlined, FileExcelOutlined } from '@ant-design/icons';
import moment from 'moment';
import AxiosClient from 'services/AxiosClient';
import ViewDocumentModal from '../users/viewDocuments';
import StatementModel from '../users/statement';
import Flex from 'components/shared-components/Flex';
import DetailsModal from './groupDetails';

const GroupPolicyList = () => {
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(100);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("1");
    const [policyNumber, setPolicyNumber] = useState("null");
    const [period, setPeriod] = useState(1);
    const [viewDocument, setViewDocument] = useState();
    const [statement, setStatement] = useState();
    const [details, setDetails] = useState();
    const [fromDate, setFromDate] = useState("null");
    const [toDate, setToDate] = useState("null");

    const fetchPolicy = async (pageNo, policyNo, download) => {
        setLoading(true);
        try {
            const client = await AxiosClient();
            const response = await client.get(`customers/group-policies/${pageNo}/${policyNo}/${fromDate}/${toDate}/${download}`);
            console.log(response?.data?.data?.data)
            setList(response?.data?.data?.data);
            if (response?.data?.data?.data.length > 0) {
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

    const tableColumns = [
        {
            title: 'NAME OF SCHEME',
            dataIndex: 'Name',
            render: (_, record) => <span>{record?.NAME_OF_SCHEME}</span>,
        },
        {
            title: 'SCHEME NO',
            dataIndex: 'SCHEME_NO',
            render: (_, record) => <span>{record?.SCHEME_NO}</span>,
        },
        {
            title: 'NO OF LIVES',
            dataIndex: 'NO_OF_LIVES',
            render: (_, record) => <span>{record?.["NO_OF_LIVES "]}</span>,
        },
        {
            title: 'POLICY START',
            dataIndex: 'POLICY_START',
            render: (_, record) =>
                <span>{record?.["POLICY_START "]}</span>,
        },
        {
            title: 'POLICY END',
            dataIndex: 'POLICY_END',
            render: (_, record) => <span>{record?.["POLICY_END "]}</span>,
        },
        {
            title: 'BROKER',
            dataIndex: 'BROKER',
            render: (_, record) => <span>{record?.BROKER}</span>,
        },
        {
            title: 'HLA_SUM_ASSURED',
            dataIndex: 'HLA_SUM_ASSURED',
            render: (_, record) => <span>{record?.["HLA_SUM_ASSURED "]}</span>,
        },
        // {
        //     title: 'HLA GROSS PREMIUM',
        //     dataIndex: 'HLA_GROSS_PREMIUM',
        //     render: (_, record) => <span>{record?.[" HLA_GROSS_PREMIUM "]}</span>,
        // },
        // {
        //     title: 'NET PREMIUM',
        //     dataIndex: 'NET_PREMIUM',
        //     render: (_, record) => <span>{record?.[" NET_PREMIUM "]}</span>,
        // },
        {
            title: 'ACCOUNT OFFICER',
            dataIndex: 'account_officer',
            render: (_, record) => (
                <span>
                    {(record?.ACCOUNT_OFFICER)}
                </span>
            ),
        },
        {
            title: 'View',
            dataIndex: 'actions',
            render: (_, record) => (
                <span style={{ cursor: 'pointer', color: 'green' }} onClick={() => setDetails(record)}><EyeOutlined /></span>
            ),
        }
    ];

    const downloadDocument = async () => {
        setLoading(true);
        try {
            const url =  `https://crmbackend.services.heirslifeassurance.com/customers/group-policies/${page}/${policyNumber}/${fromDate}/${toDate}/1`;
            window.open(url, '_blank', 'noopener,noreferrer');

        } catch (error) {
            setLoading(false);
        }
        setLoading(false);
    };

    const viewRecord = () => {
        fetchPolicy(page, policyNumber, 0);
    }

    useEffect(() => {
        fetchPolicy(page, policyNumber, 0);
    }, []);

    return (
        <>
            <h2 className='mb-5'>Group Policies</h2>
            <Card style={{ backgroundColor: 'whitesmoke' }}>
                <Flex alignItems='center' justifyContent='between' mobileFlex={false}>
                    <Flex
                        lassName='mr-md-3 mb-3'
                        alignItems='center'
                        key='search containers'
                        mobileFlex={false}
                    >
                        <div className="form-group mr-3">
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
                        </div>
                        <div className="form-group mr-3">
                            <label>Policy number</label>
                            <Input
                                placeholder='Search policy number'
                                prefix={<SearchOutlined />}
                                onInput={(e) =>
                                    e.currentTarget.value === '' && setPolicyNumber(e.target.value)
                                }
                                onKeyDown={(e) => e.key === 'Enter' && setPolicyNumber(e.target.value)}
                            />
                        </div>
                        <div className="form-group mr-3">
                            <br />
                            <Button onClick={() => viewRecord()} type="primary">View</Button></div>
                    </Flex>
                    <br />

                    <Button onClick={() => downloadDocument()}> <FileExcelOutlined />Export</Button>
                </Flex>

            </Card>
            <Card>
                <div className='table-responsive' style={{ overflow: 'auto', marginTop: '30px' }}>
                    <Table
                        columns={tableColumns}
                        dataSource={list}
                        onChange={(pagination, _, sort) => fetchPolicy(pagination.current + 1, status, policyNumber, period, 0)}
                        loading={loading}
                        rowKey='id'
                    />
                </div>
            </Card>
            <ViewDocumentModal
                initialValues={viewDocument}
                onClose={() => setViewDocument()} />
            <StatementModel
                initialValues={statement}
                onClose={() => setStatement()} />
            <DetailsModal
                initialValues={details}
                onClose={() => setDetails()}
            />
        </>
    );
};

export default GroupPolicyList;
