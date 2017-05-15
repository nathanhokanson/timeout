import {Component, Renderer2, ViewChild} from '@angular/core';
import {Store, Dispatcher} from "@ngrx/store";
import {AppState} from "./state-management/state/app.state";
import {INCREMENT} from "./state-management/actions/app.actions";
import * as moment from "moment";
import {Subscription, Observable} from "rxjs";

const millis = 1000;
const interval = millis * 20;
const logoutSpan = millis * 160;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '';
  state:AppState;
  private timeoutSubscription:Subscription;
  private logoutSubscription:Subscription;
  private listener:Function;

  @ViewChild('onPageConsole') onPageConsole;

  constructor(private store:Store<AppState>, private dispatcher:Dispatcher, private renderer:Renderer2) {
    store.select('appReducer').subscribe((state:AppState) => {
      this.log('state changed');
      this.state = state;

      if (!this.timeoutSubscription) {
        this.setTimeoutSubscription();
      }
    });
  }

  removeListener() {
    this.log('removing listener');
    this.listener();
    this.logoutSubscription.unsubscribe();
    this.logoutSubscription = undefined;
    this.setTimeoutSubscription();
  }

  setTimeoutSubscription() {
    this.log('starting timer for timeout')
    this.timeoutSubscription = Observable.timer(interval, interval).subscribe(() => {
      this.log('checking timeout');
      let diff = moment().diff(this.state.lastAccessed);
      if (diff > interval) {
        this.log("state was not touched in " + (diff / millis) + ' seconds.  Adding listeners.');
        this.listener = this.renderer.listen('document', 'mousemove', this.removeListener.bind(this));
        this.log('starting timer for logout')
        this.logoutSubscription = Observable.timer(millis, millis).subscribe((x) => {
          this.log(x + ' seconds have passed without stuff');
          if (x >= 10) {
            this.log('user should be logged out now');
          }
        })
        this.timeoutSubscription.unsubscribe();
        this.timeoutSubscription = undefined;
      }
    });
  }

  incrementCounter() {
    this.dispatcher.dispatch({
      type: INCREMENT
    });
  }

  log(message:string) {
    let logStr = moment().format('YYYY-MMM-DD HH:mm:ss') + ' ' + message;
    if (this.onPageConsole) {
      this.onPageConsole.nativeElement.innerHTML += logStr + '<br/>';
      this.onPageConsole.nativeElement.scrollTop = this.onPageConsole.nativeElement.scrollHeight;
    } else {
      console.log(logStr);
    }
  }
}
