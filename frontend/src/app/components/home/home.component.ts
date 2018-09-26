import { Component } from '@angular/core';
import { NetMetricsService } from '../../services/net.metrics/net.metrics.service';
import { Observable } from 'rxjs';
import { RaidenNetworkMetrics, TokenNetwork } from '../../models/TokenNetwork';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { SharedService } from '../../services/net.metrics/shared.service';
import { Message } from '../../services/net.metrics/message';
import { tap } from 'rxjs/operators';
import { NetMetricsConfig } from '../../services/net.metrics/net.metrics.config';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        animate(300, keyframes([
          style({opacity: 0, transform: 'translateX(-100%)', offset: 0}),
          style({opacity: 1, transform: 'translateX(15px)', offset: 0.3}),
          style({opacity: 1, transform: 'translateX(0)', offset: 1.0})
        ]))
      ]),
      transition('* => void', [
        animate(300, keyframes([
          style({opacity: 1, transform: 'translateX(0)', offset: 0}),
          style({opacity: 1, transform: 'translateX(-15px)', offset: 0.7}),
          style({opacity: 0, transform: 'translateX(100%)', offset: 1.0})
        ]))
      ])
    ])
  ]
})
export class HomeComponent {

  metrics$: Observable<RaidenNetworkMetrics>;
  messages$: Observable<Message>;
  private _loading = true;

  public get loading(): boolean {
    return this._loading;
  }

  public get main(): boolean {
    return this.config.main;
  }

  constructor(
    private netMetricsService: NetMetricsService,
    private sharedService: SharedService,
    private config: NetMetricsConfig
  ) {
    this.metrics$ = netMetricsService.metrics$.pipe(tap(() => this._loading = false));
    this.messages$ = sharedService.messages;
  }

  // noinspection JSMethodCanBeStatic
  public scrollToA(loc: string) {
    document.getElementById(loc).scrollIntoView();
  }

  //noinspection JSMethodCanBeStatic
  trackByFn(network: TokenNetwork) {
    return network.token;
  }

  //noinspection JSMethodCanBeStatic
  getVisible(tokenNetworks: TokenNetwork[], current: number) {
    let start: number;
    let end: number;
    if (current > 0) {
      start = current - 1;
    } else {
      start = 0;
    }

    if (current === tokenNetworks.length) {
      end = current;
    } else {
      end = current + 2;
    }

    return tokenNetworks.slice(start, end);
  }
}