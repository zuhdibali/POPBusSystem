import { Component, ViewChild, Injector, Output, EventEmitter, OnInit} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { RuntimePeriodsServiceProxy, CreateOrEditRuntimePeriodDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';




@Component({
    selector: 'createOrEditRuntimePeriodModal',
    templateUrl: './create-or-edit-runtimePeriod-modal.component.html'
})
export class CreateOrEditRuntimePeriodModalComponent extends AppComponentBase implements OnInit{
   
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    runtimePeriod: CreateOrEditRuntimePeriodDto = new CreateOrEditRuntimePeriodDto();




    constructor(
        injector: Injector,
        private _runtimePeriodsServiceProxy: RuntimePeriodsServiceProxy
    ) {
        super(injector);
    }
    
    show(runtimePeriodId?: number): void {
    

        if (!runtimePeriodId) {
            this.runtimePeriod = new CreateOrEditRuntimePeriodDto();
            this.runtimePeriod.id = runtimePeriodId;
            this.runtimePeriod.starttime = moment().startOf('day');
            this.runtimePeriod.endtime = moment().startOf('day');


            this.active = true;
            this.modal.show();
        } else {
            this._runtimePeriodsServiceProxy.getRuntimePeriodForEdit(runtimePeriodId).subscribe(result => {
                this.runtimePeriod = result.runtimePeriod;



                this.active = true;
                this.modal.show();
            });
        }
        
        
    }

    save(): void {
            this.saving = true;
            
			
			
            this._runtimePeriodsServiceProxy.createOrEdit(this.runtimePeriod)
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
