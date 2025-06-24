import { AreaCodes } from "../../../areacodes/models/AreaCodes";
import { User } from "../../../users/models/User";

export interface CaseCaller {
  CaseDetailId: number;
  CaseCallerId: number;
  IsConsentExplained: boolean;
  FirstName: string;
  LastName: string;
  CallBackAreaCodeId: number;
  CallBackNumber: string;
  CallBackAreaCode: AreaCodes;

  AllHourAreaCodeId: number;
  AllHourNumber: string;
  AllHourAreaCode: AreaCodes;

  CellAreaCodeId: number;
  CellNumber: string;
  CellAreaCode: AreaCodes;

  IsPolicyHolder: boolean;
  CaseController: string;
  CaseControllerUser: User;

  Agent: string;
  AgentUser: User;

  PreferredLanguageId: number;
  CaseReferenceGivenToCaller: string;
}