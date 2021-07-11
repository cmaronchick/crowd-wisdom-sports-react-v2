import React from 'react'
import PropTypes from 'prop-types'
import { NavLink, Link } from "react-router-dom";

import './SideMenu.less'
import { Layout, Menu, Popover } from 'antd'
import Icon, { UserOutlined } from '@ant-design/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFootballBall,
    faSchool,
    faBasketballBall,
    faTrophy,
    faUserFriends,
    faList,
    faUser
 } from '@fortawesome/free-solid-svg-icons'
// import { faAppStore, faGooglePlay } from '@fortawesome/free-brands-svg-icons'
import {
    FaAppStore,
    FaGooglePlay,
    FaList,
    FaUser,
    FaUserFriends,
    FaTrophy,
    FaFootballBall,
    FaBell,
    FaChartLine } from 'react-icons/fa'

import { connect } from 'react-redux'
import { setSport } from '../../../redux/actions/sportActions'

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
    const { sport, user } = props
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
            <SubMenu style={{borderBottom: '1px solid #3d5a80'}} key="nfl" icon={<Icon component={() => <FaFootballBall title="NFL" className="drawerIcon" />} />} title='NFL'>
    <Menu.Item className="drawerLink" key="1" icon={<Icon component={() => <FaFootballBall title="Games" className="drawerIcon" />} />}><NavLink activeClassName="activeNavLink" to="/nfl/games">Games</NavLink></Menu.Item>
    <Menu.Item className="drawerLink" key="2" icon={<Icon component={() => <FaTrophy title="Leaderboards" className="drawerIcon" />} />}><NavLink activeClassName="activeNavLink" to="/nfl/leaderboards">Leaderboards</NavLink></Menu.Item>
    <Menu.Item className="drawerLink" key="3" icon={<Icon component={() => <FaUserFriends title="Groups" className="drawerIcon" />} />}><NavLink activeClassName="activeNavLink" to="/nfl/groups">Groups</NavLink></Menu.Item>
            </SubMenu>
            <Menu.Item key="9" className="drawerLink" icon={<Icon component={() => <FaChartLine title="Notifications" className="drawerIcon" />} />}>
                <Link to={`/${sport.sport}/oddsmovement/${sport.gameWeekData.year}/${sport.gameWeekData.season}/${sport.gameWeekData.week}`}>Odds Movement</Link>
            </Menu.Item>
            {/* <Menu.Item key="8" className="drawerLink" icon={<Icon component={() => <FaBell title="Notifications" className="drawerIcon" />} />}>
                Notifications
            </Menu.Item> */}
            {/* <SubMenu key="ncaaf" title="NCAAF" icon={<Icon component={() => faIcon('ncaaf')} />}>
                <Menu.Item key="1" icon={<Icon component={() => <FontAwesomeIcon icon={faFootballBall} />} />}><NavLink activeClassName="activeNavLink" to="/ncaaf/games">Games</NavLink></Menu.Item>
                <Menu.Item key="2" icon={<Icon component={() => <FontAwesomeIcon icon={faTrophy} />} />}><NavLink activeClassName="activeNavLink" to="/ncaaf/leaderboards">Leaderboards</NavLink></Menu.Item>
                <Menu.Item key="3" icon={<Icon component={() => <FontAwesomeIcon icon={faUserFriends} />} />}><NavLink activeClassName="activeNavLink" to="/ncaaf/groups">Groups</NavLink></Menu.Item>
            </SubMenu>
            <SubMenu key="ncaam" title="NCAAM" icon={<Icon component={() => faIcon('ncaam')} />}>
                <Menu.Item key="1" icon={<Icon component={() => <FontAwesomeIcon icon={faFootballBall} />} />}><NavLink activeClassName="activeNavLink" to="/ncaam/games">Games</NavLink></Menu.Item>
                <Menu.Item key="2" icon={<Icon component={() => <FontAwesomeIcon icon={faTrophy} />} />}><NavLink activeClassName="activeNavLink" to="/ncaam/leaderboards">Leaderboards</NavLink></Menu.Item>
                <Menu.Item key="3" icon={<Icon component={() => <FontAwesomeIcon icon={faUserFriends} />} />}><NavLink activeClassName="activeNavLink" to="/ncaam/groups">Groups</NavLink></Menu.Item>
            </SubMenu> */}
            {user.authenticated && (
            <Menu.Item key="4" className="drawerLink" icon={<Icon component={() => <FaUser title="Profile" className="drawerIcon" />} />}>
                    <Link to="/profile">Profile</Link>
            </Menu.Item>
            )}
            <Menu.Item key="5" className="drawerLink" icon={<Icon component={() => <FaList title="Contest Rules" className="drawerIcon" />} />}>
                    <Link to="/rules">Contest Rules</Link>
            </Menu.Item>
            <Menu.Item key="6" className="drawerLink" icon={<Icon component={() => <FaAppStore title="App Store" className="drawerIcon" />} />}>
                    <a href="https://apps.apple.com/us/app/stakehouse-sports/id1475324522?ls=1" target="_blank">App Store</a>
            </Menu.Item>
            <Menu.Item key="7" className="drawerLink" icon={<Icon component={() => <FaGooglePlay title="Google Play" className="drawerIcon"/>} />}>
                    <a href="https://play.google.com/store/apps/details?id=com.cwsrn&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1" target="_blank" rel="nofollow">Google Play</a>
            </Menu.Item>
            {user.details?.isAdmin && (
                <Menu.Item key="8" className="drawerLink" icon={<Icon component={() => <FaList title="Contest Rules" className="drawerIcon" />} />}>
                        <Link to="/nfl/games/admin">Admin</Link>
                </Menu.Item>
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