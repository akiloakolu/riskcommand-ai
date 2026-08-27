"use client";

import { useMemo, useState } from "react";

import {
  addRisk,
  generateRiskId,
  RiskLevel,
  RiskTreatment,
} from "../../lib/riskStore";

const aiSystems = [
  "Customer Support AI",
  "Fraud Detection Model",
  "HR Candidate Screening",
  "Predictive Maintenance AI",
];

const categories = [
  "Privacy",
  "Security",
  "Compliance",
  "Bias & Fairness",
  "Operational",
  "Third-Party",
  "Model Risk",
];

const controls = [
  "Access Control",
  "Data Protection",
  "Human Oversight",
  "Model Monitoring",
  "Audit Logging",
  "Vendor Risk Management",
];

const treatmentOptions = [
  "Mitigate",
  "Accept",
  "Transfer",
  "Avoid",
];

function getRiskLevel(score: number): {
  label: RiskLevel;
  className: string;
} {
  if (score >= 15) {
    return {
      label: "High",
      className: "risk-high",
    };
  }

  if (score >= 7) {
    return {
      label: "Medium",
      className: "risk-medium",
    };
  }

  return {
    label: "Low",
    className: "risk-low",
  };
}

export default function RiskAssessmentPage() {
  const [aiSystem, setAiSystem] = useState(aiSystems[0]);
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");

  const [likelihood, setLikelihood] = useState(3);
  const [impact, setImpact] = useState(3);

  const [selectedControls, setSelectedControls] = useState<string[]>([]);
  const [controlEffectiveness, setControlEffectiveness] = useState(50);

  const [treatment, setTreatment] =
  useState<RiskTreatment>("Mitigate");

  const [owner, setOwner] = useState("");
  const [dueDate, setDueDate] = useState("");

  const inherentRisk = likelihood * impact;

  const residualRisk = useMemo(() => {
    const reduction = controlEffectiveness / 100;
    return Math.max(
      1,
      Math.round(inherentRisk * (1 - reduction))
    );
  }, [inherentRisk, controlEffectiveness]);

  const inherentLevel = getRiskLevel(inherentRisk);
  const residualLevel = getRiskLevel(residualRisk);

  function toggleControl(control: string) {
    setSelectedControls((current) =>
      current.includes(control)
        ? current.filter((item) => item !== control)
        : [...current, control]
    );
  }

function handleSubmit(event: React.FormEvent) {
  event.preventDefault();

  const riskId = generateRiskId();

  const inherentLevelValue = getRiskLevel(inherentRisk);
  const residualLevelValue = getRiskLevel(residualRisk);

  const newRisk = {
    id: riskId,

    aiSystem,

    category,

    description,

    likelihood,

    impact,

    inherentRisk,

    inherentLevel: inherentLevelValue.label,

    controls: selectedControls,

    controlEffectiveness,

    residualRisk,

    residualLevel: residualLevelValue.label,

    treatment,

    owner,

    dueDate,

    status: "Open" as const,

    createdAt: new Date().toISOString(),
  };

  addRisk(newRisk);

  console.log("Risk created:", newRisk);

  alert(`${riskId} created successfully.`);
}

  return (
    <main className="risk-page">
      <div className="risk-header">
        <div>
          <p className="eyebrow">RISK MANAGEMENT</p>

          <h1>Risk Assessment</h1>

          <p className="subtitle">
            Assess AI risks, evaluate controls, calculate residual exposure,
            and define the appropriate treatment strategy.
          </p>
        </div>

        <div className="framework-badge">
          NIST AI RMF
        </div>
      </div>

      <form onSubmit={handleSubmit} className="risk-layout">

        {/* LEFT SIDE */}

        <section className="risk-card">

          <div className="section-heading">
            <div>
              <p className="section-label">01</p>
              <h2>Risk Identification</h2>
            </div>
          </div>

          <div className="form-grid">

            <div className="field">
              <label>AI System</label>

              <select
                value={aiSystem}
                onChange={(e) => setAiSystem(e.target.value)}
              >
                {aiSystems.map((system) => (
                  <option key={system}>{system}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Risk Category</label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

          </div>

          <div className="field">
            <label>Risk Description</label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the potential risk to the organization..."
              rows={5}
            />
          </div>

          <div className="risk-matrix">

            <div className="field">
              <label>
                Likelihood
                <strong>{likelihood}</strong>
              </label>

              <input
                type="range"
                min="1"
                max="5"
                value={likelihood}
                onChange={(e) =>
                  setLikelihood(Number(e.target.value))
                }
              />

              <div className="range-labels">
                <span>Rare</span>
                <span>Almost Certain</span>
              </div>
            </div>

            <div className="field">
              <label>
                Impact
                <strong>{impact}</strong>
              </label>

              <input
                type="range"
                min="1"
                max="5"
                value={impact}
                onChange={(e) =>
                  setImpact(Number(e.target.value))
                }
              />

              <div className="range-labels">
                <span>Minor</span>
                <span>Severe</span>
              </div>
            </div>

          </div>

          <div className="risk-result">

            <div>
              <span>Inherent Risk</span>

              <strong>{inherentRisk}</strong>
            </div>

            <div className={`risk-pill ${inherentLevel.className}`}>
              {inherentLevel.label} Risk
            </div>

          </div>

        </section>

        {/* CONTROLS */}

        <section className="risk-card">

          <div className="section-heading">
            <div>
              <p className="section-label">02</p>
              <h2>Control Assessment</h2>
            </div>
          </div>

          <p className="helper">
            Select the controls currently mitigating this risk.
          </p>

          <div className="control-list">

            {controls.map((control) => (

              <label
                key={control}
                className={`control-option ${
                  selectedControls.includes(control)
                    ? "selected"
                    : ""
                }`}
              >

                <input
                  type="checkbox"
                  checked={selectedControls.includes(control)}
                  onChange={() => toggleControl(control)}
                />

                <span>{control}</span>

              </label>

            ))}

          </div>

          <div className="field">

            <label>
              Control Effectiveness

              <strong>{controlEffectiveness}%</strong>
            </label>

            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={controlEffectiveness}
              onChange={(e) =>
                setControlEffectiveness(Number(e.target.value))
              }
            />

          </div>

          <div className="risk-result residual">

            <div>
              <span>Residual Risk</span>

              <strong>{residualRisk}</strong>
            </div>

            <div className={`risk-pill ${residualLevel.className}`}>
              {residualLevel.label} Risk
            </div>

          </div>

        </section>

        {/* TREATMENT */}

        <section className="risk-card">

          <div className="section-heading">
            <div>
              <p className="section-label">03</p>
              <h2>Risk Treatment</h2>
            </div>
          </div>

          <div className="form-grid">

            <div className="field">

              <label>Treatment Strategy</label>

              <select
                value={treatment}
                onChange={(e) =>
                  setTreatment(e.target.value as RiskTreatment)
                }
              >
                {treatmentOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>

            </div>

            <div className="field">

              <label>Risk Owner</label>

              <input
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="e.g. Security & Risk"
              />

            </div>

          </div>

          <div className="field">

            <label>Target Remediation Date</label>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

          </div>

          <div className="treatment-summary">

            <div>
              <span>Treatment</span>
              <strong>{treatment}</strong>
            </div>

            <div>
              <span>Residual Exposure</span>
              <strong>
                {residualLevel.label}
              </strong>
            </div>

            <div>
              <span>Controls</span>
              <strong>
                {selectedControls.length}
              </strong>
            </div>

          </div>

          <button
            type="submit"
            className="primary-button"
          >
            Create Risk Assessment
          </button>

        </section>

      </form>
    </main>
  );
}