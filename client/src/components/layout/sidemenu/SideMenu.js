import React from 'react'
import PropTypes from 'prop-types'
import { NavLink, Link } from "react-router-dom";

import './SideMenu.less'
import { Layout, Menu } from 'antd'
import { UserOutlined } from '@ant-design/icons'

import { connect } from 'react-redux'

import { setSport } from '../../../redux/actions/sportActions'

const { Sider } = Layout

const { SubMenu, Item } = Menu

const SideMenu = (props) => {
    const { sport, UI } = props
    const sportKeys = {
        nfl: 'nfl'
    }
    return (
        //<!-- Sidebar -->
        <Sider>

          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={[sportKeys[sport.sport]]}
            style={{ height: '100%' }}
            className="sideMenu"
          >
            <SubMenu key="nfl" title="NFL">
                <Menu.Item key="1"><NavLink to="/nfl">Games</NavLink></Menu.Item>
                <Menu.Item key="2"><NavLink to="/nfl/leaderboards">Leaderboards</NavLink></Menu.Item>
                <Menu.Item key="3"><NavLink to="/nfl/groups">Groups</NavLink></Menu.Item>
            </SubMenu>
            <SubMenu key="ncaaf" title="NCAAF">
              <Menu.Item key="1"><NavLink to="/ncaaf">Games</NavLink></Menu.Item>
              <Menu.Item key="2"><NavLink to="/ncaaf/leaderboards">Leaderboards</NavLink></Menu.Item>
              <Menu.Item key="3"><NavLink to="/ncaaf/groups">Groups</NavLink></Menu.Item>
            </SubMenu>
            <SubMenu key="ncaam" title="NCAAM">
              <Menu.Item key="1"><NavLink to="/ncaam">Games</NavLink></Menu.Item>
              <Menu.Item key="2"><NavLink to="/ncaam/leaderboards">Leaderboards</NavLink></Menu.Item>
              <Menu.Item key="3"><NavLink to="/ncaam/groups">Groups</NavLink></Menu.Item>
            </SubMenu>
            <Item>
                <Link to="/profile"><UserOutlined /> Profile</Link>
            </Item>
        </Menu>

        </Sider>
    )
}

SideMenu.propTypes = {
    sport: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    sport: state.sport,
    UI: state.UI
})

const mapActionsToProps = {
    setSport,
    // fetchLeaderboards,
    // fetchCrowds,

}

export default connect(mapStateToProps, mapActionsToProps)(SideMenu);