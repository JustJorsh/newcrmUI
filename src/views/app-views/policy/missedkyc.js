import React, { useState, useEffect } from 'react';
import { Card, Table } from 'antd';
import AxiosClient from 'services/AxiosClient';
import ViewDocumentModal from '../users/viewDocuments';
import StatementModel from '../users/statement';


const PolicyList = () => {
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(100);
    const [loading, setLoading] = useState(false);
    const [viewDocument, setViewDocument] = useState();
    const [statement, setStatement] = useState();


    const fetchPolicy = async () => {
        setLoading(true);
        try {
            const client = await AxiosClient();
            let response = await client.get(`customers/missed-kyc`);   
            console.log(response?.data?.data)
            setList(response?.data?.data);
        } catch (error) {
            setList([]);
        }
        setLoading(false);
    };



    const tableColumns = [
        {
            title: 'Customer ID',
            dataIndex: 'customerID',
            render: (_, record) => <span>{record?.customerID}</span>,
        },
        {
            title: 'Customer Name',
            dataIndex: 'customerName',
            render: (_, record) => <span>{record?.customerName}</span>,
        },
        {
            title: 'Customer Phone',
            dataIndex: 'customerPhone',
            render: (_, record) => <span>{record?.customerPhone}</span>,
        },
        {
            title: 'Customer Address',
            dataIndex: 'customerAddress',
            render: (_, record) => <span>{record?.customerAddress}</span>,
        },
        {
            title: 'Customer Email',
            dataIndex: 'customerEmail',
            render: (_, record) => (
                <span>
                   {record?.customerEmail}
                </span>
            ),
        },
        {
            title: 'Customer Type',
            dataIndex: 'customerType',
            render: (_, record) => <span>{record?.customerType}</span>,
        },
    ];

    useEffect(() => {
        fetchPolicy();
    }, []);

    return (
        <>
            <h2 className='mb-5'>Missed KYC</h2>
          
            <Card>
                <div className='table-responsive' style={{ overflow: 'auto', marginTop: '30px' }}>
                    <Table
                        columns={tableColumns}
                        dataSource={list}
                        loading={loading}
                        rowKey='customerID'
                    />
                </div>
            </Card>
        </>
    );
};

export default PolicyList;
