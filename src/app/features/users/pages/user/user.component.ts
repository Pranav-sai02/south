import { Component, OnInit } from '@angular/core';
import {
  ColDef,
  GridApi,
  GridOptions,
  ICellRendererParams,
} from 'ag-grid-community';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';
import { ToasterService } from '../../../../core/services/toaster-service/toaster.service';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  SoftDeleteRendererComponent = SoftDeleteButtonRendererComponent;

  users: User[] = [];
  gridApi!: GridApi;

  selectedUser: User | null = null; // row reference
  editedUser: User = {} as User; // detached copy for editing

  defaultImage = 'assets/images/profile.png';

  toggleOptions = false;
  saving = false; // spinner flag

  /* === AG‑Grid options === */
  gridOptions: GridOptions = {
    context: { componentParent: this },
    getRowId: (params) => params.data.id?.toString() ?? params.data.userEmail,
  };

  columnDefs: ColDef<User>[] = [
    {
      field: 'Firstname',
      headerName: 'First Name',
      minWidth: 230,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'Lastname',
      headerName: 'Last Name',
      minWidth: 230,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'UserEmail',
      headerName: 'Email',
      minWidth: 230,
      flex: 2,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'PhoneNumber',
      headerName: 'Phone Number',
      minWidth: 230,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc', textAlign: 'center' },
      headerClass: 'bold-header',
    },
    {
      field: 'IsActive',
      headerName: 'Active',
      minWidth: 150,
      flex: 1,
      cellRenderer: 'activeToggleRenderer',
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    {
  
      headerName: 'View',
      minWidth: 150,
      flex: 1,
      cellRenderer: (_: ICellRendererParams) =>
        '<i class="fas fa-eye" title="Can View / Edit" style="color: green;"></i>',
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '17px',
      },
      onCellClicked: (params: any) => this.openPopup(params.data),
      headerClass: 'bold-header',
    },

    {
      headerName: 'Delete',
      // field: 'isDeleted',
      flex: 1,
      minWidth: 150,
      cellRenderer: 'softDeleteRenderer',
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
      onCellClicked: (params: any) => this.softDeleteProvider(params.data),
    },
  ];

  defaultColDef: ColDef = { sortable: true, filter: true, resizable: true };

  constructor(private userService: UserService, private toastr:ToasterService) {}

  /* === lifecycle === */
  ngOnInit(): void {
    this.loadUsers();
  }

  resizeGrid(): void {
    if (this.gridApi) {
      setTimeout(() => this.gridApi.sizeColumnsToFit(), 100);
    }
  }

  // loadUsers(): void {
  //   this.userService.getUsers().subscribe((data) => {
  //     this.users = data;
  //     this.resizeGrid();
  //   });
  // }
  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.resizeGrid();
      },
      error: (err) => {
        console.warn('[UserComponent] Failed to load users.', err);
        this.toastr.showError('Failed to fetch user data.');
      },
    });
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.resizeGrid();
  }

  onExport(): void {
    this.gridApi.exportDataAsCsv({
      fileName: 'users.csv',
      columnSeparator: ',',
      allColumns: true,
    });
  }

  /* === popup handlers === */
  openPopup(user: User): void {
    this.selectedUser = user;
    this.editedUser = { ...user }; // shallow copy fine for flat object
    this.toggleOptions = false;
  }

  closePopup(): void {
    this.selectedUser = null;
  }
updateUser(): void {
    if (!this.selectedUser) return;

    this.saving = true;
    this.userService.updateUser(this.editedUser).subscribe({
      next: (updated) => {
        const index = this.users.findIndex((u) => u.Id === updated.Id);
        if (index > -1) this.users[index] = { ...updated };

        const rowNode = this.gridApi.getRowNode(
          updated.Id?.toString() ?? updated.UserName
        );
        rowNode?.setData(updated);

        this.toastr.showSuccess('User updated successfully.');
        this.closePopup();
      },
      error: (err) => {
        console.error('[UserComponent] updateUser failed', err);
        this.toastr.showError('Failed to update user.');
      },
      complete: () => (this.saving = false),
    });
  }

  // ✅ Soft delete on UI only
  softDeleteProvider(user: User): void {
    if (!user || !this.gridApi) return;

    const confirmed = confirm(
      `Are you sure you want to delete ${user.UserEmail}?`
    );
    if (!confirmed) return;

    // Remove from local array
    this.users = this.users.filter((u) => u.Id !== user.Id);

    // Remove from grid
    const rowNode = this.gridApi.getRowNode(
      user.Id?.toString() ?? user.UserEmail
    );
    if (rowNode) {
      this.gridApi.applyTransaction({ remove: [rowNode.data] });
      this.toastr.showInfo(`Deleted ${user.UserEmail} from UI.`);
      console.log(`[UI DELETE] Removed ${user.UserEmail} from grid`);
    } else {
      console.warn(`[UI DELETE] Row not found for ${user.UserEmail}`);
    }
  }

  /* === misc UI helpers === */
  clearField(
    field:
      | 'Firstname'
      | 'Lastname'
      | 'UserEmail'
      | 'MobileNumber'
      | 'EmployeeId'
      | 'PhoneNumber'
  ): void {
    (this.editedUser as any)[field] = '';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      (this.editedUser.ProfileImage = reader.result as string);
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.editedUser.ProfileImage = '';
  }

  openCamera() {
    console.log('Camera action triggered');
  }

  saveUserToggleStatus(updatedUser: User): void {
    this.userService.updateUser(updatedUser).subscribe({
      next: (res) => {
        console.log(`IsActive status updated for ${res.UserEmail}`);
        this.toastr.showSuccess(`Status updated for ${res.UserEmail}`);
      },
      error: (err) => {
        console.error('Failed to update IsActive status', err);
        this.toastr.showError('Failed to update active status.');
      },
    });
  }
}
