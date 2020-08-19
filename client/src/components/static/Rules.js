
import React, { Fragment } from 'react'
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
                    <p>Odds are provided by <a href="https://oddsshark.com" target="_blank">oddsshark.com</a>.</p>
                    <p>Odds are locked when you make your prediction. If the spread or total odds line changes after you make your prediction, your odds will remain as they were when you made your prediction.<br/>
                    If you update your prediction, you will be given the odds at that time.<br/>
                    Your prediction score and stakes return will be evaluated against the odds associated to your prediction.</p>
                    <h3>Scoring</h3>
                    <p>Each prediction can earn a maximum of 10 points:</p>
                    <ul>
                    <li>Predict the winner correctly: 2 points</li>
                    <li>Predict the spread winner correctly: 2 points</li>
                    <li>Predict the Over/Under total correctly: 2 points</li>
                    <li>Predict the final spread exactly right: 1 point</li>
                    <li>Predict the final total exactly right: 1 point</li>
                    <li>Predict the exact score for the home team: 1 point</li>
                    <li>Predict the exact score for the away team: 1 point</li>
                    </ul>
                    <p>At the end of each weekend, we tally all of the points and the user(s) with the highest point total earns the weekly purse. The user(s) with the highest point total for all predictions at the end of the postseason (after the final game), earns the end-of-postseason purse.</p>
                    <h3>Stakes</h3>
                    <p>You can wager up to 3 stakes on any spread or over/under line. You do not have to wager any stakes on a game.</p>
                    <p>If you predict the spread or over/under side correctly, you earn the stakes you wager. If you are incorrect on the line you wagered, you will lose those stakes.</p>
                    <p>At the end of the week or the season, we will tally the net result for each user, and the winner will be determined by the highest net stakes.</p>
                    <ul>
                        <li>If User #1 wagers 30 stakes (3 stakes on 10 wagers), wins 18 (6 correct) and loses 12 (4 incorrect), their net will be +6 stakes.</li>
                        <li>If User #2 wagers 12 stakes (3 stakes on 4 wagers), wins 12 (4 correct), their net will be +12 stakes.</li>
                        <li>User #2 will win the weekly prize based on the net stakes even though they had fewer correct wagers.</li>
                    </ul>
                    <h3>Weekly Tiebreakers:</h3>
                    <p>In the event that two or more users have the same prediction scores, the tiebreakers will be applied in the following order:</p>
                    <ol>
                    <li>The user who predicted more winners correctly</li>
                    <li>The user who predicted more spread sides correctly</li>
                    <li>The user who predicted more totals correctly</li>
                    <li>The lower average delta from the user’s predicted spread to the actual spread across all games</li>
                    <li>The lower average delta from the user’s predicted totals to the actual totals across all games</li>
                    </ol>
                    <p>If users are still tied after all 5 tiebreakers, the users will split the winnings.</p>
                    <h3>End-of-Season Tiebreakers:</h3>
                    <ol>
                    <li>The user who predicted more winners across all games correctly</li>
                    <li>The user who predicted more spread sides across all games correctly.</li>
                    <li>The user who predicted more total sides across all games correctly.</li>
                    </ol>
                    <h3>Prizes:</h3>
                    <h4>Weekly</h4>
                    <p>There are two $25 weekly prizes available.</p>
                    <ol>
                        <li>The user who earns the highest prediction score</li>
                        <li>The user who wins the most stakes</li>
                    </ol>
                    <ul>
                    <li>Weekly: Half of the pot will be distributed to the user(s) who had the highest aggregate score (and won the tiebreakers, if necessary).</li>
                    <li>End-of-Season: The other half of each weekly pot will be set aside for the end-of-season winner, and the accumulated total will be distributed to the user who had the highest aggregate score.</li>
                    </ul>
                </div>
            </div>

            <div className="row footer">
                <div className="col-xs-12">
                    <a href="/" style={{color: '#fff'}}>Stakehouse Sports</a> | <a href="https://app.termly.io/document/privacy-policy/79832fc4-999b-4a5c-b459-002bb84e862e" target="_blank" style={{color:'#fff'}}>Privacy Policy</a>
                </div> 
            </div>
        </div>
    )
}

export default Rules