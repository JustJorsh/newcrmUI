import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Menu, Layout } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Logo from './Logo';
import NavProfile from './NavProfile';
import { toggleCollapsedNav, onMobileNavToggle } from 'redux/actions';
import {
  NAV_TYPE_TOP,
  SIDE_NAV_COLLAPSED_WIDTH,
  SIDE_NAV_WIDTH,
} from 'constants/ThemeConstant';
import utils from 'utils';

const { Header } = Layout;

export const HeaderNav = (props) => {
  const {
    navCollapsed,
    mobileNav,
    navType,
    headerNavColor,
    toggleCollapsedNav,
    onMobileNavToggle,
    isMobile,
  } = props;
  const [searchActive, setSearchActive] = useState(false);

  const onSearchActive = () => {
    setSearchActive(true);
  };

  const onSearchClose = () => {
    setSearchActive(false);
  };

  const onToggle = () => {
    if (!isMobile) {
      toggleCollapsedNav(!navCollapsed);
    } else {
      onMobileNavToggle(!mobileNav);
    }
  };

  const isNavTop = navType === NAV_TYPE_TOP ? true : false;
  const mode = utils.getColorContrast(headerNavColor);
  const getNavWidth = () => {
    if (isNavTop || isMobile) {
      return '0px';
    }
    if (navCollapsed) {
      return `${SIDE_NAV_COLLAPSED_WIDTH}px`;
    } else {
      return `${SIDE_NAV_WIDTH}px`;
    }
  };
  return (
    <Header
      className={`app-header ${mode}`}
      style={{ backgroundColor: headerNavColor }}
    >
      <div className={`app-header-wrapper ${isNavTop ? 'layout-top-nav' : ''}`}>
        <Logo logoType={mode} />
        <div className='nav' style={{ width: `calc(100% - ${getNavWidth()})` }}>
          <div className='nav-left'>
            <Menu mode='horizontal'>
              {isNavTop && !isMobile ? null : (
                <Menu.Item
                  key='clickable menu'
                  onClick={() => {
                    onToggle();
                  }}
                >
                  {isMobile && <MenuUnfoldOutlined className='nav-icon' />}
                </Menu.Item>
              )}
            </Menu>
          </div>
          <div className='nav-right'>
            {/* <NavProfile /> */}
          </div>
        </div>
      </div>
    </Header>
  );
};

const mapStateToProps = ({ theme }) => {
  const { navCollapsed, navType, headerNavColor, mobileNav } = theme;
  return { navCollapsed, navType, headerNavColor, mobileNav };
};

export default connect(mapStateToProps, {
  toggleCollapsedNav,
  onMobileNavToggle,
})(HeaderNav);
