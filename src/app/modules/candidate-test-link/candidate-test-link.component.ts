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

  userId: any;
  urlId: any;
  spinner: boolean;
  constructor(private route: ActivatedRoute, private imapmailservice: ImapMailsService, private snackBar: MatSnackBar, private router: Router, private localstorageservice: LocalStorageService) { }

  ngOnInit() {
    this.spinner = false;
    this.route.params.subscribe(param => {
      // code to get id from url
      this.userId = param.userId
    })
  }

  generateTestLink(pageUrl) {
    this.spinner = true;
    this.imapmailservice.generateTestLinkByCandidate(this.userId).subscribe((response) => {
      const url = `${window.location.origin}/#/app-deep-link/${response.data}`;
      window.location.replace(url)
      this.spinner == false;
    }, (err) => {
      console.log(err);
    })
  }
}
