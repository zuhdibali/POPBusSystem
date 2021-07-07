import { Component, ViewChild, Injector, Output, EventEmitter, OnInit} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { VehiclesTypeServiceProxy, CreateOrEditVehiclesTypeDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';




@Component({
    selector: 'createOrEditVehiclesTypeModal',
    templateUrl: './create-or-edit-vehiclesType-modal.component.html'
})
export class CreateOrEditVehiclesTypeModalComponent extends AppComponentBase implements OnInit{
   
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    vehiclesType: CreateOrEditVehiclesTypeDto = new CreateOrEditVehiclesTypeDto();

    modificationDate: Date;
    creationDate: Date;



    constructor(
        injector: Injector,
        private _vehiclesTypeServiceProxy: VehiclesTypeServiceProxy
    ) {
        super(injector);
    }
    
    show(vehiclesTypeId?: number): void {
    
    this.modificationDate = null;
    this.creationDate = null;

        if (!vehiclesTypeId) {
            this.vehiclesType = new CreateOrEditVehiclesTypeDto();
            this.vehiclesType.id = vehiclesTypeId;


            this.active = true;
            this.modal.show();
        } else {
            this._vehiclesTypeServiceProxy.getVehiclesTypeForEdit(vehiclesTypeId).subscribe(result => {
                this.vehiclesType = result.vehiclesType;

                if (this.vehiclesType.modificationDate) {
					this.modificationDate = this.vehiclesType.modificationDate.toDate();
                }
                if (this.vehiclesType.creationDate) {
					this.creationDate = this.vehiclesType.creationDate.toDate();
                }


                this.active = true;
                this.modal.show();
            });
        }
        
        
    }

    save(): void {
            this.saving = true;
            
			
        if (this.modificationDate) {
            if (!this.vehiclesType.modificationDate) {
                this.vehiclesType.modificationDate = moment(this.modificationDate).startOf('day');
            }
            else {
                this.vehiclesType.modificationDate = moment(this.modificationDate);
            }
        }
        else {
            this.vehiclesType.modificationDate = null;
        }
        if (this.creationDate) {
            if (!this.vehiclesType.creationDate) {
                this.vehiclesType.creationDate = moment(this.creationDate).startOf('day');
            }
            else {
                this.vehiclesType.creationDate = moment(this.creationDate);
            }
        }
        else {
            this.vehiclesType.creationDate = null;
        }
			
            this._vehiclesTypeServiceProxy.createOrEdit(this.vehiclesType)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }













    close(): void {
        this.active = false;
        this.modal.hide();
    }
    
     ngOnInit(): void {
        
     }    
}
