import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectSeason } from '../../redux/actions/sportActions'

import { Select, Menu } from 'antd'
const { Option } = Select

const SeasonSelector = (props) => {
    const { sport, selectSeason } = props
    const handleChange = (season) => {
        selectSeason(sport.sport, sport.gameWeekData.year, season.value)

    }
    return sport.gameWeekData.season ? (
        <Select
            labelInValue
            defaultValue={{ key: sport.gameWeekData.season }}
            style={{ width: 120 }}
            onChange={handleChange}
                >
            <Option key="reg" value="reg">Regular Season</Option>
            <Option key="post" value="post">Postseason</Option>
        </Select>
    ) : (<div></div>)
}

SeasonSelector.propTypes = {
    sport: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    sport: state.sport
})

const mapDispatchToProps = {
    selectSeason
}

export default connect(mapStateToProps, mapDispatchToProps)(SeasonSelector)
