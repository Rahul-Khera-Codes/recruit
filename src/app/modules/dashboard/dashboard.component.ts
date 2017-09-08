import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImapMailsService } from './../../service//imapemails.service';
import { DashboardService } from './../../service/dashboard.service';
import { config } from './../../config/config';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    dashboardData: any;
    dashboardChartOptions = config.dashboardChartOptions;
    lineChartLegend = true;
    subscription: any;
    isHome: boolean;
    pieChartOption = config.dashboardPieChartOptions;
    jobSelection = 'byDay';
    dashboardIntervalSubscription: any;
    constructor(private route: ActivatedRoute, private _apiService: ImapMailsService, private _dashboardService: DashboardService) { }

    ngOnInit() {
        this.subscription = this.route.data.subscribe(res => this.isHome = res.isHome);
        this.loadDashBoardData();
        this.dashboardIntervalSubscription = setInterval(() => {
            this.loadDashBoardData();
        }, config.dashboardChartRefreshTime);
    }

    loadDashBoardData() {
        this._apiService.getDashboardData().subscribe((res) => {
            this.dashboardData = this._dashboardService.formatChartData(res);
        }, (err) => {
            console.log(err)
        });
    }

    chartClicked(e) {
        console.log(e);
    }

    chartHovered(e) {
        console.log(e);
    }
    ngOnDestroy() {
        clearInterval(this.dashboardIntervalSubscription);
    }

}
