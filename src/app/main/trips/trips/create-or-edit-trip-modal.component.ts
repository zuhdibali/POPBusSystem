import { Component, ViewChild, Injector, Output, EventEmitter, OnInit} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { TripsServiceProxy, CreateOrEditTripDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

import { TripTripTypeLookupTableModalComponent } from './trip-tripType-lookup-table-modal.component';
import { TripRouteLookupTableModalComponent } from './trip-route-lookup-table-modal.component';
import { TripCalenderBusLookupTableModalComponent } from './trip-calenderBus-lookup-table-modal.component';



@Component({
    selector: 'createOrEditTripModal',
    templateUrl: './create-or-edit-trip-modal.component.html'
})
export class CreateOrEditTripModalComponent extends AppComponentBase implements OnInit{
   
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('tripTripTypeLookupTableModal', { static: true }) tripTripTypeLookupTableModal: TripTripTypeLookupTableModalComponent;
    @ViewChild('tripRouteLookupTableModal', { static: true }) tripRouteLookupTableModal: TripRouteLookupTableModalComponent;
    @ViewChild('tripCalenderBusLookupTableModal', { static: true }) tripCalenderBusLookupTableModal: TripCalenderBusLookupTableModalComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    trip: CreateOrEditTripDto = new CreateOrEditTripDto();

    tripTypeName = '';
    routeRouteIDGTFS = '';
    calenderBusCalenderName = '';



    constructor(
        injector: Injector,
        private _tripsServiceProxy: TripsServiceProxy
    ) {
        super(injector);
    }
    
    show(tripId?: number): void {
    

        if (!tripId) {
            this.trip = new CreateOrEditTripDto();
            this.trip.id = tripId;
            this.trip.startTime = moment().startOf('day');
            this.trip.endTime = moment().startOf('day');
            this.tripTypeName = '';
            this.routeRouteIDGTFS = '';
            this.calenderBusCalenderName = '';


            this.active = true;
            this.modal.show();
        } else {
            this._tripsServiceProxy.getTripForEdit(tripId).subscribe(result => {
                this.trip = result.trip;

                this.tripTypeName = result.tripTypeName;
                this.routeRouteIDGTFS = result.routeRouteIDGTFS;
                this.calenderBusCalenderName = result.calenderBusCalenderName;


                this.active = true;
                this.modal.show();
            });
        }
        
        
    }

    save(): void {
            this.saving = true;
            
			
			
            this._tripsServiceProxy.createOrEdit(this.trip)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }

    openSelectTripTypeModal() {
        this.tripTripTypeLookupTableModal.id = this.trip.tripTypeId;
        this.tripTripTypeLookupTableModal.displayName = this.tripTypeName;
        this.tripTripTypeLookupTableModal.show();
    }
    openSelectRouteModal() {
        this.tripRouteLookupTableModal.id = this.trip.routeId;
        this.tripRouteLookupTableModal.displayName = this.routeRouteIDGTFS;
        this.tripRouteLookupTableModal.show();
    }
    openSelectCalenderBusModal() {
        this.tripCalenderBusLookupTableModal.id = this.trip.calenderBusId;
        this.tripCalenderBusLookupTableModal.displayName = this.calenderBusCalenderName;
        this.tripCalenderBusLookupTableModal.show();
    }


    setTripTypeIdNull() {
        this.trip.tripTypeId = null;
        this.tripTypeName = '';
    }
    setRouteIdNull() {
        this.trip.routeId = null;
        this.routeRouteIDGTFS = '';
    }
    setCalenderBusIdNull() {
        this.trip.calenderBusId = null;
        this.calenderBusCalenderName = '';
    }


    getNewTripTypeId() {
        this.trip.tripTypeId = this.tripTripTypeLookupTableModal.id;
        this.tripTypeName = this.tripTripTypeLookupTableModal.displayName;
    }
    getNewRouteId() {
        this.trip.routeId = this.tripRouteLookupTableModal.id;
        this.routeRouteIDGTFS = this.tripRouteLookupTableModal.displayName;
    }
    getNewCalenderBusId() {
        this.trip.calenderBusId = this.tripCalenderBusLookupTableModal.id;
        this.calenderBusCalenderName = this.tripCalenderBusLookupTableModal.displayName;
    }








    close(): void {
        this.active = false;
        this.modal.hide();
    }
    
     ngOnInit(): void {
        
     }    
}
