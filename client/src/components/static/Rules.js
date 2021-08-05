
import React from 'react'
import '../../styles/Rules.less'

const Rules = () => {
    return (
        <div className="rulesContainer">
            <div className="row">
                <div className="col-xs-12">
                    <h3>What is Stakehouse Sports?</h3>
                    <p><strong>Stakehouse Sports</strong> has created a new type of sports competition that is way more fun than your regular old pick 'em games.</p>
                    <p>Instead of just one team over the over, you predict the scores and earn points based on how good you predict the results.</p>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-12"><h1>Stakehouse Sports Official Rules</h1>
                    <p>NO PURCHASE NECESSARY. VOID WHERE PROHIBITED BY LAW. THE FOLLOWING PROMOTION IS INTENDED FOR VIEWING IN THE UNITED STATES AND THE DISTRICT OF COLUMBIA ONLY (EXCLUDING PUERTO RICO, OTHER U.S. TERRITORIES AND FOREIGN TERRITORIES) AND SHALL BE CONSTRUED AND EVALUATED ACCORDING TO UNITED STATES LAW.</p>
                    <h3>Odds</h3>
                    <p>Odds are provided by <a href="https://pinnacle.com" target="_blank" rel="noopener noreferrer">pinnacle.com</a>.</p>
                    <h4>For Individuals</h4>
                    <p>Odds are locked when you make your prediction. If the spread or total odds line changes after you make your prediction, your odds will remain as they were when you made your prediction.<br/>
                    If you update your prediction, you will be given the odds at that time.<br/>
                    Your prediction score and stakes return will be evaluated against the odds associated to your prediction.</p>
                    <h4>For Groups</h4>
                    <p>Odds are determined whenever a group member makes a prediction, as the group prediction is recalculated at that point.<br/>
                    For exampbe, if a group makes a prediction 5 minutes before kickoff, the odds at that time will determine the odds by which the group prediction is measured.</p>
                    <h3>Scoring</h3>
                    <p>Each prediction can earn a maximum of 10 points, and a correct score is determined by the spread at the time that the prediction is made:</p>
                    <ul>
                    <li>Predict the winner correctly: 2 points</li>
                    <li>Predict the spread winner correctly: 2 points</li>
                    <li>Predict the Over/Under total correctly: 2 points</li>
                    <li>Predict the final spread exactly right: 1 point</li>
                    <li>Predict the final total exactly right: 1 point</li>
                    <li>Predict the exact score for the home team: 1 point</li>
                    <li>Predict the exact score for the away team: 1 point</li>
                    </ul>
                    <p>After the last game of the week is final, we tally all of the points and the user(s) with the highest point total earns the weekly purse. The user(s) with the highest point total for all predictions at the end of the postseason (after the final game), earns the end-of-postseason purse.</p>
                    <h3>Stakes</h3>
                    <p>You can wager up to 3 stakes on any spread or over/under line. You do not have to wager any stakes on a game.</p>
                    <p>If you predict the spread or over/under side correctly, you earn the stakes you wager. If you are incorrect on the line you wagered, you will lose those stakes.</p>
                    <p>After the last game of the week is final, we will tally the net result for each user, and the winner will be determined by the highest net stakes.</p>
                    <ul>
                        <li>If User #1 wagers 30 stakes (3 stakes on 10 wagers), wins 18 (6 correct) and loses 12 (4 incorrect), their net will be +6 stakes.</li>
                        <li>If User #2 wagers 12 stakes (3 stakes on 4 wagers), wins 12 (4 correct), their net will be +12 stakes.</li>
                        <li>User #2 will win the weekly prize based on the net stakes even though they had fewer correct wagers.</li>
                    </ul>
                    <h3>Weekly Tiebreakers</h3>
                    <p>In the event that two or more users have the same prediction scores, the tiebreakers will be applied in the following order:</p>
                    <ol>
                    <li>The user who predicted more winners correctly</li>
                    <li>The user who predicted more spread sides correctly</li>
                    <li>The user who predicted more totals correctly</li>
                    <li>The lower average delta from the user’s predicted spread to the actual spread across all games</li>
                    <li>The lower average delta from the user’s predicted totals to the actual totals across all games</li>
                    </ol>
                    <p>If users are still tied after all 5 tiebreakers, the users will split the winnings.</p>
                    <h3>End-of-Season Tiebreakers</h3>
                    <ol>
                    <li>The user who predicted more winners across all games correctly</li>
                    <li>The user who predicted more spread sides across all games correctly.</li>
                    <li>The user who predicted more total sides across all games correctly.</li>
                    </ol>
                    <h3>Prizes</h3>
                    <h4>Weekly</h4>
                    <h5>Individual Users</h5>
                    <p>A $25 weekly prize will be sent to the user who earns the highest prediction score.</p>
                    <p>The Overall Weekly Prediction Contest requires <strong>a minimum of 25 individual users</strong> (excluding the managers of the Stakehouse Sports and any accounts they manage, such as experts).<br/>
                    If there are fewer than 25 users in a given week, no prize money will be distributed for that period.</p>
                    <h5>Groups</h5>
                    <p>The Group Prediction contest requires:
                        <ol>
                            <li>10 unique groups composed of at least 5 unique users making a minimum of 10 predictions per week</li>
                            <li>A minimum of 50 unique users across all groups, per week per period</li>
                        </ol>
                    </p>
                    <p>If there are fewer than 10 unique groups or 50 unique users, or the groups do not meet the minimum weekly prediction requirement, no prize money will be distributed for that period.</p>
                    <p>A $250 prize will be given to the group with the highest prediction score for the following regular season periods:
                        <ol>
                            <li>Weeks 1-5</li>
                            <li>Weeks 6-9</li>
                            <li>Weeks 10-13</li>
                            <li>Weeks 14-18</li>
                        </ol>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Rules