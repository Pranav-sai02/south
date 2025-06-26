import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { Branch } from '../model/branch';
import { BranchesService } from '../services/branches.service';
import { ToasterService } from '../../../core/services/toaster-service/toaster.service';
import { LoggerService } from '../../../core/services/logger/logger.service';

import {
  LoadBranches,
  AddBranchRowLocally,
  UpdateBranch,
  SoftDeleteBranch,
} from './branch.actions';

export interface BranchesStateModel {
  branches: Branch[];
}

@State<BranchesStateModel>({
  name: 'branches',
  defaults: {
    branches: [],
  },
})
@Injectable()
export class BranchesState {
  constructor(
    private branchesService: BranchesService,
    private toaster: ToasterService,
    private logger: LoggerService
  ) { }

  @Selector()
  static getBranches(state: BranchesStateModel): Branch[] {
    return state.branches;
  }

  @Action(LoadBranches)
  loadBranches(ctx: StateContext<BranchesStateModel>) {
    return this.branchesService.getBranches().pipe(
      tap((branches) => {
        console.log('[BranchesState] Raw response:', branches);
        const sorted = [...branches].sort((a, b) => (b.BranchId ?? 0) - (a.BranchId ?? 0));
        ctx.patchState({ branches: sorted });
      }),
      catchError((error) => {
        this.logger.logError(error, 'BranchesState.loadBranches');
        this.toaster.showError('Failed to load branches.');
        return of([]);
      })
    );
  }

  @Action(AddBranchRowLocally)
  addBranchLocally(ctx: StateContext<BranchesStateModel>, action: AddBranchRowLocally) {
    const state = ctx.getState();
    ctx.patchState({
      branches: [action.payload, ...state.branches],
    });
  }

  @Action(UpdateBranch)
  updateBranch(ctx: StateContext<BranchesStateModel>, action: UpdateBranch) {
    const state = ctx.getState();
    const updatedList = state.branches.map((b) =>
      b.BranchId === action.payload.BranchId ? action.payload : b
    );
    ctx.patchState({ branches: updatedList });

    // remove frontend-only fields
    const { BranchId, isEdited, isDeleted, originalBranchName, ...sanitizedPayload } = action.payload;

    return this.branchesService.updateBranch(action.branchId, sanitizedPayload).pipe(
      catchError((error) => {
        this.logger.logError(error, 'BranchesState.updateBranch');
        this.toaster.showError('Failed to update branch.');
        return of(null);
      })
    );
  }

  @Action(SoftDeleteBranch)
  softDeleteBranch(ctx: StateContext<BranchesStateModel>, action: SoftDeleteBranch) {
    const state = ctx.getState();
    const updatedList = state.branches.filter((b) => b.BranchId !== action.payload.BranchId);
    ctx.patchState({ branches: updatedList });

    return this.branchesService.softDeleteBranch(action.payload.BranchId!).pipe(
      catchError((error) => {
        this.logger.logError(error, 'BranchesState.softDeleteBranch');
        this.toaster.showError('Failed to delete branch.');
        return of(null);
      })
    );
  }
}
