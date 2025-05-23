import React from "react";
import { Menu, Dropdown, Avatar } from "antd";
import {
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import Icon from 'components/util-components/Icon';
import { useHistory } from "react-router-dom";
import { AUTH_TOKEN } from "redux/constants";
import { connect } from "react-redux";

const menuItem = [
  {
    title: "Edit Profile",
    icon: EditOutlined,
    path: "/profile"
  }
]

export const NavProfile = (props) => {
  const history = useHistory();
  const profileImg = ``;
  const profileMenu = (
    <div className="nav-profile nav-dropdown">
      <div className="nav-profile-header">
        <div className="d-flex">
          <Avatar size={45} src={profileImg} />
          <div className="pl-3">
            <h4 className="mb-0">{props.full_name}</h4>
            {/* <span className="text-muted">{props.email}</span> */}
          </div>
        </div>
      </div>
      <div className="nav-profile-body">
        <Menu>
          <Menu.Item key={menuItem.legth + 1} onClick={e => localStorage.removeItem(AUTH_TOKEN) || history.push("/login")}>
            <span>
              <LogoutOutlined className="mr-3" />
              <span className="font-weight-normal">Sign Out</span>
            </span>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
  return (
    <Dropdown placement="bottomRight" overlay={profileMenu} trigger={["click"]}>
      <Menu className="d-flex align-item-center" mode="horizontal">
        <Menu.Item>
          <Avatar src={profileImg} />
        </Menu.Item>
      </Menu>
    </Dropdown>
  );
}

const mapStateToProps = ({ account }) => {
  return account
}

export default connect(mapStateToProps, {})(NavProfile)
