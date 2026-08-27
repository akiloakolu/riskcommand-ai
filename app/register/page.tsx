"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getRisks,
  RiskRecord,
  addRemediation,
  generateRemediationId,
  RiskTreatment,
  RemediationStatus,
} from "../../lib/riskStore";

export default function RiskRegisterPage() {
  const [risks, setRisks] = useState<RiskRecord[]>([]);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const [selectedRisk, setSelectedRisk] =
  useState<RiskRecord | null>(null);

const [showRemediation, setShowRemediation] =
  useState(false);

const [remediationForm, setRemediationForm] =
  useState<{
    finding: string;
    recommendation: string;
    treatment: RiskTreatment;
    owner: string;
    dueDate: string;
    status: RemediationStatus;
  }>({
    finding: "",
    recommendation: "",
    treatment: "Mitigate",
    owner: "",
    dueDate: "",
    status: "Open",
  });

  useEffect(() => {
    setRisks(getRisks());
  }, []);

  const filteredRisks = useMemo(() => {
    return risks.filter((risk) => {
      const matchesSearch =
        risk.id.toLowerCase().includes(search.toLowerCase()) ||
        risk.aiSystem.toLowerCase().includes(search.toLowerCase()) ||
        risk.category.toLowerCase().includes(search.toLowerCase()) ||
        risk.owner.toLowerCase().includes(search.toLowerCase());

      const matchesLevel =
        levelFilter === "All" ||
        risk.residualLevel === levelFilter;

      const matchesStatus =
        statusFilter === "All" ||
        risk.status === statusFilter;

      return (
        matchesSearch &&
        matchesLevel &&
        matchesStatus
      );
    });
  }, [risks, search, levelFilter, statusFilter]);

  const summary = useMemo(() => {
    return {
      total: risks.length,

      high: risks.filter(
        (risk) => risk.residualLevel === "High"
      ).length,

      medium: risks.filter(
        (risk) => risk.residualLevel === "Medium"
      ).length,

      open: risks.filter(
        (risk) => risk.status !== "Closed"
      ).length,
    };
  }, [risks]);

  function handleCreateRemediation(
  event: React.FormEvent
) {
  event.preventDefault();

  if (!selectedRisk) {
    return;
  }

  if (
    !remediationForm.finding ||
    !remediationForm.recommendation ||
    !remediationForm.treatment ||
    !remediationForm.owner ||
    !remediationForm.dueDate
  ) {
    alert("Please complete all remediation fields.");
    return;
  }

  addRemediation({
  id: generateRemediationId(),
  riskId: selectedRisk.id,
  finding: remediationForm.finding,
  recommendation: remediationForm.recommendation,
  treatment: remediationForm.treatment,
  controls: selectedRisk.controls,
  owner: remediationForm.owner,
  dueDate: remediationForm.dueDate,
  status: remediationForm.status,
  createdAt: new Date().toISOString(),
});

  alert("Remediation created successfully.");

  setRemediationForm({
    finding: "",
    recommendation: "",
    treatment: "Mitigate",
    owner: "",
    dueDate: "",
    status: "Open",
  });

  setShowRemediation(false);
}

  return (
    <main className="risk-page">

      <div className="risk-header">

        <div>
          <p className="eyebrow">
            RISK MANAGEMENT
          </p>

          <h1>Risk Register</h1>

          <p className="subtitle">
            Centralized visibility into AI and technology
            risks, treatment decisions, ownership, and
            remediation status.
          </p>
        </div>

        <div className="framework-badge">
          Enterprise Risk Register
        </div>

      </div>

      {/* SUMMARY */}

      <section className="register-summary">

        <div className="summary-card">
          <span>Total Risks</span>
          <strong>{summary.total}</strong>
        </div>

        <div className="summary-card high-summary">
          <span>High Risk</span>
          <strong>{summary.high}</strong>
        </div>

        <div className="summary-card medium-summary">
          <span>Medium Risk</span>
          <strong>{summary.medium}</strong>
        </div>

        <div className="summary-card">
          <span>Open Risks</span>
          <strong>{summary.open}</strong>
        </div>

      </section>

      {/* FILTERS */}

      <section className="risk-card">

        <div className="register-toolbar">

          <input
            className="register-search"
            placeholder="Search risks, AI systems, categories, owners..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={levelFilter}
            onChange={(e) =>
              setLevelFilter(e.target.value)
            }
          >
            <option value="All">
              All Risk Levels
            </option>

            <option value="High">
              High
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="Low">
              Low
            </option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">
              All Statuses
            </option>

            <option value="Open">
              Open
            </option>

            <option value="In Treatment">
              In Treatment
            </option>

            <option value="Accepted">
              Accepted
            </option>

            <option value="Closed">
              Closed
            </option>
          </select>

        </div>

        {/* TABLE */}

        <div className="risk-table-wrapper">

          <table className="risk-table">

            <thead>
              <tr>
                <th>Risk ID</th>
                <th>AI System</th>
                <th>Category</th>
                <th>Inherent</th>
                <th>Residual</th>
                <th>Treatment</th>
                <th>Owner</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {filteredRisks.map((risk) => (

  <tr
    key={risk.id}
    onClick={() => setSelectedRisk(risk)}
    className="risk-row-clickable"
  >

                  <td>
                    <strong>
                      {risk.id}
                    </strong>
                  </td>

                  <td>
                    {risk.aiSystem}
                  </td>

                  <td>
                    {risk.category}
                  </td>

                  <td>
                    <span
                      className={`risk-pill ${
                        risk.inherentLevel === "High"
                          ? "risk-high"
                          : risk.inherentLevel ===
                            "Medium"
                          ? "risk-medium"
                          : "risk-low"
                      }`}
                    >
                      {risk.inherentRisk}
                      {" "}
                      {risk.inherentLevel}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`risk-pill ${
                        risk.residualLevel === "High"
                          ? "risk-high"
                          : risk.residualLevel ===
                            "Medium"
                          ? "risk-medium"
                          : "risk-low"
                      }`}
                    >
                      {risk.residualRisk}
                      {" "}
                      {risk.residualLevel}
                    </span>
                  </td>

                  <td>
                    {risk.treatment}
                  </td>

                  <td>
                    {risk.owner || "Unassigned"}
                  </td>

                  <td>
                    <span className="status-badge">
                      {risk.status}
                    </span>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredRisks.length === 0 && (

            <div className="empty-register">

              <div className="empty-icon">
                R
              </div>

              <h3>
                No risks found
              </h3>

              <p>
                Risk assessments created through the
                Risk Assessment workflow will appear
                here.
              </p>

            </div>

          )}

           </div>
  </section>

  {/* STEP 3 — RISK DETAILS PANEL */}
  {selectedRisk && (
    <div className="risk-details-overlay">

      <div className="risk-details-panel">

        <div className="risk-details-header">

          <div>
            <p className="eyebrow">
              RISK DETAIL
            </p>

            <h2>
              {selectedRisk.id}
            </h2>

            <p className="risk-details-subtitle">
              {selectedRisk.aiSystem}
            </p>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={() => setSelectedRisk(null)}
          >
            ×
          </button>

        </div>

        <div className="risk-details-grid">

          <div className="detail-item">
            <span>AI System</span>
            <strong>{selectedRisk.aiSystem}</strong>
          </div>

          <div className="detail-item">
            <span>Category</span>
            <strong>{selectedRisk.category}</strong>
          </div>

          <div className="detail-item">
            <span>Inherent Risk</span>
            <strong>
              {selectedRisk.inherentRisk} ({selectedRisk.inherentLevel})
            </strong>
          </div>

          <div className="detail-item">
            <span>Residual Risk</span>
            <strong>
              {selectedRisk.residualRisk} ({selectedRisk.residualLevel})
            </strong>
          </div>

          <div className="detail-item">
            <span>Treatment</span>
            <strong>{selectedRisk.treatment}</strong>
          </div>

          <div className="detail-item">
            <span>Risk Owner</span>
            <strong>{selectedRisk.owner || "Unassigned"}</strong>
          </div>

          <div className="detail-item">
            <span>Status</span>
            <strong>{selectedRisk.status}</strong>
          </div>

          <div className="detail-item">
            <span>Assessment Date</span>
            <strong>
  {selectedRisk.createdAt
    ? new Date(selectedRisk.createdAt).toLocaleDateString()
    : "N/A"}
</strong>
          </div>

        </div>

        <div className="risk-detail-section">

          <h3>Risk Description</h3>

          <p>
            {selectedRisk.description ||
              "No risk description was provided."}
          </p>

        </div>

        <div className="risk-detail-section">

          <h3>Controls</h3>

          {selectedRisk.controls &&
          selectedRisk.controls.length > 0 ? (

            <div className="control-list">

              {selectedRisk.controls.map(
                (control: any, index: number) => (

                  <div
                    key={index}
                    className="control-item"
                  >
                    <strong>
                      {control.controlName ||
                        control.name ||
                        `Control ${index + 1}`}
                    </strong>

                    <span>
                      {control.status ||
                        "Control selected"}
                    </span>
                  </div>

                )
              )}

            </div>

          ) : (

            <p>
              No controls recorded.
            </p>

          )}

        </div>

        <div className="risk-detail-section">

          <h3>Treatment Strategy</h3>

          <p>
            {selectedRisk.treatment ||
              "No treatment strategy recorded."}
          </p>

        </div>

        <div className="risk-details-footer">

  <button
    type="button"
    className="secondary-button"
    onClick={() => setSelectedRisk(null)}
  >
    Close
  </button>

  <button
  type="button"
  className="primary-button"
  onClick={() => {
    setRemediationForm({
      finding: "",
      recommendation: "",
      treatment: selectedRisk.treatment || "",
      owner: selectedRisk.owner || "",
      dueDate: "",
      status: "Open",
    });

    setShowRemediation(true);
  }}
>
  Create Remediation
</button>

</div>

      </div>

    </div>
  )}

  {showRemediation && selectedRisk && (
  <div className="risk-details-overlay">

    <div className="risk-details-panel">

      <div className="risk-details-header">

        <div>
          <p className="eyebrow">
            REMEDIATION
          </p>

          <h2>
            Create Remediation
          </h2>

          <p className="risk-details-subtitle">
            {selectedRisk.id} — {selectedRisk.aiSystem}
          </p>
        </div>

        <button
          type="button"
          className="close-button"
          onClick={() => setShowRemediation(false)}
        >
          ×
        </button>

      </div>

      <div className="risk-detail-section">

        <h3>Remediation Details</h3>

        <div className="risk-details-grid">

          <div className="detail-item">
            <span>Risk ID</span>
            <strong>{selectedRisk.id}</strong>
          </div>

          <div className="detail-item">
            <span>Risk Level</span>
            <strong>
              {selectedRisk.residualRisk} (
              {selectedRisk.residualLevel})
            </strong>
          </div>

        </div>

      </div>

      <div className="risk-detail-section">

        <label>Finding</label>

        <textarea
          className="remediation-input"
          placeholder="Describe the finding that requires remediation..."
          value={remediationForm.finding}
          onChange={(e) =>
            setRemediationForm({
              ...remediationForm,
              finding: e.target.value,
            })
          }
        />

      </div>

      <div className="risk-detail-section">

        <label>Recommendation</label>

        <textarea
          className="remediation-input"
          placeholder="Describe the recommended corrective action..."
          value={remediationForm.recommendation}
          onChange={(e) =>
            setRemediationForm({
              ...remediationForm,
              recommendation: e.target.value,
            })
          }
        />

      </div>

      <div className="risk-details-grid">

        <div className="detail-item">

          <label>Treatment</label>

          <select
            className="remediation-input"
            value={remediationForm.treatment}
            onChange={(e) =>
              setRemediationForm({
                ...remediationForm,
                treatment: (e.target.value as RiskTreatment) || "Mitigate",
              })
            }
          >
            <option value="">
              Select treatment
            </option>

            <option value="Mitigate">
              Mitigate
            </option>

            <option value="Accept">
              Accept
            </option>

            <option value="Transfer">
              Transfer
            </option>

            <option value="Avoid">
              Avoid
            </option>

          </select>

        </div>

        <div className="detail-item">

          <label>Owner</label>

          <input
            className="remediation-input"
            type="text"
            placeholder="Remediation owner"
            value={remediationForm.owner}
            onChange={(e) =>
              setRemediationForm({
                ...remediationForm,
                owner: e.target.value,
              })
            }
          />

        </div>

        <div className="detail-item">

          <label>Due Date</label>

          <input
            className="remediation-input"
            type="date"
            value={remediationForm.dueDate}
            onChange={(e) =>
              setRemediationForm({
                ...remediationForm,
                dueDate: e.target.value,
              })
            }
          />

        </div>

        <div className="detail-item">

          <label>Status</label>

          <select
            className="remediation-input"
            value={remediationForm.status}
            onChange={(e) =>
              setRemediationForm({
                ...remediationForm,
                status: e.target.value as RemediationStatus,
              })
            }
          >
            <option value="Open">
              Open
            </option>

            <option value="In Treatment">
              In Treatment
            </option>

            <option value="Accepted">
              Accepted
            </option>

            <option value="Closed">
              Closed
            </option>

          </select>

        </div>

      </div>

      <div className="risk-details-footer">

        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            setShowRemediation(false)
          }
        >
          Cancel
        </button>

        <button
          type="button"
          className="primary-button"
          onClick={() => {

  if (
    !remediationForm.finding ||
    !remediationForm.recommendation ||
    !remediationForm.owner ||
    !remediationForm.dueDate
  ) {
    alert(
      "Please complete the required remediation fields."
    );

    return;
  }

  const newRemediation = {
    id: generateRemediationId(),
    riskId: selectedRisk.id,
    finding: remediationForm.finding,
    recommendation: remediationForm.recommendation,
    treatment: remediationForm.treatment,
    controls: selectedRisk.controls,
    owner: remediationForm.owner,
    dueDate: remediationForm.dueDate,
    status: remediationForm.status,
    createdAt: new Date().toISOString(),
  };

  addRemediation(newRemediation);

  alert(
    `Remediation ${newRemediation.id} created for ${selectedRisk.id}`
  );

  setShowRemediation(false);
}}
        >
          Create Remediation
        </button>

      </div>

    </div>

  </div>
)}

</main>
);
}
