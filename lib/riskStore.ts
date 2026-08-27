export type RiskLevel =
  | "Low"
  | "Medium"
  | "High";

export type RiskTreatment =
  | "Mitigate"
  | "Accept"
  | "Transfer"
  | "Avoid";

export type RiskStatus =
  | "Open"
  | "In Treatment"
  | "Accepted"
  | "Closed";

export type RemediationStatus =
  | "Open"
  | "In Progress"
  | "Completed"
  | "Overdue";

export interface RemediationRecord {
  id: string;
  riskId: string;
  finding: string;
  recommendation: string;
  treatment: RiskTreatment;
  controls: string[];
  owner: string;
  dueDate: string;
  status: RemediationStatus;
  createdAt: string;
}

export interface RiskRecord {
  id: string;

  aiSystem: string;
  category: string;
  description: string;

  likelihood: number;
  impact: number;

  inherentRisk: number;
  inherentLevel: RiskLevel;

  controls: string[];
  controlEffectiveness: number;

  residualRisk: number;
  residualLevel: RiskLevel;

  treatment: RiskTreatment;

  owner: string;
  dueDate: string;

  status: RiskStatus;

  createdAt: string;
}

const STORAGE_KEY =
  "riskcommand-risk-register";

const REMEDIATION_STORAGE_KEY =
  "riskcommand-remediations";

export function getRisks(): RiskRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored =
      localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    return JSON.parse(stored) as RiskRecord[];
  } catch {
    return [];
  }
}

export function saveRisks(
  risks: RiskRecord[]
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(risks)
  );
}

export function addRisk(
  risk: RiskRecord
) {
  const existingRisks = getRisks();

  saveRisks([
    ...existingRisks,
    risk,
  ]);
}

export function generateRiskId(): string {
  const risks = getRisks();

  const nextNumber =
    risks.length + 1;

  return `RISK-${String(nextNumber).padStart(
    4,
    "0"
  )}`;
}

export function getRemediations(): RemediationRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored =
      localStorage.getItem(
        REMEDIATION_STORAGE_KEY
      );

    if (!stored) {
      return [];
    }

    return JSON.parse(
      stored
    ) as RemediationRecord[];

  } catch {
    return [];
  }
}

export function saveRemediations(
  remediations: RemediationRecord[]
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    REMEDIATION_STORAGE_KEY,
    JSON.stringify(remediations)
  );
}

export function addRemediation(
  remediation: RemediationRecord
) {
  const existingRemediations =
    getRemediations();

  saveRemediations([
    ...existingRemediations,
    remediation,
  ]);
}

export function generateRemediationId(): string {
  const remediations =
    getRemediations();

  const nextNumber =
    remediations.length + 1;

  return `REM-${String(nextNumber).padStart(
    4,
    "0"
  )}`;
}