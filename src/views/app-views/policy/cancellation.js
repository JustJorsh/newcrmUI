import React, { useState, useEffect } from 'react';
import { Card, Table, Select, Button, Input } from 'antd';
import moment from 'moment';
import AxiosClient from 'services/AxiosClient';
import { useHistory } from 'react-router-dom';

const Cancellation = () => {
    const history = useHistory();
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(100);
    const [date, setDate] = useState('null');
    const [loading, setLoading] = useState(false);
    const [query_value, setQueryValue] = useState('');
    const [nature, setNature] = useState("null")

    const fetchCancellation = async (pageNo, nature, download, date_on) => {
        setLoading(true);
        try {
            const client = await AxiosClient();
            const response = await client.get(`customers/all-cancellation/${pageNo}/${nature}/${date_on}/${download}`);
            console.log(response?.data?.data?.data)
            setList(response?.data?.data?.data);
            setPage(pageNo);
        } catch (error) {
            setList([]);
            setLoading(false);
        }
        setLoading(false);
    };

    const downloadDocument = async (nature) => {
        setLoading(true);
        try {
            window.open(`https://crmbackend.services.heirslifeassurance.com/customers/all-cancellation/1/${nature}/${date}/1`, '_blank', 'noopener,noreferrer');
        } catch (error) {
            setLoading(false);
        }
        setLoading(false);
    };

    function closedStatus(data) {
        let statusHistory = data.statusHistory;

        let memoAcceptedDate = "";
        for (const key in statusHistory) {
            if (statusHistory[key].status === "Memo Accepted") {
                memoAcceptedDate = statusHistory[key].date;
                break;
            }
        }

        return memoAcceptedDate
    }
    const tableColumns = [
        {
            title: 'Customer',
            dataIndex: 'name',
            render: (_, record) => <span>{record?.eskaCustomerInfo?.Name}</span>,
        },
        {
            title: 'Policy Number',
            dataIndex: 'policyNumber',
            render: (_, record) => <span>{record?.policyNumber}</span>,
        },
        {
            title: 'Policy Name',
            dataIndex: 'policyName',
            render: (_, record) => <span>{record?.policyName}</span>,
        },
        {
            title: 'Nature of Claim',
            dataIndex: 'claimType',
            render: (_, record) => <span>{record?.claimType}</span>,
        },
        {
            title: 'Claims Number',
            dataIndex: 'claimNumber',
            render: (_, record) => <span>{record?.claimNumber}</span>,
        },
        {
            title: 'Reason',
            dataIndex: 'description',
            render: (_, record) => <span>{record?.description}</span>,
        },
        // {
        //     title: 'Amount Payable',
        //     dataIndex: 'netAmountPayable',
        //     render: (_, record) => (
        //         <span>
        //             {Number(record?.netAmountPayable || 0).toLocaleString()}
        //         </span>
        //     ),
        // },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (_, record) => (
                <span>
                    {record?.status}
                </span>
            ),
        },
        {
            title: 'Date of Incident',
            dataIndex: 'dateOfIncident',
            render: (_, record) => (
                <span>
                    {moment(record?.dateOfIncident).format("YYYY-MM-DD")}
                </span>
            ),
        },
        {
            title: 'Closed Date',
            dataIndex: 'dateOfIncident',
            render: (_, record) => (
                <span>
                    {closedStatus(record)}
                </span>
            ),
        }
    ];

    useEffect(() => {
        fetchCancellation(page, nature, 0, date);
    }, [nature, date]);

    return (
        <>
            <h2 className='mb-5'>Cancellation History</h2>
            <Card style={{ backgroundColor: 'whitesmoke' }}>
                <div className="row" >
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Select reason</label>
                            <Select
                                style={{ width: '100%' }}
                                onChange={(e) => setNature(e)}
                            >
                                <Select.Option value='Surrender' key='Surrender'>
                                    Surrender
                                </Select.Option>
                                <Select.Option value='Partial Withdrawal' key='Partial Withdrawal'>
                                    Partial Withdrawal
                                </Select.Option>
                                <Select.Option value='Cancellation' key='Cancellation'>
                                    Cancellation
                                </Select.Option>
                            </Select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Select Date</label>
                            <Input type='date'
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label></label>
                            <br />
                            <Button onClick={() => downloadDocument(`${nature}`)} type="primary">Download</Button>
                        </div>
                    </div>
                </div>

            </Card>
            <Card>

                <div className='table-responsive' style={{ overflow: 'auto', marginTop: '20px' }}>
                    <Table
                        columns={tableColumns}
                        dataSource={list}
                        // onChange={(pagination, _, sort) => fetchCancellation(pagination.current + 1, "null", 0)}
                        // pagination={{ total }}
                        loading={loading}
                        rowKey='_id'
                    />
                </div>
            </Card>
        </>
    );
};

export default Cancellation;
