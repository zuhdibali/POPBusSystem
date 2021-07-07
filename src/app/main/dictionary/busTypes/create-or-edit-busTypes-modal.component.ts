import { Component, ViewChild, Injector, Output, EventEmitter, OnInit} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { BusTypesServiceProxy, CreateOrEditBusTypesDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';




@Component({
    selector: 'createOrEditBusTypesModal',
    templateUrl: './create-or-edit-busTypes-modal.component.html'
})
export class CreateOrEditBusTypesModalComponent extends AppComponentBase implements OnInit{
   
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    busTypes: CreateOrEditBusTypesDto = new CreateOrEditBusTypesDto();




    constructor(
        injector: Injector,
        private _busTypesServiceProxy: BusTypesServiceProxy
    ) {
        super(injector);
    }
    
    show(busTypesId?: number): void {
    

        if (!busTypesId) {
            this.busTypes = new CreateOrEditBusTypesDto();
            this.busTypes.id = busTypesId;


            this.active = true;
            this.modal.show();
        } else {
            this._busTypesServiceProxy.getBusTypesForEdit(busTypesId).subscribe(result => {
                this.busTypes = result.busTypes;



                this.active = true;
                this.modal.show();
            });
        }
        
        
    }

    save(): void {
            this.saving = true;
            
			
			
            this._busTypesServiceProxy.createOrEdit(this.busTypes)
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
