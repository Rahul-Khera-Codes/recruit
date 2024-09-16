import { Route } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { CoreComponent } from './modules/core/core.component';

import { InboxComponent } from './modules/inbox/inbox.component';
import { EmailLogsComponent } from './modules/email-logs/email-logs.component';
import { UserActivityLogComponent } from './modules/useractivitylog/useractivitylog.component';
import { SettingComponent } from './modules/setting/setting.component';
import { ChangePasswordComponent } from './modules/changepassword/changepassword.component';

import { ImapServerComponent } from './modules/imap-server/imap-server.component';
import { SmtpServerComponent } from './modules/smtp-server/smtp-server.component';
import { EmailTemplatesComponent } from './modules/email-templates/email-templates.component';
import { EmailVariablesComponent } from './modules/email-variables/email-variables.component';
import { TagSettingComponent } from './modules/tag-setting/tag-setting.component';
import { ActionsComponent } from './modules/actions/actions.component';
import { ManageUsersComponent } from './modules/manage-users/manage-users.component';
import { LoginRouteGuard } from './service/login-route-guard';
import { ForgetPasswordComponent } from './modules/forget-password/forget-password.component';
import { ResetPasswordComponent } from './modules/reset-password/reset-password.component';
import { EmailModalComponent } from './modules/email-modal/email-modal.component';
import { AutomaticTagComponent } from './modules/automatic-tag/automatic-tag.component';
import { JobProfileTagComponent } from './modules/job-profile-tag/job-profile-tag.component';
import { AddNewUserComponent } from './modules/add-new-user/add-new-user.component';
import { UsersListComponent } from './modules/users-list/users-list.component';
import { SpamComponent } from './modules/spam/spam.component';
import { CreateQuestionComponent } from './modules/createQuestion/createQuestion.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { SlackInfoComponent } from './modules/slack-info/slack-info.component';
import { EmailTrackingComponent } from './modules/email-tracking/email-tracking.component';
import { IntervieweeInboxComponent } from './modules/interviewee-inbox/interviewee-inbox.component';
import { IntervieweeCandidateComponent } from './modules/interviewee-candidate/interviewee-candidate.component';
import { CandidateComponent } from './modules/candidate/candidate.component';
import { InterviewQuestionComponent } from './modules/interviewQuestion/interviewQuestion.component';
import { VerifyCandidateComponent } from './modules/verifyCandidate/verifyCandidate.component';
import { CandidateScoreComponent } from './modules/candidateScore/candidateScore.component';
import { PendingCandidateComponent } from './modules/pendingCandidate/pendingCandidate.component';
import { EmailtestloginComponent } from './modules/emailtestlogin/emailtestlogin.component';
import { ThankYouComponent } from './modules/thank-you/thank-you.component';
import { OtppageComponent } from './modules/otppage/otppage.component';
import { WalkinCandidateComponent } from './modules/walkin-candidate/walkin-candidate.component';
import { TestSetsComponent } from './modules/test-sets/test-sets.component';
import { AppDeepLinkComponent } from './modules/app-deep-link/app-deep-link.component';
import { CompanyProfileComponent } from './modules/company-profile/company-profile.component';
import { CandidateScheduleComponent } from './modules/candidate-schedule/candidate-schedule.component';
import { JobProfileParameterComponent } from './modules/job-profile-parameter/job-profile-parameter.component';
import { CandidateTestLinkComponent } from './modules/candidate-test-link/candidate-test-link.component'; 

