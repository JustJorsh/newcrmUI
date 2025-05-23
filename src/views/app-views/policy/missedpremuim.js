import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button } from 'antd';
import AxiosClient from 'services/AxiosClient';

const PolicyList = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(0);

    const fetchPolicy = async (page, limit) => {
        setLoading(true);
        try {
            const client = await AxiosClient();
            let response = await client.get(`customers/missed-premuim/${page}/${limit}`);
            console.log(response?.data?.data)
            setList(response?.data?.data?.data);
            setTotal(response?.data?.data.totalRecords);
        } catch (error) {
            setList([]);
        }
        setLoading(false);
    };


    const tableColumns = [
        {
            title: 'Customer Name',
            dataIndex: 'insuredName',
            render: (_, record) => <span>{record?.insuredName}</span>,
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber',
            render: (_, record) => <span>{record?.phoneNumber}</span>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: (_, record) => <span>{record?.email}</span>,
        },
        {
            title: 'Policy Number',
            dataIndex: 'policyNo',
            render: (_, record) => <span>{record?.policyNo}</span>,
        },
        {
            title: 'Policy Name',
            dataIndex: 'productName',
            render: (_, record) => <span>{record?.productName}</span>,
        },
        {
            title: 'Premium',
            dataIndex: 'premium',
            render: (_, record) => <span>{Number(record?.premium).toLocaleString() || 0}</span>,
        },
        {
            title: 'Premium Frequency',
            dataIndex: 'PremiumFrequency',
            render: (_, record) => (
                <span>
                    {record?.PremiumFrequency}
                </span>
            ),
        },
        {
            title: 'EffectiveDate',
            dataIndex: 'effectiveDate',
            render: (_, record) => (
                <span>
                    {record?.effectiveDate}
                </span>
            ),
        },
        {
            title: 'ExpiryDate',
            dataIndex: 'expiryDate',
            render: (_, record) => (
                <span>
                    {record?.expiryDate}
                </span>
            ),
        },
        {
            title: 'cumm.missed_premium',
            dataIndex: 'cummulative_missed_premium',
            render: (_, record) => (
                <span>
                    {Number(record?.cummulative_missed_premium).toLocaleString()}
                </span>
            ),
        }
    ];

    const viewRecord = () => {
        console.log("ijiji")
        fetchPolicy(page, limit);
    }

    useEffect(() => {
        fetchPolicy(1, 50);
    }, []);

    return (
        <>
            <h2 className='mb-5'>Missed Premium</h2>
            <Card style={{ backgroundColor: 'whitesmoke' }}>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-2'>
                            <label>Total Records</label>
                            <Input value={total} disabled />
                        </div>
                        <div className='col-md-2'>
                            <label>Goto next page</label>
                            <Input type='number'
                                onChange={(e) => setPage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && setPage(e.target.value)}
                                className='mr-3'
                            />
                        </div>
                        <div className='col-md-2'>
                            <label>Limit Per Page</label>
                            <Input type='number'
                                onChange={(e) => setLimit(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && setLimit(e.target.value)}
                                className='mr-3'
                            />
                        </div>
                        <div className='col-md-3'>
                            <br/>
                            <Button className="mr-3" onClick={() => viewRecord()} type="primary">View</Button>
                        </div>
                    </div>
                </div>
            </Card>
            <Card>
                <div className='table-responsive' style={{ overflow: 'auto', marginTop: '30px' }}>
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

export default PolicyList;
