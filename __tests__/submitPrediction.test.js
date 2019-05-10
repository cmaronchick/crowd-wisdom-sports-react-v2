import * as ajax from '../src/ajax'

test('should submit the proper prediction information', () => {
    const game = {
        gameId: 1108878,
        gameWeek: 1,
        year: 2019,
        sport: 'nfl',
        season: 'pre',
        awayTeam: {
            fullName: 'Denver Broncos',
            shortName: 'Broncos',
            code: 'DEN'
        },
        homeTeam: {
            fullName: 'Atlanta Falcons',
            shortName: 'Falcons',
            code: 'ATL'
        }
    };
    const prediction = ajax.submitPrediction(game, 20, 24)
    expect(prediction).toEqual({
        gameId: 1108878,
        gameWeek: 1,
        year: 2019,
        sport: 'nfl',
        season: 'pre',
        awayTeam: {
            fullName: 'Denver Broncos',
            shortName: 'Broncos',
            code: 'DEN',
            score: 20
        },
        homeTeam: {
            fullName: 'Atlanta Falcons',
            shortName: 'Falcons',
            code: 'ATL',
            score: 24
        }
    })
});