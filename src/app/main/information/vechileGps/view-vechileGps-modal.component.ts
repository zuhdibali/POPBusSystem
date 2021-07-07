import {AppConsts} from "@shared/AppConsts";
import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetVechileGpsForViewDto, VechileGpsDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewVechileGpsModal',
    templateUrl: './view-vechileGps-modal.component.html'
})
export class ViewVechileGpsModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetVechileGpsForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetVechileGpsForViewDto();
        this.item.vechileGps = new VechileGpsDto();
    }

    show(item: GetVechileGpsForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }
    
    

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
