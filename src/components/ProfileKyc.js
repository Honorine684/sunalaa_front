"use client";

import { useEffect, useRef, useState } from "react";
import { usersApi, getApiError } from "@/lib/api";

const STATUS_CONFIG = {
  verified:      { label: "Verified",    bg: "#ECFDF5", color: "#059669" },
  approved:      { label: "Approved",    bg: "#ECFDF5", color: "#059669" },
  pending:       { label: "Processing",  bg: "#FFFBEB", color: "#D97706" },
  submitted:     { label: "Processing",  bg: "#FFFBEB", color: "#D97706" },
  in_review:     { label: "Under review", bg: "#EFF6FF", color: "#2563EB" },
  under_review:  { label: "Under review", bg: "#EFF6FF", color: "#2563EB" },
  reviewing:     { label: "Under review", bg: "#EFF6FF", color: "#2563EB" },
  rejected:      { label: "Rejected",    bg: "#FFF1F2", color: "#E11D48" },
  not_submitted: { label: "Not submitted", bg: "#F1F5F9", color: "#64748B" },
};

const DOC_TYPES = [
  { value: "national_id",      label: "National ID" },
  { value: "passport",         label: "Passport" },
  { value: "driving_license",  label: "Driving license" },
  { value: "residence_permit", label: "Residence permit" },
  { value: "other",            label: "Other document" },
];

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.not_submitted;
  return (
    <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span>
  );
}

function FilePickerField({ label, required, file, onChange, capture, uploading, uploaded }) {
  const ref = useRef(null);
  const borderColor = uploaded ? "#10B981" : file ? "#3B82F6" : "#CBD5E1";
  const bg = uploaded ? "#F0FDF4" : file ? "#EFF6FF" : "#FAFAFA";
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[13px] font-medium" style={{ color: "#45556C" }}>{label}{required && " *"}</label>
      <button type="button" onClick={() => !uploading && ref.current?.click()}
        className="flex items-center gap-2 border-2 border-dashed rounded-xl px-3 py-2.5 transition cursor-pointer text-left w-full"
        style={{ borderColor, backgroundColor: bg }}>
        {uploading ? (
          <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="4"/>
            <path className="opacity-75" fill="#3B82F6" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
        ) : uploaded ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
              stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        <span className="text-[13px] truncate" style={{ color: uploaded ? "#059669" : file ? "#3B82F6" : "#94A3B8" }}>
          {uploading ? "Uploading…" : uploaded ? "Uploaded ✓" : file ? file.name : "Choose a file"}
        </span>
      </button>
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp,application/pdf"
        {...(capture ? { capture } : {})}
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
    </div>
  );
}

