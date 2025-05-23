import React, { useState } from 'react';
import { Card, Table, Button, message } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import Flex from 'components/shared-components/Flex'
import AddDocumentsModal from './addPhoneCall';


const UploadPhoneCalls = () => {
    const history = useHistory();
    const params = useParams();
    const [list, setList] = useState([]);
    // const [page, setPage] = useState(1);
    // const [total, setTotal] = useState(10);
    const [loading, setLoading] = useState(false);
    const [addDoc, setAddDoc] = useState();

    const fetchDocuemnts = async (data) => {
        message.info("Upload finished");
        if (data)
            message.info(data?.message);
        setList(data?.data);
    };

    const tableColumns = [
        {
            title: 'CallerNumber',
            dataIndex: 'CallerNumber',
        },
        {
            title: 'StartTime',
            dataIndex: 'StartTime',
            render: (_, record) => <div>{record?.StartTime}</div>,
        },
        {
            title: 'AnswerTime',
            dataIndex: 'AnswerTime',
            render: (_, record) => <div>{record?.AnswerTime}</div>,
        },
        {
            title: 'EndTime',
            dataIndex: 'EndTime',
            render: (_, record) => <div>{record?.EndTime}</div>,
        },
        {
            title: 'Disposition',
            dataIndex: 'Disposition',
            render: (_, record) => <div>{record?.Disposition}</div>,
        },
        {
            title: 'LogUserfield',
            dataIndex: 'LogUserfield',
            render: (_, record) => <div>{record?.LogUserfield}</div>,
        }
    ];

    return (
        <>
            <Card>
                <h2 className='mb-5'>Upload Phone Call</h2>
                <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                    <Flex className="mb-1" mobileFlex={false}>
                        <div className="mr-md-3 mb-3">
                        </div>
                    </Flex>
                    <div>
                        <Button onClick={() => setAddDoc({ add: true })} type="primary" >Upload Document</Button>
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

export default UploadPhoneCalls;
