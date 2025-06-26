import { Branch } from '../model/branch';

export class LoadBranches {
  static readonly type = '[Branch] Load';
}

export class AddBranchRowLocally {
  static readonly type = '[Branch] Add Row Locally';
  constructor(public payload: Branch) {}
}

export class UpdateBranch {
  static readonly type = '[Branch] Update';
  constructor(public branchId: number, public payload: Branch) {}
}

export class SoftDeleteBranch {
  static readonly type = '[Branch] Soft Delete';
  constructor(public payload: Branch) {}
}
