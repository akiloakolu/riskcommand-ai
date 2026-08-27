"use client";

import { useEffect, useMemo, useState } from "react";

import {
  addRemediation,
  generateRemediationId,
  getRemediations,
  RemediationRecord,
  RiskTreatment,
  RemediationStatus,
} from "../../lib/riskStore";

export default function RemediationPage() {
  const [remediations, setRemediations] = useState<RemediationRecord[]>([]);

  const [riskId, setRiskId] = useState("");
  const [finding, setFinding] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [treatment, setTreatment] =
    useState<RiskTreatment>("Mitigate");
  const [owner, setOwner] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] =
    useState<RemediationStatus>("Open");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    setRemediations(getRemediations());
  }, []);

  function isOverdue(remediation: RemediationRecord) {
    if (
      remediation.status === "Completed" ||
      !remediation.dueDate
    ) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(remediation.dueDate);
    due.setHours(0, 0, 0, 0);

    return due < today;
  }

  function getDisplayStatus(
    remediation: RemediationRecord
  ): RemediationStatus {
    if (
      remediation.status !== "Completed" &&
      isOverdue(remediation)
    ) {
      return "Overdue";
    }

    return remediation.status;
  }

  const summary = useMemo(() => {
    return {
      total: remediations.length,

      open: remediations.filter(
        (remediation) =>
          getDisplayStatus(remediation) === "Open"
      ).length,

      inProgress: remediations.filter(
        (remediation) =>
          getDisplayStatus(remediation) === "In Progress"
      ).length,

      completed: remediations.filter(
        (remediation) =>
          getDisplayStatus(remediation) === "Completed"
      ).length,

      overdue: remediations.filter(
        (remediation) =>
          getDisplayStatus(remediation) === "Overdue"
      ).length,
    };
  }, [remediations]);

  const filteredRemediations = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return remediations.filter((remediation) => {
      const matchesSearch =
        !searchValue ||
        remediation.id
          .toLowerCase()
          .includes(searchValue) ||
        remediation.riskId
          .toLowerCase()
          .includes(searchValue) ||
        remediation.finding
          .toLowerCase()
          .includes(searchValue) ||
        remediation.recommendation
          .toLowerCase()
          .includes(searchValue) ||
        remediation.owner
          .toLowerCase()
          .includes(searchValue);

      const displayStatus =
        getDisplayStatus(remediation);

      const matchesStatus =
        statusFilter === "All" ||
        displayStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [remediations, search, statusFilter]);

  function handleSubmit(event: React.FormEvent) {
  event.preventDefault();

 const remediation: RemediationRecord = {
  id: generateRemediationId(),
  riskId: riskId.trim(),
  finding: finding.trim(),
  recommendation: recommendation.trim(),
  treatment,
  controls: [],
  owner: owner.trim(),
  dueDate,
  status,
  createdAt: new Date().toISOString(),
};

  addRemediation(remediation);

  setFinding("");
  setRecommendation("");
  setRiskId("");
  setTreatment("Mitigate");
  setOwner("");
  setDueDate("");
  setStatus("Open");

  alert(`Remediation ${remediation.id} created successfully.`);

  window.location.reload();
}

  return (
    <main className="risk-page">

      {/* HEADER */}
      <div className="risk-header">

        <div>
          <p className="eyebrow">
            RISK MANAGEMENT
          </p>

          <h1>
            Remediation Management
          </h1>

          <p className="subtitle">
            Track findings, corrective actions,
            ownership, deadlines, and remediation
            status.
          </p>
        </div>

        <div className="framework-badge">
          Enterprise Remediation
        </div>

      </div>


      {/* SUMMARY */}
      <section className="register-summary">

        <div className="summary-card">
          <span>Total Remediations</span>
          <strong>{summary.total}</strong>
        </div>

        <div className="summary-card">
          <span>Open</span>
          <strong>{summary.open}</strong>
        </div>

        <div className="summary-card medium-summary">
          <span>In Progress</span>
          <strong>{summary.inProgress}</strong>
        </div>

        <div className="summary-card">
          <span>Completed</span>
          <strong>{summary.completed}</strong>
        </div>

        <div className="summary-card high-summary">
          <span>Overdue</span>
          <strong>{summary.overdue}</strong>
        </div>

      </section>


      {/* CREATE REMEDIATION */}
      <form
        onSubmit={handleSubmit}
        className="risk-layout"
      >

        {/* REMEDIATION DETAILS */}
        <section className="risk-card">

          <div className="section-heading">

            <div>

              <p className="section-label">
                01
              </p>

              <h2>
                Remediation Details
              </h2>

            </div>

          </div>


          <div className="form-grid">

            <div className="field">

              <label>
                Risk ID
              </label>

              <input
                type="text"
                value={riskId}
                onChange={(e) =>
                  setRiskId(e.target.value)
                }
                placeholder="e.g. RISK-0001"
                required
              />

            </div>


            <div className="field">

              <label>
                Finding
              </label>

              <textarea
                value={finding}
                onChange={(e) =>
                  setFinding(e.target.value)
                }
                placeholder="Describe the identified risk or control finding..."
                rows={5}
                required
              />

            </div>


            <div className="field">

              <label>
                Recommendation
              </label>

              <textarea
                value={recommendation}
                onChange={(e) =>
                  setRecommendation(e.target.value)
                }
                placeholder="Describe the recommended corrective action..."
                rows={5}
                required
              />

            </div>

          </div>

        </section>


        {/* TREATMENT */}
        <section className="risk-card">

          <div className="section-heading">

            <div>

              <p className="section-label">
                02
              </p>

              <h2>
                Treatment & Ownership
              </h2>

            </div>

          </div>


          <div className="form-grid">

            <div className="field">

              <label>
                Treatment Strategy
              </label>

              <select
                value={treatment}
                onChange={(e) =>
                  setTreatment(
                    e.target.value as RiskTreatment
                  )
                }
              >

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


            <div className="field">

              <label>
                Remediation Owner
              </label>

              <input
                type="text"
                value={owner}
                onChange={(e) =>
                  setOwner(e.target.value)
                }
                placeholder="Enter responsible owner..."
                required
              />

            </div>


            <div className="field">

              <label>
                Due Date
              </label>

              <input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(e.target.value)
                }
                required
              />

            </div>


            <div className="field">

              <label>
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as RemediationStatus
                  )
                }
              >

                <option value="Open">
                  Open
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Overdue">
                  Overdue
                </option>

              </select>

            </div>

          </div>


          <div className="treatment-summary">

            <div>
              <span>Treatment</span>
              <strong>{treatment}</strong>
            </div>

            <div>
              <span>Owner</span>
              <strong>
                {owner || "Unassigned"}
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{status}</strong>
            </div>

          </div>

        </section>


        {/* SUBMIT */}
        <section className="risk-card">

          <div className="risk-details-footer">

            <div>
              <p className="section-label">
                REMEDIATION WORKFLOW
              </p>

              <p className="subtitle">
                Create and track the corrective
                action associated with this risk.
              </p>
            </div>

            <button
              type="submit"
              className="primary-button"
            >
              Create Remediation
            </button>

          </div>

        </section>

      </form>


      {/* REMEDIATION REGISTER */}
      <section className="risk-card">

        <div className="section-heading">

          <div>

            <p className="section-label">
              03
            </p>

            <h2>
              Remediation Register
            </h2>

          </div>

        </div>


        {/* FILTERS */}
        <div className="register-toolbar">

          <input
            className="register-search"
            placeholder="Search remediation, risk ID, findings, owners..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />


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

            <option value="In Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Overdue">
              Overdue
            </option>

          </select>

        </div>


        {/* TABLE */}
        <div className="risk-table-wrapper">

          <table className="risk-table">

            <thead>

              <tr>

                <th>
                  Remediation ID
                </th>

                <th>
                  Risk ID
                </th>

                <th>
                  Finding
                </th>

                <th>
                  Treatment
                </th>

                <th>
                  Owner
                </th>

                <th>
                  Due Date
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredRemediations.length > 0 ? (

                filteredRemediations.map(
                  (remediation) => {

                    const displayStatus =
                      getDisplayStatus(
                        remediation
                      );

                    return (
                      <tr
                        key={remediation.id}
                      >

                        <td>
                          <strong>
                            {remediation.id}
                          </strong>
                        </td>

                        <td>
                          {remediation.riskId}
                        </td>

                        <td>
                          {remediation.finding}
                        </td>

                        <td>
                          {remediation.treatment}
                        </td>

                        <td>
                          {remediation.owner}
                        </td>

                        <td>
                          {remediation.dueDate}
                        </td>

                        <td>

                          <span className="status-badge">
                            {displayStatus}
                          </span>

                        </td>

                      </tr>
                    );
                  }
                )

              ) : (

                <tr>

                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "50px",
                    }}
                  >

                    <div>
                      <strong>
                        No remediations found
                      </strong>

                      <p className="subtitle">
                        Create a remediation above
                        and it will appear here.
                      </p>
                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </section>

    </main>
  );
}