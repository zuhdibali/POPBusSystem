import {AppConsts} from '@shared/AppConsts';
import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { TripsServiceProxy, TripDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditTripModalComponent } from './create-or-edit-trip-modal.component';

import { ViewTripModalComponent } from './view-trip-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { EntityTypeHistoryModalComponent } from '@app/shared/common/entityHistory/entity-type-history-modal.component';
import * as _ from 'lodash';
import * as moment from 'moment';


@Component({
    templateUrl: './trips.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class TripsComponent extends AppComponentBase {
    
    
    @ViewChild('entityTypeHistoryModal', { static: true }) entityTypeHistoryModal: EntityTypeHistoryModalComponent;
    @ViewChild('createOrEditTripModal', { static: true }) createOrEditTripModal: CreateOrEditTripModalComponent;
    @ViewChild('viewTripModalComponent', { static: true }) viewTripModal: ViewTripModalComponent;   
    
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    trip_idFilter = '';
    maxStartTimeFilter : moment.Moment;
		minStartTimeFilter : moment.Moment;
    maxEndTimeFilter : moment.Moment;
		minEndTimeFilter : moment.Moment;
        tripTypeNameFilter = '';
        routeRouteIDGTFSFilter = '';
        calenderBusCalenderNameFilter = '';


    _entityTypeFullName = 'BringitPal.POPBUS.Trips.Trip';
    entityHistoryEnabled = false;



    constructor(
        injector: Injector,
        private _tripsServiceProxy: TripsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.entityHistoryEnabled = this.setIsEntityHistoryEnabled();
    }

    private setIsEntityHistoryEnabled(): boolean {
        let customSettings = (abp as any).custom;
        return this.isGrantedAny('Pages.Administration.AuditLogs') && customSettings.EntityHistory && customSettings.EntityHistory.isEnabled && _.filter(customSettings.EntityHistory.enabledEntities, entityType => entityType === this._entityTypeFullName).length === 1;
    }

    getTrips(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._tripsServiceProxy.getAll(
            this.filterText,
            this.trip_idFilter,
            this.maxStartTimeFilter === undefined ? this.maxStartTimeFilter : moment(this.maxStartTimeFilter).endOf('day'),
            this.minStartTimeFilter === undefined ? this.minStartTimeFilter : moment(this.minStartTimeFilter).startOf('day'),
            this.maxEndTimeFilter === undefined ? this.maxEndTimeFilter : moment(this.maxEndTimeFilter).endOf('day'),
            this.minEndTimeFilter === undefined ? this.minEndTimeFilter : moment(this.minEndTimeFilter).startOf('day'),
            this.tripTypeNameFilter,
            this.routeRouteIDGTFSFilter,
            this.calenderBusCalenderNameFilter,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createTrip(): void {
        this.createOrEditTripModal.show();        
    }


    showHistory(trip: TripDto): void {
        this.entityTypeHistoryModal.show({
            entityId: trip.id.toString(),
            entityTypeFullName: this._entityTypeFullName,
            entityTypeDescription: ''
        });
    }

    deleteTrip(trip: TripDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._tripsServiceProxy.delete(trip.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._tripsServiceProxy.getTripsToExcel(
        this.filterText,
            this.trip_idFilter,
            this.maxStartTimeFilter === undefined ? this.maxStartTimeFilter : moment(this.maxStartTimeFilter).endOf('day'),
            this.minStartTimeFilter === undefined ? this.minStartTimeFilter : moment(this.minStartTimeFilter).startOf('day'),
            this.maxEndTimeFilter === undefined ? this.maxEndTimeFilter : moment(this.maxEndTimeFilter).endOf('day'),
            this.minEndTimeFilter === undefined ? this.minEndTimeFilter : moment(this.minEndTimeFilter).startOf('day'),
            this.tripTypeNameFilter,
            this.routeRouteIDGTFSFilter,
            this.calenderBusCalenderNameFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
    
    
    
    
    
}
