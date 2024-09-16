import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { historylog, Emaillist, SystemVar } from './mock-data';
import { InterceptedHttp } from './http.interceptor';
import { Subject } from 'rxjs/Subject';
import { bitlySetup, config } from '../config/config';


@Injectable()
export class ImapMailsService {
    count = 0;
    @Output() apiStartEvent: EventEmitter<any> = new EventEmitter(true);
    @Output() apiEndEvent: EventEmitter<any> = new EventEmitter(true);
    private childMethodCall = new Subject<any>();
    // Observalbe string streams
    componentMehtodCalled$ = this.childMethodCall.asObservable();
    constructor(public http: Http, public Intercepted: InterceptedHttp) {
        window.onbeforeunload = (e) => {
            if (this.count) {
                const dialogText = 'Dialog text here';
                e.returnValue = dialogText;
                return dialogText;
            } else {
                return e;
            }
        };
    }

    fetchNewEmail() {
        this.childMethodCall.next();
    }
    refreshNewEmails() {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + 'email/fetchByButton')
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    increaseAPiCount() {
        ++this.count;
        this.apiStartEvent.emit();
    }
    decreaseAPiCount() {
        --this.count;
        if (this.count === 0) {
            this.apiEndEvent.emit();
        }
    }
    getEmailList(body: any): Observable<any> {
        this.increaseAPiCount();
        if (!!body.type) {
            return this.Intercepted.put(environment['apibase'] + `email/fetch/${body.tag_id}/${body.page}/${body.limit}`, body)
                .map((res: Response) => {
                    this.decreaseAPiCount();
                    return res.json();
                })
                .catch((error: any) => {
                    this.count = 0;
                    this.apiEndEvent.emit();
                    return Observable.throw(error.json() || 'Server error');
                });
        } else {
            return this.Intercepted.put(environment['apibase'] + `email/fetch/${body.tag_id}/${body.page}/${body.limit}`, body)
                .map((res: Response) => {
                    this.decreaseAPiCount();
                    return res.json();
                })
                .catch((error: any) => {
                    this.count = 0;
                    this.apiEndEvent.emit();
                    return Observable.throw(error.json() || 'Server error');
                });
        }
    }
    sendEmailToPendingCandidates(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + 'email/send_to_selected_tag', body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    updatePriority(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + 'update/priority', body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getDashboardData(): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + 'dashboard')
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getEmailStatus(body): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + 'get/emailStatus', body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getScheduleData(): Observable<any> {
        this.increaseAPiCount();
        return this.http.get(environment['apibase'] + 'get/shedule')
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getEmailLogs(body): Observable<any> {
        this.increaseAPiCount();
        let url: any;
        if (body['email']) {
            url = `search/email/logs/${body.email}/${body.page}/${body.limit}`;
        } else {
            url = `get/email/logs/${body.page}/${body.limit}`;
        }
        return this.Intercepted.get(environment['apibase'] + url)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getUserList(body): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + `user/list/${body.page}/${body.limit}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getSpamList(body): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + `spamList/get/${body.page}/${body.limit}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    updateSpam(data: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + 'spamList/update/' + data.id, data)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    moveSpamFromJobProfile() {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + 'remove/spamFromJobProfile', {})
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    addSpam(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + 'spamData/add', body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    fetchEmailByDays(body): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + `fetch/emails/${body.days}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getAllTagsMain(): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + 'email/countEmail')
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getAllTags(): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + 'tag/get')
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    addTag(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + 'tag/add/' + body.type, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getCronStatus(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + 'email/cron_status', body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    addUser(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + 'user/add_user', body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    sendEmail(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + 'email/sendtomany', body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    sendToNotReplied(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + 'sendToNotReplied', body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    UnreadStatus(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + `email/changeUnreadStatus/${body.mongo_id}/${body.status}`, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    MarkASUnreadStatus(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + `email/markAsUnread`, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    resetPassword(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + `account/update_password`, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    emailAttachment(id: string): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + `email/mailAttachment/${id}`)
            .retryWhen(error => {
                return error.flatMap((error1: any) => {
                    if (error1.status === 400) {
                        return Observable.of(error1.status).delay(2000)
                    }
                    return Observable.throw({ error: 'No retry' });
                })
                    .take(20)
                    .concat(Observable.throw({ error: 'Sorry, there was an error (after 5 retries)' }));
            })
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    assignTag(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + `email/assignMultiple/${body.tag_id}`, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    deleteEmail(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + `email/deleteEmail/${body.tag_id}`, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    updateTag(tag: any, type: string): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + 'tag/update/' + type + '/' + tag.id, tag)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    deleteTag(tag: string, type: string): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.delete(environment['apibase'] + 'tag/delete/' + type + '/' + tag)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    deleteUser(path, id): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.delete(environment['apibase'] + path + id)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }

    getHistory(body): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + `user/log/${body.email}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getUserVariable(): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + 'variable/get/1/20')
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getSystemVariable(): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + 'systemVariable/get/1/20')
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    addUserVariable(body): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + 'variable/add/', body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    deleteVariable(id: string): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.delete(environment['apibase'] + 'variable/delete/' + id)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    updateVariable(body: any, id: string): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + 'variable/update/' + id, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    addTemplate(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + 'template/add/', body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getEmailName(): Promise<any[]> {
        return Promise.resolve(Emaillist);
    }
    deleteImap(id: string): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.delete(environment['apibase'] + 'imap/delete/' + id)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    storeImap(body): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + 'imap/save', body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getImapList(): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + 'imap/get')
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    storeSmtp(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + 'smtp/save', body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    sendTestEmail(userDetail: any, body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + `template/email/${userDetail.CandidateEmail}`, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    sendEmailBySeclection(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + `email/by_seclection`, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    resendEmailForTracking(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + 'send/sendEmailToNotviewed', body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    activateImap(email_id: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + `imap/statusActive/${email_id}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getSmtpList(): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + 'smtp/get/1/10')
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    deleteSmtp(id: string): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.delete(environment['apibase'] + 'smtp/delete/' + id)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    testSmtp(email: string): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + `smtp/testSmtp/${email}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    changeSmtpStatus(email: string): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + `smtp/changeStatus/${email}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    // *** Email template service functions ***
    getTemplate(): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + 'template/get/1/20')
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    updateTemplate(body: any, id: string): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + 'template/update/' + id, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    deleteTemplate(id: string): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.delete(environment['apibase'] + 'template/delete/' + id)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getCandidateHistory(Email_id: string): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + `email/inbox/${Email_id}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    testTemplate(temp_id: string): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + `template/test/${temp_id}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    addNote(data: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + 'candidate_notes/insert', data)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    updateNote(data: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + `candidate_notes/update/`, data)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    sendSlackInfo(info: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + `add/slackInfo/`, info)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getSlackInfo(): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + `get/slackInfo/`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    updateSlackInfo(body: any, id: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + 'update/slackInfo/' + id, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    deleteSlackData(id: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.delete(environment['apibase'] + `delete/slackInfo/` + id)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    addSubTag(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + 'tag/add/' + body.type, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    addNewCandidate(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + 'add/addNewCandidate', body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    deleteSubTag(type: any, id: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.delete(environment['apibase'] + `tag/delete/` + type + '/' + id)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getEmailTrackingData(): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + `fetch/trackingData`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getIntervieweeList(): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + `get/Interviewee`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    assignInterviewee(body): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + `assign/interviewee`, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    deleteCampaign(campaign_name): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.delete(environment['apibase'] + `delete/campaign/${campaign_name}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getIntervieweeInboxData(): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + `get/candidate/byInterviewee`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    creteQues(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + `exams/addQuestion`, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    updateQues(body: any, questionId: String): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + `exams/updateQuestion/${questionId}`, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getQuesAdmin(): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + `exams/getAllQuestions`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getQues(fb_id: any): Observable<any> {
        this.increaseAPiCount();
        return this.http.get(environment['apibase'] + `exams/getQuestinsForCandidate/${fb_id}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getQuesByid(quesId: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + `exams/getQuestionById/${quesId}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    deleteQueByid(quesId: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + `exams/deleteQuestion/${quesId}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    jobprofile(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.http.post(environment['apibase'] + `exams/job_profile`, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    submitTest(data): Observable<any> {
        this.increaseAPiCount();
        return this.http.post(environment['apibase'] + `exams/submitExam`, data)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    score(data: any, body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + `exams/showExamResult/${data.page}/${data.limit}`, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    detailedScore(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + `exams/getCandidateResult`, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    createGroup(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + `exams/examSubjects`, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    examGroup(): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + `exams/getExamSubjects`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    generateTestLink(id): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + `exams/generateLink/${id}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    generateTestLinkByCandidate(id): Observable<any> {
        this.increaseAPiCount();
        return this.http.get(environment['apibase'] + `exams/generateLink/${id}?startTest=true`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getCandidateDetails(id): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + `exams/candidateDetails/${id}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    addWalkinCandidate(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.http.post(environment['apibase'] + `exams/addNewCandidate`, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    pendingList(): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + `exams/getPendingList`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    approveCandidate(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + `exams/approveCandidate`, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    markStarred(status: boolean, body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + `star/starEmail/` + `${status}`, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getStarredMails() {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + `star/getStaredEmails`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    removeOldEmails(body: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + `tag/remove`, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    moveEmailToSpam(email: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + `spam/candidate/${email}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    moveEmailToArchive(email: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + `email/candidateArchive/${email}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    markAllAsRead(body): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + `email/tag/markAsRead`, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    // Candidate calling for help
    helpMe(body): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + `exams/askHrForHelp`, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    // For candidate delete
    removeCandidate(param): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.delete(environment['apibase'] + `exams/deletePendingCandidate/${param}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    setCallStatus(param, body): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + `email/candidate/${param}`, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    // For bulk Archive Mail
    archiveAllMail(data: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + `email/archive`, data)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    archivefindTotalMail(data: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + `email/archiveCount`, data)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    closeJobProfile(data: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + `tag/closeJobProfile`, data)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    createTestSet(data: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + `exams/addTestPapers`, data)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    updateTestSet(data: any): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + `exams/updateTestPapers`, data)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    removeOldlogs(body): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.delete(environment['apibase'] + `user/deleteLogs/${body['userId']}/${body['start']}/${body['end']}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getAllTestPaper(): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + `exams/getTestPapers`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getTestPaperById(id): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + `exams/getOneTestPaper/${id}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    questionsForPDF(id): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + `exams/questionsForPDF/${id}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    deleteTestPaper(body): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + `exams/deleteTestPapers`, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    deleteGroup(groupId): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.delete(environment['apibase'] + `exams/deleteExamSubjects/${groupId}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }
    getBitlyURL(url): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(`${bitlySetup.host}?login=${bitlySetup.login}&apiKey=${bitlySetup.apiKey}&longUrl=${url}&format=json`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }

    getCompanyProfile(): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.get(environment['apibase'] + `tag/getCompanyProfile/${config.companyProfileId}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }

    addCompanyProfile(apiData): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + `tag/addCompanyProfile`, apiData)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }

    updateCompanyProfile(id, apiData): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + `tag/updateCompanyProfile/${id}`, apiData)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }

    saveCandidateDesiredSchedule(apiData): Observable<any> {
        this.increaseAPiCount();
        return this.http.post(environment['apibase'] + `exams/saveCandidateDesiredSchedule`, apiData)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }

    getNotificationStats(): Observable<any> {
        this.increaseAPiCount();
        return this.http.get(environment['apibase'] + `notification/status`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }

    markNotInterested(userId): Observable<any> {
        this.increaseAPiCount();
        return this.http.put(environment['apibase'] + `exam/candidate/notInterested/${userId}`, {})
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }

    addMobileNumber(body, userId): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + `email/update/userPhone/${userId}`, body)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }

    processOldCvs(tagId): Observable<any> {
        this.increaseAPiCount();
        return this.http.get(environment['apibase'] + `email/process/oldCvs/${tagId}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }

    addJobProfileParameter(apiData): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.post(environment['apibase'] + 'JobProfileParameters/add', apiData)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }


    getJobProfileParameters(): Observable<any> {
        this.increaseAPiCount();
        return this.http.get(environment['apibase'] + 'JobProfileParameters/getAll')
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }

    updateJobProfileParameters(apiData): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.put(environment['apibase'] + `JobProfileParameters/update/${apiData.tagId}`, apiData)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }

    deleteJobProfileParameter(id): Observable<any> {
        this.increaseAPiCount();
        return this.Intercepted.delete(environment['apibase'] + `JobProfileParameters/delete/${id}`)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            })
    }

    sendShortListedUserId(apiData): Observable<any> {
        this.increaseAPiCount();
        return this.http.post(environment['apibase'] + `exam/autoShortList`, apiData)
            .map((res: Response) => {
                this.decreaseAPiCount();
                return res.json();
            })
            .catch((error: any) => {
                this.count = 0;
                this.apiEndEvent.emit();
                return Observable.throw(error.json() || 'Server error');
            });
    }

}
