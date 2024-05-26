import { Component, ViewChild, Injector, Output, EventEmitter, OnInit, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import {
    EmploymentsServiceProxy,
    CreateOrEditEmploymentDto,
    EmploymentCompanyLookupTableDto,
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DateTime } from 'luxon';

import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'createOrEditEmploymentModal',
    templateUrl: './create-or-edit-employment-modal.component.html',
})
export class CreateOrEditEmploymentModalComponent extends AppComponentBase implements OnInit {
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    employment: CreateOrEditEmploymentDto = new CreateOrEditEmploymentDto();

    companyName = '';

    id: string;
    form: FormGroup;
    allCompanys: EmploymentCompanyLookupTableDto[];

    constructor(
        injector: Injector,
        private _employmentsServiceProxy: EmploymentsServiceProxy,
        private _dateTimeService: DateTimeService,
        private fb: FormBuilder,
    ) {
        super(injector);
    }

    show(employmentId?: string): void {
        if (employmentId) {
            this.id = employmentId;
            this._employmentsServiceProxy.getEmploymentForEdit(employmentId).subscribe((result) => {
                this.createForm(result);
            });
        }
        this.active = true;
        this.modal.show();

    }

    save(): void {
        this.saving = true;

        this._employmentsServiceProxy
            .createOrEdit(this.form.getRawValue())
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.form.reset()
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.form.reset()
        this.active = false;
        this.modal.hide();
    }

    createForm(item: any = {}) {
        this.form = this.fb.group({
            id: [item.id ? item.id : null],
            companyId: [item.companyId || null, Validators.required],
            total: [item.total || 0],
            male: [item.male || 0],
            female: [item.female || 0],
            foreign: [item.foreign || 0],
            impairment: [item.impairment || 0, Validators.min(0)],
            salaryStart: [item.salaryStart || 0],
            salaryEnd: [item.salaryEnd || 0],
            ageStart: [item.ageStart || 0],
            ageEnd: [item.ageEnd || 0],
            parment: [item.parment || 0],
            temporary: [item.temporary || 0],
            trainer: [item.trainer || 0],
            dailyWages: [item.dailyWages || 0],
        });
    }

    getAllCompany() {
        this._employmentsServiceProxy.getAllCompanyForTableDropdown().subscribe((result) => {
            console.log('calling company', result)
            this.allCompanys = result;
        });
    }

    ngOnInit(): void {
        this.createForm()
        this.getAllCompany();
    }
}
