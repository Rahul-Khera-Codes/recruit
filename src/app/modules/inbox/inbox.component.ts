import {
    Component,
    OnInit,
    OnDestroy
} from '@angular/core';
import {
    Router,
    NavigationStart,
    RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import {
    ImapMailsService
} from '../../service/imapemails.service';
import {
    MatDialog,
    MatDialogConfig,
    MatDialogRef
} from '@angular/material';
import {
    EmailModalComponent
} from '../email-modal/email-modal.component';
import {
    MatSnackBar
} from '@angular/material';
import {
    NgForm,
    FormControl,
    Validators
} from '@angular/forms';
import { Location } from '@angular/common';
import { CoreComponent } from './../../modules/core/core.component';
import { ComposeEmailComponent } from './../../modules/compose-email/compose-email.component';
import { LocalStorageService } from './../../service/local-storage.service';
import { CommonService } from './../../service/common.service';
import { DialogService } from './../../service/dialog.service';
import { environment } from '../../../environments/environment';
import * as _ from 'lodash';
import { AddCandidateComponent } from './../add-candidate/add-candidate.component';
import { RemoveMailsDialogComponent } from './../remove-mails-dialog/remove-mails-dialog.component';
import { ArchiveMailComponent } from './../archive-mail/archive-mail.component';
import { config } from './../../config/config';
import { SelectShortListedWeightageModalComponent } from '../../modules/select-short-listed-weightage-modal/select-short-listed-weightage-modal.component';
@Component({
    selector: 'app-inbox',
    templateUrl: './inbox.component.html',
    styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit, OnDestroy {
    dialogRef: MatDialogRef<any>;
    Math: any;
    emaillist: any;
    loading = false;
    tag_id: string;
    tags: any;
    data: any;
    selected: any;
    emailIds: string[];
    selectedTag: any;
    message: string;
    showmessage: boolean;
    showInboxEmailList = true;
    subscription: any;
    tagsForEmailListAndModel: any;
    subject_for_genuine: string;
    emailParentId: any;
    emailChildId: any;
    emailParenttitle: string;
    emailChildTitle: string;
    selectedTagTitle: string;
    sendSuccessEmailListCount: any;
    sendFailedEmailListCount: any;
    dataForInterviewScheduleRound = [];
    inboxRefreshSubscription: any;
    fetchEmailSubscription: any;
    role: string;
    inboxMailsTagsForEmailListAndModel: any;
    lastSelectedTagData: any;
    goToPageNo: number;
    email: any;
    intervieweeList: any;
    selectedOption: any;
    emailLimit: number;
    onStarredPage: boolean;
    currentPage: any;
    isSearching = false;
    noOfMails: any;
    tagStatus: any;
    constructor(public _core: CoreComponent, public _location: Location, public _router: Router, public dialog: MatDialog, public getemails: ImapMailsService, public snackBar: MatSnackBar, public _localStorageService: LocalStorageService, public _commonService: CommonService, public _dialogService: DialogService) {
        this.Math = Math;
        this.fetchEmailSubscription = this.getemails.componentMehtodCalled$.subscribe(
            () => {
                this.fetchNewEmails();
            });
        this.role = this._localStorageService.getItem('role');

    }
    ngOnInit() {
        this.emailLimit = config.emailLimit;
        this.emailIds = [];
        this.loading = true;
        this.data = {
            'page': 1,
            'tag_id': 0,
            'limit': this.emailLimit
        };
        this.selectedOption = 'email';
        this.defaultOpen();
        setTimeout(() => {
            if (this._location.path().substr(0, 17) === '/core/inbox/email') {
                this.showInboxEmailList = false;
            } else {
                this.showInboxEmailList = true;
            }
        });
        this.subscription = this._core.routerInboxPage.subscribe(() => {
            this.showInboxEmailList = true;
        });
        this.inboxRefreshSubscription = this._commonService.inboxRefresh.subscribe(() => {
            this.refresh();
        });
        this.getIntervieweeList();
        window.addEventListener('storage', (ev) => {
            if (ev.key === 'updateInbox') {
                this.updateInbox(ev.newValue);
                this.getAllTag();
            }
            if (ev.key === 'tagReassigned') {
                this.tagReassigned(ev.newValue);
            }
        });
    }
    starred(data) {
        this.onStarredPage = data;
        this.loading = true;
        this.getemails.getStarredMails().subscribe((res) => {
            this.addSelectedFieldInEmailList(res);
            this.emailIds = [];
            this.loading = false;
        }, (err) => {
            console.log(err);
        })
    }

    defaultOpen() {
        this.getemails.getAllTagsMain()
            .subscribe((res) => {
                this._localStorageService.setItem('allTags', res);
                this.formatTagsInArray(res.data);
                if (res.data.length > 0) {
                    _.forEach(res.data, (value, key) => {
                        if (value['title'] === 'inbox') {
                            _.forEach(value['data'], (subMenuValue, subMenukey) => {
                                if (subMenuValue['title'] === 'Attachment') {
                                    this.data.tag_id = subMenuValue['id'];
                                    this.selectedTag = subMenuValue['id'];
                                    this.selectedTagTitle = subMenuValue['title'] || '';
                                    // this.emailParentId = '0';
                                    this.emailChildId = subMenuValue['id'];
                                    this.emailParenttitle = value['title'];
                                    this.emailChildTitle = subMenuValue['title'] || '';
                                    this.data.is_attach = true;
                                    this.lastSelectedTagData = { 'id': this.data.tag_id, 'parantTagId': this.emailParentId, 'title': this.selectedTagTitle, 'parentTitle': this.emailParenttitle };
                                    this.getemails.getEmailList(this.data).subscribe((data) => {
                                        this.addSelectedFieldInEmailList(data);
                                        this.loading = false;
                                    });
                                }
                            });
                        }
                    });
                }
            }, (err) => {
                this.loading = false;
            });
    }

    addSelectedFieldInEmailList(data) {
        if (data && data['data'].length > 0) {
            _.forEach(data['data'], (value, key) => {
                value['selected'] = false;
                if (value['body']) {
                    value['body'] = this.stripHtml(value['body']);
                    value['body'] = value['body'].replace(/<\/?[^>]+(>|$)/g, ' ');
                    value['body'] = value['body'].replace(/(\r\n|\n|\r)/gm, ' ');
                    value['body'] = value['body'].replace(/\s\s+/g, ' ');
                }
            });
        }
        this.emaillist = data;
    }
    stripHtml(htmlData) {
        const temporalDivElement = document.createElement('div');
        temporalDivElement.innerHTML = htmlData;
        return temporalDivElement.textContent || temporalDivElement.innerText || '';
    }
    searchEmail(searchform: NgForm) {
        if (searchform.valid) {
            if (!!searchform.value['currentTag']) {
                if (this.data['is_attach']) {
                    this.data = {
                        'page': 1,
                        'tag_id': this.emailParentId,
                        'default_id': this.emailChildId,
                        'limit': this.emailLimit,
                        'type': searchform.value['option'],
                        'keyword': searchform.value['keyword'],
                        'selected': searchform.value['currentTag'],
                        'is_attach': this.data['is_attach']
                    };
                } else {
                    this.data = {
                        'page': 1,
                        'tag_id': this.emailParentId,
                        'default_id': this.emailChildId,
                        'limit': this.emailLimit,
                        'type': searchform.value['option'],
                        'keyword': searchform.value['keyword'],
                        'selected': searchform.value['currentTag']
                    };
                }
            } else {
                this.data = {
                    'page': 1,
                    'limit': this.emailLimit,
                    'type': searchform.value['option'],
                    'keyword': searchform.value['keyword'],
                    'selected': searchform.value['currentTag']
                };
            }
            this.loading = true;
            this.showmessage = false;
            this.isSearching = true;
            this.getemails.getEmailList(this.data).subscribe((data) => {
                if (data.data.length > 0) {
                    this.addSelectedFieldInEmailList(data);
                    this.emailIds = [];
                    this.loading = false;
                } else {
                    this.message = data.message;
                    this.showmessage = true;
                    this.emaillist = [];
                    this.loading = false;
                }
            });
        }
    }

    addEmail(id: string) {
        this.emailIds.push(id);
    }

    removeEmails(id: string) {
        this.emailIds.splice(this.emailIds.indexOf(id), 1);
    }
    removeStarredMails(id) {
        if (this.onStarredPage) {
            this.emaillist.data.splice(id, 1);
        }
    }
    composeEmail() {
        this.dialogRef = this.dialog.open(ComposeEmailComponent, {
            height: '90%',
            width: '70%'
        });
        if (this.emailParentId == null || this.emailParentId == 0 || this.emailParentId == "null" || this.emailParentId == undefined) {
            this.dialogRef.componentInstance.parentId = 0;
        } else {
            this.dialogRef.componentInstance.parentId = this.emailParentId;
        }
        this.dialogRef.componentInstance.emailList = this.emailIds;
        this.dialogRef.componentInstance.subject_for_genuine = this.subject_for_genuine;
        this.dialogRef.afterClosed().subscribe(result => {
            _.forEach(this.emaillist.data, (value, key) => {
                if (value.sender_mail === this.emailIds) {
                    value.unread = false;
                }
            })
            this.dialogRef = null;
            this.emailIds = [];
            this.addSelectedFieldInEmailList(this.emaillist);
        });
    }

    assign(tag_id, id: any) {
        this.selected = {
            'tag_id': tag_id,
            'mongo_id': id
        };
        this.getemails.assignTag(this.selected).subscribe((data) => {
            this.getAllTag();
            this.emailIds.length = 0;
        }, (err) => {
            console.log(err);
            this.refresh();
        });
    }

    delete() {
        this.selected = {
            'tag_id': this.selectedTag,
            'mongo_id': this.emailIds
        };
        this.getemails.deleteEmail(this.selected).subscribe((data) => {
            this.refresh();
            this.emailIds.length = 0;
            this.notify('done', '');
        }, (err) => {
            console.log(err);
        });
    }

    notify(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }

    openEmails(email: any) {
        this.showInboxEmailList = true;
        const index = _.findIndex(this.emaillist['data'], email);
        if (index !== -1) {
            if (this.emaillist['data'][index]['unread']) {
                this.tags = this._commonService.reduseCountEmail(this.tags, this.selectedTag, this.emailParentId);
            }
            this.emaillist['data'][index]['unread'] = false;
        }
        // if (environment['picasa']) {
        let attachment = false;
        if (email['attachment'] && email['attachment'].length === 0) {
            attachment = true;
        }
        const landingUrl = window['origin'] + '/#/core/email/' + email._id;
        window.open(landingUrl);
        // }else {
        //     this._router.navigate(['core/inbox/email', email._id]);
        // }
        this._localStorageService.setItem('email', email);
        this._localStorageService.setItem('selectedTag', this.selectedTag);
        this._localStorageService.setItem('tags', this.tagsForEmailListAndModel);
        this._localStorageService.setItem('dataForInterviewScheduleRound', this.dataForInterviewScheduleRound);
        this._localStorageService.setItem('inboxMailsTagsForEmailListAndModel', this.inboxMailsTagsForEmailListAndModel);
    }
    refreshEmails(email: any) {
        this.showInboxEmailList = true;
        const index = _.findIndex(this.emaillist['data'], email);
        if (index !== -1) {
            if (!this.emaillist['data'][index]['unread']) {
                this.emaillist['data'][index]['unread'] = true;
            } else {
                this.emaillist['data'][index]['unread'] = false;
            }
        }
    }

    getAllTag() {
        this.getemails.getAllTagsMain()
            .subscribe((res) => {
                this.formatTagsInArray(res.data);
            }, (err) => {
                this.loading = false;
            });
    }
    sendEmailToPendingCandidates() {
        this.getemails.sendEmailToPendingCandidates({ 'tag_id': this.selectedTag }).subscribe((data) => {
            this.notify(data.message, '');
        }, (err) => {
            this.notify(err.message, '');
        });
    }

    markAllRead() {
        this._dialogService.openConfirmationBox('Are you sure ?').then((res) => {
            if (res === 'yes') {
                const apiData = {
                    'tag_id': this.emailParentId || 0,
                    'default_id': this.emailChildId || '0',
                }
                this.getemails.markAllAsRead(apiData).subscribe((response) => {
                    _.forEach(this.emaillist.data, (email, key) => {
                        email['unread'] = false;
                        this.tags = this._commonService.markAllAsReadTag(this.tags, this.selectedTag, this.emailParentId);
                    })
                }, (err) => {
                    console.log(err)
                })
            }
        })
    }

    parseOldCvs() {
        this._dialogService.openConfirmationBox('Are you sure ?').then((res) => {
            if (res === 'yes') {
                this.getemails.processOldCvs(this.emailParentId).subscribe((response) => { }, (err) => {
                    console.log(err)
                });
            }
        });
    }
    sendEmailToAll(notGenuine?) {
        this.dialogRef = this.dialog.open(ComposeEmailComponent, {
            height: '90%',
            width: '70%'
        });
        this.dialogRef.componentInstance.emailParenttitle = this.emailParenttitle;
        this.dialogRef.componentInstance.emailChildTitle = this.emailChildTitle;
        this.dialogRef.componentInstance.emailParentId = this.emailParentId;
        this.dialogRef.componentInstance.emailChildId = this.emailChildId;
        this.dialogRef.componentInstance.notGenuine = notGenuine;
        this.dialogRef.componentInstance.subject_for_genuine = this.subject_for_genuine;
        this.dialogRef.afterClosed().subscribe(result => {
            this.dialogRef = null;
            this.emailIds = [];
            this.addSelectedFieldInEmailList(this.emaillist);
        });
    }

    emaillists(emailData: any, page?: number) {
        if (emailData.active_status) {
            this.tagStatus = emailData.active_status;
        }
        this.onStarredPage = false;
        this.isSearching = false;
        this.currentPage = emailData.parentTitle;
        this.lastSelectedTagData = emailData;
        this.emailParenttitle = emailData['parentTitle'];
        this.emailChildTitle = emailData['title'];
        if (this._location.path().substr(0, 17) === '/core/inbox/email') {
            this.showInboxEmailList = true;
            this._location.back();
        }
        this.emailParentId = (emailData.parantTagId ? emailData.parantTagId.toString() : null);
        if (emailData.id == null) {
            this.emailChildId = null;
        } else {
            this.emailChildId = emailData.id.toString() || '0';
        }
        if (emailData.title === 'All') {
            this.selectedTagTitle = emailData.title;
        } else {
            this.selectedTagTitle = '';
        }
        this.selectedTag = emailData.id;
        this.data = null;
        this.showmessage = false;
        if (emailData['is_attach']) {
            this.data = {
                'page': page || 1,
                'tag_id': emailData.parantTagId || ((emailData.id === 0) ? 0 : emailData.id) || 0,
                'default_id': (emailData.parantTagId ? emailData.id : 0).toString() || '0',
                'limit': this.emailLimit,
                'is_attach': emailData['is_attach']
            };
        } else {
            this.data = {
                'page': page || 1,
                'tag_id': emailData.parantTagId || ((emailData.id === 0) ? 0 : emailData.id) || 0,
                'default_id': (emailData.parantTagId ? emailData.id : 0).toString() || '0',
                'limit': this.emailLimit
            };
        }
        this.loading = true;
        this.getemails.getEmailList(this.data).subscribe((data) => {
            this.addSelectedFieldInEmailList(data);
            this.emailIds = [];
            this.loading = false;
        });
    }

    searchEmailList(page: number) {
        this.data.page = page || 1;
        this.showmessage = false;
        this.loading = true;
        this.getemails.getEmailList(this.data).subscribe((data) => {
            this.addSelectedFieldInEmailList(data);
            this.emailIds = [];
            this.loading = false;
        });
    }

    previous() {
        if (this.data.page > 1) {
            this.data.page = this.data.page - 1;
            if (!this.data.type) {
                this.emaillists({ 'id': this.emailChildId, 'parantTagId': this.emailParentId, 'title': this.emailChildTitle, 'parentTitle': this.emailParenttitle, 'is_attach': this.data.is_attach }, this.data.page);
            } else {
                this.searchEmailList(this.data.page);
            }
        }
    }

    next() {
        if (this.data.page < this.emaillist.count / this.data.limit) {
            this.data.page = this.data.page + 1;
            if (!this.data.type) {
                this.emaillists({ 'id': this.emailChildId, 'parantTagId': this.emailParentId, 'title': this.emailChildTitle, 'parentTitle': this.emailParenttitle, 'is_attach': this.data.is_attach }, this.data.page);
            } else {
                this.searchEmailList(this.data.page);
            }
        }
    }

    gotTopage(pageNo) {
        pageNo = parseInt(pageNo, 10);
        if (pageNo <= Math.ceil(this.emaillist.count / this.data.limit)) {
            this.data.page = pageNo;
            if (!this.data.type) {
                this.emaillists({ 'id': this.emailChildId, 'parantTagId': this.emailParentId, 'title': this.emailChildTitle, 'parentTitle': this.emailParenttitle, 'is_attach': this.data.is_attach }, this.data.page);
            } else {
                this.searchEmailList(this.data.page);
            }
        }
    }
    getMails() {
        this.emailLimit = this.noOfMails;
        this.data['limit'] = this.noOfMails;
        this.getemails.getEmailList(this.data).subscribe((data) => {
            this.addSelectedFieldInEmailList(data);
            this.loading = false;
        });
    }

    fetchNewEmails() {
        this.loading = true;
        this.getemails.refreshNewEmails().subscribe((data) => {
            this.refresh();
        });
    }

    refresh(id?: string) {
        this.getAllTag();
        this.getemails.getEmailList(this.data).subscribe((data) => {
            this.emailIds = [];
            this.addSelectedFieldInEmailList(data);
        });
    }

    formatTagsInArray(data: any) {
        this.tags = this._commonService.sortByJobProfileStatus(JSON.parse(JSON.stringify(data)));
        this.getDefaultTagOpen(this.tags);
        this._commonService.formateTags(data).then((res: any) => {
            this.tagsForEmailListAndModel = res.tagsForEmailListAndModel;
            this.dataForInterviewScheduleRound = res.dataForInterviewScheduleRound;
            this.subject_for_genuine = res.subject_for_genuine;
            this.inboxMailsTagsForEmailListAndModel = res.inboxMailsTagsForEmailListAndModel;
        }, (err) => { });
        this.loading = false;
    }
    getDefaultTagOpen(tags) {
        this.tags = tags
        _.forEach(this.tags, (tagValue, tagKey) => {
            if (tagValue['title'] === 'candidate') {
                _.forEach(tagValue['data'], (tagSubValue, tagSubKey) => {
                    tagSubValue['defaultTagOpen'] = true
                })
            }
        });
    }

    trackByEmails(index, email) {
        return index;
    }

    cronStatus() {
        this._dialogService.getCronStatusDialog(this.emailParentId);
    }

    addCandidate() {
        this.dialogRef = this.dialog.open(AddCandidateComponent, {
            height: '90%',
            width: '70%'
        });
        this.dialogRef.componentInstance.emailParenttitle = this.emailParenttitle;
        this.dialogRef.componentInstance.emailChildTitle = this.emailChildTitle;
        this.dialogRef.componentInstance.emailParentId = this.emailParentId;
        this.dialogRef.componentInstance.emailChildId = this.emailChildId;
        this.dialogRef.afterClosed().subscribe(result => {
            this.dialogRef = null;
            this.refresh();
        });
    }

    getIntervieweeList() {
        this._commonService.getIntervieweeList().then((res) => {
            this.intervieweeList = res;
        }, (err) => {
            console.log(err)
        })
    }
    updateInbox(id) {
        _.remove(this.emaillist.data, { '_id': id });
        localStorage.removeItem('updateInbox');
    }

    tagReassigned(id) {
        _.remove(this.emaillist.data, { '_id': id });
        localStorage.removeItem('tagReassigned');
    }
    removeOldEmails(role) {
        this.dialogRef = this.dialog.open(RemoveMailsDialogComponent, {
            height: '60%',
            width: '60%'
        });
        this.dialogRef.componentInstance.emailParentId = this.emailParentId;
        if (this.emailParentId == this.emailChildId) {
            this.dialogRef.componentInstance.emailChildId = "";
        } else {
            this.dialogRef.componentInstance.emailChildId = this.emailChildId;
        }
        this.dialogRef.componentInstance.role = role;
        this.dialogRef.afterClosed().subscribe(result => {
            this.dialogRef = null;
            if (result === 'Admin') {
                this.refresh();
            }
        })
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.inboxRefreshSubscription.unsubscribe();
        this.fetchEmailSubscription.unsubscribe();
    }
    closeProfile() {
        if (this.tagStatus) {
            this.tagStatus = false
        };
        this._dialogService.openConfirmationBox('Are you sure want to close this job profile,\n this operation cannot be undone?').then((res) => {
            if (res === 'yes') {
                const body = {
                    id: this.selectedTag,
                    status: this.tagStatus
                };
                this.getemails.closeJobProfile(body).subscribe((data) => {
                    this.defaultOpen();
                }, (err) => {
                    console.log(err);
                });
            }
        }, (err) => {
            console.log(err);
        });
    }
    markAllArchive() {
        this.dialogRef = this.dialog.open(ArchiveMailComponent, {
            height: '60%',
            width: '60%'
        });
        this.dialogRef.componentInstance.emailParentId = this.emailParentId;
        this.dialogRef.componentInstance.is_attachment = this.data.is_attach;
        this.dialogRef.afterClosed().subscribe(result => {
            this.dialogRef = null;
            if (result) {
                this.refresh();
            }
        })
    }

    showUnReadOnly() {
        this.data['unread'] = true;
        this.getemails.getEmailList(this.data).subscribe((res) => {
            this.addSelectedFieldInEmailList(res);
        })
    }

    openShortListedCandidateWeightage() {
        this.dialogRef = this.dialog.open(SelectShortListedWeightageModalComponent, {
            width: "60vw"
        });
        this.dialogRef.componentInstance.getWeightageValue.subscribe((value) => {
            const apiData = { userIds: [] };
            this.emaillist.data.forEach(e => {
                if (e.weightage > value || e.weightage == value) {
                    apiData['userIds'].push(e._id)
                }
            });
            this.getemails.sendShortListedUserId(apiData).subscribe(res => {
                if (res == 'success') {
                    this.refresh();
                }
            }, (err) => {
                console.log(err);
            });
        });
    }
}
