import React, { useState, useEffect } from 'react';
import { Card, Table, Select, Input, Menu } from 'antd';
import {
  EyeOutlined,
  SearchOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import Flex from 'components/shared-components/Flex';
import moment from 'moment';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from 'redux/features/userSlice';

const { Option } = Select;


const Users = () => {
  let cnfk = parseInt(localStorage.getItem('COMPANY_ID')) == 19 ? '1' : parseInt(localStorage.getItem('COMPANY_ID')) == 20 ? '1' : parseInt(localStorage.getItem('COMPANY_ID')) == 50 ? '2' : 0;
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  let query = useQuery();
  if(query.get("cnfk") != null) cnfk =query.get("cnfk");
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    loading,
    data: users,
    error,
  } = useSelector((state) => state.users.users);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [companyId, setCompanyId] = useState(cnfk);
  const [email, setEmail] = useState('');
  const [policyNumber, setPolicyNumber] = useState();
  const [mobile, setMobile] = useState('');


  const tableColumns = [
    {
      title: 'CustomerNo',
      dataIndex: 'CustomerNo',
    },
    {
      title: 'Company',
      dataIndex: 'CompanyId',
      render: (_, record) => (
        <span>
          {record?.CompanyId == 2 ? 'Heirs Life Assurance' : 'Heirs General'}
        </span>
      )
    },
    {
      title: 'Customer Name',
      dataIndex: 'Name',
    },
    {
      title: 'Customer Type',
      dataIndex: 'CustomerType',
      render: (_, record) => (
        <span>
          {record?.CompanyId == 2 && record?.CustomerType == 124 ? 'Indivdual' : record?.CompanyId == 2 && record?.CustomerType == 171 ? 'Company' :
          record?.CompanyId == 1 && record?.CustomerType == 124 ? 'Indivdual' : record?.CompanyId == 1 && record?.CustomerType == 143 ? 'Company' : ''
          }
        </span>
      )
    },
    { title: 'Email', dataIndex: 'Email'},
    { title: 'Phone Number', dataIndex: 'Phone' },
    { title: 'Mobile', dataIndex: 'Mobile' },
    {
      title: 'Date Joined',
      dataIndex: 'StartDate',
      render: (_, record) => (
        <span>
          {moment.parseZone(record.CreationDate).format('YYYY-MM-DD')}
        </span>
      )
    },
    {
      title: 'Customer for',
      dataIndex: 'StartDate',
      render: (_, record) => (
        <span>
          {`${moment().diff( moment(record.CreationDate), "day" )} days`}
        </span>
      )
    }
  ];

  const handlePageChange = (page, rows = 10) => {
    page && setPage(page);
    rows && setRows(rows);
  };

  const getCompnay = (e) => {
    console.log(e);
  };

  useEffect(() => {
    dispatch(
      getUsers({
        pageNumber: page,
        rows,
        cId: query.get("cnfk") || companyId,
        email,
        mobile,
        policyNumber
      })
    );
    // setTotal(users?.Data?.length / rows);
  }, [dispatch, page, rows, companyId, email, mobile, policyNumber]);

  return (
    <>
     <div className="row">
          <div className="col-md-12">
            <h2>Customers List</h2>
          </div>
        </div>
      <Card>
       
        <Flex alignItems='center' justifyContent='between' mobileFlex={false}>
          <Flex
            lassName='mr-md-3 mb-3'
            alignItems='center'
            key='search containers'
            mobileFlex={false}
          >
            <Input
              placeholder='Search email'
              prefix={<SearchOutlined />}
              onInput={(e) =>
                e.currentTarget.value === '' && setEmail(e.target.value)
              }
              onKeyDown={(e) => e.key === 'Enter' && setEmail(e.target.value)}
              className='mr-3'
            />
            <Input
              placeholder='Search mobile'
              prefix={<SearchOutlined />}
              onInput={(e) =>
                e.currentTarget.value === '' && setMobile(e.target.value)
              }
              onKeyDown={(e) => e.key === 'Enter' && setMobile(e.target.value)}
            />
             <Input
              placeholder='Search policy number'
              prefix={<SearchOutlined />}
              onInput={(e) =>
                e.currentTarget.value === '' && setPolicyNumber(e.target.value)
              }
              onKeyDown={(e) => e.key === 'Enter' && setPolicyNumber(e.target.value)}
            />
          </Flex>
          <div className='row'>
            <div className='col-md-12'>
              <div className='form-group'>
                <Select
                  defaultValue={companyId}
                  style={{ width: '100%' }}
                  onChange={(e) => setCompanyId(e)}
                >
                  <Option value='1' key='insurance'>
                    Heirs General
                  </Option>
                  <Option value='2' key='life insurance'>
                    Heirs Life Assurance
                  </Option>
                </Select>
              </div>
            </div>
          </div>
        </Flex>
      
        <div className='table-responsive' style={{ overflow: 'auto' }}>
          <Table
            columns={tableColumns}
            dataSource={users.Data}
            loading={loading}
            style={{ cursor: 'pointer' }}
            onRow={(r) => ({
              onClick: () => history.push(`/users/${r.ID}`),
            })}
            pagination={{
              position: 'bottomRight',
              onChange: (page, pageSize) => handlePageChange(page, pageSize),
              total: users?.TotalRecords,
              hideOnSinglePage: true,
              current: page,
            }}
          />
        </div>
      </Card>
    </>
  );
};

export default Users;
