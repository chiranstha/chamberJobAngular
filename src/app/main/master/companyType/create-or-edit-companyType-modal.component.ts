﻿import { Component, ViewChild, Injector, Output, EventEmitter, OnInit, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CompanyTypeServiceProxy, CreateOrEditCompanyTypeDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DateTime } from 'luxon';

import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'createOrEditCompanyTypeModal',
    templateUrl: './create-or-edit-companyType-modal.component.html',
})
export class CreateOrEditCompanyTypeModalComponent extends AppComponentBase implements OnInit {
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    companyType: CreateOrEditCompanyTypeDto = new CreateOrEditCompanyTypeDto();
    form: FormGroup;
    id: string;
   

    constructor(
        injector: Injector,
        private _companyTypeServiceProxy: CompanyTypeServiceProxy,
        private _dateTimeService: DateTimeService,
        private fb: FormBuilder,
    ) {
        super(injector);
    }

    createForm(item: any = {}) {
        this.form = this.fb.group({
            name: [item.name ? item.name : '', Validators.required],
            description: [item.description ? item.description : ''],
            id: [item.id ? item.id : null],
        });
    }

    show(companyTypeId?: string): void {
        if (companyTypeId) {
            // this.companyType = new CreateOrEditCompanyTypeDto();
            this.id = companyTypeId;

        //     this.active = true;
        //     this.modal.show();
        // } else {
            this._companyTypeServiceProxy.getCompanyTypeForEdit(companyTypeId).subscribe((result) => {
                this.createForm(result)

                
            });
        }
        this.active = true;
                this.modal.show();
    }

    save(): void {
        this.saving = true;

        this._companyTypeServiceProxy
            .createOrEdit(this.form.getRawValue())
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.form.reset();
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
