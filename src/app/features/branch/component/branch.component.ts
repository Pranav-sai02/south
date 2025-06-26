import { Component, OnInit } from '@angular/core';
import { GridApi, ColDef, GetContextMenuItemsParams, MenuItemDef, GetContextMenuItems } from 'ag-grid-community';
import { Store } from '@ngxs/store';
import { ToasterService } from '../../../core/services/toaster-service/toaster.service';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { LoadBranches, UpdateBranch, SoftDeleteBranch, AddBranchRowLocally } from '../state/branch.actions';
import { BranchesState } from '../state/branch.state';
import { Branch } from '../model/branch';
import { ActiveToggleRendererComponent } from '../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';

@Component({
  selector: 'app-branch',
  standalone: false,
  templateUrl: './branch.component.html',
  styleUrl: './branch.component.css',
})
export class BranchComponent implements OnInit {
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  SoftDeleteRendererComponent = SoftDeleteButtonRendererComponent;

  gridApi!: GridApi;
  rowData: Branch[] = [];

  columnDefs: ColDef<Branch>[] = [
    {
      field: 'BranchName',
      headerName: 'Name',
      editable: true,
      minWidth: 150,
    },
    {
      field: 'Province',
      headerName: 'Province',
      editable: true,
      minWidth: 150,
    },
    {
      field: 'Country',
      headerName: 'Country',
      editable: true,
      minWidth: 150,
    },
    {
      field: 'IsActive',
      headerName: 'Active',
      cellRenderer: 'activeToggleRenderer',
      minWidth: 120,
      cellStyle: { display: 'flex', justifyContent: 'center' },
    },
    {
      headerName: 'Delete',
      minWidth: 100,
      cellRenderer: 'softDeleteRenderer',
      cellStyle: { display: 'flex', justifyContent: 'center' },
      onCellClicked: (params: any) => {
        if (params?.data) {
          this.softDelete(params.data);
        }
      }
    },
    {
      headerName: 'Save',
      minWidth: 120,
      cellRenderer: () => `
        <button class="save-icon-btn">
          <i class="fas fa-save save-icon" style="color: #28a745;"></i>
        </button>
      `,
      cellStyle: { display: 'flex', justifyContent: 'center' },
      onCellClicked: (params: any) => {
        if (params?.data) {
          this.softDelete(params.data);
        }
      }
    },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    editable: true,
  };

  constructor(
    private store: Store,
    private toaster: ToasterService,
    private logger: LoggerService
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new LoadBranches()).subscribe({
      error: (err) => {
        this.logger.logError(err, 'BranchComponent.ngOnInit');
        this.toaster.showError('Failed to load branches');
      },
    });

    this.store.select(BranchesState.getBranches).subscribe({
      next: (data) => (this.rowData = data),
    });
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
  }

  onCellValueChanged(event: any): void {
    const row = event.data;
    row.isEdited = true;
    this.gridApi.applyTransaction({ update: [row] });
  }

  saveRow(row: Branch): void {
    const isNew = !row.BranchId;
    const trimmed = {
      BranchName: row.BranchName?.trim(),
      Province: row.Province?.trim(),
      Country: row.Country?.trim(),
      IsActive: row.IsActive,
    };

    if (!isNew && !row.isEdited) {
      this.toaster.showInfo('No changes to save.');
      return;
    }

    const payload = { ...row, ...trimmed };

    this.store.dispatch(new UpdateBranch(row.BranchId!, payload)).subscribe({
      next: () => {
        this.toaster.showSuccess('Saved successfully');
        row.isEdited = false;
        this.gridApi.applyTransaction({ update: [row] });
      },
      error: (err) => {
        this.toaster.showError('Failed to save branch');
        this.logger.logError(err, 'BranchComponent.saveRow');
      },
    });
  }

  softDelete(row: Branch): void {
    const updated = { ...row, isDeleted: true };
    this.store.dispatch(new SoftDeleteBranch(updated)).subscribe({
      next: () => this.toaster.showSuccess('Deleted successfully'),
      error: (err) => {
        this.toaster.showError('Failed to delete branch');
        this.logger.logError(err, 'BranchComponent.softDelete');
      },
    });
  }

  addRow(): void {
    const newRow: Branch = {
      BranchName: '',
      Country: '',
      Province: '',
      IsActive: true,
    };
    this.store.dispatch(new AddBranchRowLocally(newRow));
  }

  getContextMenuItems: GetContextMenuItems = (
      params: GetContextMenuItemsParams
    ) => {
      const addRow = {
        name: 'Add Row',
        action: () => this.addRow(),
        icon: '<i class="fas fa-plus"></i>',
      };
  
      const deleteRow = {
        name: 'Delete Row',
        action: () => {
          if (params.node) {
            this.softDelete(params.node.data);
          }
        },
        icon: '<i class="fas fa-trash"></i>',
      };
  
      return [addRow, deleteRow, 'separator', 'copy', 'export'];
    };

  getRowClass = (params: any) => (!params.data.BranchId ? 'temporary-row' : '');
}
