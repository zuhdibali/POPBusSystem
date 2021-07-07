import {AppConsts} from '@shared/AppConsts';
import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { VehiclesTypeServiceProxy, VehiclesTypeDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditVehiclesTypeModalComponent } from './create-or-edit-vehiclesType-modal.component';

import { ViewVehiclesTypeModalComponent } from './view-vehiclesType-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { EntityTypeHistoryModalComponent } from '@app/shared/common/entityHistory/entity-type-history-modal.component';
import * as _ from 'lodash';
import * as moment from 'moment';


@Component({
    templateUrl: './vehiclesType.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class VehiclesTypeComponent extends AppComponentBase {
    
    
    @ViewChild('entityTypeHistoryModal', { static: true }) entityTypeHistoryModal: EntityTypeHistoryModalComponent;
    @ViewChild('createOrEditVehiclesTypeModal', { static: true }) createOrEditVehiclesTypeModal: CreateOrEditVehiclesTypeModalComponent;
    @ViewChild('viewVehiclesTypeModalComponent', { static: true }) viewVehiclesTypeModal: ViewVehiclesTypeModalComponent;   
    
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    typeDescriptionFilter = '';
    maxManufacturerFilter : number;
		maxManufacturerFilterEmpty : number;
		minManufacturerFilter : number;
		minManufacturerFilterEmpty : number;
    maxMotorTypeFilter : number;
		maxMotorTypeFilterEmpty : number;
		minMotorTypeFilter : number;
		minMotorTypeFilterEmpty : number;
    maxPassengersCountFilter : number;
		maxPassengersCountFilterEmpty : number;
		minPassengersCountFilter : number;
		minPassengersCountFilterEmpty : number;
    maxDoorsCountFilter : number;
		maxDoorsCountFilterEmpty : number;
		minDoorsCountFilter : number;
		minDoorsCountFilterEmpty : number;
    maxDoorsTypesFilter : number;
		maxDoorsTypesFilterEmpty : number;
		minDoorsTypesFilter : number;
		minDoorsTypesFilterEmpty : number;
    maxGarageFrequencyKMFilter : number;
		maxGarageFrequencyKMFilterEmpty : number;
		minGarageFrequencyKMFilter : number;
		minGarageFrequencyKMFilterEmpty : number;
    maxSeatsNumberFilter : number;
		maxSeatsNumberFilterEmpty : number;
		minSeatsNumberFilter : number;
		minSeatsNumberFilterEmpty : number;
    noInterurbanFilter = -1;
    maxBusTypeFilter : number;
		maxBusTypeFilterEmpty : number;
		minBusTypeFilter : number;
		minBusTypeFilterEmpty : number;
    maxTiresCountFilter : number;
		maxTiresCountFilterEmpty : number;
		minTiresCountFilter : number;
		minTiresCountFilterEmpty : number;
    maxStatusFilter : number;
		maxStatusFilterEmpty : number;
		minStatusFilter : number;
		minStatusFilterEmpty : number;
    maxModifiedByFilter : number;
		maxModifiedByFilterEmpty : number;
		minModifiedByFilter : number;
		minModifiedByFilterEmpty : number;
    maxModificationDateFilter : moment.Moment;
		minModificationDateFilter : moment.Moment;
    maxCreatedByFilter : number;
		maxCreatedByFilterEmpty : number;
		minCreatedByFilter : number;
		minCreatedByFilterEmpty : number;
    maxCreationDateFilter : moment.Moment;
		minCreationDateFilter : moment.Moment;


    _entityTypeFullName = 'BringitPal.POPBUS.Dictionary.VehiclesType';
    entityHistoryEnabled = false;



    constructor(
        injector: Injector,
        private _vehiclesTypeServiceProxy: VehiclesTypeServiceProxy,
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

    getVehiclesType(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._vehiclesTypeServiceProxy.getAll(
            this.filterText,
            this.typeDescriptionFilter,
            this.maxManufacturerFilter == null ? this.maxManufacturerFilterEmpty: this.maxManufacturerFilter,
            this.minManufacturerFilter == null ? this.minManufacturerFilterEmpty: this.minManufacturerFilter,
            this.maxMotorTypeFilter == null ? this.maxMotorTypeFilterEmpty: this.maxMotorTypeFilter,
            this.minMotorTypeFilter == null ? this.minMotorTypeFilterEmpty: this.minMotorTypeFilter,
            this.maxPassengersCountFilter == null ? this.maxPassengersCountFilterEmpty: this.maxPassengersCountFilter,
            this.minPassengersCountFilter == null ? this.minPassengersCountFilterEmpty: this.minPassengersCountFilter,
            this.maxDoorsCountFilter == null ? this.maxDoorsCountFilterEmpty: this.maxDoorsCountFilter,
            this.minDoorsCountFilter == null ? this.minDoorsCountFilterEmpty: this.minDoorsCountFilter,
            this.maxDoorsTypesFilter == null ? this.maxDoorsTypesFilterEmpty: this.maxDoorsTypesFilter,
            this.minDoorsTypesFilter == null ? this.minDoorsTypesFilterEmpty: this.minDoorsTypesFilter,
            this.maxGarageFrequencyKMFilter == null ? this.maxGarageFrequencyKMFilterEmpty: this.maxGarageFrequencyKMFilter,
            this.minGarageFrequencyKMFilter == null ? this.minGarageFrequencyKMFilterEmpty: this.minGarageFrequencyKMFilter,
            this.maxSeatsNumberFilter == null ? this.maxSeatsNumberFilterEmpty: this.maxSeatsNumberFilter,
            this.minSeatsNumberFilter == null ? this.minSeatsNumberFilterEmpty: this.minSeatsNumberFilter,
            this.noInterurbanFilter,
            this.maxBusTypeFilter == null ? this.maxBusTypeFilterEmpty: this.maxBusTypeFilter,
            this.minBusTypeFilter == null ? this.minBusTypeFilterEmpty: this.minBusTypeFilter,
            this.maxTiresCountFilter == null ? this.maxTiresCountFilterEmpty: this.maxTiresCountFilter,
            this.minTiresCountFilter == null ? this.minTiresCountFilterEmpty: this.minTiresCountFilter,
            this.maxStatusFilter == null ? this.maxStatusFilterEmpty: this.maxStatusFilter,
            this.minStatusFilter == null ? this.minStatusFilterEmpty: this.minStatusFilter,
            this.maxModifiedByFilter == null ? this.maxModifiedByFilterEmpty: this.maxModifiedByFilter,
            this.minModifiedByFilter == null ? this.minModifiedByFilterEmpty: this.minModifiedByFilter,
            this.maxModificationDateFilter === undefined ? this.maxModificationDateFilter : moment(this.maxModificationDateFilter).endOf('day'),
            this.minModificationDateFilter === undefined ? this.minModificationDateFilter : moment(this.minModificationDateFilter).startOf('day'),
            this.maxCreatedByFilter == null ? this.maxCreatedByFilterEmpty: this.maxCreatedByFilter,
            this.minCreatedByFilter == null ? this.minCreatedByFilterEmpty: this.minCreatedByFilter,
            this.maxCreationDateFilter === undefined ? this.maxCreationDateFilter : moment(this.maxCreationDateFilter).endOf('day'),
            this.minCreationDateFilter === undefined ? this.minCreationDateFilter : moment(this.minCreationDateFilter).startOf('day'),
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

    createVehiclesType(): void {
        this.createOrEditVehiclesTypeModal.show();        
    }


    showHistory(vehiclesType: VehiclesTypeDto): void {
        this.entityTypeHistoryModal.show({
            entityId: vehiclesType.id.toString(),
            entityTypeFullName: this._entityTypeFullName,
            entityTypeDescription: ''
        });
    }

    deleteVehiclesType(vehiclesType: VehiclesTypeDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._vehiclesTypeServiceProxy.delete(vehiclesType.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._vehiclesTypeServiceProxy.getVehiclesTypeToExcel(
        this.filterText,
            this.typeDescriptionFilter,
            this.maxManufacturerFilter == null ? this.maxManufacturerFilterEmpty: this.maxManufacturerFilter,
            this.minManufacturerFilter == null ? this.minManufacturerFilterEmpty: this.minManufacturerFilter,
            this.maxMotorTypeFilter == null ? this.maxMotorTypeFilterEmpty: this.maxMotorTypeFilter,
            this.minMotorTypeFilter == null ? this.minMotorTypeFilterEmpty: this.minMotorTypeFilter,
            this.maxPassengersCountFilter == null ? this.maxPassengersCountFilterEmpty: this.maxPassengersCountFilter,
            this.minPassengersCountFilter == null ? this.minPassengersCountFilterEmpty: this.minPassengersCountFilter,
            this.maxDoorsCountFilter == null ? this.maxDoorsCountFilterEmpty: this.maxDoorsCountFilter,
            this.minDoorsCountFilter == null ? this.minDoorsCountFilterEmpty: this.minDoorsCountFilter,
            this.maxDoorsTypesFilter == null ? this.maxDoorsTypesFilterEmpty: this.maxDoorsTypesFilter,
            this.minDoorsTypesFilter == null ? this.minDoorsTypesFilterEmpty: this.minDoorsTypesFilter,
            this.maxGarageFrequencyKMFilter == null ? this.maxGarageFrequencyKMFilterEmpty: this.maxGarageFrequencyKMFilter,
            this.minGarageFrequencyKMFilter == null ? this.minGarageFrequencyKMFilterEmpty: this.minGarageFrequencyKMFilter,
            this.maxSeatsNumberFilter == null ? this.maxSeatsNumberFilterEmpty: this.maxSeatsNumberFilter,
            this.minSeatsNumberFilter == null ? this.minSeatsNumberFilterEmpty: this.minSeatsNumberFilter,
            this.noInterurbanFilter,
            this.maxBusTypeFilter == null ? this.maxBusTypeFilterEmpty: this.maxBusTypeFilter,
            this.minBusTypeFilter == null ? this.minBusTypeFilterEmpty: this.minBusTypeFilter,
            this.maxTiresCountFilter == null ? this.maxTiresCountFilterEmpty: this.maxTiresCountFilter,
            this.minTiresCountFilter == null ? this.minTiresCountFilterEmpty: this.minTiresCountFilter,
            this.maxStatusFilter == null ? this.maxStatusFilterEmpty: this.maxStatusFilter,
            this.minStatusFilter == null ? this.minStatusFilterEmpty: this.minStatusFilter,
            this.maxModifiedByFilter == null ? this.maxModifiedByFilterEmpty: this.maxModifiedByFilter,
            this.minModifiedByFilter == null ? this.minModifiedByFilterEmpty: this.minModifiedByFilter,
            this.maxModificationDateFilter === undefined ? this.maxModificationDateFilter : moment(this.maxModificationDateFilter).endOf('day'),
            this.minModificationDateFilter === undefined ? this.minModificationDateFilter : moment(this.minModificationDateFilter).startOf('day'),
            this.maxCreatedByFilter == null ? this.maxCreatedByFilterEmpty: this.maxCreatedByFilter,
            this.minCreatedByFilter == null ? this.minCreatedByFilterEmpty: this.minCreatedByFilter,
            this.maxCreationDateFilter === undefined ? this.maxCreationDateFilter : moment(this.maxCreationDateFilter).endOf('day'),
            this.minCreationDateFilter === undefined ? this.minCreationDateFilter : moment(this.minCreationDateFilter).startOf('day'),
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
    
    
    
    
    
}
