import React from 'react'
import PropTypes from 'prop-types'
import { NavLink, Link } from "react-router-dom";

import './SideMenu.less'
import { Layout, Menu } from 'antd'
import Icon, { UserOutlined } from '@ant-design/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFootballBall, faSchool, faBasketballBall, faTrophy, faUserFriends } from '@fortawesome/free-solid-svg-icons'

import { connect } from 'react-redux'
import { setSport } from '../../../redux/actions/sportActions'

import LoginButton from '../../profile/LoginButton'

const { Sider } = Layout

const { SubMenu, Item } = Menu

const sportsVariables = {
    nfl: {
        name: 'NFL',
        icon: faFootballBall
    },
    ncaaf: {
        name: 'NCAAF',
        icon: faSchool
    },
    ncaam: {
        name: 'NCAAM',
        icon: faBasketballBall
    }
}

const faIcon = (sport) => (<FontAwesomeIcon icon={sportsVariables[sport].icon}/>)

const SideMenu = (props) => {
    const { sport, UI, user } = props
    const sportKeys = {
        nfl: 'nfl'
    }
    return (
        //<!-- Sidebar -->
        <Sider breakpoint="sm"
        collapsedWidth="80">

          <Menu
            mode="inline"
            defaultOpenKeys={[sportKeys[sport.sport]]}
            style={{ height: '100%' }}
            className="sideMenu"
          >
            <SubMenu key="nfl" icon={<Icon component={() => faIcon('nfl')} />} title='NFL'>
                <Menu.Item key="1" icon={<Icon component={() => <FontAwesomeIcon icon={faFootballBall} />} />}><NavLink activeClassName="activeNavLink" to="/nfl/games">Games</NavLink></Menu.Item>
                <Menu.Item key="2" icon={<Icon component={() => <FontAwesomeIcon icon={faTrophy} />} />}><NavLink activeClassName="activeNavLink" to="/nfl/leaderboards">Leaderboards</NavLink></Menu.Item>
                <Menu.Item key="3" icon={<Icon component={() => <FontAwesomeIcon icon={faUserFriends} />} />}><NavLink activeClassName="activeNavLink" to="/nfl/groups">Groups</NavLink></Menu.Item>
            </SubMenu>
            <SubMenu key="ncaaf" title="NCAAF" icon={<Icon component={() => faIcon('ncaaf')} />}>
                <Menu.Item key="1" icon={<Icon component={() => <FontAwesomeIcon icon={faFootballBall} />} />}><NavLink activeClassName="activeNavLink" to="/ncaaf/games">Games</NavLink></Menu.Item>
                <Menu.Item key="2" icon={<Icon component={() => <FontAwesomeIcon icon={faTrophy} />} />}><NavLink activeClassName="activeNavLink" to="/ncaaf/leaderboards">Leaderboards</NavLink></Menu.Item>
                <Menu.Item key="3" icon={<Icon component={() => <FontAwesomeIcon icon={faUserFriends} />} />}><NavLink activeClassName="activeNavLink" to="/ncaaf/groups">Groups</NavLink></Menu.Item>
            </SubMenu>
            <SubMenu key="ncaam" title="NCAAM" icon={<Icon component={() => faIcon('ncaam')} />}>
                <Menu.Item key="1" icon={<Icon component={() => <FontAwesomeIcon icon={faFootballBall} />} />}><NavLink activeClassName="activeNavLink" to="/ncaam/games">Games</NavLink></Menu.Item>
                <Menu.Item key="2" icon={<Icon component={() => <FontAwesomeIcon icon={faTrophy} />} />}><NavLink activeClassName="activeNavLink" to="/ncaam/leaderboards">Leaderboards</NavLink></Menu.Item>
                <Menu.Item key="3" icon={<Icon component={() => <FontAwesomeIcon icon={faUserFriends} />} />}><NavLink activeClassName="activeNavLink" to="/ncaam/groups">Groups</NavLink></Menu.Item>
            </SubMenu>
            {user.authenticated && (
            <Item icon={<UserOutlined />}>
                    <Link to="/profile"> Profile</Link>
            </Item>
            )}
        </Menu>

        </Sider>
    )
}

SideMenu.propTypes = {
    sport: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    sport: state.sport,
    UI: state.UI,
    user: state.user
})

const mapActionsToProps = {
    setSport,
    // fetchLeaderboards,
    // fetchCrowds,

}

export default connect(mapStateToProps, mapActionsToProps)(SideMenu);