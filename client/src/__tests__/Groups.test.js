import React from 'react';
import { render } from '@testing-library/react';
import Group from '../components/groups/Group';
import { fetchGroup } from '../redux/actions/groupActions'
import { LOADING_GROUP, SET_GROUP } from '../redux/types'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../redux/store'
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

const testGroup = {
    _id: '5e0c25e3904ad50001dc2ad1',
    owner: {
      username: 'cmaronchick',
      firstName: 'Chris',
      lastName: 'Aronchick',
      preferred_username: 'cmaronchick'
    },
    groupName: 'SHS Playoffs',
    sport: 'nfl',
    year: 2019,
    'public': true,
    password: '',
    users: [
      {
        username: 'cmaronchick',
        firstName: 'Chris',
        lastName: 'Aronchick',
        preferred_username: 'cmaronchick',
        results: {
          weekly: [
            {
              gameWeek: 1,
              winner: {
                correct: 2,
                push: 0,
                bullseyes: 0
              },
              spread: {
                correct: 2,
                push: 0,
                bullseyes: 1,
                stars: {
                  wagered: 12,
                  net: 0
                }
              },
              total: {
                correct: 2,
                push: 0,
                bullseyes: 0,
                stars: {
                  wagered: 9,
                  net: -3
                }
              },
              predictionScore: 13,
              stars: {
                wagered: 21,
                net: -3,
                roi: -0.14285714285714285
              },
              totalPredictions: 4
            },
            {
              gameWeek: 2,
              winner: {
                correct: 2,
                push: 0,
                bullseyes: 2
              },
              spread: {
                correct: 0,
                push: 0,
                bullseyes: 0,
                stars: {
                  wagered: 9,
                  net: -9
                }
              },
              total: {
                correct: 2,
                push: 0,
                bullseyes: 1,
                stars: {
                  wagered: 12,
                  net: 0
                }
              },
              predictionScore: 11,
              stars: {
                wagered: 21,
                net: -9,
                roi: -0.42857142857142855
              },
              totalPredictions: 4
            },
            {
              gameWeek: 3,
              winner: {
                correct: 2,
                push: 0,
                bullseyes: 1
              },
              spread: {
                correct: 1,
                push: 0,
                bullseyes: 0,
                stars: {
                  wagered: 3,
                  net: -3
                }
              },
              total: {
                correct: 0,
                push: 0,
                bullseyes: 0,
                stars: {
                  wagered: 6,
                  net: -6
                }
              },
              predictionScore: 7,
              stars: {
                wagered: 9,
                net: -9,
                roi: -1
              },
              totalPredictions: 2
            },
            {
              gameWeek: 4,
              winner: {
                correct: 0,
                push: 0,
                bullseyes: 0
              },
              spread: {
                correct: 0,
                push: 0,
                bullseyes: 0,
                stars: {
                  wagered: 3,
                  net: -3
                }
              },
              total: {
                correct: 1,
                push: 0,
                bullseyes: 0,
                stars: {
                  wagered: 3,
                  net: 3
                }
              },
              predictionScore: 4,
              stars: {
                wagered: 6,
                net: 0,
                roi: 0
              },
              totalPredictions: 1
            }
          ],
          overall: {
            winner: {
              correct: 6,
              bullseyes: 3,
              percentage: 0.5454545454545454
            },
            spread: {
              correct: 3,
              push: 0,
              bullseyes: 1,
              percentage: 0.2727272727272727,
              stars: {
                wagered: 27,
                net: -15
              }
            },
            total: {
              correct: 5,
              push: 0,
              bullseyes: 1,
              percentage: 0.45454545454545453,
              stars: {
                wagered: 30,
                net: -6
              }
            },
            predictionScore: 35,
            stars: {
              wagered: 57,
              net: -21,
              roi: -0.3684210526315789
            },
            totalPredictions: 11
          }
        }
      }
    ],
    groupId: 24,
    totalPredictionScore: 0,
    predictions: [
      {
        gameId: 1233884,
        year: 2019,
        season: 'post',
        gameWeek: 2,
        awayTeam: {
          score: 24
        },
        homeTeam: {
          score: 27
        },
        total: 51,
        spread: -3,
        results: {
          winner: {
            correct: 1,
            push: 0
          },
          spread: {
            correct: 0,
            push: 0
          },
          total: {
            correct: 0,
            push: 0
          },
          predictionScore: 3
        }
      },
      {
        gameId: 1232785,
        year: 2019,
        season: 'post',
        gameWeek: 1,
        awayTeam: {
          score: 14
        },
        homeTeam: {
          score: 34
        },
        total: 48,
        spread: -20,
        results: {
          winner: {
            correct: 0,
            push: 0
          },
          spread: {
            correct: 0,
            push: 0
          },
          total: {
            correct: 1,
            push: 0
          },
          predictionScore: 2
        }
      },
      {
        gameId: 1234560,
        year: 2019,
        season: 'post',
        gameWeek: 3,
        awayTeam: {
          score: 24
        },
        homeTeam: {
          score: 27
        },
        total: 51,
        spread: -3,
        results: {
          winner: {
            correct: 1,
            push: 0
          },
          spread: {
            correct: 0,
            push: 0
          },
          total: {
            correct: 0,
            push: 0
          },
          predictionScore: 3
        }
      },
      {
        gameId: 1232790,
        year: 2019,
        season: 'post',
        gameWeek: 1,
        awayTeam: {
          score: 24
        },
        homeTeam: {
          score: 21
        },
        total: 45,
        spread: 3,
        results: {
          winner: {
            correct: 1,
            push: 0
          },
          spread: {
            correct: 1,
            push: 0
          },
          total: {
            correct: 0,
            push: 0
          },
          predictionScore: 4
        }
      },
      {
        gameId: 1233827,
        year: 2019,
        season: 'post',
        gameWeek: 2,
        awayTeam: {
          score: 27
        },
        homeTeam: {
          score: 30
        },
        total: 57,
        spread: -3,
        results: {
          winner: {
            correct: 1,
            push: 0
          },
          spread: {
            correct: 0,
            push: 0
          },
          total: {
            correct: 1,
            push: 0
          },
          predictionScore: 4
        }
      },
      {
        gameId: 1233822,
        year: 2019,
        season: 'post',
        gameWeek: 2,
        awayTeam: {
          score: 13
        },
        homeTeam: {
          score: 27
        },
        total: 40,
        spread: -14,
        results: {
          winner: {
            correct: 0,
            push: 0
          },
          spread: {
            correct: 0,
            push: 0
          },
          total: {
            correct: 1,
            push: 0
          },
          predictionScore: 3
        }
      },
      {
        gameId: 1232780,
        year: 2019,
        season: 'post',
        gameWeek: 1,
        awayTeam: {
          score: 17
        },
        homeTeam: {
          score: 28
        },
        total: 45,
        spread: -11,
        results: {
          winner: {
            correct: 0,
            push: 0
          },
          spread: {
            correct: 0,
            push: 0
          },
          total: {
            correct: 0,
            push: 0
          },
          predictionScore: 0
        }
      },
      {
        gameId: 1232775,
        year: 2019,
        season: 'post',
        gameWeek: 1,
        awayTeam: {
          score: 17
        },
        homeTeam: {
          score: 20
        },
        total: 37,
        spread: -3,
        results: {
          winner: {
            correct: 1,
            push: 0
          },
          spread: {
            correct: 1,
            push: 0
          },
          total: {
            correct: 1,
            push: 0
          },
          predictionScore: 7
        }
      },
      {
        gameId: 1233912,
        year: 2019,
        season: 'post',
        gameWeek: 2,
        awayTeam: {
          score: 23
        },
        homeTeam: {
          score: 20
        },
        total: 43,
        spread: 3,
        results: {
          winner: {
            correct: 0,
            push: 0
          },
          spread: {
            correct: 0,
            push: 0
          },
          total: {
            correct: 0,
            push: 0
          },
          predictionScore: 1
        }
      },
      {
        gameId: 1235067,
        year: 2019,
        season: 'post',
        gameWeek: 4,
        awayTeam: {
          score: 23
        },
        homeTeam: {
          score: 20
        },
        total: 43,
        spread: 3,
        results: {
          winner: {
            correct: 0,
            push: 0
          },
          spread: {
            correct: 0,
            push: 0
          },
          total: {
            correct: 1,
            push: 0
          },
          predictionScore: 2
        }
      },
      {
        gameId: 1234565,
        year: 2019,
        season: 'post',
        gameWeek: 3,
        awayTeam: {
          score: 17
        },
        homeTeam: {
          score: 27
        },
        total: 44,
        spread: -10,
        results: {
          winner: {
            correct: 1,
            push: 0
          },
          spread: {
            correct: 1,
            push: 0
          },
          total: {
            correct: 0,
            push: 0
          },
          predictionScore: 4
        }
      }
    ],
    results: {
      nfl: {
        '2019': {
          post: {
            weekly: [
              {
                gameWeek: 1,
                season: 'post',
                winner: {
                  correct: 2,
                  push: 0
                },
                spread: {
                  correct: 2,
                  push: 0
                },
                total: {
                  correct: 2,
                  push: 0
                },
                predictionScore: 13,
                totalPredictions: 4
              },
              {
                gameWeek: 2,
                season: 'post',
                winner: {
                  correct: 2,
                  push: 0
                },
                spread: {
                  correct: 0,
                  push: 0
                },
                total: {
                  correct: 2,
                  push: 0
                },
                predictionScore: 11,
                totalPredictions: 4
              },
              {
                gameWeek: 3,
                season: 'post',
                winner: {
                  correct: 2,
                  push: 0
                },
                spread: {
                  correct: 1,
                  push: 0
                },
                total: {
                  correct: 0,
                  push: 0
                },
                predictionScore: 7,
                totalPredictions: 2
              },
              {
                gameWeek: 4,
                season: 'post',
                winner: {
                  correct: 0,
                  push: 0
                },
                spread: {
                  correct: 0,
                  push: 0
                },
                total: {
                  correct: 1,
                  push: 0
                },
                predictionScore: 2,
                totalPredictions: 1
              }
            ],
            overall: {
              winner: {
                correct: 6,
                push: 0
              },
              spread: {
                correct: 3,
                push: 0
              },
              total: {
                correct: 5,
                push: 0
              },
              predictionScore: 33,
              totalPredictions: 11
            }
          }
        }
      },
      overall: {
        winner: {
          correct: 6,
          push: 0
        },
        spread: {
          correct: 3,
          push: 0
        },
        total: {
          correct: 5,
          push: 0
        },
        predictionScore: 33,
        totalPredictions: 11
      }
    },
    memberOf: false,
    selectedSeason: 'post'
  }

describe('render the group screen', () => {
    
    test('present a loading game message when game is missing', () => {
        store.dispatch({
            type: LOADING_GROUP
        })
        const { getByTitle } = render(<Provider store={store}><Router><Route component={Group} /></Router></Provider>);
        const linkElement = getByTitle(/Loading Group/i);
        
        expect(linkElement).toBeInTheDocument();
    })
    test('present a no group found when no group is returned', () => {
        store.dispatch({
            type: SET_GROUP,
            payload: {}
        })

        const { getByText } = render(<Provider store={store}><Router><Route component={Group} /></Router></Provider>);
        const linkElement = getByText(/No group found/i);
        
        expect(linkElement).toBeInTheDocument();
    })
    test('present a group found when a group is provided', () => {
        store.dispatch({
            type: SET_GROUP,
            payload: testGroup
        })

        const { getByText } = render(<Provider store={store}><Router><Route component={Group} /></Router></Provider>);
        const linkElement = getByText(/SHS Playoffs/i);
        
        expect(linkElement).toBeInTheDocument();
    })


})