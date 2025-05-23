import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Button, Form, Input, Alert, Card, Row, Col } from 'antd';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { AUTH_TOKEN } from 'redux/constants';
import { setAccount } from 'redux/actions';
import { authorized } from 'redux/features/authSlice';


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
  const token = query.get("emp") || "";


  const onLogin = async () => {
    setLoading(true);
    try {
      console.log(query.get('emp'));
      console.log("...1login 2")

      const response = await dispatch(authorized({ token: query.get('emp') }));
      const { error, payload } = response;
      console.log("payload", response);
      if (error) throw new Error(error?.message);
      localStorage.setItem(AUTH_TOKEN, payload.data.token);
      localStorage.setItem('COMPANY_NAME', payload.data.cname);
      localStorage.setItem('COMPANY_ID', payload.data.cnamefk);
      //history.push('/dashboard');
      // setLoading(false);
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
    console.log(token);
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
