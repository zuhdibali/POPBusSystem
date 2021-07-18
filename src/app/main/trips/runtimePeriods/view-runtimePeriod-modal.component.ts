import {AppConsts} from "@shared/AppConsts";
import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetRuntimePeriodForViewDto, RuntimePeriodDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewRuntimePeriodModal',
    templateUrl: './view-runtimePeriod-modal.component.html'
})
export class ViewRuntimePeriodModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetRuntimePeriodForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetRuntimePeriodForViewDto();
        this.item.runtimePeriod = new RuntimePeriodDto();
    }

    show(item: GetRuntimePeriodForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }
    
    

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
