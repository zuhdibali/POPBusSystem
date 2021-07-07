import { Component, ViewChild, Injector, Output, EventEmitter, OnInit} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { BanksesServiceProxy, CreateOrEditBanksDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';




@Component({
    selector: 'createOrEditBanksModal',
    templateUrl: './create-or-edit-banks-modal.component.html'
})
export class CreateOrEditBanksModalComponent extends AppComponentBase implements OnInit{
   
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    banks: CreateOrEditBanksDto = new CreateOrEditBanksDto();




    constructor(
        injector: Injector,
        private _banksesServiceProxy: BanksesServiceProxy
    ) {
        super(injector);
    }
    
    show(banksId?: number): void {
    

        if (!banksId) {
            this.banks = new CreateOrEditBanksDto();
            this.banks.id = banksId;


            this.active = true;
            this.modal.show();
        } else {
            this._banksesServiceProxy.getBanksForEdit(banksId).subscribe(result => {
                this.banks = result.banks;



                this.active = true;
                this.modal.show();
            });
        }
        
        
    }

    save(): void {
            this.saving = true;
            
			
			
            this._banksesServiceProxy.createOrEdit(this.banks)
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
