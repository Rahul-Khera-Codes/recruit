import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImapMailsService } from '../../service/imapemails.service';

@Component({
  selector: 'app-select-short-listed-weightage-modal',
  templateUrl: './select-short-listed-weightage-modal.component.html',
  styleUrls: ['./select-short-listed-weightage-modal.component.scss']
})
export class SelectShortListedWeightageModalComponent implements OnInit {

  weightageForm: FormGroup;
  weightageValue: any;
  @Output() getWeightageValue: EventEmitter<any> = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<any>, public _snackBar: MatSnackBar, private _fb: FormBuilder, private imapMailService: ImapMailsService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.weightageForm = this._fb.group({
      weightage: ['', Validators.compose([Validators.required, Validators.max(10), Validators.min(1), Validators.maxLength(2)])]
    });
  }
  onSubmit(value) {
    this.weightageValue = value;
    this.getWeightageValue.emit(value.weightage);
    this.close('success');

  }
  close(data?) {
    this.dialogRef.close(data);
  }
}
