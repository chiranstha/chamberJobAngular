﻿import { AppConsts } from '@shared/AppConsts';
import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GetJobDemandForViewDto,  ExperienceLevelEnum } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewJobDemandModal',
    templateUrl: './view-jobDemand-modal.component.html',
})
export class ViewJobDemandModalComponent extends AppComponentBase {
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetJobDemandForViewDto;
    experienceLevelEnum = ExperienceLevelEnum;

    constructor(injector: Injector) {
        super(injector);
        this.item = new GetJobDemandForViewDto();
    }

    show(item: GetJobDemandForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