export const routes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'core'
    },
    {
        path: 'candidate',
        component: CandidateComponent,
        children: [{
            path: 'interviewques/:id',
            component: InterviewQuestionComponent,
            pathMatch: 'full'
        }]
    },
    {
        path: 'verifycandidate',
        component: VerifyCandidateComponent,
        pathMatch: 'full'
    },
    {
        path: 'addwalkin',
        component: WalkinCandidateComponent,
        pathMatch: 'full'
    },
    {
        path: 'otp/:candidateId',
        component: OtppageComponent,
        pathMatch: 'full'
    },
    {
        path: 'ThankYou',
        component: ThankYouComponent,
        pathMatch: 'full'
    },
    {
        path: 'core',
        component: CoreComponent,
        canActivate: [LoginRouteGuard],
        children: [{
            path: '',
            redirectTo: 'inbox',
            pathMatch: 'full'
        },
        {
            path: 'inbox',
            component: InboxComponent,
            canActivate: [LoginRouteGuard],
        },
        {
            path: 'email/:id',
            pathMatch: 'full',
            component: EmailModalComponent,
            canActivate: [LoginRouteGuard]
        },
        {
            path: 'dashboard',
            component: DashboardComponent,
            canActivate: [LoginRouteGuard],
            data: { isHome: false }
        },
        {
            path: 'email-tracking',
            component: EmailTrackingComponent,
            canActivate: [LoginRouteGuard]
        },
        {
            path: 'interviewee-inbox',
            component: IntervieweeInboxComponent,
            canActivate: [LoginRouteGuard]
        },
        {
            path: 'intervieweeCandidate/:id',
            pathMatch: 'full',
            component: IntervieweeCandidateComponent,
            canActivate: [LoginRouteGuard]
        }, {
            path: 'setting',
            component: SettingComponent,
            canActivate: [LoginRouteGuard],
            children: [{
                path: '',
                redirectTo: 'imap',
                pathMatch: 'full'
            }, {
                path: 'imap',
                component: ImapServerComponent,
                canActivate: [LoginRouteGuard]
            }, {
                path: 'smtp',
                component: SmtpServerComponent,
                canActivate: [LoginRouteGuard]
            }, {
                path: 'emailtemplate',
                component: EmailTemplatesComponent,
                canActivate: [LoginRouteGuard]
            }, {
                path: 'emailvariable',
                component: EmailVariablesComponent,
                canActivate: [LoginRouteGuard]
            }, {
                path: 'tagsetting',
                component: TagSettingComponent,
                canActivate: [LoginRouteGuard]
            }, {
                path: 'action',
                component: ActionsComponent,
                canActivate: [LoginRouteGuard]
            }, {
                path: 'manageuser',
                component: ManageUsersComponent,
                canActivate: [LoginRouteGuard]
            }, {
                path: 'automaticTags',
                component: AutomaticTagComponent,
                canActivate: [LoginRouteGuard]
            }, {
                path: 'jobProfileTags',
                component: JobProfileTagComponent,
                canActivate: [LoginRouteGuard]
            }, {
                path: 'companyProfile',
                component: CompanyProfileComponent,
                canActivate: [LoginRouteGuard]
            }, {
                path: 'resetPassword',
                component: ResetPasswordComponent,
                canActivate: [LoginRouteGuard]
            }, {
                path: 'usersList',
                component: UsersListComponent,
                canActivate: [LoginRouteGuard]
            }, {
                path: 'useractivity',
                component: UserActivityLogComponent,
                canActivate: [LoginRouteGuard]
            }, {
                path: 'emailLogs',
                component: EmailLogsComponent,
                canActivate: [LoginRouteGuard]
            }, {
                path: 'slackinfo',
                component: SlackInfoComponent,
                canActivate: [LoginRouteGuard]
            }, {
                path: 'spam',
                component: SpamComponent,
                canActivate: [LoginRouteGuard]
            }, {
                path: 'createQuestion',
                component: CreateQuestionComponent,
                canActivate: [LoginRouteGuard]
            }, {
                path: 'candidateScore',
                component: CandidateScoreComponent,
                canActivate: [LoginRouteGuard]
            }, {
                path: 'pendingCandidate',
                component: PendingCandidateComponent,
                canActivate: [LoginRouteGuard]
            }, {
                path: 'testSet',
                component: TestSetsComponent,
                canActivate: [LoginRouteGuard]
            }, {
                path: 'jobProfileParameter',
                component: JobProfileParameterComponent,
                canActivate: [LoginRouteGuard]
            }]
        }, {
            path: 'changepassword',
            component: ChangePasswordComponent,
            canActivate: [LoginRouteGuard]
        }

        ]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'app-deep-link/:id',
        component: AppDeepLinkComponent
    },
    {
        path: 'emailtestlogin',
        component: EmailtestloginComponent
    },
    {
        path: 'forgot',
        component: ForgetPasswordComponent
    },
    {
        path: 'candidate-schedule/:userId',
        component: CandidateScheduleComponent
    },
    {
        path : 'candidate-test/:userId',
        component: CandidateTestLinkComponent
    }
];
