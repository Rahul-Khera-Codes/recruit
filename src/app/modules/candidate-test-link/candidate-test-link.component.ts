import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlHandlingStrategy } from '@angular/router';
import { ImapMailsService } from '../../service/imapemails.service';
import { MatSnackBar } from '@angular/material';
import { LocalStorageService } from '../../service/local-storage.service';

@Component({
  selector: 'app-candidate-test-link',
  templateUrl: './candidate-test-link.component.html',
  styleUrls: ['./candidate-test-link.component.scss']
})
export class CandidateTestLinkComponent implements OnInit {

  notificationId: any;
  userId: any;
  urlId: any;
  spinner: boolean;
  constructor(private route: ActivatedRoute, private imapmailservice: ImapMailsService, private snackBar: MatSnackBar, private router: Router, private localstorageservice: LocalStorageService) { }

  ngOnInit() {
    this.spinner = false;
    this.userId = this.route.snapshot.params.userId;
    this.route.queryParamMap.subscribe(param => {
      this.notificationId = param.get('notificationId')
    })
  }

  generateTestLink() {
    this.spinner = true;
    this.imapmailservice.getexamAutomation(this.userId, this.notificationId).subscribe(res => {
    }, (err) => {
      console.log(err);
    });
    this.imapmailservice.generateTestLinkByCandidate(this.userId).subscribe((response) => {
      const url = `${window.location.origin}/#/app-deep-link/${response.data}`;
      window.location.replace(url)
      this.spinner == false;
    }, (err) => {
      console.log(err);
    })
  }
}

