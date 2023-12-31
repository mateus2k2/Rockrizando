import React, { useState, useEffect } from 'react';
import { Menu, Layout } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  PlusOutlined,
  UserOutlined,
  KeyOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Grid, Button } from 'antd';
import { useAuthUser, useIsAuthenticated } from 'react-auth-kit';
import { useSignOut  } from 'react-auth-kit';

import Logo from '../Logo'
import './Sider.css';

const { Sider } = Layout;
const { useBreakpoint } = Grid;



const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const location = useLocation();
  const screens = useBreakpoint();
  const signout = useSignOut();
  const navigate = useNavigate();

  const auth = useAuthUser()
  const isAuthenticated = useIsAuthenticated();

  const handleSignOut = () => {
    console.log("teste")
    signout();
    navigate('/');
  };

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

  let menuToLoad = [];

  if (isAuthenticated()) {
    const userId = auth().user

    menuToLoad = [
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <Link to="/">Home</Link>
      </Menu.Item>,
      <Menu.Item key="newParty" icon={<PlusOutlined />}>
        <Link to="/party/new">New Party</Link>
      </Menu.Item>,
      <Menu.SubMenu key="profile" icon={<UserOutlined />} title="Profile">
        <Menu.Item key="editProfile">
          <Link to={`/user/${userId}/profile/`}>Edit profile</Link>
        </Menu.Item>
        <Menu.Item key="purchases">
          <Link to={`/user/${userId}/purchases/`}>Purchases</Link>
        </Menu.Item>
        <Menu.Item key="myParties">
          <Link to={`/user/${userId}/parties/`}>My Parties</Link>
        </Menu.Item>
      </Menu.SubMenu>,

      <Menu.Item key="signout" icon={<LogoutOutlined />}>
        <Button type="link" onClick={handleSignOut}>Sign Out</Button>
      </Menu.Item>
    ];
  }
  else {
    menuToLoad = [
      <Menu.Item key="/" icon={<HomeOutlined />}>
        <Link to="/">Home</Link>
      </Menu.Item>,
      <Menu.Item key="login" icon={<KeyOutlined />}>
        <Link to="/login">Login/Register</Link>
      </Menu.Item>
    ];
  }

  // let menuToLoad = [
  //   { key: "/", icon: <HomeOutlined />, label: "Home", link: "/" },
  //   { key: "parties", icon: <UnorderedListOutlined />, label: "Parties", link: "/parties" }
  // ];

  // if (isAuthenticated) {
  //   menuToLoad.push(
  //     { key: "newParty", icon: <PlusOutlined />, label: "New Party", link: "/newParty" },
  //     { key: "profile", icon: <UserOutlined />, label: "Profile", link: "/profile" }

  //   )
  // }

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapse} theme="dark" style={{ position: 'fixed', height: '100%' }}>
      <Logo collapsed={collapsed} />
      <Menu theme="dark" mode="inline" selectedKeys={selectedKeys}>
        {menuToLoad}
      </Menu>
      {/* <Menu theme="dark" mode="inline" selectedKeys={selectedKeys} items={menuToLoad} /> */}
    </Sider>
  );
};

export default Sidebar;