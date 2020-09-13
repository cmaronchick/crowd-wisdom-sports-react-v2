import React from 'react'
import PropTypes from 'prop-types'

import { Select } from 'antd'

const { Option } = Select

const LeaderboardSelector = props => {
    const { leaderboardType, handleChangeLeaderboardType } = props
    return (
        <Select
        defaultValue="predictionScore" style={{ width: 120 }}
            onChange={handleChangeLeaderboardType}>
          <Option disabled={leaderboardType === 'predictionScore'} value="predictionScore">Prediction Score</Option>
          <Option disabled={leaderboardType === 'stakes'} value="stakes">Stakes</Option>
        </Select>
    )
}

LeaderboardSelector.propTypes = {
    leaderboardType: PropTypes.string.isRequired
}

export default LeaderboardSelector
