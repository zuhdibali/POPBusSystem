import { Component, ViewChild, Injector, Output, EventEmitter, OnInit} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { EmployeeTypeServiceProxy, CreateOrEditEmployeeTypeDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';




@Component({
    selector: 'createOrEditEmployeeTypeModal',
    templateUrl: './create-or-edit-employeeType-modal.component.html'
})
export class CreateOrEditEmployeeTypeModalComponent extends AppComponentBase implements OnInit{
   
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    employeeType: CreateOrEditEmployeeTypeDto = new CreateOrEditEmployeeTypeDto();




    constructor(
        injector: Injector,
        private _employeeTypeServiceProxy: EmployeeTypeServiceProxy
    ) {
        super(injector);
    }
    
    show(employeeTypeId?: number): void {
    

        if (!employeeTypeId) {
            this.employeeType = new CreateOrEditEmployeeTypeDto();
            this.employeeType.id = employeeTypeId;


            this.active = true;
            this.modal.show();
        } else {
            this._employeeTypeServiceProxy.getEmployeeTypeForEdit(employeeTypeId).subscribe(result => {
                this.employeeType = result.employeeType;



                this.active = true;
                this.modal.show();
            });
        }
        
        
    }

    save(): void {
            this.saving = true;
            
			
			
            this._employeeTypeServiceProxy.createOrEdit(this.employeeType)
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
