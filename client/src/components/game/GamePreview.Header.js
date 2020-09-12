import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { ArrowRightOutlined } from '@ant-design/icons'

import { Typography } from 'antd'


const { Title, Text, Paragraph } = Typography

const HeaderTitle = ({game}) => (
  <Fragment>
  {game.awayTeam.rank ? `#${game.awayTeam.rank} ` : ''}
  {window.innerWidth > 799 ? game.awayTeam.fullName : game.awayTeam.code} vs. 
  {game.homeTeam.rank ? `#${game.homeTeam.rank} ` : ''}
  {window.innerWidth > 799 ? game.homeTeam.fullName : game.homeTeam.code}
  </Fragment>
)

const GamePreviewHeader = (props) => {
    const { game } = props

    return window.location.pathname.indexOf('/game/') === -1 ? (
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
      ) : (
        <Title level={4} className="game-header">
        {game.bowlName && (
          <div className="bowlName">
          {game.bowlName}
          </div>
          )}
          <HeaderTitle game={game} />
        </Title>
      )
}

GamePreviewHeader.propTypes = {
    game: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
}

export default GamePreviewHeader