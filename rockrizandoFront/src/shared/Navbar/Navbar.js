import React, { useState, useEffect } from 'react';
import { Menu, Layout } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  UnorderedListOutlined,
  PlusOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Grid } from 'antd';

import Logo from './../Logo' 
import './Navbar.css';

const { Sider } = Layout;
const { useBreakpoint } = Grid;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const location = useLocation();
  const screens = useBreakpoint();

  useEffect(() => {
    const path = location.pathname;
    const key = path === '/' ? '/' : path.split('/')[1];
    setSelectedKeys([key]);
  }, [location.pathname]);

  useEffect(() => {
    if (!screens.md) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [screens]);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapse} theme="dark">
      <Logo collapsed={collapsed} />
      <Menu theme="dark" mode="inline" selectedKeys={selectedKeys}>
        <Menu.Item key="/" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="parties" icon={<UnorderedListOutlined />}>
          <Link to="/parties">Parties</Link>
        </Menu.Item>
        <Menu.Item key="newParty" icon={<PlusOutlined />}>
          <Link to="/newParty">New Party</Link>
        </Menu.Item>
        <Menu.Item key="profile" icon={<UserOutlined />}>
          <Link to="/profile">Profile</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
