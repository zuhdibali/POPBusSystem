import {AppConsts} from '@shared/AppConsts';
import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { VehiclesServiceProxy, VehiclesDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditVehiclesModalComponent } from './create-or-edit-vehicles-modal.component';

import { ViewVehiclesModalComponent } from './view-vehicles-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { EntityTypeHistoryModalComponent } from '@app/shared/common/entityHistory/entity-type-history-modal.component';
import * as _ from 'lodash';
import * as moment from 'moment';


@Component({
    templateUrl: './vehicles.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class VehiclesComponent extends AppComponentBase {
    
    
    @ViewChild('entityTypeHistoryModal', { static: true }) entityTypeHistoryModal: EntityTypeHistoryModalComponent;
    @ViewChild('createOrEditVehiclesModal', { static: true }) createOrEditVehiclesModal: CreateOrEditVehiclesModalComponent;
    @ViewChild('viewVehiclesModalComponent', { static: true }) viewVehiclesModal: ViewVehiclesModalComponent;   
    
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    maxInternalIDFilter : number;
		maxInternalIDFilterEmpty : number;
		minInternalIDFilter : number;
		minInternalIDFilterEmpty : number;
    maxVehicleNumberFilter : number;
		maxVehicleNumberFilterEmpty : number;
		minVehicleNumberFilter : number;
		minVehicleNumberFilterEmpty : number;
    maxShortVehicleNumberFilter : number;
		maxShortVehicleNumberFilterEmpty : number;
		minShortVehicleNumberFilter : number;
		minShortVehicleNumberFilterEmpty : number;
    maxVehicleTypeFilter : number;
		maxVehicleTypeFilterEmpty : number;
		minVehicleTypeFilter : number;
		minVehicleTypeFilterEmpty : number;
    maxStatusFilter : number;
		maxStatusFilterEmpty : number;
		minStatusFilter : number;
		minStatusFilterEmpty : number;
    maxStatusDateFilter : moment.Moment;
		minStatusDateFilter : moment.Moment;
    maxParkingFilter : number;
		maxParkingFilterEmpty : number;
		minParkingFilter : number;
		minParkingFilterEmpty : number;
    maxGarageFilter : number;
		maxGarageFilterEmpty : number;
		minGarageFilter : number;
		minGarageFilterEmpty : number;
    maxKMFilter : number;
		maxKMFilterEmpty : number;
		minKMFilter : number;
		minKMFilterEmpty : number;
    maxTestDateFilter : moment.Moment;
		minTestDateFilter : moment.Moment;
    maxInsuranceDateFilter : moment.Moment;
		minInsuranceDateFilter : moment.Moment;
    maxLastHandleDateFilter : moment.Moment;
		minLastHandleDateFilter : moment.Moment;
    maxNextHandleDateFilter : moment.Moment;
		minNextHandleDateFilter : moment.Moment;
    maxUpdatedFilter : moment.Moment;
		minUpdatedFilter : moment.Moment;
    maxOperatorIDFilter : number;
		maxOperatorIDFilterEmpty : number;
		minOperatorIDFilter : number;
		minOperatorIDFilterEmpty : number;
    maxIsBusInTripFilter : number;
		maxIsBusInTripFilterEmpty : number;
		minIsBusInTripFilter : number;
		minIsBusInTripFilterEmpty : number;
    maxIsBusInTripLastUpdatedFilter : moment.Moment;
		minIsBusInTripLastUpdatedFilter : moment.Moment;
        vehiclesTypeTypeDescriptionFilter = '';


    _entityTypeFullName = 'BringitPal.POPBUS.Dictionary.Vehicles';
    entityHistoryEnabled = false;



    constructor(
        injector: Injector,
        private _vehiclesServiceProxy: VehiclesServiceProxy,
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

    getVehicles(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._vehiclesServiceProxy.getAll(
            this.filterText,
            this.maxInternalIDFilter == null ? this.maxInternalIDFilterEmpty: this.maxInternalIDFilter,
            this.minInternalIDFilter == null ? this.minInternalIDFilterEmpty: this.minInternalIDFilter,
            this.maxVehicleNumberFilter == null ? this.maxVehicleNumberFilterEmpty: this.maxVehicleNumberFilter,
            this.minVehicleNumberFilter == null ? this.minVehicleNumberFilterEmpty: this.minVehicleNumberFilter,
            this.maxShortVehicleNumberFilter == null ? this.maxShortVehicleNumberFilterEmpty: this.maxShortVehicleNumberFilter,
            this.minShortVehicleNumberFilter == null ? this.minShortVehicleNumberFilterEmpty: this.minShortVehicleNumberFilter,
            this.maxVehicleTypeFilter == null ? this.maxVehicleTypeFilterEmpty: this.maxVehicleTypeFilter,
            this.minVehicleTypeFilter == null ? this.minVehicleTypeFilterEmpty: this.minVehicleTypeFilter,
            this.maxStatusFilter == null ? this.maxStatusFilterEmpty: this.maxStatusFilter,
            this.minStatusFilter == null ? this.minStatusFilterEmpty: this.minStatusFilter,
            this.maxStatusDateFilter === undefined ? this.maxStatusDateFilter : moment(this.maxStatusDateFilter).endOf('day'),
            this.minStatusDateFilter === undefined ? this.minStatusDateFilter : moment(this.minStatusDateFilter).startOf('day'),
            this.maxParkingFilter == null ? this.maxParkingFilterEmpty: this.maxParkingFilter,
            this.minParkingFilter == null ? this.minParkingFilterEmpty: this.minParkingFilter,
            this.maxGarageFilter == null ? this.maxGarageFilterEmpty: this.maxGarageFilter,
            this.minGarageFilter == null ? this.minGarageFilterEmpty: this.minGarageFilter,
            this.maxKMFilter == null ? this.maxKMFilterEmpty: this.maxKMFilter,
            this.minKMFilter == null ? this.minKMFilterEmpty: this.minKMFilter,
            this.maxTestDateFilter === undefined ? this.maxTestDateFilter : moment(this.maxTestDateFilter).endOf('day'),
            this.minTestDateFilter === undefined ? this.minTestDateFilter : moment(this.minTestDateFilter).startOf('day'),
            this.maxInsuranceDateFilter === undefined ? this.maxInsuranceDateFilter : moment(this.maxInsuranceDateFilter).endOf('day'),
            this.minInsuranceDateFilter === undefined ? this.minInsuranceDateFilter : moment(this.minInsuranceDateFilter).startOf('day'),
            this.maxLastHandleDateFilter === undefined ? this.maxLastHandleDateFilter : moment(this.maxLastHandleDateFilter).endOf('day'),
            this.minLastHandleDateFilter === undefined ? this.minLastHandleDateFilter : moment(this.minLastHandleDateFilter).startOf('day'),
            this.maxNextHandleDateFilter === undefined ? this.maxNextHandleDateFilter : moment(this.maxNextHandleDateFilter).endOf('day'),
            this.minNextHandleDateFilter === undefined ? this.minNextHandleDateFilter : moment(this.minNextHandleDateFilter).startOf('day'),
            this.maxUpdatedFilter === undefined ? this.maxUpdatedFilter : moment(this.maxUpdatedFilter).endOf('day'),
            this.minUpdatedFilter === undefined ? this.minUpdatedFilter : moment(this.minUpdatedFilter).startOf('day'),
            this.maxOperatorIDFilter == null ? this.maxOperatorIDFilterEmpty: this.maxOperatorIDFilter,
            this.minOperatorIDFilter == null ? this.minOperatorIDFilterEmpty: this.minOperatorIDFilter,
            this.maxIsBusInTripFilter == null ? this.maxIsBusInTripFilterEmpty: this.maxIsBusInTripFilter,
            this.minIsBusInTripFilter == null ? this.minIsBusInTripFilterEmpty: this.minIsBusInTripFilter,
            this.maxIsBusInTripLastUpdatedFilter === undefined ? this.maxIsBusInTripLastUpdatedFilter : moment(this.maxIsBusInTripLastUpdatedFilter).endOf('day'),
            this.minIsBusInTripLastUpdatedFilter === undefined ? this.minIsBusInTripLastUpdatedFilter : moment(this.minIsBusInTripLastUpdatedFilter).startOf('day'),
            this.vehiclesTypeTypeDescriptionFilter,
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

    createVehicles(): void {
        this.createOrEditVehiclesModal.show();        
    }


    showHistory(vehicles: VehiclesDto): void {
        this.entityTypeHistoryModal.show({
            entityId: vehicles.id.toString(),
            entityTypeFullName: this._entityTypeFullName,
            entityTypeDescription: ''
        });
    }

    deleteVehicles(vehicles: VehiclesDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._vehiclesServiceProxy.delete(vehicles.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._vehiclesServiceProxy.getVehiclesToExcel(
        this.filterText,
            this.maxInternalIDFilter == null ? this.maxInternalIDFilterEmpty: this.maxInternalIDFilter,
            this.minInternalIDFilter == null ? this.minInternalIDFilterEmpty: this.minInternalIDFilter,
            this.maxVehicleNumberFilter == null ? this.maxVehicleNumberFilterEmpty: this.maxVehicleNumberFilter,
            this.minVehicleNumberFilter == null ? this.minVehicleNumberFilterEmpty: this.minVehicleNumberFilter,
            this.maxShortVehicleNumberFilter == null ? this.maxShortVehicleNumberFilterEmpty: this.maxShortVehicleNumberFilter,
            this.minShortVehicleNumberFilter == null ? this.minShortVehicleNumberFilterEmpty: this.minShortVehicleNumberFilter,
            this.maxVehicleTypeFilter == null ? this.maxVehicleTypeFilterEmpty: this.maxVehicleTypeFilter,
            this.minVehicleTypeFilter == null ? this.minVehicleTypeFilterEmpty: this.minVehicleTypeFilter,
            this.maxStatusFilter == null ? this.maxStatusFilterEmpty: this.maxStatusFilter,
            this.minStatusFilter == null ? this.minStatusFilterEmpty: this.minStatusFilter,
            this.maxStatusDateFilter === undefined ? this.maxStatusDateFilter : moment(this.maxStatusDateFilter).endOf('day'),
            this.minStatusDateFilter === undefined ? this.minStatusDateFilter : moment(this.minStatusDateFilter).startOf('day'),
            this.maxParkingFilter == null ? this.maxParkingFilterEmpty: this.maxParkingFilter,
            this.minParkingFilter == null ? this.minParkingFilterEmpty: this.minParkingFilter,
            this.maxGarageFilter == null ? this.maxGarageFilterEmpty: this.maxGarageFilter,
            this.minGarageFilter == null ? this.minGarageFilterEmpty: this.minGarageFilter,
            this.maxKMFilter == null ? this.maxKMFilterEmpty: this.maxKMFilter,
            this.minKMFilter == null ? this.minKMFilterEmpty: this.minKMFilter,
            this.maxTestDateFilter === undefined ? this.maxTestDateFilter : moment(this.maxTestDateFilter).endOf('day'),
            this.minTestDateFilter === undefined ? this.minTestDateFilter : moment(this.minTestDateFilter).startOf('day'),
            this.maxInsuranceDateFilter === undefined ? this.maxInsuranceDateFilter : moment(this.maxInsuranceDateFilter).endOf('day'),
            this.minInsuranceDateFilter === undefined ? this.minInsuranceDateFilter : moment(this.minInsuranceDateFilter).startOf('day'),
            this.maxLastHandleDateFilter === undefined ? this.maxLastHandleDateFilter : moment(this.maxLastHandleDateFilter).endOf('day'),
            this.minLastHandleDateFilter === undefined ? this.minLastHandleDateFilter : moment(this.minLastHandleDateFilter).startOf('day'),
            this.maxNextHandleDateFilter === undefined ? this.maxNextHandleDateFilter : moment(this.maxNextHandleDateFilter).endOf('day'),
            this.minNextHandleDateFilter === undefined ? this.minNextHandleDateFilter : moment(this.minNextHandleDateFilter).startOf('day'),
            this.maxUpdatedFilter === undefined ? this.maxUpdatedFilter : moment(this.maxUpdatedFilter).endOf('day'),
            this.minUpdatedFilter === undefined ? this.minUpdatedFilter : moment(this.minUpdatedFilter).startOf('day'),
            this.maxOperatorIDFilter == null ? this.maxOperatorIDFilterEmpty: this.maxOperatorIDFilter,
            this.minOperatorIDFilter == null ? this.minOperatorIDFilterEmpty: this.minOperatorIDFilter,
            this.maxIsBusInTripFilter == null ? this.maxIsBusInTripFilterEmpty: this.maxIsBusInTripFilter,
            this.minIsBusInTripFilter == null ? this.minIsBusInTripFilterEmpty: this.minIsBusInTripFilter,
            this.maxIsBusInTripLastUpdatedFilter === undefined ? this.maxIsBusInTripLastUpdatedFilter : moment(this.maxIsBusInTripLastUpdatedFilter).endOf('day'),
            this.minIsBusInTripLastUpdatedFilter === undefined ? this.minIsBusInTripLastUpdatedFilter : moment(this.minIsBusInTripLastUpdatedFilter).startOf('day'),
            this.vehiclesTypeTypeDescriptionFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
    
    
    
    
    
}
