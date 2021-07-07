import {AppConsts} from "@shared/AppConsts";
import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetBusTypesForViewDto, BusTypesDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewBusTypesModal',
    templateUrl: './view-busTypes-modal.component.html'
})
export class ViewBusTypesModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetBusTypesForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetBusTypesForViewDto();
        this.item.busTypes = new BusTypesDto();
    }

    show(item: GetBusTypesForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }
    
    

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
