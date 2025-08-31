export interface Patient {
  id: string;
  patientId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IspGoalTrackingData {
  id: string;
  patientId: string;
  goal: string;
  objective: string;
  notes: string;
  dailyEntries: Record<
    number,
    {
      goalMet: boolean;
      workedOnGoal: boolean;
      numberOfPrompts: string;
      code: string;
      staffInitial: string;
    }
  >;
  staffInfo: {
    staffName: string;
    initials: string;
    ispTraining: boolean;
    signature: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyDrillLogData {
  id: string;
  patientId: string;
  location: string;
  date: Date;
  startTime: string;
  endTime: string;
  totalElapsedTime: string;
  announced: string;
  notificationMethod: string;
  performedBy: string;
  drillType: string[];
  otherDrillType?: string;
  actualSimulated: string;
  numberOfParticipants: string;
  stepByStepActions: string;
  evaluation: string;
  correctiveActionComments: string;
  signatureOfPerformer: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BloodGlucoseLogData {
  id: string;
  patientId: string;
  telephoneNumber: string;
  dateOfBirth: Date;
  glucoseReadings: Record<
    string,
    {
      breakfastBefore: string;
      breakfastAfter: string;
      lunchBefore: string;
      lunchAfter: string;
      dinnerBefore: string;
      dinnerAfter: string;
      bedtime: string;
      other: string;
    }
  >;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkinBreakdownTrackingData {
  id: string;
  patientId: string;
  year: number;
  program: string;
  staffInitials: string;
  skinData: Record<string, Record<number, string>>;
  createdAt: Date;
  updatedAt: Date;
}

export interface MonthlySupplyListData {
  id: string;
  patientId: string;
  month: string;
  year: number;
  supplyItems: Array<{
    id: string;
    name: string;
    quantityOnHand: string;
    quantityNeeded: string;
    staffRequesting: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface StaffData {
  id: string;
  name: string;
  initials: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLogData {
  id: string;
  userId?: string;
  action: string;
  formType: string;
  formId?: string;
  patientId?: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface TimerData {
  name: string;
  type: "till" | "from";
  dueDate: Date;
  userId?: string;
  description?: string;
  isActive?: boolean;
  endDate?: Date;
  id?: string;
}
