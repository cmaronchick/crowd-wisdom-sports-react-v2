import React, { useEffect, useState} from 'react'
import {Auth} from 'aws-amplify'

import { Card, Button, Spinner, Row, Col, Typography } from 'antd'
import { Select } from 'antd'


import { connect } from 'react-redux'

import SeasonSelector from '../seasonSelector/SeasonSelector'
import Weeks from '../weeks/Weeks'

import { fetchGameWeekGames } from '../../redux/actions/gamesActions'
import ky from 'ky/umd'

const { Option } = Select

const AdminPage = (props) => {
    const { sport, games, user, fetchGameWeekGames} = props
    const [gamesObj, setGames] = useState({})

    const apiHost = ky.create({prefixUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:5001/api/' : 'https://app.stakehousesports.com/api/'})


    useEffect(() => {
        console.log(`games`, Object.keys(games.games).length, gamesObj)
        if ((games && games.games && Object.keys(games.games).length > 0 && Object.keys(gamesObj).length === 0) || (Object.keys(games.games).length !== Object.keys(gamesObj).length > 0)) {
            console.log(`games.games`, games.games)
            setGames(() => {
                return {
                    ...games.games
                }
            })
        }
    }, [games])

    // when a user inputs a score
    // rebuild the game object and update the specific team score

    const handleScoreChange = ({gameId, team, score }) => {
        setGames(() => {
            return {
                ...gamesObj,
                [gameId]: {
                    ...gamesObj[gameId],
                    results: {
                        ...gamesObj[gameId].results,
                        [team]: {
                            score: parseInt(score)
                        }
                    }
                }
            }
        })
    }

    // when a user selects an updated status, rebuild the game object and update the status

    const handleStatusChange = ({gameId, status }) => {
        setGames(() => {
            return {
                ...gamesObj,
                [gameId]: {
                    ...gamesObj[gameId],
                    status
                }
            }
        })
    }

    const handleGameUpdateSubmit = (gameId) => {
        const gameDetails = gamesObj[gameId]
        setGames(() => {
            return {
                ...gamesObj,
                [gameId]: {
                    ...gamesObj[gameId],
                    updating: true
                }
            }
        })
        
        Auth.currentSession()
        .then(currentSession => {
            let IdToken = currentSession.getIdToken()
            let tokenPayload = IdToken.decodePayload()
            const { gameId, gameWeek, year, sport, status, season, startDateTime, results, odds } = gameDetails
            const updatedGameDetails = {

                gameId,
                gameWeek,
                year,
                sport,
                status,
                season,
                startDateTime: new Date(startDateTime).getTime(),
                results,
                odds: {
                    spread: odds.spread,
                    total: odds.total
                }
            }
            console.log(`gameDetails`, JSON.stringify(updatedGameDetails))
            
            // "gameId" : $input.path('gameId'),

            // "gameWeek" : $input.path('gameWeek'),
            // "year" : $input.path('year'),
            // "sport" : "$input.path('sport')",
            // "status" : "$input.path('status')",
            // "season" : "$input.path('season')",
            // "startDateTime": $input.path('startDateTime'),
            // #if($input.path('$.results.awayTeam.score') > -1 || $input.path('$.results.homeTeam.score') > -1)
            //     "results": {
            //         "awayTeam" : {
            //             "score" : $input.path('$.results.awayTeam.score')
            //         },
            //         "homeTeam" : {
            //             "score" : $input.path('$.results.homeTeam.score')
            //         }
            //     },
            // #end
            // "odds" : {
            //     #if($input.path('$.odds.total'))
            //         "total" : $input.path('$.odds.total'),
            //     #end
            //     #if($input.path('$.odds.spread'))
            //         "spread" : $input.path('$.odds.spread')
            //     #end
            // }
            if (currentSession && tokenPayload['cognito:groups'] && tokenPayload['cognito:groups'].indexOf('admins') > -1) {
                ky.post(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/gameupdate`,{
                    headers: {
                    Authorization: IdToken.getJwtToken(),
                    'Content-type': 'application/json'
                    },
                    body: JSON.stringify(updatedGameDetails)
                })
                .then(response => {
                    console.log(`response`, response);
                    setGames(() => {
                        return {
                            ...gamesObj,
                            [gameId]: {
                                ...gamesObj[gameId],
                                updating: false,
                                updated: true
                            }
                        }
                    })
                })
                .catch(updateGameError => {
                    console.log(`updateGameError`, updateGameError)

                    setGames(() => {
                        return {
                            ...gamesObj,
                            [gameId]: {
                                ...gamesObj[gameId],
                                updating: false,
                                updated: false
                            }
                        }
                    })
                })
            } else {
                throw new Error('user is not an admin')
            }
        })
        .catch((adminCheckError) => {
            console.log(`adminCheckError`, adminCheckError)
        })
    }
    return props.user.details?.isAdmin ? (
        
        <div className="gamesContainer">
            <div className="selectorHeader">
                <SeasonSelector
                    sport={sport.sport} season={sport.gameWeekData.season}
                />
                <Weeks onGameWeekClick={fetchGameWeekGames} page="games" />
            </div>
            {games && Object.keys(games.games).length > 0 && Object.keys(games.games).sort((a,b) => {
                return games.games[a].startDateTime > games.games[b].startDateTime ? 1 : -1
            }).map(gameId => {
                const { awayTeam, homeTeam, odds, status, updating, updated, results } = games.games[gameId]
                console.log(`updated`, updated)
                // console.log(`awayTeam, homeTeam`, awayTeam, homeTeam)
                return (
                <Card key={gameId} title={`${gameId}: ${awayTeam.shortName} at ${homeTeam.shortName}`}>
                    <Row>
                        <Col>
                        <div>{awayTeam.code}<input value={gamesObj[gameId] && gamesObj[gameId].results && gamesObj[gameId].results.awayTeam && gamesObj[gameId].results.awayTeam.score !== null ? gamesObj[gameId].results.awayTeam.score : ''} type="number" id="awayTeamScore" onChange={(event) => { handleScoreChange({gameId, team: 'awayTeam', score: event.target.value})}} /></div>
                        </Col>
                        <Col>
                        at
                        </Col>
                        <Col>
                        <div>{homeTeam.code}<input type="number" value={gamesObj[gameId] && gamesObj[gameId].results && gamesObj[gameId].results.homeTeam && gamesObj[gameId].results.homeTeam.score !== null ? gamesObj[gameId].results.homeTeam.score : ''} id="homeTeamScore" onChange={(event) => { handleScoreChange({gameId, team: 'homeTeam', score: event.target.value})}} /></div>
                        </Col>
                    </Row>
                    <Row>
                        Game Status: 
                        <Select
                            defaultValue={status}
                            style={{ width: 120 }}
                            onChange={(value) => handleStatusChange({gameId, status: value})}>
                                <Option value="notStarted">Not Started</Option>
                                <Option value="inProgress">In Progress</Option>
                                <Option value="final">final</Option>
                                
                            </Select>

                    </Row>
                    <Row>
                        <Button onClick={() => handleGameUpdateSubmit(gameId)}
                        disabled={updating}>
                            Submit Update
                        </Button>
                        {updated && (<div style="color: 'green'">Updated!</div>)}
                    </Row>
                </Card>
                )}
            )}
            
        </div>
    ) : (<div>Admins Only</div>)
}

const mapStateToProps = (state) => ({
    sport: state.sport,
    games: state.games,
    user: state.user
})

const mapDispatchToProps = {
    fetchGameWeekGames

}

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage)