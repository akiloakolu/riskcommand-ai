"use client";

import { useState } from "react";

const models = [
  {
    name: "Customer Support AI",
    owner: "Customer Experience",
    businessUnit: "Customer Operations",
    useCase: "Customer Service Automation",
    modelType: "Generative AI",
    dataClassification: "Confidential",
    vendor: "OpenAI",
    risk: "Medium",
    status: "Production",
    score: 62,
    lastAssessment: "2026-07-15",
    nextReview: "2026-10-15",
  },
  {
    name: "Fraud Detection Model",
    owner: "Risk & Compliance",
    businessUnit: "Financial Crime",
    useCase: "Fraud Detection",
    modelType: "Machine Learning",
    dataClassification: "Restricted",
    vendor: "Internal",
    risk: "High",
    status: "Production",
    score: 84,
    lastAssessment: "2026-06-20",
    nextReview: "2026-09-20",
  },
  {
    name: "HR Candidate Screening",
    owner: "Human Resources",
    businessUnit: "People & Culture",
    useCase: "Candidate Screening",
    modelType: "Machine Learning",
    dataClassification: "Personal",
    vendor: "Third Party",
    risk: "High",
    status: "Review",
    score: 78,
    lastAssessment: "2026-07-01",
    nextReview: "2026-08-30",
  },
  {
    name: "Marketing Recommendation AI",
    owner: "Marketing",
    businessUnit: "Marketing",
    useCase: "Content Recommendation",
    modelType: "Generative AI",
    dataClassification: "Internal",
    vendor: "Microsoft",
    risk: "Low",
    status: "Production",
    score: 34,
    lastAssessment: "2026-08-01",
    nextReview: "2027-02-01",
  },
];

