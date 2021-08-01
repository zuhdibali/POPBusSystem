import {AppConsts} from '@shared/AppConsts';
import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { ShapesServiceProxy, ShapeDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditShapeModalComponent } from './create-or-edit-shape-modal.component';

import { ViewShapeModalComponent } from './view-shape-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { EntityTypeHistoryModalComponent } from '@app/shared/common/entityHistory/entity-type-history-modal.component';
import * as _ from 'lodash';
import * as moment from 'moment';


@Component({
    templateUrl: './shapes.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ShapesComponent extends AppComponentBase {
    
    
    @ViewChild('entityTypeHistoryModal', { static: true }) entityTypeHistoryModal: EntityTypeHistoryModalComponent;
    @ViewChild('createOrEditShapeModal', { static: true }) createOrEditShapeModal: CreateOrEditShapeModalComponent;
    @ViewChild('viewShapeModalComponent', { static: true }) viewShapeModal: ViewShapeModalComponent;   
    
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    maxshape_idFilter : number;
		maxshape_idFilterEmpty : number;
		minshape_idFilter : number;
		minshape_idFilterEmpty : number;
    maxshape_pt_latFilter : number;
		maxshape_pt_latFilterEmpty : number;
		minshape_pt_latFilter : number;
		minshape_pt_latFilterEmpty : number;
    maxshape_pt_lonFilter : number;
		maxshape_pt_lonFilterEmpty : number;
		minshape_pt_lonFilter : number;
		minshape_pt_lonFilterEmpty : number;
    maxshape_pt_sequenceFilter : number;
		maxshape_pt_sequenceFilterEmpty : number;
		minshape_pt_sequenceFilter : number;
		minshape_pt_sequenceFilterEmpty : number;
        routeRouteIDGTFSFilter = '';


    _entityTypeFullName = 'BringitPal.POPBUS.Road.Shape';
    entityHistoryEnabled = false;



    constructor(
        injector: Injector,
        private _shapesServiceProxy: ShapesServiceProxy,
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

    getShapes(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._shapesServiceProxy.getAll(
            this.filterText,
            this.maxshape_idFilter == null ? this.maxshape_idFilterEmpty: this.maxshape_idFilter,
            this.minshape_idFilter == null ? this.minshape_idFilterEmpty: this.minshape_idFilter,
            this.maxshape_pt_latFilter == null ? this.maxshape_pt_latFilterEmpty: this.maxshape_pt_latFilter,
            this.minshape_pt_latFilter == null ? this.minshape_pt_latFilterEmpty: this.minshape_pt_latFilter,
            this.maxshape_pt_lonFilter == null ? this.maxshape_pt_lonFilterEmpty: this.maxshape_pt_lonFilter,
            this.minshape_pt_lonFilter == null ? this.minshape_pt_lonFilterEmpty: this.minshape_pt_lonFilter,
            this.maxshape_pt_sequenceFilter == null ? this.maxshape_pt_sequenceFilterEmpty: this.maxshape_pt_sequenceFilter,
            this.minshape_pt_sequenceFilter == null ? this.minshape_pt_sequenceFilterEmpty: this.minshape_pt_sequenceFilter,
            this.routeRouteIDGTFSFilter,
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

    createShape(): void {
        this.createOrEditShapeModal.show();        
    }


    showHistory(shape: ShapeDto): void {
        this.entityTypeHistoryModal.show({
            entityId: shape.id.toString(),
            entityTypeFullName: this._entityTypeFullName,
            entityTypeDescription: ''
        });
    }

    deleteShape(shape: ShapeDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._shapesServiceProxy.delete(shape.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._shapesServiceProxy.getShapesToExcel(
        this.filterText,
            this.maxshape_idFilter == null ? this.maxshape_idFilterEmpty: this.maxshape_idFilter,
            this.minshape_idFilter == null ? this.minshape_idFilterEmpty: this.minshape_idFilter,
            this.maxshape_pt_latFilter == null ? this.maxshape_pt_latFilterEmpty: this.maxshape_pt_latFilter,
            this.minshape_pt_latFilter == null ? this.minshape_pt_latFilterEmpty: this.minshape_pt_latFilter,
            this.maxshape_pt_lonFilter == null ? this.maxshape_pt_lonFilterEmpty: this.maxshape_pt_lonFilter,
            this.minshape_pt_lonFilter == null ? this.minshape_pt_lonFilterEmpty: this.minshape_pt_lonFilter,
            this.maxshape_pt_sequenceFilter == null ? this.maxshape_pt_sequenceFilterEmpty: this.maxshape_pt_sequenceFilter,
            this.minshape_pt_sequenceFilter == null ? this.minshape_pt_sequenceFilterEmpty: this.minshape_pt_sequenceFilter,
            this.routeRouteIDGTFSFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
    
    
    
    
    
}
