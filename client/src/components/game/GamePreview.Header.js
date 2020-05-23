import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { ArrowRightOutlined } from '@ant-design/icons'

import { Typography } from 'antd'


const { Title, Text, Paragraph } = Typography

const GamePreviewHeader = (props) => {
    const { game } = props

    return (
        <Link to={`/${game.sport}/games/${game.year}/${game.season}/${game.gameWeek}/game/${game.gameId}`} onClick={() => props.onClick()}>
        <Title level={4} className="game-header">
        {game.bowlName ? (
          <div className="bowlName">
          {game.bowlName}
          </div>
          ) : null}
        {game.awayTeam.rank ? `#${game.awayTeam.rank} ` : ''}{game.awayTeam.fullName} vs. {game.homeTeam.rank ? `#${game.homeTeam.rank} ` : ''}{game.homeTeam.fullName}
        <ArrowRightOutlined />
        </Title>
      </Link>
      )
}

GamePreviewHeader.propTypes = {
    game: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
}

export default GamePreviewHeader