import { Component, ViewChild, Injector, Output, EventEmitter, OnInit} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { BranchesServiceProxy, CreateOrEditBranchesDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';




@Component({
    selector: 'createOrEditBranchesModal',
    templateUrl: './create-or-edit-branches-modal.component.html'
})
export class CreateOrEditBranchesModalComponent extends AppComponentBase implements OnInit{
   
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    branches: CreateOrEditBranchesDto = new CreateOrEditBranchesDto();




    constructor(
        injector: Injector,
        private _branchesServiceProxy: BranchesServiceProxy
    ) {
        super(injector);
    }
    
    show(branchesId?: number): void {
    

        if (!branchesId) {
            this.branches = new CreateOrEditBranchesDto();
            this.branches.id = branchesId;


            this.active = true;
            this.modal.show();
        } else {
            this._branchesServiceProxy.getBranchesForEdit(branchesId).subscribe(result => {
                this.branches = result.branches;



                this.active = true;
                this.modal.show();
            });
        }
        
        
    }

    save(): void {
            this.saving = true;
            
			
			
            this._branchesServiceProxy.createOrEdit(this.branches)
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
