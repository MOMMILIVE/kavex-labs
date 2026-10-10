"use client";

import { useRef, useState } from "react";
import { Arrow } from "./Brand";
import { translate, routeFor, type Language } from "../lib/i18n";

const commissions = [
  {
    name: "Engagement ring",
    caption: "A singular beginning.",
    image: "/assets/hand_setting.webp",
  },
  {
    name: "Wedding bands",
    caption: "Made for a lifetime.",
    image: "/assets/editorial_bands.webp",
  },
  {
    name: "Bespoke jewelry",
    caption: "A vision of your own.",
    image: "/assets/fancy_yellow.webp",
  },
];
const shapes = [
  "Oval",
  "Round",
  "Emerald",
  "Radiant",
  "Pear",
  "I need a recommendation",
];
const scales = [
  "1 - 2 Carats (Subtle)",
  "2 - 3 Carats (Statement)",
  "3 - 4 Carats (The Kavex Standard)",
  "4 - 5+ Carats (Bespoke)",
  "I need a recommendation",
];
const progressLabels = [
  "Your vision",
  "Centerpiece",
  "The scale",
  "Allocation",
  "Introduction",
];
const titles = [
  "What are we creating?",
  "Define the aesthetic.",
  "Define the carat weight.",
  "Define your allocation.",
  "A private introduction.",
];
const descriptions = [
  "Every commission starts with a vision. Tell us yours.",
  "Select her preferred diamond shape, or let our concierge guide you.",
  "Select the target scale for the centerpiece.",
  "Choose a comfortable budget. Your concierge will shape the brief with you.",
  "Your brief is ready. Introduce yourself to our private concierge.",
];
const budgets = [
  "25,000–45,000 Kr",
  "45,000–75,000 Kr",
  "75,000–100,000 Kr",
  "Let's discuss my vision",
];

function SelectionOptions({
  name,
  legend,
  options,
  value,
  onSelect,
  language,
}: {
  language: Language;
  name: string;
  legend: string;
  options: readonly string[];
  value: string;
  onSelect: (value: string) => void;
}) {
  return (
    <fieldset
      className={`budget-options ${name === "shape" ? "shape-options" : ""}`}
    >
      <legend className="sr-only">{translate(language, legend)}</legend>
      {options.map((item, i) => (
        <label
          key={item}
          className={`budget-option ${value === item ? "selected" : ""}`}
        >
          <input
            type="radio"
            name={name}
            value={item}
            checked={value === item}
            onChange={() => onSelect(item)}
          />
          <span className="micro">0{i + 1}</span>
          <span>{translate(language, item)}</span>
          <span className="radio-indicator" aria-hidden="true" />
        </label>
      ))}
    </fieldset>
  );
}

