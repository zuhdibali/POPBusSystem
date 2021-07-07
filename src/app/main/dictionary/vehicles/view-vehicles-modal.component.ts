import {AppConsts} from "@shared/AppConsts";
import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetVehiclesForViewDto, VehiclesDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewVehiclesModal',
    templateUrl: './view-vehicles-modal.component.html'
})
export class ViewVehiclesModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetVehiclesForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetVehiclesForViewDto();
        this.item.vehicles = new VehiclesDto();
    }

    show(item: GetVehiclesForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }
    
    

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
