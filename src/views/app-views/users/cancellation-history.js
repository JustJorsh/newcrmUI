import React, { useState, useEffect } from 'react'
import { Row, Card, Table, Modal } from 'antd';
import moment from 'moment';

const Cancellation = ({ initialValues, onClose }) => {

  const [record, setRecord] = useState([]);

  useEffect(() => {
    setRecord(initialValues);
  }, [initialValues])
  
  if (initialValues?.length == 0) return null



  return (
    <Modal
      title={'Cancellation History'}
      visible
      closable
      footer={null}
      width={750}
      destroyOnClose
      onCancel={onClose}
    >
      <div>
        <>
          <div className="container">
            <Card>
              <div className='table-responsive'>
                <Table
                  columns={[
                    {
                      title: 'Policy Number',
                      dataIndex: 'policyNumber',
                      render: (_, record) => <span>{record?.policyNumber}</span>,
                    },
                    {
                      title: 'Period of Cover',
                      dataIndex: 'periodofCover',
                      render: (_, record) => <span>{record?.periodofCover}</span>,
                    },
                    {
                      title: 'Nature of Claim',
                      dataIndex: 'natureofClaim',
                      render: (_, record) => <span>{record?.natureofClaim}</span>,
                    },
                    {
                      title: 'Reason',
                      dataIndex: 'reason',
                      render: (_, record) => <span>{record?.reason}</span>,
                    },
                    {
                      title: 'Amount Payable',
                      dataIndex: 'netAmountPayable',
                      render: (_, record) => (
                        <span>
                          {Number(record?.netAmountPayable || 0).toLocaleString()}
                        </span>
                      ),
                    },
                    {
                      title: 'Beneficiary Bank',
                      dataIndex: 'beneficiaryBank',
                      render: (_, record) => (
                        <span>
                          {record?.beneficiaryBank || ""}
                        </span>
                      ),
                    },
                    {
                      title: 'Date of Payment',
                      dataIndex: 'dateofPayment',
                      render: (_, record) => (
                        <span>
                          {moment.parseZone(record?.ExpiryDate || record?.EXPIRY_DATE).format('MMM, Do YYYY')}
                        </span>
                      ),
                    }
                  ]}
                  dataSource={record}
                  rowKey='id'
                  rowSelection={false}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </Card>
          </div>
        </>
      </div>
    </Modal>
  )
}

export default Cancellation