function getReviewStatus(nextReview: string) {
  if (!nextReview) {
    return {
      label: "Not Scheduled",
      className: "bg-slate-400/10 text-slate-400",
    };
  }

  const today = new Date();
  const reviewDate = new Date(nextReview);

  today.setHours(0, 0, 0, 0);
  reviewDate.setHours(0, 0, 0, 0);

  const difference =
    Math.ceil(
      (reviewDate.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    );

  if (difference < 0) {
    return {
      label: "Overdue",
      className: "bg-red-400/10 text-red-400",
    };
  }

  if (difference <= 30) {
    return {
      label: "Due Soon",
      className: "bg-amber-400/10 text-amber-400",
    };
  }

  return {
    label: "Scheduled",
    className: "bg-emerald-400/10 text-emerald-400",
  };
}
const controls = [
  { name: "AI Risk Assessment", status: "Compliant" },
  { name: "Model Documentation", status: "Compliant" },
  { name: "Human Oversight", status: "Review Required" },
  { name: "Data Privacy Controls", status: "Compliant" },
  { name: "AI Incident Management", status: "Review Required" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [showForm, setShowForm] = useState(false);

const [inventory, setInventory] = useState(models);

  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [lifecycleFilter, setLifecycleFilter] = useState("All");

    const [selectedModel, setSelectedModel] =
  useState<(typeof models)[number] | null>(null);
  
const [showAssessment, setShowAssessment] = useState(false);
const [showRemediation, setShowRemediation] = useState(false);
const [selectedFinding, setSelectedFinding] = useState<{
  framework: string;
  controlId: string;
  controlName: string;
  status: string;
} | null>(null);
const [showGovernanceControl, setShowGovernanceControl] =
  useState(false);

const [savedAssessments, setSavedAssessments] = useState<
  {
    modelName: string;
    riskCategory: string;
    likelihood: number;
    impact: number;
    inherentRisk: number;
    residualRisk: number;
    controlEffectiveness: string;
    riskTreatment: string;
    riskOwner: string;
    notes: string;
    assessmentDate: string;
  }[]
>([]);

const [remediations, setRemediations] = useState<
  {
    framework: string;
    controlId: string;
    controlName: string;
    modelName: string;
    finding: string;
    recommendation: string;
    treatment: string;
    owner: string;
    dueDate: string;
    status: string;
    createdDate: string;
  }[]
>([]);

const [governanceControls, setGovernanceControls] = useState<
  {
    modelName: string;
    framework: string;
    controlId: string;
    controlName: string;
    status: string;
    owner: string;
    evidence: string;
    lastReviewed: string;
  }[]
>([]);

const selectedModelControls = selectedModel
  ? governanceControls.filter(
      (control) =>
        control.modelName === selectedModel.name
    )
  : [];

  const frameworkCoverage = (framework: string) => {
  const frameworkControls = selectedModelControls.filter(
    (control) => control.framework === framework
  );

  if (frameworkControls.length === 0) {
    return 0;
  }

  const implemented = frameworkControls.filter(
    (control) => control.status === "Implemented"
  ).length;

  return Math.round(
    (implemented / frameworkControls.length) * 100
  );
};

const nistCoverage = frameworkCoverage("NIST AI RMF");

const isoCoverage = frameworkCoverage("ISO/IEC 42001");

const responsibleAICoverage =
  frameworkCoverage("Responsible AI");

const governanceFindings = selectedModelControls.filter(
  (control) =>
    control.status === "Gap" ||
    control.status === "Partially Implemented"
);

const totalFindings = governanceFindings.length;

const criticalFindings = governanceFindings.filter(
  (control) => control.status === "Gap"
).length;

const partialFindings = governanceFindings.filter(
  (control) => control.status === "Partially Implemented"
).length;

const openRemediations = remediations.filter(
  (remediation) => remediation.status === "Open"
).length;

const inProgressRemediations = remediations.filter(
  (remediation) => remediation.status === "In Progress"
).length;

const completedRemediations = remediations.filter(
  (remediation) => remediation.status === "Completed"
).length;

const overdueRemediations = remediations.filter(
  (remediation) =>
    remediation.status !== "Completed" &&
    remediation.dueDate !== "" &&
    new Date(remediation.dueDate) < new Date()
).length;

const totalControls = selectedModelControls.length;

const implementedControls = selectedModelControls.filter(
  (control) => control.status === "Implemented"
).length;

const partialControls = selectedModelControls.filter(
  (control) => control.status === "Partially Implemented"
).length;

const gapControls = selectedModelControls.filter(
  (control) => control.status === "Gap"
).length;

const controlCoverage =
  totalControls === 0
    ? 0
    : Math.round(
        (implementedControls / totalControls) * 100
      );

    const filteredInventory = inventory.filter((model) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      model.name.toLowerCase().includes(search) ||
      model.businessUnit.toLowerCase().includes(search) ||
      model.useCase.toLowerCase().includes(search) ||
      model.vendor.toLowerCase().includes(search);

    const matchesRisk =
      riskFilter === "All" || model.risk === riskFilter;

    const matchesLifecycle =
      lifecycleFilter === "All" ||
      model.status === lifecycleFilter;

    return (
      matchesSearch &&
      matchesRisk &&
      matchesLifecycle
    );
  });

  const totalSystems = inventory.length;

  const highRiskSystems = inventory.filter(
    (model) => model.risk === "High"
  ).length;

  const mediumRiskSystems = inventory.filter(
  (model) => model.risk === "Medium"
).length;

const lowRiskSystems = inventory.filter(
  (model) => model.risk === "Low"
).length;

  const productionSystems = inventory.filter(
    (model) => model.status === "Production"
  ).length;

  const systemsNeedingReview = inventory.filter((model) => {
    if (!model.nextReview) return false;

    return new Date(model.nextReview) <= new Date();
  }).length;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-medium tracking-widest text-emerald-400">
              RESPONSIBLE AI
            </p>

            <h1 className="mt-1 text-2xl font-semibold">
              AI Governance Dashboard
            </h1>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm">
            <span className="text-slate-400">Framework:</span>{" "}
            <span className="font-medium">NIST AI RMF</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto flex max-w-7xl gap-8 overflow-x-auto px-6">
          {["Overview", "AI Inventory", "Risk", "Controls", "Reports"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 px-1 py-4 text-sm font-medium transition ${
                  activeTab === tab
                    ? "border-emerald-400 text-emerald-400"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Page heading */}
        <div className="mb-8">
          <p className="text-sm text-slate-400">Enterprise AI Governance</p>

          <h2 className="mt-2 text-3xl font-semibold">
            Governance Overview
          </h2>

          <p className="mt-2 max-w-3xl text-slate-400">
            Centralized visibility into AI systems, risk exposure, control
            compliance, and responsible AI governance.
          </p>
        </div>

        {/* Metrics */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="AI Systems"
            value={String(totalSystems)}
            description="Registered models"
          />

          <Metric
            label="High Risk"
            value={String(highRiskSystems)}
            description="Require attention"
          />

          <Metric
            label="Control Compliance"
            value="92%"
            description="Across AI inventory"
          />

          <Metric
            label="Open Findings"
            value="7"
            description="Active governance issues"
          />
        </section>

        {/* Risk overview */}
        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  AI Risk Distribution
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Current risk profile across registered AI systems
                </p>
              </div>

              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-400">
                Live Inventory
              </span>
            </div>

            <div className="mt-8 space-y-5">
              <RiskBar
  label="Low Risk"
  value={totalSystems === 0 ? 0 : Math.round((lowRiskSystems / totalSystems) * 100)}
/>

<RiskBar
  label="Medium Risk"
  value={totalSystems === 0 ? 0 : Math.round((mediumRiskSystems / totalSystems) * 100)}
/>

<RiskBar
  label="High Risk"
  value={totalSystems === 0 ? 0 : Math.round((highRiskSystems / totalSystems) * 100)}
/>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-lg font-semibold">Governance Health</h3>

            <div className="mt-6 flex items-center justify-center">
              <div className="flex h-40 w-40 items-center justify-center rounded-full border-[14px] border-emerald-400/80">
                <div className="text-center">
                  <div className="text-4xl font-bold">92%</div>
                  <div className="text-xs text-slate-400">
                    Compliance
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-slate-400">
              Overall governance posture is healthy with several controls
              requiring review.
            </p>
          </div>
        </section>

        {/* AI inventory */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-semibold">
                AI Model Inventory
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Registered AI systems and current risk posture
              </p>
            </div>

            <button
  onClick={() => setShowForm(true)}
  className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
>
  + Register AI System
</button>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
  {/* Search */}
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search AI systems, business units, vendors..."
    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
  />

  {/* Risk Filter */}
  <select
    value={riskFilter}
    onChange={(e) => setRiskFilter(e.target.value)}
    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
  >
    <option value="All">All Risk Levels</option>
    <option value="Low">Low Risk</option>
    <option value="Medium">Medium Risk</option>
    <option value="High">High Risk</option>
  </select>

  {/* Lifecycle Filter */}
  <select
    value={lifecycleFilter}
    onChange={(e) => setLifecycleFilter(e.target.value)}
    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
  >
    <option value="All">All Lifecycle Statuses</option>
    <option value="Development">Development</option>
    <option value="Testing">Testing</option>
    <option value="Production">Production</option>
    <option value="Review">Review</option>
    <option value="Retired">Retired</option>
  </select>
</div>

          <div className="mt-6 overflow-x-auto">
  <table className="w-full min-w-[1200px] text-left text-sm">
    <thead>
      <tr className="border-b border-slate-800 text-slate-500">
        <th className="px-4 py-3">AI System</th>
        <th className="px-4 py-3">Business Unit</th>
        <th className="px-4 py-3">Use Case</th>
        <th className="px-4 py-3">Model Type</th>
        <th className="px-4 py-3">Data</th>
        <th className="px-4 py-3">Vendor</th>
        <th className="px-4 py-3">Risk</th>
        <th className="px-4 py-3">Lifecycle</th>
        <th className="px-4 py-3">Risk Score</th>
        <th className="px-4 py-3">Next Review</th>
<th className="px-4 py-3">Review Status</th>
      </tr>
    </thead>

    <tbody>
      {filteredInventory.map((model) => (
        <tr
          key={`${model.name}-${model.owner}`}
          className="border-b border-slate-800/70 last:border-0 transition hover:bg-slate-800/30"
        >
          <td className="px-4 py-4">
  <button
    type="button"
    onClick={() => setSelectedModel(model)}
    className="text-left font-medium text-white transition hover:text-emerald-400"
  >
    {model.name}
  </button>

  <div className="mt-1 text-xs text-slate-500">
    Owner: {model.owner}
  </div>
</td>

          <td className="px-4 py-4 text-slate-400">
            {model.businessUnit}
          </td>

          <td className="px-4 py-4 text-slate-400">
            {model.useCase}
          </td>

          <td className="px-4 py-4 text-slate-400">
            {model.modelType}
          </td>

          <td className="px-4 py-4">
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
              {model.dataClassification}
            </span>
          </td>

          <td className="px-4 py-4 text-slate-400">
            {model.vendor}
          </td>

          <td className="px-4 py-4">
            <RiskBadge risk={model.risk} />
          </td>

          <td className="px-4 py-4 text-slate-400">
            {model.status}
          </td>

          <td className="px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-20 rounded-full bg-slate-800">
                <div
                  className={`h-2 rounded-full ${
                    model.score >= 75
                      ? "bg-red-400"
                      : model.score >= 50
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                  }`}
                  style={{ width: `${model.score}%` }}
                />
              </div>

              <span className="text-slate-300">
                {model.score}
              </span>
            </div>
          </td>

          <td className="px-4 py-4 text-slate-400">
  {model.nextReview}
</td>

<td className="px-4 py-4">
  {(() => {
    const reviewStatus = getReviewStatus(model.nextReview);

    return (
      <span
        className={`rounded-full px-3 py-1 text-xs ${reviewStatus.className}`}
      >
        {reviewStatus.label}
      </span>
    );
  })()}
</td>
        </tr>
      ))}
    
          </tbody>
    </table>
  </div>
        </section>

        {/* Selected AI Model Details */}
        {selectedModel && (
          <section className="mt-8 rounded-2xl border border-emerald-400/20 bg-slate-900 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium tracking-wider text-emerald-400">
                  AI GOVERNANCE PROFILE
                </p>

                <h3 className="mt-1 text-2xl font-semibold">
                  {selectedModel.name}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Detailed governance, risk, and lifecycle profile
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAssessment(true)}
                className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-300"
    >
      Assess Risk
    </button>

<button
  type="button"
  onClick={() => setShowRemediation(true)}
  className="rounded-lg border border-amber-400/40 px-4 py-2 text-sm font-medium text-amber-400 transition hover:bg-amber-400/10"
>
  Treat Risk
</button>

<button
  type="button"
  onClick={() => setShowGovernanceControl(true)}
  className="rounded-lg border border-cyan-400/40 px-4 py-2 text-sm font-medium text-cyan-400 transition hover:bg-cyan-400/10"
>
  Map Control
</button>

    <button
      type="button"
                onClick={() => setSelectedModel(null)}
                className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-400 transition hover:border-slate-500 hover:text-white"
              >
                Close
              </button>
{/* Governance Control Coverage */}
<div className="mt-8 rounded-2xl border border-cyan-400/20 bg-slate-950 p-6">

  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">
        GOVERNANCE POSTURE
      </p>

      <h3 className="mt-1 text-lg font-semibold">
        Control Coverage
      </h3>

      <p className="mt-1 text-sm text-slate-400">
        Governance controls mapped to this AI system.
      </p>
    </div>

    <div className="text-right">
      <p className="text-xs text-slate-500">
        Coverage
      </p>

      <p className="text-3xl font-semibold text-cyan-400">
        {controlCoverage}%
      </p>
    </div>
  </div>

  {/* Coverage Bar */}
  <div className="mt-6">
    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
      <div
        className="h-full rounded-full bg-cyan-400 transition-all"
        style={{
          width: `${controlCoverage}%`,
        }}
      />
    </div>
  </div>

  {/* Metrics */}
  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <p className="text-xs text-slate-500">
        Total Controls
      </p>

      <p className="mt-2 text-2xl font-semibold">
        {totalControls}
      </p>
    </div>

    <div className="rounded-xl border border-emerald-400/10 bg-slate-900 p-4">
      <p className="text-xs text-slate-500">
        Implemented
      </p>

      <p className="mt-2 text-2xl font-semibold text-emerald-400">
        {implementedControls}
      </p>
    </div>

    <div className="rounded-xl border border-amber-400/10 bg-slate-900 p-4">
      <p className="text-xs text-slate-500">
        Partially Implemented
      </p>

      <p className="mt-2 text-2xl font-semibold text-amber-400">
        {partialControls}
      </p>
    </div>

    <div className="rounded-xl border border-red-400/10 bg-slate-900 p-4">
      <p className="text-xs text-slate-500">
        Control Gaps
      </p>

      <p className="mt-2 text-2xl font-semibold text-red-400">
        {gapControls}
      </p>
    </div>

  </div>

</div>

            </div>
{/* Framework Compliance Coverage */}
<div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-6">

  <div>
    <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">
      FRAMEWORK COVERAGE
    </p>

    <h3 className="mt-1 text-lg font-semibold">
      AI Governance Frameworks
    </h3>

    <p className="mt-1 text-sm text-slate-400">
      Control implementation coverage across selected governance frameworks.
    </p>
  </div>

  <div className="mt-6 grid gap-4 md:grid-cols-3">

    {/* NIST AI RMF */}
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

      <div className="flex items-center justify-between">
        <p className="font-medium">
          NIST AI RMF
        </p>

        <span className="text-lg font-semibold text-cyan-400">
          {nistCoverage}%
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-cyan-400 transition-all"
          style={{
            width: `${nistCoverage}%`,
          }}
        />
      </div>

      <p className="mt-3 text-xs text-slate-500">
        AI Risk Management Framework
      </p>

    </div>

    {/* ISO 42001 */}
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

      <div className="flex items-center justify-between">
        <p className="font-medium">
          ISO/IEC 42001
        </p>

        <span className="text-lg font-semibold text-emerald-400">
          {isoCoverage}%
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-emerald-400 transition-all"
          style={{
            width: `${isoCoverage}%`,
          }}
        />
      </div>

      <p className="mt-3 text-xs text-slate-500">
        AI Management System
      </p>

    </div>

    {/* Responsible AI */}
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

      <div className="flex items-center justify-between">
        <p className="font-medium">
          Responsible AI
        </p>

        <span className="text-lg font-semibold text-amber-400">
          {responsibleAICoverage}%
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-amber-400 transition-all"
          style={{
            width: `${responsibleAICoverage}%`,
          }}
        />
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Responsible AI Governance
      </p>

    </div>

  </div>

{/* Governance Findings */}
<div className="mt-6 rounded-2xl border border-red-400/20 bg-slate-950 p-6">

  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-red-400">
        GOVERNANCE FINDINGS
      </p>

      <h3 className="mt-1 text-lg font-semibold">
        Control Gaps & Attention Items
      </h3>

      <p className="mt-1 text-sm text-slate-400">
        Governance controls requiring remediation or additional review.
      </p>
    </div>

    <div className="flex gap-3 text-sm">
      <span className="rounded-full bg-red-400/10 px-3 py-1 text-red-400">
        {criticalFindings} Gaps
      </span>

      <span className="rounded-full bg-amber-400/10 px-3 py-1 text-amber-400">
        {partialFindings} Partial
      </span>
    </div>
  </div>

  {totalFindings === 0 ? (
    <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-5">
      <p className="font-medium text-emerald-400">
        No governance findings
      </p>

      <p className="mt-1 text-sm text-slate-400">
        All mapped governance controls are currently implemented.
      </p>
    </div>
  ) : (
    <div className="mt-6 space-y-4">

      {governanceFindings.map((finding, index) => (
        <div
          key={`${finding.controlId}-${index}`}
          className="rounded-xl border border-slate-800 bg-slate-900 p-5"
        >

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">

            <div>
              <div className="flex flex-wrap items-center gap-2">

                <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-400">
                  {finding.framework}
                </span>

                <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
                  {finding.controlId}
                </span>

              </div>

              <h4 className="mt-3 font-semibold text-white">
                {finding.controlName}
              </h4>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs ${
                finding.status === "Gap"
                  ? "bg-red-400/10 text-red-400"
                  : "bg-amber-400/10 text-amber-400"
              }`}
            >
              {finding.status}
            </span>

            <button
  type="button"
  onClick={() => {
  setSelectedFinding({
    framework: finding.framework,
    controlId: finding.controlId,
    controlName: finding.controlName,
    status: finding.status,
  });

  setShowRemediation(true);
}}
  className="rounded-lg border border-amber-400/30 px-3 py-1 text-xs font-medium text-amber-400 transition hover:bg-amber-400/10"
>
  Create Remediation
</button>

          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">

            <div>
              <p className="text-xs text-slate-500">
                Control Owner
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {finding.owner}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Last Reviewed
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {finding.lastReviewed}
              </p>
            </div>

          </div>

          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950 p-4">

            <p className="text-xs text-slate-500">
              Evidence / Documentation
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              {finding.evidence || "No evidence documented."}
            </p>

          </div>

        </div>
      ))}

    </div>
  )}

</div>

</div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs text-slate-500">Business Owner</p>
                <p className="mt-1 font-medium">{selectedModel.owner}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs text-slate-500">Business Unit</p>
                <p className="mt-1 font-medium">{selectedModel.businessUnit}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs text-slate-500">Use Case</p>
                <p className="mt-1 font-medium">{selectedModel.useCase}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs text-slate-500">Model Type</p>
                <p className="mt-1 font-medium">{selectedModel.modelType}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs text-slate-500">Data Classification</p>
                <p className="mt-1 font-medium">
                  {selectedModel.dataClassification}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs text-slate-500">AI Vendor</p>
                <p className="mt-1 font-medium">{selectedModel.vendor}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs text-slate-500">Risk Classification</p>
                <div className="mt-2">
                  <RiskBadge risk={selectedModel.risk} />
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs text-slate-500">Lifecycle Status</p>
                <p className="mt-1 font-medium">{selectedModel.status}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs text-slate-500">Risk Score</p>

                <div className="mt-2 flex items-center gap-3">
                  <div className="h-2 flex-1 rounded-full bg-slate-800">
                    <div
                      className={`h-2 rounded-full ${
                        selectedModel.score >= 75
                          ? "bg-red-400"
                          : selectedModel.score >= 50
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                      }`}
                      style={{ width: `${selectedModel.score}%` }}
                    />
                  </div>

                  <span className="font-semibold text-slate-200">
                    {selectedModel.score}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs text-slate-500">Last Assessment</p>
                <p className="mt-1 font-medium">
                  {selectedModel.lastAssessment || "Not recorded"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs text-slate-500">Next Review</p>
                <p className="mt-1 font-medium">
                  {selectedModel.nextReview}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
  <p className="text-xs text-slate-500">Review Status</p>

  <div className="mt-2">
    {(() => {
      const reviewStatus = getReviewStatus(
        selectedModel.nextReview
      );

      return (
        <span
          className={`rounded-full px-3 py-1 text-xs ${reviewStatus.className}`}
        >
          {reviewStatus.label}
        </span>
      );
    })()}
  </div>
</div>
            </div>

{/* Saved Risk Assessment */}
{savedAssessments
  .filter(
    (assessment) =>
      assessment.modelName === selectedModel.name
  )
  .map((assessment) => (
    <div key={assessment.assessmentDate} className="mt-8">

      <h3 className="text-lg font-semibold">
        Latest Risk Assessment
      </h3>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Assessment Date
          </p>

          <p className="mt-1 font-medium">
            {assessment.assessmentDate}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Risk Category
          </p>

          <p className="mt-1 font-medium">
            {assessment.riskCategory}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Risk Owner
          </p>

          <p className="mt-1 font-medium">
            {assessment.riskOwner}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Inherent Risk
          </p>

          <p className="mt-1 text-2xl font-semibold">
            {assessment.inherentRisk}
            <span className="ml-1 text-sm text-slate-500">
              /25
            </span>
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Residual Risk
          </p>

          <p className="mt-1 text-2xl font-semibold">
            {assessment.residualRisk}
            <span className="ml-1 text-sm text-slate-500">
              /25
            </span>
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Risk Treatment
          </p>

          <p className="mt-1 font-medium">
            {assessment.riskTreatment}
          </p>
        </div>

      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">

        <p className="text-xs text-slate-500">
          Control Effectiveness
        </p>

        <p className="mt-1 font-medium">
          {assessment.controlEffectiveness}
        </p>

        {assessment.notes && (
          <>
            <p className="mt-4 text-xs text-slate-500">
              Assessment Notes
            </p>

            <p className="mt-1 text-sm text-slate-300">
              {assessment.notes}
            </p>
          </>
        )}

      </div>

    </div>
  ))}

{/* Remediation Register */}

{/* Remediation Status Dashboard */}
<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
    <p className="text-xs text-slate-500">
      Open
    </p>

    <p className="mt-2 text-2xl font-semibold text-slate-200">
      {openRemediations}
    </p>

    <p className="mt-1 text-xs text-slate-500">
      Awaiting action
    </p>
  </div>

  <div className="rounded-xl border border-amber-400/10 bg-slate-950 p-4">
    <p className="text-xs text-slate-500">
      In Progress
    </p>

    <p className="mt-2 text-2xl font-semibold text-amber-400">
      {inProgressRemediations}
    </p>

    <p className="mt-1 text-xs text-slate-500">
      Active remediation
    </p>
  </div>

  <div className="rounded-xl border border-emerald-400/10 bg-slate-950 p-4">
    <p className="text-xs text-slate-500">
      Completed
    </p>

    <p className="mt-2 text-2xl font-semibold text-emerald-400">
      {completedRemediations}
    </p>

    <p className="mt-1 text-xs text-slate-500">
      Closed findings
    </p>
  </div>

  <div className="rounded-xl border border-red-400/10 bg-slate-950 p-4">
    <p className="text-xs text-slate-500">
      Overdue
    </p>

    <p className="mt-2 text-2xl font-semibold text-red-400">
      {overdueRemediations}
    </p>

    <p className="mt-1 text-xs text-slate-500">
      Past due date
    </p>
  </div>

</div>

{remediations

  .filter(
    (remediation) =>
      remediation.modelName === selectedModel.name
  )
  .map((remediation, index) => (
    <div
      key={`${remediation.createdDate}-${index}`}
      className="mt-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-amber-400">
            REMEDIATION REGISTER
          </p>

          <h3 className="mt-1 text-lg font-semibold">
            Risk Treatment & Remediation
          </h3>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs ${
            remediation.status === "Closed"
              ? "bg-emerald-400/10 text-emerald-400"
              : remediation.status === "In Progress"
                ? "bg-blue-400/10 text-blue-400"
                : remediation.status === "Pending Validation"
                  ? "bg-amber-400/10 text-amber-400"
                  : "bg-red-400/10 text-red-400"
          }`}
        >
          {remediation.status}
        </span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 lg:col-span-2">
          <p className="text-xs text-slate-500">
            Risk Finding
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-300">

<div className="mb-3 flex flex-wrap items-center gap-2">
  {remediation.framework && (
    <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-400">
      {remediation.framework}
    </span>
  )}

  {remediation.controlId && (
    <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
      {remediation.controlId}
    </span>
  )}

  {remediation.controlName && (
    <span className="text-xs text-slate-400">
      {remediation.controlName}
    </span>
  )}
</div>

            {remediation.finding || "No finding documented."}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Risk Treatment
          </p>

          <p className="mt-2 font-medium text-white">
            {remediation.treatment}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 lg:col-span-2">
          <p className="text-xs text-slate-500">
            Recommended Action
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            {remediation.recommendation ||
              "No recommendation documented."}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Remediation Owner
          </p>

          <p className="mt-2 font-medium text-white">
            {remediation.owner}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Due Date
          </p>

          <p className="mt-2 font-medium text-white">
            {remediation.dueDate || "Not scheduled"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Created
          </p>

          <p className="mt-2 font-medium text-white">
            {remediation.createdDate}
          </p>
        </div>

      </div>
    </div>

  ))}

{/* Governance Control Register */}
{governanceControls
  .filter(
    (control) =>
      control.modelName === selectedModel.name
  )
  .map((control, index) => (
    <div
      key={`${control.controlId}-${index}`}
      className="mt-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">
            GOVERNANCE CONTROL REGISTER
          </p>

          <h3 className="mt-1 text-lg font-semibold">
            Compliance & Control Mapping
          </h3>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs ${
            control.status === "Implemented"
              ? "bg-emerald-400/10 text-emerald-400"
              : control.status === "Partially Implemented"
                ? "bg-amber-400/10 text-amber-400"
                : control.status === "Gap"
                  ? "bg-red-400/10 text-red-400"
                  : "bg-slate-400/10 text-slate-400"
          }`}
        >
          {control.status}
        </span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Framework
          </p>

          <p className="mt-2 font-medium text-white">
            {control.framework}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Control ID
          </p>

          <p className="mt-2 font-medium text-white">
            {control.controlId}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Control Owner
          </p>

          <p className="mt-2 font-medium text-white">
            {control.owner}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 lg:col-span-2">
          <p className="text-xs text-slate-500">
            Control Name
          </p>

          <p className="mt-2 text-sm text-slate-300">
            {control.controlName || "No control name provided."}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Last Reviewed
          </p>

          <p className="mt-2 font-medium text-white">
            {control.lastReviewed}
          </p>
        </div>

      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
        <p className="text-xs text-slate-500">
          Evidence / Documentation
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          {control.evidence || "No evidence documented."}
        </p>
      </div>
    </div>
  ))}

          </section>
        )}
        {showAssessment && selectedModel && (
  <RiskAssessmentForm
    model={selectedModel}
    onClose={() => setShowAssessment(false)}
    onSave={(assessment) => {
      setSavedAssessments((current) => [
        ...current,
        assessment,
      ]);
      setShowAssessment(false);
    }}
  />
)}

{showRemediation && selectedModel && (
  <RemediationForm
    model={selectedModel}
    selectedFinding={selectedFinding}
    onClose={() => setShowRemediation(false)}
    onSave={(remediation) => {
      setRemediations((current) => [
        ...current,
        remediation,
      ]);

      setShowRemediation(false);
    }}
  />
)}

{showGovernanceControl && selectedModel && (
  <GovernanceControlForm
    model={selectedModel}
    onClose={() => setShowGovernanceControl(false)}
    onSave={(control) => {
      setGovernanceControls((current) => [
        ...current,
        control,
      ]);

      setShowGovernanceControl(false);
    }}
  />
)}

        {showForm && (

  <RegisterAIForm
    onClose={() => setShowForm(false)}
    onRegister={(newModel) => {
      setInventory((current) => [newModel, ...current]);
      setShowForm(false);
    }}
  />
)}




        {/* Controls */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div>
            <h3 className="text-lg font-semibold">
              Governance Controls
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Control effectiveness and compliance monitoring
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {controls.map((control) => (
              <div
                key={control.name}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <span className="text-sm">{control.name}</span>

                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    control.status === "Compliant"
                      ? "bg-emerald-400/10 text-emerald-400"
                      : "bg-amber-400/10 text-amber-400"
                  }`}
                >
                  {control.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Frameworks */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Framework
            name="NIST AI RMF"
            description="AI risk management framework"
          />

          <Framework
            name="ISO 42001"
            description="AI management system"
          />

          <Framework
            name="EU AI Act"
            description="AI regulatory readiness"
          />
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-slate-800 py-8 text-center text-sm text-slate-500">
          AI Governance Dashboard • Enterprise Responsible AI Platform
        </footer>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm text-slate-400">{label}</p>

      <p className="mt-2 text-3xl font-semibold">{value}</p>

      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function RiskBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400">{value}%</span>
      </div>

      <div className="h-3 rounded-full bg-slate-800">
        <div
          className="h-3 rounded-full bg-emerald-400"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const styles = {
    Low: "bg-emerald-400/10 text-emerald-400",
    Medium: "bg-amber-400/10 text-amber-400",
    High: "bg-red-400/10 text-red-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs ${
        styles[risk as keyof typeof styles]
      }`}
    >
      {risk}
    </span>
  );
}

function Framework({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="font-semibold">{name}</p>

      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}

function RegisterAIForm({
  onClose,
  onRegister,
}: {
  onClose: () => void;
  onRegister: (model: {
    name: string;
    owner: string;
    businessUnit: string;
    useCase: string;
    modelType: string;
    dataClassification: string;
    vendor: string;
    risk: string;
    status: string;
    score: number;
    lastAssessment: string;
    nextReview: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [businessUnit, setBusinessUnit] = useState("");
  const [useCase, setUseCase] = useState("");
  const [modelType, setModelType] = useState("Generative AI");
  const [dataClassification, setDataClassification] =
    useState("Internal");
  const [vendor, setVendor] = useState("");
  const [risk, setRisk] = useState("Medium");
  const [status, setStatus] = useState("Development");
  const [score, setScore] = useState("50");
  const [lastAssessment, setLastAssessment] = useState("");
  const [nextReview, setNextReview] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    onRegister({
      name,
      owner,
      businessUnit,
      useCase,
      modelType,
      dataClassification,
      vendor,
      risk,
      status,
      score: Number(score),
      lastAssessment,
      nextReview,
    });
  }
  return (
    <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium tracking-wider text-emerald-400">
            AI INVENTORY
          </p>

          <h3 className="mt-1 text-xl font-semibold">
            Register AI System
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Add an AI system to the enterprise governance inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-400 transition hover:border-slate-500 hover:text-white"
        >
          Cancel
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-5 md:grid-cols-2"
      >
        {/* AI System Name */}
        <div>
          <label className="text-sm text-slate-400">
            AI System Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Example: Customer Support Copilot"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
          />
        </div>

        {/* Business Owner */}
        <div>
          <label className="text-sm text-slate-400">
            Business Owner
          </label>

          <input
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            required
            placeholder="Example: Customer Experience"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
          />
        </div>

        {/* Business Unit */}
        <div>
          <label className="text-sm text-slate-400">
            Business Unit
          </label>

          <input
            value={businessUnit}
            onChange={(e) => setBusinessUnit(e.target.value)}
            required
            placeholder="Example: Information Security"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
          />
        </div>

        {/* AI Use Case */}
        <div>
          <label className="text-sm text-slate-400">
            AI Use Case
          </label>

          <input
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            required
            placeholder="Example: Enterprise Knowledge Assistant"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
          />
        </div>

        {/* Model Type */}
        <div>
          <label className="text-sm text-slate-400">
            Model Type
          </label>

          <select
            value={modelType}
            onChange={(e) => setModelType(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
          >
            <option>Generative AI</option>
            <option>Machine Learning</option>
            <option>Deep Learning</option>
            <option>Predictive Analytics</option>
            <option>Computer Vision</option>
            <option>Natural Language Processing</option>
          </select>
        </div>

        {/* Data Classification */}
        <div>
          <label className="text-sm text-slate-400">
            Data Classification
          </label>

          <select
            value={dataClassification}
            onChange={(e) =>
              setDataClassification(e.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
          >
            <option>Public</option>
            <option>Internal</option>
            <option>Confidential</option>
            <option>Restricted</option>
            <option>Personal</option>
          </select>
        </div>

        {/* AI Vendor */}
        <div>
          <label className="text-sm text-slate-400">
            AI Vendor
          </label>

          <input
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            required
            placeholder="Example: OpenAI"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
          />
        </div>

        {/* Risk Classification */}
        <div>
          <label className="text-sm text-slate-400">
            Risk Classification
          </label>

          <select
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        {/* Lifecycle Status */}
        <div>
          <label className="text-sm text-slate-400">
            Lifecycle Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
          >
            <option>Development</option>
            <option>Testing</option>
            <option>Production</option>
            <option>Review</option>
            <option>Retired</option>
          </select>
        </div>

        {/* Risk Score */}
        <div>
          <label className="text-sm text-slate-400">
            Risk Score
          </label>

          <input
            type="number"
            min="0"
            max="100"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            required
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
          />
        </div>

        {/* Last Assessment */}
        <div>
          <label className="text-sm text-slate-400">
            Last Assessment
          </label>

          <input
            type="date"
            value={lastAssessment}
            onChange={(e) =>
              setLastAssessment(e.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
          />
        </div>

        {/* Next Review */}
        <div>
          <label className="text-sm text-slate-400">
            Next Review
          </label>

          <input
            type="date"
            value={nextReview}
            onChange={(e) =>
              setNextReview(e.target.value)
            }
            required
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
          />
        </div>

  
        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Register AI System
          </button>
        </div>
      </form>
    </div>
  );
}

function RiskAssessmentForm({
  model,
  onClose,
  onSave,
}: {
  model: (typeof models)[number];
  onClose: () => void;
  onSave: (assessment: {
    modelName: string;
    riskCategory: string;
    likelihood: number;
    impact: number;
    inherentRisk: number;
    residualRisk: number;
    controlEffectiveness: string;
    riskTreatment: string;
    riskOwner: string;
    notes: string;
    assessmentDate: string;
  }) => void;
}) {

  const [riskCategory, setRiskCategory] = useState("Privacy");
  const [likelihood, setLikelihood] = useState("3");
  const [impact, setImpact] = useState("3");
  const [controls, setControls] = useState("");
  const [controlEffectiveness, setControlEffectiveness] =
    useState("Effective");
  const [riskTreatment, setRiskTreatment] = useState("Mitigate");
  const [riskOwner, setRiskOwner] = useState(model.owner);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const inherentRisk =
    Number(likelihood) * Number(impact);

  const residualRisk =
    controlEffectiveness === "Effective"
      ? Math.round(inherentRisk * 0.5)
      : controlEffectiveness === "Partially Effective"
        ? Math.round(inherentRisk * 0.75)
        : inherentRisk;

  const getRiskLevel = (score: number) => {
    if (score >= 15) return "High";
    if (score >= 8) return "Medium";
    return "Low";
  };

  return (
    <section className="mt-8 rounded-2xl border border-emerald-400/20 bg-slate-900 p-6">

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium tracking-wider text-emerald-400">
            AI RISK ASSESSMENT
          </p>

          <h3 className="mt-1 text-2xl font-semibold">
            {model.name}
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Assess AI risk exposure, controls, and residual risk.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-400 transition hover:border-slate-500 hover:text-white"
        >
          Close
        </button>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">

        {/* Risk Category */}
        <div>
          <label className="text-sm text-slate-400">
            Risk Category
          </label>

          <select
            value={riskCategory}
            onChange={(e) => setRiskCategory(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
          >
            <option>Privacy</option>
            <option>Security</option>
            <option>Model Risk</option>
            <option>Compliance</option>
            <option>Bias & Fairness</option>
            <option>Third Party</option>
            <option>Operational</option>
          </select>
        </div>

        {/* Likelihood */}
        <div>
          <label className="text-sm text-slate-400">
            Likelihood
          </label>

          <select
            value={likelihood}
            onChange={(e) => setLikelihood(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
          >
            <option value="1">1 — Rare</option>
            <option value="2">2 — Unlikely</option>
            <option value="3">3 — Possible</option>
            <option value="4">4 — Likely</option>
            <option value="5">5 — Almost Certain</option>
          </select>
        </div>

        {/* Impact */}
        <div>
          <label className="text-sm text-slate-400">
            Impact
          </label>

          <select
            value={impact}
            onChange={(e) => setImpact(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
          >
            <option value="1">1 — Minimal</option>
            <option value="2">2 — Minor</option>
            <option value="3">3 — Moderate</option>
            <option value="4">4 — Major</option>
            <option value="5">5 — Severe</option>
          </select>
        </div>

        {/* Control Effectiveness */}
        <div>
          <label className="text-sm text-slate-400">
            Control Effectiveness
          </label>

          <select
            value={controlEffectiveness}
            onChange={(e) =>
              setControlEffectiveness(e.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
          >
            <option>Effective</option>
            <option>Partially Effective</option>
            <option>Not Effective</option>
          </select>
        </div>

        {/* Risk Treatment */}
        <div>
          <label className="text-sm text-slate-400">
            Risk Treatment
          </label>

          <select
            value={riskTreatment}
            onChange={(e) =>
              setRiskTreatment(e.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
          >
            <option>Mitigate</option>
            <option>Accept</option>
            <option>Transfer</option>
            <option>Avoid</option>
          </select>
        </div>

        {/* Risk Owner */}
        <div>
          <label className="text-sm text-slate-400">
            Risk Owner
          </label>

          <input
            value={riskOwner}
            onChange={(e) => setRiskOwner(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
          />
        </div>

        {/* Existing Controls */}
        <div className="md:col-span-2">
          <label className="text-sm text-slate-400">
            Existing Controls
          </label>

          <textarea
            value={controls}
            onChange={(e) => setControls(e.target.value)}
            placeholder="Describe existing security, privacy, governance, or human oversight controls..."
            rows={4}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
          />
        </div>

        {/* Assessment Notes */}
        <div className="md:col-span-2">
          <label className="text-sm text-slate-400">
            Assessment Notes
          </label>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Document risk rationale, findings, assumptions, and recommended actions..."
            rows={4}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
          />
        </div>

      </div>

      {/* Risk Calculation */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Inherent Risk
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {inherentRisk}
            <span className="ml-2 text-sm text-slate-500">
              / 25
            </span>
          </p>

          <p className="mt-2 text-sm text-slate-400">
            {getRiskLevel(inherentRisk)} Risk
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Residual Risk
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {residualRisk}
            <span className="ml-2 text-sm text-slate-500">
              / 25
            </span>
          </p>

          <p className="mt-2 text-sm text-slate-400">
            {getRiskLevel(residualRisk)} Risk
          </p>
        </div>

      </div>

      <div className="mt-6">
        <button
          type="button"
      
onClick={() => {
  onSave({
    modelName: model.name,
    riskCategory,
    likelihood: Number(likelihood),
    impact: Number(impact),
    inherentRisk,
    residualRisk,
    controlEffectiveness,
    riskTreatment,
    riskOwner,
    notes,
    assessmentDate: new Date().toISOString().split("T")[0],
  });

  setSaved(true);
}}

          className="w-full rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          Save Risk Assessment
        </button>
        {saved && (
  <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-400">
    Risk assessment saved successfully for {model.name}.
  </div>
)}
      </div>

    </section>
  );
}

function RemediationForm({
  model,
  onClose,
  onSave,
  selectedFinding,
}: {
  model: (typeof models)[number];
  onClose: () => void;
  selectedFinding: {
    framework: string;
    controlId: string;
    controlName: string;
    status: string;
  } | null;
  onSave: (remediation: {
    modelName: string;
    finding: string;
    framework: string;
    controlId: string;
    controlName: string;
    recommendation: string;
    treatment: string;
    owner: string;
    dueDate: string;
    status: string;
    createdDate: string;
  }) => void;
}) {
  const [finding, setFinding] = useState(
  selectedFinding
    ? `${selectedFinding.framework} ${selectedFinding.controlId}: ${selectedFinding.controlName}`
    : ""
);
  const [recommendation, setRecommendation] = useState("");
  const [treatment, setTreatment] = useState("Mitigate");
  const [owner, setOwner] = useState(model.owner);
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Open");

  function handleSave() {
    onSave({
      modelName: model.name,
      finding,
      framework: selectedFinding?.framework || "",
      controlId: selectedFinding?.controlId || "",
      controlName: selectedFinding?.controlName || "",
      recommendation,
      treatment,
      owner,
      dueDate,
      status,
      createdDate: new Date().toISOString().split("T")[0],
    });
  }

  return (
    <section className="mt-8 rounded-2xl border border-amber-400/20 bg-slate-900 p-6">

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium tracking-wider text-amber-400">
            RISK TREATMENT & REMEDIATION
          </p>

          <h3 className="mt-1 text-2xl font-semibold">
            {model.name}
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Document the finding, treatment plan, owner, and remediation timeline.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-400 transition hover:border-slate-500 hover:text-white"
        >
          Close
        </button>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">

        {/* Finding */}
        <div className="md:col-span-2">
          <label className="text-sm text-slate-400">
            Risk Finding
          </label>

          <textarea
            value={finding}
            onChange={(e) => setFinding(e.target.value)}
            placeholder="Describe the identified risk or governance finding..."
            rows={4}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-amber-400"
          />
        </div>

        {/* Recommendation */}
        <div className="md:col-span-2">
          <label className="text-sm text-slate-400">
            Recommended Action
          </label>

          <textarea
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
            placeholder="Describe the recommended remediation or control improvement..."
            rows={4}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-amber-400"
          />
        </div>

        {/* Treatment */}
        <div>
          <label className="text-sm text-slate-400">
            Risk Treatment
          </label>

          <select
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-400"
          >
            <option>Mitigate</option>
            <option>Accept</option>
            <option>Transfer</option>
            <option>Avoid</option>
          </select>
        </div>

        {/* Owner */}
        <div>
          <label className="text-sm text-slate-400">
            Remediation Owner
          </label>

          <input
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="text-sm text-slate-400">
            Remediation Due Date
          </label>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
        </div>

        {/* Status */}
        <div>
          <label className="text-sm text-slate-400">
            Remediation Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-400"
          >
            <option>Open</option>
            <option>In Progress</option>
            <option>Pending Validation</option>
            <option>Closed</option>
          </select>
        </div>

      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-300"
        >
          Save Remediation Action
        </button>
      </div>

    </section>
  );
}

function GovernanceControlForm({
  model,
  onClose,
  onSave,
}: {
  model: (typeof models)[number];
  onClose: () => void;
  onSave: (control: {
    modelName: string;
    framework: string;
    controlId: string;
    controlName: string;
    status: string;
    owner: string;
    evidence: string;
    lastReviewed: string;
  }) => void;
}) {
  const [framework, setFramework] = useState("NIST AI RMF");
  const [controlId, setControlId] = useState("");
  const [controlName, setControlName] = useState("");
  const [status, setStatus] = useState("Implemented");
  const [owner, setOwner] = useState(model.owner);
  const [evidence, setEvidence] = useState("");

  function handleSave() {
    onSave({
      modelName: model.name,
      framework,
      controlId,
      controlName,
      status,
      owner,
      evidence,
      lastReviewed: new Date().toISOString().split("T")[0],
    });
  }

  return (
    <section className="mt-8 rounded-2xl border border-cyan-400/20 bg-slate-900 p-6">

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium tracking-wider text-cyan-400">
            GOVERNANCE CONTROL MAPPING
          </p>

          <h3 className="mt-1 text-2xl font-semibold">
            {model.name}
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Map this AI system to governance and compliance controls.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-400 transition hover:border-slate-500 hover:text-white"
        >
          Close
        </button>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">

        {/* Framework */}
        <div>
          <label className="text-sm text-slate-400">
            Governance Framework
          </label>

          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
          >
            <option>NIST AI RMF</option>
            <option>ISO/IEC 42001</option>
            <option>Responsible AI</option>
            <option>Internal Governance</option>
          </select>
        </div>

        {/* Control ID */}
        <div>
          <label className="text-sm text-slate-400">
            Control ID
          </label>

          <input
            value={controlId}
            onChange={(e) => setControlId(e.target.value)}
            placeholder="Example: GOVERN 1.1"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
          />
        </div>

        {/* Control Name */}
        <div className="md:col-span-2">
          <label className="text-sm text-slate-400">
            Control Name
          </label>

          <input
            value={controlName}
            onChange={(e) => setControlName(e.target.value)}
            placeholder="Example: AI Governance Policy"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
          />
        </div>

        {/* Status */}
        <div>
          <label className="text-sm text-slate-400">
            Control Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
          >
            <option>Implemented</option>
            <option>Partially Implemented</option>
            <option>Gap</option>
            <option>Not Applicable</option>
          </select>
        </div>

        {/* Owner */}
        <div>
          <label className="text-sm text-slate-400">
            Control Owner
          </label>

          <input
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />
        </div>

        {/* Evidence */}
        <div className="md:col-span-2">
          <label className="text-sm text-slate-400">
            Evidence / Documentation
          </label>

          <textarea
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Describe the evidence supporting this control..."
            rows={4}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
          />
        </div>

      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Save Governance Control
        </button>
      </div>

    </section>
  );
}