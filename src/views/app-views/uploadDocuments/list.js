import React, { useState, useEffect } from 'react';
import { Card, Table, Select, Input, Button, Badge, Menu, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import AxiosClient from 'services/AxiosClient';
import { useHistory, useParams } from 'react-router-dom';
import Flex from 'components/shared-components/Flex'
import AddDocumentsModal from  './add';

const UploadDocuments = () => {
    const history = useHistory();
    const params = useParams();
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(10);
    const [loading, setLoading] = useState(false);
    const [query_value, setQueryValue] = useState('');
    const [addDoc, setAddDoc] = useState();

    const fetchDocuemnts = async () => {
        setLoading(true);
        try {
            const client = await AxiosClient();
            const response = await client.get(`customers/get-general-document`);
            // console.log(response?.data?.data?.data)
            setList(response?.data?.data?.data);
            //   setTotal(response.data.data.page_info.total);
            //   setPage(response.data.data.page_info.page);
        } catch (error) {
            setList([]);
            setLoading(false);
        }
        setLoading(false);
    };

    const ViewDocuments = async (file) => {
        window.open(file, '_blank', 'noopener,noreferrer');
      }

    const tableColumns = [
        {
            title: 'Customer ID',
            dataIndex: 'customerId',
        },
        {
            title: 'Customer Name',
            dataIndex: 'customerName',
            render: (_, record) => <div>{record?.customerName}</div>,
            sorter: true,
        },
        {
            title: 'Policy Name',
            dataIndex: 'policyName',
            render: (_, record) => <div>{record?.policyName}</div>,
            sorter: true,
        },
        {
            title: 'Policy No',
            dataIndex: 'policyNumber',
            render: (_, record) => <div>{record?.policyNumber}</div>,
            sorter: true,
        },
        {
            title: 'View',
            dataIndex: 'document',
            render: (_, record) => (
                <span style={{ cursor: 'pointer', color: 'green' }} onClick={() => ViewDocuments(record?.documentLinks)}><EyeOutlined /></span>  
             
            )
        }
    ];

    const onSearch = (e) => {
        console.log(e);
    };

    useEffect(() => {
       fetchDocuemnts();
    }, []);

    return (
        <>
            <Card>
                <h2 className='mb-5'>Upload Documents</h2>
                <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                    <Flex className="mb-1" mobileFlex={false}>
                        <div className="mr-md-3 mb-3">
                        </div>
                    </Flex>
                    <div>
                        <Button onClick={() => setAddDoc({ add: true })} type="primary" >Add Documents</Button>
                    </div>
                </Flex>
                <div className="table-responsive">
                    <Table
                        columns={tableColumns}
                        dataSource={list}
                        loading={loading}
                        rowKey='id'
                    />
                </div>
            </Card>
            <AddDocumentsModal
        initialValues={addDoc}
        onClose={() => setAddDoc()}
        onFinish={fetchDocuemnts} />
        </>
    );
};

export default UploadDocuments;
