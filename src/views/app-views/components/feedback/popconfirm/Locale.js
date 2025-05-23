import React, { Component } from "react";
import { Popconfirm } from "antd";

export class Locale extends Component {
  render() {
    return (
      <Popconfirm title="Are you sure？" okText="Yes" cancelText="No">
        <a href="#">Delete</a>
      </Popconfirm>
    );
  }
}

export default Locale;
