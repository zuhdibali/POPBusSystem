import { Component, ViewChild, Injector, Output, EventEmitter, OnInit} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { ShapesServiceProxy, CreateOrEditShapeDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

import { ShapeRouteLookupTableModalComponent } from './shape-route-lookup-table-modal.component';



@Component({
    selector: 'createOrEditShapeModal',
    templateUrl: './create-or-edit-shape-modal.component.html'
})
export class CreateOrEditShapeModalComponent extends AppComponentBase implements OnInit{
   
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('shapeRouteLookupTableModal', { static: true }) shapeRouteLookupTableModal: ShapeRouteLookupTableModalComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    shape: CreateOrEditShapeDto = new CreateOrEditShapeDto();

    routeRouteIDGTFS = '';



    constructor(
        injector: Injector,
        private _shapesServiceProxy: ShapesServiceProxy
    ) {
        super(injector);
    }
    
    show(shapeId?: number): void {
    

        if (!shapeId) {
            this.shape = new CreateOrEditShapeDto();
            this.shape.id = shapeId;
            this.routeRouteIDGTFS = '';


            this.active = true;
            this.modal.show();
        } else {
            this._shapesServiceProxy.getShapeForEdit(shapeId).subscribe(result => {
                this.shape = result.shape;

                this.routeRouteIDGTFS = result.routeRouteIDGTFS;


                this.active = true;
                this.modal.show();
            });
        }
        
        
    }

    save(): void {
            this.saving = true;
            
			
			
            this._shapesServiceProxy.createOrEdit(this.shape)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }

    openSelectRouteModal() {
        this.shapeRouteLookupTableModal.id = this.shape.routeId;
        this.shapeRouteLookupTableModal.displayName = this.routeRouteIDGTFS;
        this.shapeRouteLookupTableModal.show();
    }


    setRouteIdNull() {
        this.shape.routeId = null;
        this.routeRouteIDGTFS = '';
    }


    getNewRouteId() {
        this.shape.routeId = this.shapeRouteLookupTableModal.id;
        this.routeRouteIDGTFS = this.shapeRouteLookupTableModal.displayName;
    }








    close(): void {
        this.active = false;
        this.modal.hide();
    }
    
     ngOnInit(): void {
        
     }    
}
