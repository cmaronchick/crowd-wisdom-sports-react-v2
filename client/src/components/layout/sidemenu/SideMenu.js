import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from "react-router-dom";

import './SideMenu.less'
import { Layout, Menu, Popover } from 'antd'
import Icon, { UserOutlined } from '@ant-design/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faSchool,
    faBasketballBall
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
    FaChartLine,
FaBasketballBall } from 'react-icons/fa'

import { connect } from 'react-redux'
import { setSport } from '../../../redux/actions/sportActions'

const { Sider } = Layout

const { SubMenu, Item } = Menu

const sportsVariables = {
    nfl: {
        name: 'NFL',
        icon: FaFootballBall
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

const getMenuItems = (sportData) => {
    const sportKey = sportData?.sport || 'nfl'
    const gameWeekData = sportData?.gameWeekData || {}
    const year = gameWeekData.year
    const season = gameWeekData.season
    const week = gameWeekData.week
    const oddsMovementPath = year && season && week
        ? `/${sportKey}/oddsmovement/${year}/${season}/${week}`
        : `/${sportKey}/games`

    return ([
    {
        key: 'nfl',
        label: 'NFL',
        icon: <FaFootballBall />,
        children: [
            {
                key: 'nfl-1',
                label: 'Games',
                path: '/nfl/games',
                icon: <FaFootballBall />
            },
            {
                key: 'nfl-2',
                label: 'Leaderboards',
                path: '/nfl/leaderboards',
                icon: <FaTrophy/>
            },
            {
                key: 'nfl-3',
                label: 'Groups',
                path: '/nfl/groups',
                icon: <FaUserFriends/>
            }
        ]
    },
    {
        key: 'ncaaf',
        label: 'NCAAF',
        icon: <FontAwesomeIcon icon={faSchool} />,
        children: [
            {
                key: 'ncaaf-1',
                label: 'Games',
                path: '/ncaaf/games',
                icon: <FaFootballBall />
            },
            {
                key: 'ncaaf-2',
                label: 'Leaderboards',
                path: '/ncaaf/leaderboards',
                icon: <FaTrophy/>
            },
            {
                key: 'ncaaf-3',
                label: 'Groups',
                path: '/ncaaf/groups',
                icon: <FaUserFriends/>
            }
        ]
    },
    {
        key: 'ncaam',
        label: 'NCAAM',
        icon: <FaBasketballBall />,
        children: [
            {
                key: 'ncaam-1',
                label: 'Games',
                path: '/ncaam/games',
                icon: <FaBasketballBall />
            },
            {
                key: 'ncaam-2',
                label: 'Leaderboards',
                path: '/ncaam/leaderboards',
                icon: <FaTrophy/>
            },
            {
                key: 'ncaam-3',
                label: 'Groups',
                path: '/ncaam/groups',
                icon: <FaUserFriends/>
            }
        ]
    },
    {
        key: 'wager-slip',
        label: 'Wager Slip',
        path: `/${sportKey}/wagerslip`,
        icon: <FaBell />
    },
    {
        key: 'odds-movement',
        label: 'Odds Movement',
        icon: <FaChartLine />,
        path: oddsMovementPath
    },
    {
        key: 'profile',
        label: 'Profile',
        icon: <FaUser />,
        path: '/profile'
    }, 
    {
        key: 'app-store',
        label: 'App Store',
        href: 'https://apps.apple.com/us/app/stakehouse-sports/id1475324522?ls=1',
        icon: <FaAppStore />
    },
    {
        key: 'google-play',
        label: 'Google Play',
        href: 'https://play.google.com/store/apps/details?id=com.cwsrn&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1',
        icon: <FaGooglePlay />
    },
    {
        key: 'admin',
        label: 'Admin',
        path: '/nfl/games/admin',
        icon: <FaList />,
    }
])
}

const getLevelKeys = (items1) => {
  const key = {};
  const func = (items2, level = 1) => {
    items2.forEach((item) => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        func(item.children, level + 1);
      }
    });
  };
  func(items1);
  return key;
};

const levelKeys = getLevelKeys(getMenuItems({ sport: 'nfl' }));

