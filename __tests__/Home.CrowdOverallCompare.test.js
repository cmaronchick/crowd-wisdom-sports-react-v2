import {fetchCrowdOverall} from '../src/apis'

describe('it should have a sport, year, season, and week', () => {
    
});

test('should receive the leaderboard in proper format', async () => {
    try {
        let crowdOverallData = await fetchCrowdOverall('nfl', 2019, 'reg', 7);
        expect(crowdOverallData).toEqual({
            overall: [
                ["Week", "S/U", "ATS", "O/U"],
                [1, 66, 62, 43],
                [2, 67, 54, 46],
                [3, 63, 55, 48],
                [4, 59, 48, 54],
                [5, 58, 46, 55],
                [6, 57, 45, 55],
                [7, 51, 33, 39],
            ],
            overallRecord: {
                gameWeek: 7,
                predictionScore: 629,
                spread: {
                    correct: 82,
                    incorrect: 162,
                    push: 2
                },
                total: {
                    correct: 96,
                    incorrect: 145,
                    push: 5
                },
                totalGames: 246,
                winner: {
                    correct: 127,
                    incorrect: 119
                }
            },
            weekly: [
                ["Week", "S/U", "ATS", "O/U", "Total Games"],
                [1, 10, 10, 7],
                [2, 11, 7, 8],
                [3, 9, 9, 8],
                [4, 7, 4, 11],
                [5, 8, 6, 9],
                [6, 7, 5, 7],
                [7, 10, 6, 5],
            ],
            weeklyRecord: {
                gameWeek: 7,
                predictionScore: 42,
                spread: {
                    correct: 6,
                    incorrect: 8,
                    push: 0
                },
                total: {
                    correct: 5,
                    incorrect: 8,
                    push: 1
                },
                winner: {
                    correct: 10,
                    incorrect: 4
                }
            }
        })
    } catch (crowdOverallDataError) {
        console.log({crowdOverallDataError})
    }
})

