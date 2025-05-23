import React, { useState, useEffect } from 'react'
import { Row, Card, Table, Modal } from 'antd';
import moment from 'moment';

const MissedPremium = ({ initialValues, onClose }) => {

  const [record, setRecord] = useState([]);

  useEffect(() => {
    setRecord(initialValues);
  }, [initialValues])
  if (initialValues?.length == 0) return null


  return (
    <Modal
      title={'Missed Premium'}
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
                      title: 'INSTALLMENT NO',
                      dataIndex: 'INSTALLMENT_NO',
                      render: (_, record) => <span>{record?.INSTALLMENT_NO}</span>,
                    },
                    {
                      title: 'INST.AMOUNT',
                      dataIndex: 'INST_AMOUNT',
                      render: (_, record) => <span>{record?.INST_AMOUNT}</span>,
                    },
                    {
                      title: 'STATUS',
                      dataIndex: 'STATUS',
                      render: (_, record) => <span>{record?.STATUS}</span>,
                    },
                    {
                      title: 'DUE_DATE',
                      dataIndex: 'DUE_DATE',
                      render: (_, record) => (
                        <span>
                          {moment.parseZone(record?.DUE_DATE).format('MMM, Do YYYY')}
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

export default MissedPremium
