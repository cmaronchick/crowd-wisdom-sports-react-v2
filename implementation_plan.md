# Implementation Plan - Incorporating Wagering Functionality

This plan details the design and changes required to integrate the wagering functionality from the React Native app into the React web app.

## User Review Required

> [!IMPORTANT]
> **API & State Integration**: This feature leverages the same backend API as the React Native app. We will proxy requests from the local express gateway (`/api`) to the AWS backend.
> **Wager Selection UX**: The wagering layout will be hosted in a modern modal, leveraging Ant Design components and customized styling to match the web application.

---

## Proposed Changes

### 1. Express Gateway API Proxy [NEW] [MODIFY]

We need to proxy the wagering and lines-related requests from our local Express router to the AWS API Gateway backend.

#### [NEW] [wagers.js](file:///Users/chrisaronchick/GitHub/crowd-wisdom-sports-react-v2/api/handlers/wagers.js)
Create express handlers for:
- `getCurrentLines`: `/api/:sport/games/:year/:season/:gameWeek/game/:gameId/currentlines`
- `submitWager`: `/api/predictions/wager` (POST)
- `getWagers`: `/api/predictions/wager` (GET)

#### [MODIFY] [index.js](file:///Users/chrisaronchick/GitHub/crowd-wisdom-sports-react-v2/api/index.js)
Register the new endpoints and hook them up to the wagers handler.

---

### 2. Redux State & Actions [MODIFY]

We need to add state, actions, and reducers to handle wagering data (loading state, available lines, user wagers list, and wagers posting).

#### [MODIFY] [types.js](file:///Users/chrisaronchick/GitHub/crowd-wisdom-sports-react-v2/client/src/redux/types.js)
Add new action types:
- `LOADING_WAGERS`, `SET_WAGERS`, `ADD_WAGER`
- `LOADING_ODDS`, `SET_GAME_ODDS`

#### [MODIFY] [predictionsReducer.js](file:///Users/chrisaronchick/GitHub/crowd-wisdom-sports-react-v2/client/src/redux/reducers/predictionsReducer.js)
Add wagers to the state (`wagers: null`, `loadingWagers: false`) and handle the `SET_WAGERS`, `ADD_WAGER`, and `LOADING_WAGERS` actions.

#### [MODIFY] [gamesReducer.js](file:///Users/chrisaronchick/GitHub/crowd-wisdom-sports-react-v2/client/src/redux/reducers/gamesReducer.js)
Handle `LOADING_ODDS` and `SET_GAME_ODDS` to update the games object with fetched real-time lines (`currentLines`).

#### [MODIFY] [predictionsActions.js](file:///Users/chrisaronchick/GitHub/crowd-wisdom-sports-react-v2/client/src/redux/actions/predictionsActions.js)
Add `submitWager(game, prediction, wager)` and `fetchWagers({ sport, year, season, week, gameId })` actions using the proxied Express endpoints.

#### [MODIFY] [gamesActions.js](file:///Users/chrisaronchick/GitHub/crowd-wisdom-sports-react-v2/client/src/redux/actions/gamesActions.js)
Add the `fetchCurrentLines(sport, year, season, gameWeek, gameId, awayTeamId, homeTeamId)` action to query the API for live odds from multiple sportsbooks.

---

### 3. Utility Logic & Layout Changes [NEW] [MODIFY]

Port utility calculations and add frontend components.

#### [NEW] [oddsMovement.js](file:///Users/chrisaronchick/GitHub/crowd-wisdom-sports-react-v2/client/src/functions/oddsMovement.js)
Implement `getWagerValueSignals` and other odds calculation functions ported from the React Native codebase.

#### [MODIFY] [utils.js](file:///Users/chrisaronchick/GitHub/crowd-wisdom-sports-react-v2/client/src/functions/utils.js)
Extend utility functions (`straightUpPrediction`, `spreadPrediction`, `totalPrediction`) to format wager descriptions correctly.

#### [NEW] [WagerModal.js](file:///Users/chrisaronchick/GitHub/crowd-wisdom-sports-react-v2/client/src/components/game/WagerModal.js)
Implement a beautiful dialog window displaying either the wagering panel or the wagers list for the selected game.

#### [NEW] [PredictionStakesPredict.js](file:///Users/chrisaronchick/GitHub/crowd-wisdom-sports-react-v2/client/src/components/game/PredictionStakesPredict.js)
The wagering board where the user selects stake levels, configures custom amounts, and views sportsbook lines.

#### [NEW] [WagerRow.js](file:///Users/chrisaronchick/GitHub/crowd-wisdom-sports-react-v2/client/src/components/game/WagerRow.js)
A single row in the stakes sheet showing the selected team/odds, star buttons for stakes, custom input, and horizontal sportsbook odds list.

#### [NEW] [WagerSlip.js](file:///Users/chrisaronchick/GitHub/crowd-wisdom-sports-react-v2/client/src/components/game/WagerSlip.js)
A summary list component of all stakes placed for the selected game or week, displaying ROI, net change, and selection details.

#### [NEW] [WagerHistory.js](file:///Users/chrisaronchick/GitHub/crowd-wisdom-sports-react-v2/client/src/components/profile/WagerHistory.js)
A dedicated page under profile showing the user's wagering history across different sports and wager types with toggleable filters.

#### [MODIFY] [GamePreview.js](file:///Users/chrisaronchick/GitHub/crowd-wisdom-sports-react-v2/client/src/components/game/GamePreview.js)
Integrate the "Wager" or "Get Current Lines" buttons, and attach the `WagerModal`.

#### [MODIFY] [SideMenu.js](file:///Users/chrisaronchick/GitHub/crowd-wisdom-sports-react-v2/client/src/components/layout/sidemenu/SideMenu.js)
Add a "Wager History" navigation item for authenticated users.

#### [MODIFY] [App.js](file:///Users/chrisaronchick/GitHub/crowd-wisdom-sports-react-v2/client/src/App.js)
Register `/wagers` routing linking to the `WagerHistory` component.

---

## Verification Plan

### Automated Tests
We will execute unit tests in the client to ensure no regressions:
- Run client tests: `cd client && yarn test`

### Manual Verification
- Launch the application locally (`npm run start:dev` / `yarn start:dev`).
- Confirm the "Wager" buttons show up for games.
- Open the wagering modal, select stakes/sportsbooks, and verify successful BET submission.
- Navigate to "Wager History" and verify filtered history lists.
