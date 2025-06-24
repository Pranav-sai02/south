import { Component, OnInit } from '@angular/core';
import { Client } from '../../models/Client';
import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { ClientService } from '../../services/client-service/client.service';
import { ToasterService } from '../../../../core/services/toaster-service/toaster.service';

@Component({
  selector: 'app-client',
  standalone: false,
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent implements OnInit {
  gridApi!: GridApi;
  clients: Client[] = [];

  selectedClient: Client | null = null;
  showPopup = false;

  gridOptions: GridOptions = {
    context: { componentParent: this },
    getRowId: (params) => params.data?.ClientId?.toString(),
    pagination: true,
    paginationPageSize: 20,
    domLayout: 'autoHeight',
    animateRows: true,
    rowSelection: 'single',
  };

  columnDefs: ColDef<Client>[] = [
    {
      field: 'ClientName',
      headerName: 'Name',
      flex: 1,
      minWidth: 200,
      sortable: true,
      filter: 'agTextColumnFilter',
      cellStyle: { borderRight: '1px solid #ccc' },
    },
    {
      field: 'ClaimsManager',
      headerName: 'Claims Manager',
      flex: 1,
      minWidth: 200,
      sortable: true,
      filter: 'agTextColumnFilter',
      cellStyle: { borderRight: '1px solid #ccc' },
    },
    {
      field: 'ClientGroup',
      valueGetter: (params) => params.data?.ClientGroup?.Name ?? '',
      headerName: 'Group',
      flex: 1,
      minWidth: 200,
      sortable: true,
      filter: 'agTextColumnFilter',
      cellStyle: { borderRight: '1px solid #ccc' },
    },
    {
      field: 'Address',
      headerName: 'Address',
      flex: 1,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
      cellStyle: { borderRight: '1px solid #ccc' },
    },
    {
      field: 'AreaCodes',
      valueGetter: (params) => params.data?.AreaCodes?.AreaCode ?? '',
      headerName: 'Area Code',
      flex: 1,
      minWidth: 150,
      sortable: true,
      filter: 'agTextColumnFilter',
      cellStyle: { textAlign: 'center', borderRight: '1px solid #ccc' },
    },
    {
      field: 'Tel',
      headerName: 'Telephone',
      flex: 1,
      minWidth: 150,
      cellStyle: { textAlign: 'center', borderRight: '1px solid #ccc' },
    },
    {
      field: 'IsActive',
      headerName: 'Active',
      flex: 0.6,
      minWidth: 150,
      cellRenderer: 'activeToggleRenderer',
      cellRendererParams: { onChange: this.onActiveToggleChange.bind(this) },
      cellStyle: {
        textAlign: 'center',
        borderRight: '1px solid #ccc',
      },
    },
    {
      headerName: 'View/Edit',
      minWidth: 150,
      cellRenderer: () =>
        `<i class="fas fa-eye" title="View/Edit" style="color: green; cursor: pointer;"></i>`,
      cellStyle: {
        textAlign: 'center',
        fontSize: '18px',
        borderRight: '1px solid #ccc',
      },
      onCellClicked: (params: any) => this.editClient(params.data),
    },
    {
      headerName: 'Delete',
      minWidth: 150,
      cellRenderer: 'softDeleteRenderer',
      cellStyle: {
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRight: '1px solid #ccc',
      },
      onCellClicked: (params: any) => this.softDelete(params.data),
    },
  ];

  defaultColDef: ColDef = {
    headerClass: 'bold-header',
    sortable: true,
    filter: true,
    resizable: true,
    cellStyle: {
      borderRight: '1px solid #ccc',
    },
  };

  components = {
    activeToggleRenderer: ActiveToggleRendererComponent,
    softDeleteRenderer: SoftDeleteButtonRendererComponent,
  };

  constructor(
    private clientService: ClientService,
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.resizeGrid();
  }

  resizeGrid(): void {
    setTimeout(() => this.gridApi?.sizeColumnsToFit(), 100);
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.resizeGrid();
      },
      error: (err) => {
        console.error('Failed to load clients', err);
      },
    });
  }

  editClient(client: Client): void {
    this.selectedClient = client;
    this.showPopup = true;
  }

  closePopup(): void {
    this.selectedClient = null;
    this.showPopup = false;
  }

  onActiveToggleChange(params: any): void {
    const updatedClient = params.data as Client;
    // Save toggle status if needed
    params.api.refreshCells({ rowNodes: [params.node], force: true });
  }

  softDelete(client: Client): void {
    client.IsDeleted = true;
    this.clients = this.clients.filter((c) => c.ClientId !== client.ClientId);
    this.toasterService.showSuccess('Client removed successfully');
  }

  onExport(): void {
    this.gridApi.exportDataAsCsv({
      fileName: 'clients.csv',
    });
  }
}
