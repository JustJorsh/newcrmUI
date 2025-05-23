import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Card, Row, Col } from 'antd';
import {  useHistory,  useParams, useLocation } from 'react-router-dom';
import { AUTH_TOKEN } from 'redux/constants';
import { setAccount } from 'redux/actions';
import { authorized, signinuser } from 'redux/features/authSlice';

const backgroundStyle = {
  backgroundImage: 'url(/img/others/img-11.jpg)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
};

const Authorized = (props) => {
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const emp = query.get("emp") || "";
  const token = query.get("token") || "";

  const onLogin = async () => {
    setLoading(true);
    try {
      console.log(emp, token);
      const response = emp != "" ? await dispatch(authorized({ token:emp })) : token != "" ? await dispatch(signinuser({ token })) : null;
      const { error, payload } = response;

     if (error) throw new Error(error?.message);
      
     const result =  payload?.data?.response;
     console.log("result", result);
      localStorage.setItem(AUTH_TOKEN, payload?.data?.token);
      localStorage.setItem('COMPANY_NAME', result.cname);
      localStorage.setItem('COMPANY_ID', result.cnamefk);
      localStorage.setItem('CRM_StaffName', `${result.firstname} ${result.lastname}`);

      // localStorage.setItem(AUTH_TOKEN, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzeXN0ZW0uc2V0dGluZ0BoZWlyc2hvbGRpbmdzLmNvbSIsIlRva2VuSWQiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKVmMyVnlibUZ0WlNJNklrRmtiV2x1TGtobGFYSnpJaXdpVTJWemMybHZia2xrSWpvaVpqa3lOREkwTVRBdFkySTFOQzAwWm1RNExUaGhNVFV0TnpJMU1qZ3hNREF6TlRBM0lpd2lURzluYVc1RVlYUmxJam9pTVRJdk1qTXZNakF5TkNBMU9qQTFPakkxSUZCTklDc3dNVG93TUNJc0lrTnZiWEJoYm5sSlpDSTZJakVpTENKQ2NtRnVZMmhKWkNJNklqSWlMQ0p1WW1ZaU9qRTNNelE1TmprNU1qVXNJbVY0Y0NJNk1UY3pOVEExTmpNeU5YMC5BWE1qX1A4blZHSXI4c1ExSHFOa09mWThSLTRJYkpmWGwzSkJHU202cS1rIiwiU2Vzc2lvbklEIjoiZjkyNDI0MTAtY2I1NC00ZmQ4LThhMTUtNzI1MjgxMDAzNTA3IiwiaWF0IjoxNzM0OTY5OTI1LCJleHAiOjE3MzUwNDE5MjV9.UBMg7H2Kio04svFoTfdAfVuLPW3yv0lU93GQqSctn00");
      // localStorage.setItem('COMPANY_NAME', "Test Company");
      // localStorage.setItem('COMPANY_ID', '2');
      // localStorage.setItem('CRM_StaffName', `System Settings`);
     history.push('/dashboard');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage(
        error.response?.data?.message ||
          error.response?.statusText ||
          error.message ||
          'Seems like something went wrong with your request. Please try again.'
      );
    }
  };

  useEffect(() => {
    onLogin();
  }, [])

  if (message) setTimeout(() => setMessage(null), 3000);
  return (
    <div className='h-100'>
      <div className='container d-flex flex-column justify-content-center h-100'>
        <Row justify='center'>
          <Col xs={20} sm={20} md={20} lg={7}>
            <Card>
              <div className='mt-4 mb-5'>
                <div className='text-center'>
                </div>
                <Row justify='center'>
                  <Col xs={24} sm={24} md={20} lg={20}>
                    <>
                    <h3>Processing</h3>
                  </>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  setAccount,
};

export default connect(null, mapDispatchToProps)(Authorized);
