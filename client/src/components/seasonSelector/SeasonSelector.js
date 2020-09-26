import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectSeason } from '../../redux/actions/sportActions'

import { Select } from 'antd'
const { Option } = Select

const SeasonSelector = (props) => {
    const { sport, selectSeason, season, handleSelectSeason } = props
    const handleChange = (season) => {
        if (handleSelectSeason) {
            handleSelectSeason(season.value)
        } else {
            selectSeason(sport.sport, sport.gameWeekData.year, season.value)
        }
    }
    return sport.gameWeekData.season ? (
        <Select
            labelInValue
            defaultValue={{ key: season }}
            style={{ width: 120 }}
            onChange={handleChange}
                >
            <Option key="reg" value="reg">{window.innerWidth >= 960 ? `Regular Season` : `REG`}</Option>
            <Option key="post" value="post">{window.innerWidth >= 960 ? `Postseason` : `POST`}</Option>
        </Select>
    ) : (<div></div>)
}

SeasonSelector.propTypes = {
    sport: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => ({
    sport: state.sport,
    season: ownProps && ownProps.season ? ownProps.season : state.sport.gameWeekData ? state.sport.gameWeekData.season : null
})

const mapDispatchToProps = {
    selectSeason
}

export default connect(mapStateToProps, mapDispatchToProps)(SeasonSelector)
