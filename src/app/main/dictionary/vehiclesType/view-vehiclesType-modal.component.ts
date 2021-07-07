import {AppConsts} from "@shared/AppConsts";
import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetVehiclesTypeForViewDto, VehiclesTypeDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewVehiclesTypeModal',
    templateUrl: './view-vehiclesType-modal.component.html'
})
export class ViewVehiclesTypeModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetVehiclesTypeForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetVehiclesTypeForViewDto();
        this.item.vehiclesType = new VehiclesTypeDto();
    }

    show(item: GetVehiclesTypeForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }
    
    

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
