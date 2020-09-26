import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons'

import { Typography } from 'antd'


const { Title } = Typography

const HeaderTitle = ({game}) => (
  <span>
  {game.awayTeam.rank ? `#${game.awayTeam.rank} ` : ''}
  {window.innerWidth > 799 ? game.awayTeam.fullName : game.awayTeam.code} vs. {game.homeTeam.rank ? `#${game.homeTeam.rank} ` : ''}{window.innerWidth > 799 ? game.homeTeam.fullName : game.homeTeam.code}
  </span>
)

const GamePreviewHeader = (props) => {
    const { game } = props

    return window.location.pathname.indexOf('/game/') === -1 ? (

      <div className="game-header-div">
        <Link to={`/${game.sport}/games/${game.year}/${game.season}/${game.gameWeek}/game/${game.gameId}`} onClick={() => props.onClick()}>
          <Title level={4} className="game-header">
          {game.bowlName && (
            <div className="bowlName">
            {game.bowlName}
            </div>
            )}
          
          <HeaderTitle game={game} />
          <ArrowRightOutlined />
          </Title>
        </Link>
        </div>
      ) : (
        <div className="game-header-div">
        <Link to={`/${game.sport}/games/${game.year}/${game.season}/${game.gameWeek}`}>
          <ArrowLeftOutlined className="left-arrow"/>
        </Link>
        <Title level={4} className="game-header">
        {game.bowlName && (
          <div className="bowlName">
          {game.bowlName}
          </div>
          )}

          <HeaderTitle game={game} />
        </Title>
        </div>
      )
}

GamePreviewHeader.propTypes = {
    game: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
}

export default GamePreviewHeader