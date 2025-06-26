export interface Branch {
  BranchId?: number;
  BranchName: string;
  Country: string;
  Province: string;
  IsActive: boolean;

  // Optional UI-only fields
  isDeleted?: boolean;
  isEdited?: boolean;
  originalBranchName?: string;
}