export default function VaultQuiz({
  language = "en",
}: {
  language?: Language;
}) {
  const t = (text: string) => translate(language, text);
  const [step, setStep] = useState(0);
  const [commission, setCommission] = useState("");
  const [shape, setShape] = useState("");
  const [scale, setScale] = useState("");
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [handoff, setHandoff] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  function goTo(next: number) {
    setStep(next);
    setError("");
    setHandoff(false);
    requestAnimationFrame(() => heading.current?.focus());
  }
  function continueStep() {
    if (step === 0 && !commission) {
      setError("Choose a commission to continue.");
      return;
    }
    if (step === 1 && !shape) {
      setError(
        "Choose a diamond shape or request a recommendation to continue.",
      );
      return;
    }
    if (step === 2 && !scale) {
      setError(
        "Choose a carat weight or request a recommendation to continue.",
      );
      return;
    }
    if (step === 3 && !budget) {
      setError("Choose a budget to continue.");
      return;
    }
    goTo(step + 1);
  }
  const message = [
    "Hello Kavex Labs — I would like to request a private vault allocation.",
    `Commission: ${commission}`,
    `Diamond shape: ${shape}`,
    `Carat weight: ${scale}`,
    `Budget: ${budget}`,
    `Name: ${name.trim()}`,
    `Phone: ${phone.trim()}`,
    "Preferred contact: iMessage / WhatsApp Concierge",
    `Language: ${language === "ar" ? "Arabic" : language === "no" ? "Norwegian" : "English"}`,
    "Source: The Manifesto",
  ].join("\n");
  // Existing site's concierge number. This opens a draft; the client sends it in WhatsApp.
  const whatsappUrl = `https://wa.me/4748900083?text=${encodeURIComponent(message)}`;

  return (
    <div className="quiz">
      <ol className="quiz-progress" aria-label={t("Request progress")}>
        {progressLabels.map((label, i) => (
          <li
            key={label}
            aria-current={step === i ? "step" : undefined}
            className={step >= i ? "active" : ""}
          >
            <span>0{i + 1}</span>
            <span>{t(label)}</span>
          </li>
        ))}
      </ol>
      <div className="quiz-step">
        <p className="micro chapter-label">
          {t("STEP")} <bdi dir="ltr">0{step + 1} / 05</bdi>
        </p>
        <h1 ref={heading} tabIndex={-1}>
          {t(titles[step])}
        </h1>
        <p className="quiz-description">{t(descriptions[step])}</p>
        {step === 0 ? (
          <fieldset className="vision-options">
            <legend className="sr-only">{t("Commission type")}</legend>
            {commissions.map((item) => (
              <label
                key={item.name}
                className={`vision-option ${commission === item.name ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="commission"
                  value={item.name}
                  checked={commission === item.name}
                  onChange={() => {
                    setCommission(item.name);
                    setError("");
                  }}
                />
                <img src={item.image} alt="" width="400" height="400" />
                <span className="option-detail">
                  <span>
                    <strong>{t(item.name)}</strong>
                    <span>{t(item.caption)}</span>
                  </span>
                  <span className="radio-indicator" aria-hidden="true" />
                </span>
              </label>
            ))}
          </fieldset>
        ) : null}
        {step === 1 ? (
          <SelectionOptions
            language={language}
            name="shape"
            legend="Preferred diamond shape"
            options={shapes}
            value={shape}
            onSelect={(value) => {
              setShape(value);
              setError("");
            }}
          />
        ) : null}
        {step === 2 ? (
          <SelectionOptions
            language={language}
            name="scale"
            legend="Target carat weight"
            options={scales}
            value={scale}
            onSelect={(value) => {
              setScale(value);
              setError("");
            }}
          />
        ) : null}
        {step === 3 ? (
          <SelectionOptions
            language={language}
            name="budget"
            legend="Comfortable budget in Kr"
            options={budgets}
            value={budget}
            onSelect={(value) => {
              setBudget(value);
              setError("");
            }}
          />
        ) : null}
        {step === 4 ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!name.trim()) {
                setError("Enter your name to prepare your introduction.");
                return;
              }
              const digits = phone.replace(/\D/g, "");
              if (
                !/^\+[\d\s().-]+$/.test(phone.trim()) ||
                digits.length < 7 ||
                digits.length > 15
              ) {
                setError(
                  "Enter your phone number with its country code, for example +47 489 00 083.",
                );
                return;
              }
              setError("");
              setHandoff(true);
            }}
            className="contact-form"
          >
            <div className="brief-summary">
              <span className="micro">{t("YOUR PRIVATE BRIEF")}</span>
              <span>{t(commission)}</span>
              <span>
                {t("Shape")}: {t(shape)}
              </span>
              <span>
                {t("Scale")}: {t(scale)}
              </span>
              <span>{t(budget)}</span>
            </div>
            <label>
              {t("Your name")}
              <input
                autoComplete="name"
                name="name"
                type="text"
                required
                maxLength={100}
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setHandoff(false);
                }}
                placeholder={t("Full name")}
              />
            </label>
            <label>
              {t("Phone Number (For iMessage / WhatsApp Concierge)")}
              <input
                autoComplete="tel"
                name="phone"
                type="tel"
                required
                maxLength={25}
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                  setHandoff(false);
                }}
                placeholder={t("+47 · Your number")}
                dir="ltr"
                aria-describedby="phone-note"
              />
            </label>
            <p id="phone-note" className="form-note">
              {t(
                "Include your country code. Your details will be included in your WhatsApp brief so the concierge can contact you by iMessage or WhatsApp.",
              )}
            </p>
            <label className="consent">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(event) => {
                  setConsent(event.target.checked);
                  setHandoff(false);
                }}
              />
              <span>
                {t(
                  "I agree to share this brief and my details with Kavex Labs via WhatsApp.",
                )}{" "}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  {t("Privacy policy ↗")}
                </a>
              </span>
            </label>
            {error ? (
              <p className="form-error" role="alert">
                {t(error)}
              </p>
            ) : null}
            {handoff && consent && name.trim() ? (
              <div className="handoff" role="status">
                <p>{t("Your introduction is ready.")}</p>
                <a
                  className="pill"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("Continue on WhatsApp")}
                  <Arrow diagonal />
                </a>
                <p className="form-note">
                  {t(
                    "WhatsApp opens with your brief. Tap send there to submit your request.",
                  )}
                </p>
              </div>
            ) : (
              <button className="pill" type="submit">
                {t("Prepare my introduction")}
                <Arrow />
              </button>
            )}
          </form>
        ) : null}
        {step < 4 && error ? (
          <p className="form-error" role="alert">
            {t(error)}
          </p>
        ) : null}
        <div className="quiz-actions">
          {step > 0 ? (
            <button
              type="button"
              className="text-button"
              onClick={() => goTo(step - 1)}
            >
              {t("← Back")}
            </button>
          ) : (
            <a className="text-button" href={routeFor(language, "manifesto")}>
              {t("← The manifesto")}
            </a>
          )}
          {step < 4 ? (
            <button type="button" className="pill" onClick={continueStep}>
              {t("Continue")}
              <Arrow />
            </button>
          ) : null}
        </div>
      </div>
      <noscript>
        <p>
          {t("Please enable JavaScript to complete the five-step request, or")}{" "}
          <a href="https://wa.me/4748900083">
            {t("contact the Kavex concierge on WhatsApp")}
          </a>
          .
        </p>
      </noscript>
    </div>
  );
}
