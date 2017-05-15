import {Action, ActionReducer} from "@ngrx/store";
import * as moment from 'moment';

import {initialState, AppState} from "../state/app.state";
import {INCREMENT, EVENT_FROM_EFFECT} from "../actions/app.actions";

export const appReducer:ActionReducer<AppState> =
  (state = initialState, action: Action) => {
    console.log(action.type);
    const newState = Object.assign(state, {
      lastAccessed:moment()
    });

    switch (action.type) {
      case INCREMENT: {
        return Object.assign(newState, {
          counter: state.counter + 1
        })
      }

      case EVENT_FROM_EFFECT: {
        return Object.assign(newState, {
          counter: 4
        });
      }

      default: {
        return state;
      }
    }
  };
