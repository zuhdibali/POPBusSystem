import {AppConsts} from '@shared/AppConsts';
import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { VechileGpsServiceProxy, VechileGpsDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditVechileGpsModalComponent } from './create-or-edit-vechileGps-modal.component';

import { ViewVechileGpsModalComponent } from './view-vechileGps-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { EntityTypeHistoryModalComponent } from '@app/shared/common/entityHistory/entity-type-history-modal.component';
import * as _ from 'lodash';
import * as moment from 'moment';


@Component({
    templateUrl: './vechileGps.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class VechileGpsComponent extends AppComponentBase {
    
    
    @ViewChild('entityTypeHistoryModal', { static: true }) entityTypeHistoryModal: EntityTypeHistoryModalComponent;
    @ViewChild('createOrEditVechileGpsModal', { static: true }) createOrEditVechileGpsModal: CreateOrEditVechileGpsModalComponent;
    @ViewChild('viewVechileGpsModalComponent', { static: true }) viewVechileGpsModal: ViewVechileGpsModalComponent;   
    
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    maxVechileIDFilter : number;
		maxVechileIDFilterEmpty : number;
		minVechileIDFilter : number;
		minVechileIDFilterEmpty : number;
    maxLatitudeFilter : number;
		maxLatitudeFilterEmpty : number;
		minLatitudeFilter : number;
		minLatitudeFilterEmpty : number;
    maxLongitudeFilter : number;
		maxLongitudeFilterEmpty : number;
		minLongitudeFilter : number;
		minLongitudeFilterEmpty : number;
    maxangleFilter : number;
		maxangleFilterEmpty : number;
		minangleFilter : number;
		minangleFilterEmpty : number;
    maxLocationDateTimeFilter : moment.Moment;
		minLocationDateTimeFilter : moment.Moment;
    maxSatellitesFilter : number;
		maxSatellitesFilterEmpty : number;
		minSatellitesFilter : number;
		minSatellitesFilterEmpty : number;
    maxHdopFilter : number;
		maxHdopFilterEmpty : number;
		minHdopFilter : number;
		minHdopFilterEmpty : number;
    maxCreatedFilter : moment.Moment;
		minCreatedFilter : moment.Moment;
    maxModifiedFilter : moment.Moment;
		minModifiedFilter : moment.Moment;
    maxGPSSpeedFilter : number;
		maxGPSSpeedFilterEmpty : number;
		minGPSSpeedFilter : number;
		minGPSSpeedFilterEmpty : number;
    maxSpeedFilter : number;
		maxSpeedFilterEmpty : number;
		minSpeedFilter : number;
		minSpeedFilterEmpty : number;
    maxBearingFilter : number;
		maxBearingFilterEmpty : number;
		minBearingFilter : number;
		minBearingFilterEmpty : number;
    maxVehicleNumberFilter : number;
		maxVehicleNumberFilterEmpty : number;
		minVehicleNumberFilter : number;
		minVehicleNumberFilterEmpty : number;


    _entityTypeFullName = 'BringitPal.POPBUS.Information.VechileGps';
    entityHistoryEnabled = false;



    constructor(
        injector: Injector,
        private _vechileGpsServiceProxy: VechileGpsServiceProxy,
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

    getVechileGps(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._vechileGpsServiceProxy.getAll(
            this.filterText,
            this.maxVechileIDFilter == null ? this.maxVechileIDFilterEmpty: this.maxVechileIDFilter,
            this.minVechileIDFilter == null ? this.minVechileIDFilterEmpty: this.minVechileIDFilter,
            this.maxLatitudeFilter == null ? this.maxLatitudeFilterEmpty: this.maxLatitudeFilter,
            this.minLatitudeFilter == null ? this.minLatitudeFilterEmpty: this.minLatitudeFilter,
            this.maxLongitudeFilter == null ? this.maxLongitudeFilterEmpty: this.maxLongitudeFilter,
            this.minLongitudeFilter == null ? this.minLongitudeFilterEmpty: this.minLongitudeFilter,
            this.maxangleFilter == null ? this.maxangleFilterEmpty: this.maxangleFilter,
            this.minangleFilter == null ? this.minangleFilterEmpty: this.minangleFilter,
            this.maxLocationDateTimeFilter === undefined ? this.maxLocationDateTimeFilter : moment(this.maxLocationDateTimeFilter).endOf('day'),
            this.minLocationDateTimeFilter === undefined ? this.minLocationDateTimeFilter : moment(this.minLocationDateTimeFilter).startOf('day'),
            this.maxSatellitesFilter == null ? this.maxSatellitesFilterEmpty: this.maxSatellitesFilter,
            this.minSatellitesFilter == null ? this.minSatellitesFilterEmpty: this.minSatellitesFilter,
            this.maxHdopFilter == null ? this.maxHdopFilterEmpty: this.maxHdopFilter,
            this.minHdopFilter == null ? this.minHdopFilterEmpty: this.minHdopFilter,
            this.maxCreatedFilter === undefined ? this.maxCreatedFilter : moment(this.maxCreatedFilter).endOf('day'),
            this.minCreatedFilter === undefined ? this.minCreatedFilter : moment(this.minCreatedFilter).startOf('day'),
            this.maxModifiedFilter === undefined ? this.maxModifiedFilter : moment(this.maxModifiedFilter).endOf('day'),
            this.minModifiedFilter === undefined ? this.minModifiedFilter : moment(this.minModifiedFilter).startOf('day'),
            this.maxGPSSpeedFilter == null ? this.maxGPSSpeedFilterEmpty: this.maxGPSSpeedFilter,
            this.minGPSSpeedFilter == null ? this.minGPSSpeedFilterEmpty: this.minGPSSpeedFilter,
            this.maxSpeedFilter == null ? this.maxSpeedFilterEmpty: this.maxSpeedFilter,
            this.minSpeedFilter == null ? this.minSpeedFilterEmpty: this.minSpeedFilter,
            this.maxBearingFilter == null ? this.maxBearingFilterEmpty: this.maxBearingFilter,
            this.minBearingFilter == null ? this.minBearingFilterEmpty: this.minBearingFilter,
            this.maxVehicleNumberFilter == null ? this.maxVehicleNumberFilterEmpty: this.maxVehicleNumberFilter,
            this.minVehicleNumberFilter == null ? this.minVehicleNumberFilterEmpty: this.minVehicleNumberFilter,
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

    createVechileGps(): void {
        this.createOrEditVechileGpsModal.show();        
    }


    showHistory(vechileGps: VechileGpsDto): void {
        this.entityTypeHistoryModal.show({
            entityId: vechileGps.id.toString(),
            entityTypeFullName: this._entityTypeFullName,
            entityTypeDescription: ''
        });
    }

    deleteVechileGps(vechileGps: VechileGpsDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._vechileGpsServiceProxy.delete(vechileGps.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._vechileGpsServiceProxy.getVechileGpsToExcel(
        this.filterText,
            this.maxVechileIDFilter == null ? this.maxVechileIDFilterEmpty: this.maxVechileIDFilter,
            this.minVechileIDFilter == null ? this.minVechileIDFilterEmpty: this.minVechileIDFilter,
            this.maxLatitudeFilter == null ? this.maxLatitudeFilterEmpty: this.maxLatitudeFilter,
            this.minLatitudeFilter == null ? this.minLatitudeFilterEmpty: this.minLatitudeFilter,
            this.maxLongitudeFilter == null ? this.maxLongitudeFilterEmpty: this.maxLongitudeFilter,
            this.minLongitudeFilter == null ? this.minLongitudeFilterEmpty: this.minLongitudeFilter,
            this.maxangleFilter == null ? this.maxangleFilterEmpty: this.maxangleFilter,
            this.minangleFilter == null ? this.minangleFilterEmpty: this.minangleFilter,
            this.maxLocationDateTimeFilter === undefined ? this.maxLocationDateTimeFilter : moment(this.maxLocationDateTimeFilter).endOf('day'),
            this.minLocationDateTimeFilter === undefined ? this.minLocationDateTimeFilter : moment(this.minLocationDateTimeFilter).startOf('day'),
            this.maxSatellitesFilter == null ? this.maxSatellitesFilterEmpty: this.maxSatellitesFilter,
            this.minSatellitesFilter == null ? this.minSatellitesFilterEmpty: this.minSatellitesFilter,
            this.maxHdopFilter == null ? this.maxHdopFilterEmpty: this.maxHdopFilter,
            this.minHdopFilter == null ? this.minHdopFilterEmpty: this.minHdopFilter,
            this.maxCreatedFilter === undefined ? this.maxCreatedFilter : moment(this.maxCreatedFilter).endOf('day'),
            this.minCreatedFilter === undefined ? this.minCreatedFilter : moment(this.minCreatedFilter).startOf('day'),
            this.maxModifiedFilter === undefined ? this.maxModifiedFilter : moment(this.maxModifiedFilter).endOf('day'),
            this.minModifiedFilter === undefined ? this.minModifiedFilter : moment(this.minModifiedFilter).startOf('day'),
            this.maxGPSSpeedFilter == null ? this.maxGPSSpeedFilterEmpty: this.maxGPSSpeedFilter,
            this.minGPSSpeedFilter == null ? this.minGPSSpeedFilterEmpty: this.minGPSSpeedFilter,
            this.maxSpeedFilter == null ? this.maxSpeedFilterEmpty: this.maxSpeedFilter,
            this.minSpeedFilter == null ? this.minSpeedFilterEmpty: this.minSpeedFilter,
            this.maxBearingFilter == null ? this.maxBearingFilterEmpty: this.maxBearingFilter,
            this.minBearingFilter == null ? this.minBearingFilterEmpty: this.minBearingFilter,
            this.maxVehicleNumberFilter == null ? this.maxVehicleNumberFilterEmpty: this.maxVehicleNumberFilter,
            this.minVehicleNumberFilter == null ? this.minVehicleNumberFilterEmpty: this.minVehicleNumberFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
    
    
    
    
    
}
