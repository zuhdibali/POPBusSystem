import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StationsServiceProxy, StationDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditStationModalComponent } from './create-or-edit-station-modal.component';
import { ViewStationModalComponent } from './view-station-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { EntityTypeHistoryModalComponent } from '@app/shared/common/entityHistory/entity-type-history-modal.component';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './stations.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class StationsComponent extends AppComponentBase {

    @ViewChild('createOrEditStationModal', {static: true}) createOrEditStationModal: CreateOrEditStationModalComponent;
    @ViewChild('viewStationModalComponent', {static: true}) viewStationModal: ViewStationModalComponent;
    @ViewChild('entityTypeHistoryModal', {static: true}) entityTypeHistoryModal: EntityTypeHistoryModalComponent;
    @ViewChild('dataTable', {static: true}) dataTable: Table;
    @ViewChild('paginator', {static: true}) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    locationNameFilter = '';
    maxLatitudeFilter : number;
		maxLatitudeFilterEmpty : number;
		minLatitudeFilter : number;
		minLatitudeFilterEmpty : number;
    maxLongitudeFilter : number;
		maxLongitudeFilterEmpty : number;
		minLongitudeFilter : number;
		minLongitudeFilterEmpty : number;
    isStopFilter = -1;
    maxStationCodeFilter : number;
		maxStationCodeFilterEmpty : number;
		minStationCodeFilter : number;
		minStationCodeFilterEmpty : number;
    locationNameHebrewFilter = '';
    typeFilter = '';
    isMarkFilter = -1;
    isSaveFilter = -1;
    maxcheckDistanceFilter : number;
		maxcheckDistanceFilterEmpty : number;
		mincheckDistanceFilter : number;
		mincheckDistanceFilterEmpty : number;
    isPathFilter = -1;


    _entityTypeFullName = 'BringitPal.POPBUS.Road.Station';
    entityHistoryEnabled = false;

    constructor(
        injector: Injector,
        private _stationsServiceProxy: StationsServiceProxy,
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
        return customSettings.EntityHistory && customSettings.EntityHistory.isEnabled && _.filter(customSettings.EntityHistory.enabledEntities, entityType => entityType === this._entityTypeFullName).length === 1;
    }

    getStations(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._stationsServiceProxy.getAll(
            this.filterText,
            this.locationNameFilter,
            this.maxLatitudeFilter == null ? this.maxLatitudeFilterEmpty: this.maxLatitudeFilter,
            this.minLatitudeFilter == null ? this.minLatitudeFilterEmpty: this.minLatitudeFilter,
            this.maxLongitudeFilter == null ? this.maxLongitudeFilterEmpty: this.maxLongitudeFilter,
            this.minLongitudeFilter == null ? this.minLongitudeFilterEmpty: this.minLongitudeFilter,
            this.isStopFilter,
            this.maxStationCodeFilter == null ? this.maxStationCodeFilterEmpty: this.maxStationCodeFilter,
            this.minStationCodeFilter == null ? this.minStationCodeFilterEmpty: this.minStationCodeFilter,
            this.locationNameHebrewFilter,
            this.typeFilter,
            this.isMarkFilter,
            this.isSaveFilter,
            this.maxcheckDistanceFilter == null ? this.maxcheckDistanceFilterEmpty: this.maxcheckDistanceFilter,
            this.mincheckDistanceFilter == null ? this.mincheckDistanceFilterEmpty: this.mincheckDistanceFilter,
            this.isPathFilter,
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

    createStation(): void {
        this.createOrEditStationModal.show();
    }

    showHistory(station: StationDto): void {
        this.entityTypeHistoryModal.show({
            entityId: station.id.toString(),
            entityTypeFullName: this._entityTypeFullName,
            entityTypeDescription: ''
        });
    }

    deleteStation(station: StationDto): void {
        this.message.confirm(
            '',
            (isConfirmed) => {
                if (isConfirmed) {
                    this._stationsServiceProxy.delete(station.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._stationsServiceProxy.getStationsToExcel(
        this.filterText,
            this.locationNameFilter,
            this.maxLatitudeFilter == null ? this.maxLatitudeFilterEmpty: this.maxLatitudeFilter,
            this.minLatitudeFilter == null ? this.minLatitudeFilterEmpty: this.minLatitudeFilter,
            this.maxLongitudeFilter == null ? this.maxLongitudeFilterEmpty: this.maxLongitudeFilter,
            this.minLongitudeFilter == null ? this.minLongitudeFilterEmpty: this.minLongitudeFilter,
            this.isStopFilter,
            this.maxStationCodeFilter == null ? this.maxStationCodeFilterEmpty: this.maxStationCodeFilter,
            this.minStationCodeFilter == null ? this.minStationCodeFilterEmpty: this.minStationCodeFilter,
            this.locationNameHebrewFilter,
            this.typeFilter,
            this.isMarkFilter,
            this.isSaveFilter,
            this.maxcheckDistanceFilter == null ? this.maxcheckDistanceFilterEmpty: this.maxcheckDistanceFilter,
            this.mincheckDistanceFilter == null ? this.mincheckDistanceFilterEmpty: this.mincheckDistanceFilter,
            this.isPathFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}
