import { Component, ViewChild, Injector, Output, EventEmitter, OnInit} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { EmployeesServiceProxy, CreateOrEditEmployeesDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

import { EmployeesEmployeeTypeLookupTableModalComponent } from './employees-employeeType-lookup-table-modal.component';
import { EmployeesBranchesLookupTableModalComponent } from './employees-branches-lookup-table-modal.component';



@Component({
    selector: 'createOrEditEmployeesModal',
    templateUrl: './create-or-edit-employees-modal.component.html'
})
export class CreateOrEditEmployeesModalComponent extends AppComponentBase implements OnInit{
   
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('employeesEmployeeTypeLookupTableModal', { static: true }) employeesEmployeeTypeLookupTableModal: EmployeesEmployeeTypeLookupTableModalComponent;
    @ViewChild('employeesBranchesLookupTableModal', { static: true }) employeesBranchesLookupTableModal: EmployeesBranchesLookupTableModalComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    employees: CreateOrEditEmployeesDto = new CreateOrEditEmployeesDto();

    workStartDate: Date;
    workEndDate: Date;
    dateOfBirth: Date;
    employeeTypeDescription = '';
    branchesDescription = '';



    constructor(
        injector: Injector,
        private _employeesServiceProxy: EmployeesServiceProxy
    ) {
        super(injector);
    }
    
    show(employeesId?: number): void {
    
    this.workStartDate = null;
    this.workEndDate = null;
    this.dateOfBirth = null;

        if (!employeesId) {
            this.employees = new CreateOrEditEmployeesDto();
            this.employees.id = employeesId;
            this.employeeTypeDescription = '';
            this.branchesDescription = '';


            this.active = true;
            this.modal.show();
        } else {
            this._employeesServiceProxy.getEmployeesForEdit(employeesId).subscribe(result => {
                this.employees = result.employees;

                if (this.employees.workStartDate) {
					this.workStartDate = this.employees.workStartDate.toDate();
                }
                if (this.employees.workEndDate) {
					this.workEndDate = this.employees.workEndDate.toDate();
                }
                if (this.employees.dateOfBirth) {
					this.dateOfBirth = this.employees.dateOfBirth.toDate();
                }
                this.employeeTypeDescription = result.employeeTypeDescription;
                this.branchesDescription = result.branchesDescription;


                this.active = true;
                this.modal.show();
            });
        }
        
        
    }

    save(): void {
            this.saving = true;
            
			
        if (this.workStartDate) {
            if (!this.employees.workStartDate) {
                this.employees.workStartDate = moment(this.workStartDate).startOf('day');
            }
            else {
                this.employees.workStartDate = moment(this.workStartDate);
            }
        }
        else {
            this.employees.workStartDate = null;
        }
        if (this.workEndDate) {
            if (!this.employees.workEndDate) {
                this.employees.workEndDate = moment(this.workEndDate).startOf('day');
            }
            else {
                this.employees.workEndDate = moment(this.workEndDate);
            }
        }
        else {
            this.employees.workEndDate = null;
        }
        if (this.dateOfBirth) {
            if (!this.employees.dateOfBirth) {
                this.employees.dateOfBirth = moment(this.dateOfBirth).startOf('day');
            }
            else {
                this.employees.dateOfBirth = moment(this.dateOfBirth);
            }
        }
        else {
            this.employees.dateOfBirth = null;
        }
			
            this._employeesServiceProxy.createOrEdit(this.employees)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }

    openSelectEmployeeTypeModal() {
        this.employeesEmployeeTypeLookupTableModal.id = this.employees.employeeTypeId;
        this.employeesEmployeeTypeLookupTableModal.displayName = this.employeeTypeDescription;
        this.employeesEmployeeTypeLookupTableModal.show();
    }
    openSelectBranchesModal() {
        this.employeesBranchesLookupTableModal.id = this.employees.branchesId;
        this.employeesBranchesLookupTableModal.displayName = this.branchesDescription;
        this.employeesBranchesLookupTableModal.show();
    }


    setEmployeeTypeIdNull() {
        this.employees.employeeTypeId = null;
        this.employeeTypeDescription = '';
    }
    setBranchesIdNull() {
        this.employees.branchesId = null;
        this.branchesDescription = '';
    }


    getNewEmployeeTypeId() {
        this.employees.employeeTypeId = this.employeesEmployeeTypeLookupTableModal.id;
        this.employeeTypeDescription = this.employeesEmployeeTypeLookupTableModal.displayName;
    }
    getNewBranchesId() {
        this.employees.branchesId = this.employeesBranchesLookupTableModal.id;
        this.branchesDescription = this.employeesBranchesLookupTableModal.displayName;
    }








    close(): void {
        this.active = false;
        this.modal.hide();
    }
    
     ngOnInit(): void {
        
     }    
}
