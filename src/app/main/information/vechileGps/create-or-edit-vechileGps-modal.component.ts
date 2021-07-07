import { Component, ViewChild, Injector, Output, EventEmitter, OnInit} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { VechileGpsServiceProxy, CreateOrEditVechileGpsDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';




@Component({
    selector: 'createOrEditVechileGpsModal',
    templateUrl: './create-or-edit-vechileGps-modal.component.html'
})
export class CreateOrEditVechileGpsModalComponent extends AppComponentBase implements OnInit{
   
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    vechileGps: CreateOrEditVechileGpsDto = new CreateOrEditVechileGpsDto();




    constructor(
        injector: Injector,
        private _vechileGpsServiceProxy: VechileGpsServiceProxy
    ) {
        super(injector);
    }
    
    show(vechileGpsId?: number): void {
    

        if (!vechileGpsId) {
            this.vechileGps = new CreateOrEditVechileGpsDto();
            this.vechileGps.id = vechileGpsId;
            this.vechileGps.locationDateTime = moment().startOf('day');
            this.vechileGps.created = moment().startOf('day');
            this.vechileGps.modified = moment().startOf('day');


            this.active = true;
            this.modal.show();
        } else {
            this._vechileGpsServiceProxy.getVechileGpsForEdit(vechileGpsId).subscribe(result => {
                this.vechileGps = result.vechileGps;



                this.active = true;
                this.modal.show();
            });
        }
        
        
    }

    save(): void {
            this.saving = true;
            
			
			
            this._vechileGpsServiceProxy.createOrEdit(this.vechileGps)
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
