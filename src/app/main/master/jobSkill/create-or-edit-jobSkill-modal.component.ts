import { Component, ViewChild, Injector, Output, EventEmitter, OnInit, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { JobSkillServiceProxy, CreateOrEditJobSkillDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DateTime } from 'luxon';

import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
    selector: 'createOrEditJobSkillModal',
    templateUrl: './create-or-edit-jobSkill-modal.component.html',
})
export class CreateOrEditJobSkillModalComponent extends AppComponentBase implements OnInit {
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    id:string;
    form: FormGroup;

   
    constructor(
        injector: Injector,
        private _jobSkillServiceProxy: JobSkillServiceProxy,
        private _dateTimeService: DateTimeService,
        private fb: FormBuilder
    ) {
        super(injector);
    }

    show(jobSkillId?: string): void {
        if (jobSkillId) {
            this.id=jobSkillId;
            this._jobSkillServiceProxy.getJobSkillForEdit(jobSkillId).subscribe((result) => {
                this.createForm(result);

               
            });
        }
        this.active = true;
        this.modal.show();
    }
    createForm(item: any = {}): void {
        this.form = this.fb.group({
          id: [item.id?item.id:null],
          name: [item.name || '', Validators.required],
          description: [item.description || ''],
        });
      }
    save(): void {
        this.saving = true;

        this._jobSkillServiceProxy
            .createOrEdit(this.form.getRawValue())
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    ngOnInit(): void {
        this.createForm();
    }
}
