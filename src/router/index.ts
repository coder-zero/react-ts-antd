import Home from '../pages/Home'
import User from '../pages/User'
import About from '../pages/About'
import {
    DesktopOutlined,
    PieChartOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { MenuRoute } from './types';

const router: MenuRoute[] = [
    {
        path: '/home',
        name: '首页',
        extract: true,
        key: '/home',
        component: Home,
        icon: DesktopOutlined as any,
    },
    {
        path: '/user',
        name: '用户信息',
        extract: true,
        key: '/user',
        component: User,
        icon: PieChartOutlined as any
    },
    {
        path: '/about',
        name: '关于',
        extract: true,
        key: '/about',
        component: About,
        icon: UserOutlined as any
    }
]



export default router