import {AppConsts} from "@shared/AppConsts";
import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetCalenderBusForViewDto, CalenderBusDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewCalenderBusModal',
    templateUrl: './view-calenderBus-modal.component.html'
})
export class ViewCalenderBusModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetCalenderBusForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetCalenderBusForViewDto();
        this.item.calenderBus = new CalenderBusDto();
    }

    show(item: GetCalenderBusForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }
    
    

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