const findMenuItemByKey = (items, targetKey) => {
    for (const item of items) {
        if (item.key === targetKey) {
            return item
        }

        if (item.children) {
            const match = findMenuItemByKey(item.children, targetKey)
            if (match) {
                return match
            }
        }
    }

    return null
}

const SideMenu = (props) => {
    const [collapsed, toggleCollapsed] = useState(window.innerWidth < 560 ? true : false)

    const [current, setCurrent] = useState('nfl');
    const { sport } = props
        const history = useHistory()
        const menuItems = getMenuItems(sport)

    const onClick = (e) => {
        setCurrent(e.key);

        const selectedItem = findMenuItemByKey(menuItems, e.key)
        if (!selectedItem) {
            return
        }

        if (selectedItem.path) {
            history.push(selectedItem.path)
            return
        }

        if (selectedItem.href) {
            window.open(selectedItem.href, '_blank', 'noopener,noreferrer')
        }
    };

    const sportKeys = {
        nfl: 'nfl',
        ncaaf: 'ncaaf',
        ncaam: 'ncaam',
        nba: 'nba'
    }
    return (
        //<!-- Sidebar -->
        <Sider
            breakpoint="sm"
            collapsedWidth="0"
            >
          <Menu
            mode="inline"
            style={{ height: '100%' }}
            className="sideMenu"
                        items={menuItems}
            defaultOpenKeys={[sportKeys[sport.sport]]}
            onClick={onClick}
            selectedKeys={[current]}
          />
            {/* <SubMenu style={{borderBottom: '1px solid #3d5a80'}} key="nfl" icon={<Icon component={() => <FaFootballBall title="football" className="drawerIcon" />} />} title='NFL'>
                <Menu.Item className="drawerLink" key="nfl-1" icon={<Icon component={() => <FaFootballBall title="Games" className="drawerIcon" />} />}><NavLink activeClassName="activeNavLink" to="/nfl/games">Games</NavLink></Menu.Item>
                <Menu.Item className="drawerLink" key="nfl-2" icon={<Icon component={() => <FaTrophy title="Leaderboards" className="drawerIcon" />} />}><NavLink activeClassName="activeNavLink" to="/nfl/leaderboards">Leaderboards</NavLink></Menu.Item>
                <Menu.Item className="drawerLink" key="nfl-3" icon={<Icon component={() => <FaUserFriends title="Groups" className="drawerIcon" />} />}><NavLink activeClassName="activeNavLink" to="/nfl/groups">Groups</NavLink></Menu.Item>
            </SubMenu>
            <Menu.Item key="nfl-9" className="drawerLink" icon={<Icon component={() => <FaChartLine title="Notifications" className="drawerIcon" />} />}>
                <Link to={`/${sport.sport}/oddsmovement/${sport.gameWeekData.year}/${sport.gameWeekData.season}/${sport.gameWeekData.week}`}>Odds Movement</Link>
            </Menu.Item>
            <SubMenu key="ncaaf" title="NCAAF" icon={<Icon component={() => <FaFootballBall title="NCAAF" className="drawerIcon" />}/>}>
                <Menu.Item className="drawerLink" key="ncaaf-1" icon={<Icon component={() => <FaFootballBall title="Games" className="drawerIcon" />} />}><NavLink activeClassName="activeNavLink" to="/ncaaf/games">Games</NavLink></Menu.Item>
                <Menu.Item className="drawerLink" key="ncaaf-2" icon={<Icon component={() => <FaTrophy title="Leaderboards" className="drawerIcon" />} />}><NavLink activeClassName="activeNavLink" to="/ncaaf/leaderboards">Leaderboards</NavLink></Menu.Item>
                <Menu.Item className="drawerLink" key="ncaaf-3" icon={<Icon component={() => <FaUserFriends title="Groups" className="drawerIcon" />} />}><NavLink activeClassName="activeNavLink" to="/ncaaf/groups">Groups</NavLink></Menu.Item>
            </SubMenu>
            {user.authenticated && (
            <Menu.Item key="user-4" className="drawerLink" icon={<Icon component={() => <FaUser title="Person" className="drawerIcon" />} />}>
                    <Link to="/profile">Profile</Link>
            </Menu.Item>
            )}
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
        </Menu> */}
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