export default function ProfileKyc() {
  const [kyc, setKyc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [docType, setDocType] = useState("national_id");
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);

  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [uploadingSelfie, setUploadingSelfie] = useState(false);
  const [frontUrl, setFrontUrl] = useState(null);
  const [backUrl, setBackUrl] = useState(null);
  const [selfieUrl, setSelfieUrl] = useState(null);

  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    usersApi.getKyc()
      .then((res) => setKyc(res.data?.data ?? res.data))
      .catch((err) => { if (err?.response?.status !== 404) setError(getApiError(err)); })
      .finally(() => setLoading(false));
  }, []);

  async function uploadFile(file, setUploading, setUrl) {
    if (!file) return null;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("document", file);
      const res = await usersApi.uploadKycDocument(fd);
      const url = (res.data?.data ?? res.data)?.url;
      setUrl(url);
      return url;
    } catch (err) {
      setFormError(`Upload error: ${getApiError(err)}`);
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function handleFrontChange(file) {
    setFrontFile(file); setFrontUrl(null);
    if (file) await uploadFile(file, setUploadingFront, setFrontUrl);
  }
  async function handleBackChange(file) {
    setBackFile(file); setBackUrl(null);
    if (file) await uploadFile(file, setUploadingBack, setBackUrl);
  }
  async function handleSelfieChange(file) {
    setSelfieFile(file); setSelfieUrl(null);
    if (file) await uploadFile(file, setUploadingSelfie, setSelfieUrl);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!frontUrl) {
      if (!frontFile) { setFormError("Front photo is required."); return; }
      setFormError("Front file is still uploading, please wait…"); return;
    }
    setSubmitting(true);
    try {
      const payload = {
        documentType: docType,
        documentFront: frontUrl,
        ...(backUrl   ? { documentBack: backUrl }  : {}),
        ...(selfieUrl ? { selfie: selfieUrl }       : {}),
      };
      await usersApi.submitKyc(payload);
      // Re-fetch pour avoir le vrai statut persisté côté backend
      const updated = await usersApi.getKyc();
      setKyc(updated.data?.data ?? updated.data);
      setShowForm(false);
      setFrontFile(null); setBackFile(null); setSelfieFile(null);
      setFrontUrl(null); setBackUrl(null); setSelfieUrl(null);
    } catch (err) {
      setFormError(getApiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  const rawStatus = (kyc?.status ?? kyc?.kycStatus ?? "").toLowerCase().replace(/ /g, "_") || null;
  const status = rawStatus ?? (kyc?.documentType ? "pending" : "not_submitted");
  const canSubmit = !["verified", "approved", "pending", "submitted", "in_review", "under_review", "reviewing"].includes(status);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            stroke="#1F4E46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h2 className="text-[16px] font-bold" style={{ color: "#1F4E46" }}>Identity verification (KYC)</h2>
      </div>

      {error && <p className="text-red-400 text-[13px] mb-3">{error}</p>}

      {loading ? (
        <div className="h-20 rounded-xl bg-slate-100 animate-pulse" />
      ) : (
        <>
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 mb-4">
            <div>
              <p className="text-[15px] font-semibold mb-1" style={{ color: "#0F172B" }}>KYC Status</p>
              {kyc?.documentType && (
                <p className="text-[13px]" style={{ color: "#64748B" }}>
                  Document: <span className="font-medium">{DOC_TYPES.find(d => d.value === kyc.documentType)?.label ?? kyc.documentType}</span>
                </p>
              )}
              {kyc?.reviewedAt && (
                <p className="text-[12px]" style={{ color: "#94A3B8" }}>
                  Reviewed on {new Date(kyc.reviewedAt).toLocaleDateString("en-US")}
                </p>
              )}
              {kyc?.rejectionReason && (
                <p className="text-[12px] mt-1" style={{ color: "#E11D48" }}>Reason: {kyc.rejectionReason}</p>
              )}
            </div>
            <StatusBadge status={status} />
          </div>

          {canSubmit && !showForm && (
            <button onClick={() => setShowForm(true)}
              className="w-full py-2.5 rounded-xl text-white text-[14px] font-semibold hover:brightness-90 transition cursor-pointer"
              style={{ backgroundColor: "#1F4E46" }}>
              Submit my documents
            </button>
          )}

          {canSubmit && showForm && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium" style={{ color: "#45556C" }}>Document type *</label>
                <select value={docType} onChange={(e) => setDocType(e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-secondary/30 bg-white"
                  style={{ color: "#0F172B" }}>
                  {DOC_TYPES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FilePickerField label="Front of document" required
                  file={frontFile} onChange={handleFrontChange}
                  capture="environment" uploading={uploadingFront} uploaded={!!frontUrl} />
                <FilePickerField label="Back of document"
                  file={backFile} onChange={handleBackChange}
                  capture="environment" uploading={uploadingBack} uploaded={!!backUrl} />
                <FilePickerField label="Selfie with document"
                  file={selfieFile} onChange={handleSelfieChange}
                  capture="user" uploading={uploadingSelfie} uploaded={!!selfieUrl} />
              </div>

              <p className="text-[11px]" style={{ color: "#94A3B8" }}>
                Accepted formats: JPG, PNG, WEBP, PDF. Max size: 10 MB.
              </p>

              {formError && <p className="text-red-400 text-[12px]">{formError}</p>}

              <div className="flex gap-2">
                <button type="button" onClick={() => { setShowForm(false); setFormError(""); }}
                  className="flex-1 py-2 rounded-xl text-[14px] border border-slate-200 hover:bg-white transition cursor-pointer"
                  style={{ color: "#45556C" }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting || uploadingFront || uploadingBack || uploadingSelfie}
                  className="flex-1 py-2 rounded-xl text-white text-[14px] font-semibold hover:brightness-90 transition cursor-pointer disabled:opacity-60"
                  style={{ backgroundColor: "#1F4E46" }}>
                  {submitting ? "Submitting…" : "Submit"}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
