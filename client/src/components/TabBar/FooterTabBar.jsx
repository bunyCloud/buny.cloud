import React from 'react';
import { NavBar, TabBar } from 'antd-mobile';
import { Route, Switch, useHistory, useLocation, MemoryRouter as Router } from 'react-router-dom';
import { AppOutline, MessageOutline, UnorderedListOutline, UserOutline } from 'antd-mobile-icons';
import styles from './footer.less';

const FooterTabBar = () => {
    return (
        <Router initialEntries={['/home']}>
            <div className={styles.app}>
                <div className={styles.top}>
                    <NavBar>配合路由使用</NavBar>
                </div>
                <div className={styles.body}>
                    <Switch>
                        <Route exact path='/home' component={Home} />
                        <Route exact path='/todo' component={Todo} />
                        <Route exact path='/message' component={Message} />
                        <Route exact path='/me' component={PersonalCenter} />
                    </Switch>
                </div>
                <div className={styles.bottom}>
                    <Bottom />
                </div>
            </div>
        </Router>
    );
};

const Bottom = () => {
    const history = useHistory();
    const location = useLocation();
    const { pathname } = location;
    
    const setRouteActive = (value) => {
        history.push(value);
    };
    
    const tabs = [
        { key: '/home', title: 'Home', icon: <AppOutline /> },
        { key: '/todo', title: 'To Do', icon: <UnorderedListOutline /> },
        { key: '/message', title: 'Contact', icon: <MessageOutline /> },
        { key: '/me', title: 'About', icon: <UserOutline /> },
    ];

    return (
        <TabBar activeKey={pathname} onChange={value => setRouteActive(value)}>
            {tabs.map(item => (
                <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
            ))}
        </TabBar>
    );
};

const Home = () => <div>Home</div>;

const Todo = () => <div>To Do</div>;

const Message = () => <div>Contact</div>;

const PersonalCenter = () => <div>About</div>;

export default FooterTabBar;
