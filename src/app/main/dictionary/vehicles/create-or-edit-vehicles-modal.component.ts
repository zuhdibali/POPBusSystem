import { Component, ViewChild, Injector, Output, EventEmitter, OnInit} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { VehiclesServiceProxy, CreateOrEditVehiclesDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

import { VehiclesVehiclesTypeLookupTableModalComponent } from './vehicles-vehiclesType-lookup-table-modal.component';



@Component({
    selector: 'createOrEditVehiclesModal',
    templateUrl: './create-or-edit-vehicles-modal.component.html'
})
export class CreateOrEditVehiclesModalComponent extends AppComponentBase implements OnInit{
   
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('vehiclesVehiclesTypeLookupTableModal', { static: true }) vehiclesVehiclesTypeLookupTableModal: VehiclesVehiclesTypeLookupTableModalComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    vehicles: CreateOrEditVehiclesDto = new CreateOrEditVehiclesDto();

    statusDate: Date;
    testDate: Date;
    insuranceDate: Date;
    lastHandleDate: Date;
    nextHandleDate: Date;
    updated: Date;
    isBusInTripLastUpdated: Date;
    vehiclesTypeTypeDescription = '';



    constructor(
        injector: Injector,
        private _vehiclesServiceProxy: VehiclesServiceProxy
    ) {
        super(injector);
    }
    
    show(vehiclesId?: number): void {
    
    this.statusDate = null;
    this.testDate = null;
    this.insuranceDate = null;
    this.lastHandleDate = null;
    this.nextHandleDate = null;
    this.updated = null;
    this.isBusInTripLastUpdated = null;

        if (!vehiclesId) {
            this.vehicles = new CreateOrEditVehiclesDto();
            this.vehicles.id = vehiclesId;
            this.vehiclesTypeTypeDescription = '';


            this.active = true;
            this.modal.show();
        } else {
            this._vehiclesServiceProxy.getVehiclesForEdit(vehiclesId).subscribe(result => {
                this.vehicles = result.vehicles;

                if (this.vehicles.statusDate) {
					this.statusDate = this.vehicles.statusDate.toDate();
                }
                if (this.vehicles.testDate) {
					this.testDate = this.vehicles.testDate.toDate();
                }
                if (this.vehicles.insuranceDate) {
					this.insuranceDate = this.vehicles.insuranceDate.toDate();
                }
                if (this.vehicles.lastHandleDate) {
					this.lastHandleDate = this.vehicles.lastHandleDate.toDate();
                }
                if (this.vehicles.nextHandleDate) {
					this.nextHandleDate = this.vehicles.nextHandleDate.toDate();
                }
                if (this.vehicles.updated) {
					this.updated = this.vehicles.updated.toDate();
                }
                if (this.vehicles.isBusInTripLastUpdated) {
					this.isBusInTripLastUpdated = this.vehicles.isBusInTripLastUpdated.toDate();
                }
                this.vehiclesTypeTypeDescription = result.vehiclesTypeTypeDescription;


                this.active = true;
                this.modal.show();
            });
        }
        
        
    }

    save(): void {
            this.saving = true;
            
			
        if (this.statusDate) {
            if (!this.vehicles.statusDate) {
                this.vehicles.statusDate = moment(this.statusDate).startOf('day');
            }
            else {
                this.vehicles.statusDate = moment(this.statusDate);
            }
        }
        else {
            this.vehicles.statusDate = null;
        }
        if (this.testDate) {
            if (!this.vehicles.testDate) {
                this.vehicles.testDate = moment(this.testDate).startOf('day');
            }
            else {
                this.vehicles.testDate = moment(this.testDate);
            }
        }
        else {
            this.vehicles.testDate = null;
        }
        if (this.insuranceDate) {
            if (!this.vehicles.insuranceDate) {
                this.vehicles.insuranceDate = moment(this.insuranceDate).startOf('day');
            }
            else {
                this.vehicles.insuranceDate = moment(this.insuranceDate);
            }
        }
        else {
            this.vehicles.insuranceDate = null;
        }
        if (this.lastHandleDate) {
            if (!this.vehicles.lastHandleDate) {
                this.vehicles.lastHandleDate = moment(this.lastHandleDate).startOf('day');
            }
            else {
                this.vehicles.lastHandleDate = moment(this.lastHandleDate);
            }
        }
        else {
            this.vehicles.lastHandleDate = null;
        }
        if (this.nextHandleDate) {
            if (!this.vehicles.nextHandleDate) {
                this.vehicles.nextHandleDate = moment(this.nextHandleDate).startOf('day');
            }
            else {
                this.vehicles.nextHandleDate = moment(this.nextHandleDate);
            }
        }
        else {
            this.vehicles.nextHandleDate = null;
        }
        if (this.updated) {
            if (!this.vehicles.updated) {
                this.vehicles.updated = moment(this.updated).startOf('day');
            }
            else {
                this.vehicles.updated = moment(this.updated);
            }
        }
        else {
            this.vehicles.updated = null;
        }
        if (this.isBusInTripLastUpdated) {
            if (!this.vehicles.isBusInTripLastUpdated) {
                this.vehicles.isBusInTripLastUpdated = moment(this.isBusInTripLastUpdated).startOf('day');
            }
            else {
                this.vehicles.isBusInTripLastUpdated = moment(this.isBusInTripLastUpdated);
            }
        }
        else {
            this.vehicles.isBusInTripLastUpdated = null;
        }
			
            this._vehiclesServiceProxy.createOrEdit(this.vehicles)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }

    openSelectVehiclesTypeModal() {
        this.vehiclesVehiclesTypeLookupTableModal.id = this.vehicles.vehiclesTypeId;
        this.vehiclesVehiclesTypeLookupTableModal.displayName = this.vehiclesTypeTypeDescription;
        this.vehiclesVehiclesTypeLookupTableModal.show();
    }


    setVehiclesTypeIdNull() {
        this.vehicles.vehiclesTypeId = null;
        this.vehiclesTypeTypeDescription = '';
    }


    getNewVehiclesTypeId() {
        this.vehicles.vehiclesTypeId = this.vehiclesVehiclesTypeLookupTableModal.id;
        this.vehiclesTypeTypeDescription = this.vehiclesVehiclesTypeLookupTableModal.displayName;
    }








    close(): void {
        this.active = false;
        this.modal.hide();
    }
    
     ngOnInit(): void {
        
     }    
}
