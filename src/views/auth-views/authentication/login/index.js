import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Button, Form, Input, Alert, Card, Row, Col } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import AxiosClient from 'services/AxiosClient';
import { AUTH_TOKEN } from 'redux/constants';
import { setAccount } from 'redux/actions';
import navigationConfig from 'configs/NavigationConfig';
import { doLogin } from 'redux/features/authSlice';
import logo from '../../../../assets/hLogo.png';

const backgroundStyle = {
  backgroundImage: 'url(/img/others/img-11.jpg)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
};

const Login = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);

  const onLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      console.log("...1login")
      const response = await dispatch(doLogin({ email, password }));
      const { error, payload } = response;

      if (error) throw new Error(error?.message);
      localStorage.setItem(AUTH_TOKEN, payload.data.token);
      localStorage.setItem('COMPANY_NAME', payload.data.cname);
      // const permissions = response.data?.data?.role?.permissions.reduce(
      //   (acc, c) => [...acc, c.action],
      //   []
      // );
      // props.setAccount({ ...response.data.data, permissions });
      // let first;
      // for (const menu of navigationConfig(permissions)) {
      //   if (menu.hidden === false) {
      //     first = menu.path;
      //     break;
      //   }
      //   for (const sub of menu.submenu) {
      //     if (sub.hidden === false) {
      //       first = sub.path;
      //       break;
      //     }
      //   }
      //   if (first) break;
      // }
      history.push('/dashboard');
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

  if (message) setTimeout(() => setMessage(null), 3000);
  return (
    <div className='h-100'>
      <div className='container d-flex flex-column justify-content-center h-100'>
        <Row justify='center'>
          <Col xs={20} sm={20} md={20} lg={7}>
            <Card>
              <div className='mt-4 mb-5'>
                <div className='text-center'>
                  <img
                    className='img-fluid'
                    src={logo}
                    style={{
                      height: '100px',
                      objectFit: 'contain',
                      width: '75%',
                    }}
                    alt='heirs insurance logo'
                  />

                  <h3>Log In to Heirs General</h3>
                  <span>Enter your email and password below</span>
                </div>
                <Row justify='center'>
                  <Col xs={24} sm={24} md={20} lg={20}>
                    <>
                      <motion.div
                        initial={{ opacity: 0, marginBottom: 0 }}
                        animate={{
                          opacity: message ? 1 : 0,
                          marginBottom: message ? 20 : 0,
                          marginTop: message ? 20 : 0,
                        }}
                      >
                        <Alert type='error' showIcon message={message}></Alert>
                      </motion.div>
                      <Form
                        layout='vertical'
                        name='login-form'
                        onFinish={onLogin}
                      >
                        <Form.Item
                          name='email'
                          label='Email'
                          rules={[
                            {
                              required: true,
                              message: 'Please input your email',
                            },
                            {
                              type: 'email',
                              message: 'Please enter a validate email!',
                            },
                          ]}
                        >
                          <Input
                            prefix={<MailOutlined className='text-primary' />}
                          />
                        </Form.Item>
                        <Form.Item
                          name='password'
                          label='Password'
                          rules={[
                            {
                              required: true,
                              message: 'Please input your password',
                            },
                          ]}
                        >
                          <Input.Password
                            prefix={<LockOutlined className='text-primary' />}
                          />
                        </Form.Item>
                        <Form.Item>
                          <Button
                            color='#F00002'
                            type='primary'
                            htmlType='submit'
                            style={{
                              background: '#F00002',
                              borderColor: '#F00002',
                              borderRadius: '.75rem',
                              fontSize: '16px',
                              // paddingTop: '20px',
                              paddingBottom: '20px',
                            }}
                            block
                            loading={loading}
                          >
                            {' '}
                            Log In{' '}
                          </Button>
                        </Form.Item>
                      </Form>
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

export default connect(null, mapDispatchToProps)(Login);
