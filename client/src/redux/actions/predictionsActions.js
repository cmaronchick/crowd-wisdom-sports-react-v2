import { LOADING_GAMES,
    SET_GAMES,
    LOADING_GAME,
    SET_GAME,
    LOADING_PREDICTIONS,
    LOADING_COMPARED_USER_PREDICTIONS,
    SET_PREDICTIONS,
    SET_ERRORS,
    CLEAR_ERRORS
} from '../types'

import { Auth } from '@aws-amplify/auth'
import ky from 'ky/umd'
import store from '../store';