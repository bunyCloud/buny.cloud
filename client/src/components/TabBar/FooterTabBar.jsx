import React from 'react';
import { NavBar, TabBar } from 'antd-mobile';
import { Route, Switch, useHistory, useLocation, MemoryRouter as Router } from 'react-router-dom';
import { AppOutline,  UnorderedListOutline, UserOutline } from 'antd-mobile-icons';
import styles from './footer.less';
import UserKeyTable from '../Users/UserKeyTable';
import { EmailIcon } from '@chakra-ui/icons';

const FooterTabBar = () => {
    return (
        <Router initialEntries={['/home']}>
            <div className={styles.app}>
                
                    <NavBar>Control Panel</NavBar>
                
                <div className={styles.body}>
                    <Switch>
                        <Route exact path='/home' component={Home} />
                        <Route exact path='/todo' component={Todo} />
                        <Route exact path='/inbox' component={Message} />
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
        { key: '/home', title: 'Accounts', icon: <AppOutline /> },
        { key: '/todo', title: 'Pending Transactions', icon: <UnorderedListOutline /> },
        { key: '/inbox', title: 'Inbox', icon: <EmailIcon /> },
        { key: '/me', title: 'Profile', icon: <UserOutline /> },
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

const Todo = () => <div></div>;

const Message = () => <div>                     

 <UserKeyTable/>
</div>;

const PersonalCenter = () => <div>About</div>;

export default FooterTabBar;
