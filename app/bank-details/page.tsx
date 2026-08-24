"use client";

export const dynamic = "force-static";

import { useState } from "react";
import { invitationConfig as invitation } from "../invitation-config";

export default function BankDetailsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyValue = async (value: string, id: string) => {
    await navigator.clipboard.writeText(value.replaceAll(" ", ""));
    setCopied(id);
    window.setTimeout(() => setCopied((current) => (current === id ? null : current)), 1800);
  };

  return (
    <main className="bank-details-shell">
      <article className="bank-details-frame" aria-labelledby="bank-details-heading">
        <button
          type="button"
          className="bank-back-button"
          onClick={() => window.history.back()}
          aria-label="Back to the invitation"
        >
          <span aria-hidden="true">←</span>
        </button>

        <header className="bank-details-header">
          <h1 id="bank-details-heading">BANK DETAILS</h1>
        </header>

        <div className="bank-account-list">
          {invitation.arabicCeremony.gift.accounts.map((account, accountIndex) => (
            <section className="bank-account-card" aria-labelledby={`account-${accountIndex}`} key={account.name}>
              <h2 id={`account-${accountIndex}`}>{account.name}</h2>
              {(["iban", "bic"] as const).map((field) => {
                const id = `${accountIndex}-${field}`;
                const label = field.toUpperCase();
                const value = account[field];
                return (
                  <div className="bank-detail-row" key={field}>
                    <div>
                      <span className="bank-detail-label">{label}</span>
                      <strong dir="ltr">{value}</strong>
                    </div>
                    <button
                      type="button"
                      className="bank-copy-button"
                      onClick={() => void copyValue(value, id)}
                      aria-label={`Copy ${label} for ${account.name}`}
                    >
                      <span className="copy-icon" aria-hidden="true" />
                      <span>{copied === id ? "COPIED" : "COPY"}</span>
                    </button>
                  </div>
                );
              })}
            </section>
          ))}
        </div>
        <p className="copy-status" aria-live="polite">{copied ? "Copied to clipboard" : ""}</p>
      </article>
    </main>
  );
}
