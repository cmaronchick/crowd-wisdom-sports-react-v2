import React from 'react'
import PropTypes from 'prop-types'

import { Select } from 'antd'

const { Option } = Select

const LeaderboardSelector = props => {
    const { leaderboardType, handleChangeLeaderboardType } = props
    return (
        <Select
            value={leaderboardType}
            style={{ width: 150 }}
            onChange={handleChangeLeaderboardType}
        >
          <Option value="predictionScore">Prediction Score</Option>
          <Option value="stakes">Currency Won</Option>
          <Option value="roi">ROI</Option>
        </Select>
    )
}

LeaderboardSelector.propTypes = {
    leaderboardType: PropTypes.string.isRequired
}

export default LeaderboardSelector
