import React, { Component } from "react";
import { Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

export class PopConfirmIcon extends Component {
  render() {
    return (
      <Popconfirm title="Are you sure？" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
        <a href="#">Delete</a>
      </Popconfirm>
    );
  }
}

export default PopConfirmIcon;
