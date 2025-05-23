import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input } from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import AxiosClient from 'services/AxiosClient';
import Flex from 'components/shared-components/Flex'
import moment from "moment";

const UploadDocuments = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addDoc, setAddDoc] = useState();

    const fetchDocuemnts = async (phone) => {
        setLoading(true);
        try {
            const client = await AxiosClient();
            const response = await client.get(`customers/user-documents/${phone}`);
            console.log(response?.data?.data)
            let data = [];
            data.push(response?.data?.data)
            setList(data);
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
            title: 'Customer Name',
            dataIndex: 'customerName',
            render: (_, record) => <div>{record?.firstName} {record?.lastName}</div>,
            sorter: true,
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            render: (_, record) => <div>{record?.gender}</div>,
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: (_, record) => <div>{record?.email}</div>,
            sorter: true,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            render: (_, record) => <div>{record?.phone}</div>,
            sorter: true,
        },
        {
            title: 'DOB',
            dataIndex: 'dob',
            render: (_, record) => <div>{moment(record?.dob).format("YYYY-MM-DD")}</div>,
            sorter: true,
        },
        {
            title: 'Photo',
            dataIndex: 'photo',
            render: (_, record) => (
                <span style={{ cursor: 'pointer', color: 'green' }} onClick={() => ViewDocuments(record?.photoUrl)}><EyeOutlined /></span>

            )
        },
        {
            title: 'Id Card',
            dataIndex: 'idcard',
            render: (_, record) => (
                <span style={{ cursor: 'pointer', color: 'green' }} onClick={() => ViewDocuments(record?.idCardImgUrl)}><EyeOutlined /></span>

            )
        },
        {
            title: 'utility',
            dataIndex: 'utility',
            render: (_, record) => (
                <span style={{ cursor: 'pointer', color: 'green' }} onClick={() => ViewDocuments(record?.utilityImgUrl)}><EyeOutlined /></span>

            )
        },
        {
            title: 'Signature',
            dataIndex: 'signature',
            render: (_, record) => (
                <span style={{ cursor: 'pointer', color: 'green' }} onClick={() => ViewDocuments(record?.signatureUrl)}><EyeOutlined /></span>

            )
        }
    ];

    const onSearch = (e) => {
        fetchDocuemnts(e.currentTarget.value)
    };

    return (
        <>
            <Card>
                <h2 className='mb-5'>Documents</h2>
                <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                    <Flex className="mb-1" mobileFlex={false}>
                        <div className="mr-md-3 mb-3">
                            <span>Search by phone number</span>
                            <Input placeholder="Search by phone number" prefix={<SearchOutlined />} onChange={e => onSearch(e)} />
                        </div>
                    </Flex>
                </Flex>
                <div className="table-responsive">
                    <Table
                        columns={tableColumns}
                        dataSource={list}
                        loading={loading}
                        rowKey='_id'
                    />
                </div>
            </Card>
          
        </>
    );
};

export default UploadDocuments;
