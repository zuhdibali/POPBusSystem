import {AppConsts} from '@shared/AppConsts';
import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { RuntimePeriodsServiceProxy, RuntimePeriodDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditRuntimePeriodModalComponent } from './create-or-edit-runtimePeriod-modal.component';

import { ViewRuntimePeriodModalComponent } from './view-runtimePeriod-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { EntityTypeHistoryModalComponent } from '@app/shared/common/entityHistory/entity-type-history-modal.component';
import * as _ from 'lodash';
import * as moment from 'moment';


@Component({
    templateUrl: './runtimePeriods.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class RuntimePeriodsComponent extends AppComponentBase {
    
    
    @ViewChild('entityTypeHistoryModal', { static: true }) entityTypeHistoryModal: EntityTypeHistoryModalComponent;
    @ViewChild('createOrEditRuntimePeriodModal', { static: true }) createOrEditRuntimePeriodModal: CreateOrEditRuntimePeriodModalComponent;
    @ViewChild('viewRuntimePeriodModalComponent', { static: true }) viewRuntimePeriodModal: ViewRuntimePeriodModalComponent;   
    
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    nameFilter = '';
    maxstarttimeFilter : moment.Moment;
		minstarttimeFilter : moment.Moment;
    maxendtimeFilter : moment.Moment;
		minendtimeFilter : moment.Moment;
    traficJamFilter = -1;


    _entityTypeFullName = 'BringitPal.POPBUS.Trips.RuntimePeriod';
    entityHistoryEnabled = false;



    constructor(
        injector: Injector,
        private _runtimePeriodsServiceProxy: RuntimePeriodsServiceProxy,
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

    getRuntimePeriods(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._runtimePeriodsServiceProxy.getAll(
            this.filterText,
            this.nameFilter,
            this.maxstarttimeFilter === undefined ? this.maxstarttimeFilter : moment(this.maxstarttimeFilter).endOf('day'),
            this.minstarttimeFilter === undefined ? this.minstarttimeFilter : moment(this.minstarttimeFilter).startOf('day'),
            this.maxendtimeFilter === undefined ? this.maxendtimeFilter : moment(this.maxendtimeFilter).endOf('day'),
            this.minendtimeFilter === undefined ? this.minendtimeFilter : moment(this.minendtimeFilter).startOf('day'),
            this.traficJamFilter,
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

    createRuntimePeriod(): void {
        this.createOrEditRuntimePeriodModal.show();        
    }


    showHistory(runtimePeriod: RuntimePeriodDto): void {
        this.entityTypeHistoryModal.show({
            entityId: runtimePeriod.id.toString(),
            entityTypeFullName: this._entityTypeFullName,
            entityTypeDescription: ''
        });
    }

    deleteRuntimePeriod(runtimePeriod: RuntimePeriodDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._runtimePeriodsServiceProxy.delete(runtimePeriod.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._runtimePeriodsServiceProxy.getRuntimePeriodsToExcel(
        this.filterText,
            this.nameFilter,
            this.maxstarttimeFilter === undefined ? this.maxstarttimeFilter : moment(this.maxstarttimeFilter).endOf('day'),
            this.minstarttimeFilter === undefined ? this.minstarttimeFilter : moment(this.minstarttimeFilter).startOf('day'),
            this.maxendtimeFilter === undefined ? this.maxendtimeFilter : moment(this.maxendtimeFilter).endOf('day'),
            this.minendtimeFilter === undefined ? this.minendtimeFilter : moment(this.minendtimeFilter).startOf('day'),
            this.traficJamFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
    
    
    
    
    
}
