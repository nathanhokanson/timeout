import * as moment from 'moment';

export interface AppState {
  lastAccessed:any;
  counter: number;
}

export const initialState: AppState = {
  lastAccessed:moment(),
  counter: 0
};
