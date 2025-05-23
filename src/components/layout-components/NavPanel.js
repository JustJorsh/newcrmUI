import React, { Component } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Drawer, Menu } from 'antd';
import ThemeConfigurator from './ThemeConfigurator';
import { connect } from 'react-redux';

export class NavPanel extends Component {
  constructor() {
    super();
    this.state = { visible: false };
    this.showDrawer = () => {
      this.setState({
        visible: true,
      });
    };

    this.onClose = () => {
      this.setState({
        visible: false,
      });
    };
  }

  render() {
    return (
      <>
        <Menu mode='horizontal'>
          <Menu.Item onClick={this.showDrawer} key='navPanel'>
            <SettingOutlined className='nav-icon mr-0' />
          </Menu.Item>
        </Menu>
        <Drawer
          title='Theme Config'
          placement='right'
          width={350}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <ThemeConfigurator />
        </Drawer>
      </>
    );
  }
}

const mapStateToProps = ({ theme }) => {
  const { locale } = theme;
  return { locale };
};

export default connect(mapStateToProps)(NavPanel);
