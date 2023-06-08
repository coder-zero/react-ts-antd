import React, { useState, useEffect } from 'react';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Button } from 'antd';
import { Link, useHistory, useLocation } from 'react-router-dom'
import { renderRoutes } from '../../utils';
import router from '../../router';

import './index.css'

const { Header, Content, Footer, Sider } = Layout;

type MenuType = Record<string, string>


const Containers: React.FC = () => {
    const history = useHistory();
    const [collapsed, setCollapsed] = useState(false);
    const { pathname } = useLocation()
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const onClick: MenuProps['onClick'] = (e) => {
        history.push(e.key)
    };
    const logOut = () => {
        localStorage.removeItem('token');
        history.push('/login')
    }

    // 防止未登录情况下通过路由跳转
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token && pathname !== '/login') {
            history.replace('/login')
            return
        }

    })

    //路由统一管理后结合Menu使用的方法
    // 创建菜单树
    const renderMenuMap = (list: MenuType[]): JSX.Element[] =>
        list.map((item) => renderMenu(item))

    // 渲染一级菜单
    const renderMenu = (data: MenuType): JSX.Element => {
        return <Menu.Item key={data.key}>
            <Link to={data.path}>{subMenuTitle(data)}</Link>
        </Menu.Item>
    }
    //菜单标题以及icon
    const subMenuTitle = (data: MenuType): JSX.Element => {
        const { icon: MenuIcon } = data
        return (
            <>
                {!!MenuIcon && <MenuIcon />}
                <span>{data.name}</span>
            </>
        )
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" defaultSelectedKeys={[pathname]} mode="inline" onClick={onClick} >
                    {renderMenuMap(router)}
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }} >
                    <Button className='header-button' onClick={logOut}>退出</Button>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    {
                        renderRoutes(router)
                    }
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
            </Layout>
        </Layout>
    );
};

export default Containers;