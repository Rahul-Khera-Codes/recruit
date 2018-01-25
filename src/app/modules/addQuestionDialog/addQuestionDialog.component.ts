import { Component, OnInit} from '@angular/core';
import { MdDialogRef } from '@angular/material';
import * as _ from 'lodash';
import { NgForm, FormControl, Validators } from '@angular/forms';
import { ImapMailsService } from '../../service/imapemails.service';

@Component({
    selector: 'app-addquestion-dialog',
    templateUrl: './addQuestionDialog.component.html',
    styleUrls: ['./addQuestionDialog.component.scss'],
})
export class AddQuestionDialogComponent implements OnInit {
    loading = false;
    tags: any[];
    job_profile: any;
    question: any;
    answer: any;
    opt1: any;
    opt2: any;
    opt3: any;
    opt4: any;
    opt5: any;
    ans_id: any;
    answerOpt: any;
    options= [];
    message: string;
    showmessage: boolean;
    questionEditable: any;
    editabledialog= false;
    questionId: any;
    jobprofile_tag= [];
    job_id: any;
    examgroup= [];
    examId: any;

    constructor(private dialogRef: MdDialogRef<any>, private getTags: ImapMailsService) {
    }
    ngOnInit() {
        this.loading = true;
        this.getAllTag();
        this.getExamGroup();
        console.log(this.questionEditable);
        if (this.questionEditable) {
            console.log(this.questionEditable);
            this.job_profile = this.questionEditable.job_profile[0];
            this.questionId = this.questionEditable._id;
            this.question = this.questionEditable.question;
            this.answer = this.questionEditable.answer;
            this.examId = this.questionEditable.exam_subject;
            this.opt1 = this.questionEditable.options[0].option;
            this.ans_id = this.questionEditable.answer;
            this.opt2 = this.questionEditable.options[1].option;
            this.opt3 = this.questionEditable.options[2].option;
            this.opt4 = this.questionEditable.options[3].option;
            this.editabledialog = true;
        }
        console.log(this.job_id);
        if (this.job_id) {
            this.job_profile = this.job_id;
        }
    }

    getAllTag() {
        this.getTags.getAllTags()
            .subscribe((data) => {
                this.formatTagsInArray(data);
            }, (err) => {
                console.log(err);
                this.loading = false;
            });
    }
    getExamGroup() {
        this.getTags.examGroup()
            .subscribe((data) => {
                console.log(data);
                this.examgroup = data;
            }, (err) => {
                console.log(err);
                this.loading = false;
            });
    }

    formatTagsInArray(data: any) {
        this.tags = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].type === 'Default') {
                if (!this.tags['Default']) {
                    this.tags['Default'] = [];
                    this.tags['Default'].push(data[i]);
                } else {
                    this.tags['Default'].push(data[i]);
                }
            } else if (data[i].type === 'Manual') {
                if (!this.tags['Manual']) {
                    this.tags['Manual'] = [];
                    this.tags['Manual'].push(data[i]);
                } else {
                    this.tags['Manual'].push(data[i]);
                }
            } else if (data[i].type === 'Automatic') {
                if (!this.tags['Automatic']) {
                    this.tags['Automatic'] = [];
                    this.tags['Automatic'].push(data[i]);
                } else {
                    this.tags['Automatic'].push(data[i]);
                }
            }
        }
        if (this.tags['Automatic']) {
            _.forEach(this.tags['Automatic'], (val, key) => {
                if (val.is_job_profile_tag) {
                    this.jobprofile_tag.push(val);
                };
            })
        }
        this.loading = false;
    }
    close() {
    }
    answerRight(val) {
        this.ans_id = val.value;
        console.log(val.source, val.value);
    }
    createQues(form: NgForm) {
        let quesdata;
        console.log(form.value)
        if (form.valid) {
            // this.options.push(form.value.option1);
            // this.options.push(form.value.option2);
            // this.options.push(form.value.option3);
            // this.options.push(form.value.option4);
            quesdata = {
                'job_profile': form.value.job_profile,
                'question' : form.value.question,
                'answer' : parseInt(this.ans_id),
                'exam_subject': form.value.examId,
                'options': [{
                    'option': form.value.option1,
                    'opt_id': 1
                },
                {
                    'option': form.value.option2,
                    'opt_id': 2
                },
                {
                    'option': form.value.option3,
                    'opt_id': 3
                },
                {
                    'option': form.value.option4,
                    'opt_id': 4
                },
                {
                    'option': form.value.option5,
                    'opt_id': 5
                }]
            };
        }
        if (this.job_id) {
            quesdata.job_profile = this.job_id;
        }
        console.log(quesdata);

        this.loading = true;
        this.showmessage = false;
        if (this.editabledialog) {
            this.getTags.updateQues(quesdata, this.questionId).subscribe(res => {
                this.loading = false;
                this.showmessage = false;
                this.dialogRef.close(res);
            }, err => {
                this.loading = false;
                this.showmessage = true;
                this.message = err.message;
            });
        } else {
            this.getTags.creteQues(quesdata).subscribe(res => {
                this.loading = false;
                this.showmessage = false;
                this.dialogRef.close(res);
                    // this.form.reset();
            }, err => {
                this.loading = false;
                this.showmessage = true;
                this.message = err.message;
            });
        }
    }
}
