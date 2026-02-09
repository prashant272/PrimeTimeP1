import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiX, FiRefreshCcw } from "react-icons/fi";
import { Crown } from "lucide-react";
import { createNomination, fetchNominationById, updateUserNomination } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const categoryMap = {
  Hospital: {
    "Overall Excellence": [
      "Best Hospital of the Year",
      "Excellence in Healthcare Services",
      "Outstanding Multi-Specialty Hospital",
      "Most Trusted Hospital Brand",
      "Hospital Excellence Award",
    ],
    "Specialty-Based Awards": [
      "Best Cardiac Care Hospital",
      "Best Cancer Care Hospital",
      "Best Mother & Child Care Hospital",
      "Best Orthopaedic Hospital",
      "Best Neurology & Neurosurgery Hospital",
      "Best Kidney Care / Nephrology Hospital",
      "Best Eye Care Hospital",
      "Best Dental Hospital",
      "Best Trauma & Emergency Care Hospital",
    ],
    "Innovation & Technology": [
      "Most Innovative Hospital",
      "Excellence in Medical Technology Adoption",
      "Best Digital Healthcare Initiative",
      "AI & Smart Healthcare Excellence Award",
      "Best Hospital for Robotic Surgery",
    ],
    "Patient Care & Quality": [
      "Best Patient Care Hospital",
      "Excellence in Patient Safety",
      "Best Hospital for Patient Satisfaction",
      "Quality Care Excellence Award",
      "Compassionate Care Award",
    ],
    "Social Impact & Ethics": [
      "Community Healthcare Excellence Award",
      "CSR in Healthcare Award",
      "Affordable Healthcare Excellence Award",
      "Rural Healthcare Excellence Award",
      "Public Health Impact Award",
    ],
    "Management & Leadership": [
      "Best Hospital Management Team",
      "Healthcare Leadership Excellence Award",
      "Best Hospital Administration",
      "Excellence in Healthcare Operations",
    ],
    "Category by Hospital Type": [
      "Best Government Hospital",
      "Best Private Hospital",
      "Best Teaching Hospital",
      "Best NABH Accredited Hospital",
      "Best Emerging Hospital",
    ],
  },
  Clinic: {
    "Overall Excellence": [
      "Best Clinic of the Year",
      "Excellence in Primary Care",
      "Most Trusted Clinic Brand",
      "Clinic Excellence Award",
    ],
    "Specialty-Based Awards": [
      "Best Dental Clinic",
      "Best IVF / Fertility Clinic",
      "Best Skin & Cosmetology Clinic",
      "Best Orthopaedic Clinic",
      "Best Eye Care Clinic",
      "Best Pediatric Clinic",
      "Best Physiotherapy Clinic",
      "Best AYUSH Clinic",
    ],
    "Innovation & Technology": [
      "Most Innovative Clinic",
      "Excellence in Digital Health Adoption",
      "Best Clinic for Holistic Health",
    ],
    "Patient Care & Quality": [
      "Best Patient Care Clinic",
      "Excellence in Patient Safety (Clinic)",
      "Best Clinic for Patient Satisfaction",
      "Compassionate Care Clinic Award",
    ],
    "Accessibility & Outreach": [
      "Affordable Healthcare Clinic Award",
      "Community Outreach Excellence Award",
      "Best Emerging Clinic",
    ],
  },
  "Diagnostic Center": {
    "Overall Excellence": [
      "Best Diagnostic Center of the Year",
      "Diagnostic Excellence Award",
      "Most Trusted Diagnostic Brand",
      "Outstanding Diagnostic Center",
    ],
    "Service-Based Awards": [
      "Best Pathology Lab",
      "Best Imaging Center",
      "Best Radiology Center",
      "Best Preventive Health Checkup Center",
      "Best Advanced Diagnostic Facility",
    ],
    "Quality & Accuracy": [
      "Excellence in Diagnostic Accuracy",
      "Best Diagnostic Center for Patient Satisfaction",
      "Patient Safety Excellence Award (Diagnostics)",
      "Fast & Reliable Reporting Award",
    ],
    "Type & Accreditation": [
      "Best NABL Accredited Lab",
      "Best Standalone Diagnostic Center",
      "Best Hospital-Affiliated Diagnostic Center",
      "Best Emerging Diagnostic Center",
    ],
  },
  "Individual / Organization": {
    "Individual Excellence": [
      "Best Doctor of the Year",
      "Best Surgeon",
      "Best Specialist Doctor",
      "Emerging Doctor of the Year",
      "Lifetime Achievement in Healthcare",
    ],
    "Organization / Company": [
      "Best Pharma Company",
      "Best Generic Medicine Brand",
      "Best Medical Device Company",
      "Best Healthcare Organization",
      "Excellence in Pharma Research",
    ],
    "Startup & Innovation": [
      "Best Healthcare Startup",
      "Best HealthTech Innovation",
      "Best Digital Health Platform",
      "AI Innovation in Healthcare Award",
    ],
    "Social Impact": [
      "Community Healthcare Excellence Award",
      "CSR in Healthcare Award",
      "Rural Healthcare Excellence Award",
      "Public Health Impact Award",
    ],
  },
};

const initialForm = {
  participationType: "nominated as award", // default
  category: "",
  subCategory: "",
  otherSubCategory: "",
  nomineeName: "",
  organization: "",
  designation: "", // for simple form
  mobile: "",      // for simple form
  email: "",       // for simple form

  orgHeadName: "",
  orgHeadDesignation: "",
  orgHeadMobile: "",
  orgHeadEmail: "",

  contactName: "",
  contactDesignation: "",
  contactMobile: "",
  contactEmail: "",

  website: "",
  turnover: "",

  street: "",
  city: "",
  state: "",
  zip: "",

  preferredLocation: "",
  remarks: "",
  acceptTerms: false,
};

export default function NominationForm() {
  const { id } = useParams();
  const { token, user: authUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const inputRef = useRef({});

  const isEditMode = !!id;

  // Load existing nomination if editing
  useEffect(() => {
    if (isEditMode && token) {
      const load = async () => {
        try {
          setLoading(true);
          const data = await fetchNominationById(id, token);

          if (data.status !== "nominated") {
            setError("This nomination can no longer be edited.");
            return;
          }

          // Merge fetched data with initial form structure
          setForm(prev => ({
            ...prev,
            ...data,
            // Ensure category mapping is handled
            subCategory: data.subCategory || "",
            otherSubCategory: data.otherSubCategory || "",
            acceptTerms: false, // User must re-accept terms for update
          }));
        } catch (err) {
          setError(err.message || "Failed to load nomination data");
        } finally {
          setLoading(false);
        }
      };
      load();
    }
  }, [id, token, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Clear field specific error
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    if (name === "participationType") {
      setForm(() => ({
        ...initialForm,
        participationType: value,
      }));
      setFieldErrors({});
      return;
    }

    if (name === "category") {
      setForm((prev) => ({
        ...prev,
        category: value,
        subCategory: "",
        otherSubCategory: "",
      }));
      return;
    }

    if (name === "subCategory") {
      setForm((prev) => ({
        ...prev,
        subCategory: value,
        otherSubCategory: value === "Other" ? prev.otherSubCategory : "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    const requiredAward = [
      "category", "subCategory", "nomineeName", "organization",
      "orgHeadName", "orgHeadDesignation", "orgHeadMobile", "orgHeadEmail",
      "contactName", "contactDesignation", "contactMobile", "contactEmail",
      "street", "city", "state", "zip"
    ];
    const requiredOther = ["nomineeName", "organization", "designation", "mobile", "email"];

    const list = form.participationType === "nominated as award" ? requiredAward : requiredOther;

    list.forEach(field => {
      if (!form[field] || (typeof form[field] === "string" && form[field].trim() === "")) {
        errors[field] = "Required";
      }
    });

    if (form.participationType === "nominated as award" && form.subCategory === "Other" && !form.otherSubCategory) {
      errors.otherSubCategory = "Specify category";
    }

    if (!form.acceptTerms) {
      errors.acceptTerms = "Required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      alert("Please fill all mandatory fields marked in red.");
      // Scroll to first error field
      const firstError = Object.keys(validateForm() ? {} : fieldErrors)[0];
      // Need a fresh validation or use state (state is async, so better re-calc or use result of direct validation)
      const currentErrors = {};
      const requiredAward = ["category", "subCategory", "nomineeName", "organization", "orgHeadName", "orgHeadDesignation", "orgHeadMobile", "orgHeadEmail", "contactName", "contactDesignation", "contactMobile", "contactEmail", "street", "city", "state", "zip"];
      const requiredOther = ["nomineeName", "organization", "designation", "mobile", "email"];
      const list = form.participationType === "nominated as award" ? requiredAward : requiredOther;
      list.forEach(f => { if (!form[f]) currentErrors[f] = true; });
      if (form.participationType === "nominated as award" && form.subCategory === "Other" && !form.otherSubCategory) currentErrors.otherSubCategory = true;
      if (!form.acceptTerms) currentErrors.acceptTerms = true;

      const keys = Object.keys(currentErrors);
      if (keys.length > 0 && inputRef.current[keys[0]]) {
        inputRef.current[keys[0]].scrollIntoView({ behavior: "smooth", block: "center" });
        inputRef.current[keys[0]].focus();
      }
      return;
    }

    try {
      setSubmitting(true);
      if (isEditMode) {
        await updateUserNomination(id, form, token);
        navigate(`/nomination/${id}`); // Back to details
      } else {
        await createNomination(form, token);
        setForm(initialForm);
        navigate("/success");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const groupedSubCategories = categoryMap[form.category] || {};

  const getSelectClass = (name) => {
    const base = "w-full bg-black/60 border rounded-lg px-4 py-3 text-white outline-none transition-all focus:ring-2 focus:ring-[#d4af37]/50";
    const errorClass = fieldErrors[name] ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" : "border-white/20 hover:border-[#d4af37]/40";
    return `${base} ${errorClass}`;
  };

  const getInputClass = (name) => {
    const base = "w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition-all focus:bg-white/10 focus:ring-2 focus:ring-[#d4af37]/50";
    const errorClass = fieldErrors[name] ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" : "border-white/20 hover:border-[#d4af37]/40";
    return `${base} ${errorClass}`;
  };

  return (
    <div className="min-h-screen py-7 sm:py-30 pb-32 relative overflow-hidden bg-[#3a1418]">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#d4af37] opacity-[0.03] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#d4af37] opacity-[0.03] rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="mb-8 flex justify-between items-center">
          <button
            onClick={() => isEditMode ? navigate(-1) : navigate("/")}
            className="flex items-center gap-2 text-[#d4af37] hover:text-[#f2d06b] transition-colors font-bold uppercase tracking-widest text-xs"
          >
            <FiArrowLeft className="text-lg" /> {isEditMode ? "Go Back" : "Back to Home"}
          </button>
          {authUser && (
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-white/5 py-1 px-3 rounded-full border border-white/10">
              Authenticated: {authUser.email}
            </p>
          )}
        </div>

        <div className="mb-8 md:mb-12 text-center relative">
          {/* Header Decorations */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-[#d4af37] animate-pulse" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f2d06b] to-[#c62828] uppercase tracking-tighter leading-none px-2">
              {isEditMode ? "Update Nomination" : "Healthcare Excellence Awards"}
            </h1>
            <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-[#d4af37] animate-pulse" />
          </div>

          <div className="h-1 w-24 md:w-32 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto rounded-full mb-8"></div>

          <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg font-light leading-relaxed px-4 italic">
            {isEditMode
              ? "Refine your submission to ensure every detail shines for the jury review."
              : "Honor the pioneers, celebrate the innovators. Register your presence or nominate for excellence in the healthcare sector."
            }
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-center">
            <p className="font-bold flex items-center justify-center gap-2">
              <span className="text-lg">⚠️</span> {error}
            </p>
          </div>
        )}

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">

            {/* Participation Choice */}
            <div className="md:col-span-2 space-y-4">
              <label className="text-sm font-bold text-[#d4af37] uppercase tracking-widest pl-1">
                Choose Your Presence Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { id: "nominated as award", label: "Nominated as Award", icon: "🏆" },
                  { id: "attend as speaker", label: "Attend as Speaker", icon: "🎤" },
                  { id: "attend as exhibitor", label: "Attend as Exhibitor", icon: "🎪" },
                  { id: "attend as sponsor", label: "Attend as Sponsor", icon: "💎" },
                ].map((type) => (
                  <label
                    key={type.id}
                    className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300
                      ${form.participationType === type.id
                        ? "bg-gradient-to-br from-[#d4af37] to-[#b8860b] border-transparent text-black scale-105 shadow-[0_15px_30px_rgba(212,175,55,0.2)]"
                        : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/20"
                      }`}
                  >
                    <input
                      type="radio"
                      name="participationType"
                      value={type.id}
                      checked={form.participationType === type.id}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <span className={`text-2xl mb-2 transition-transform group-hover:scale-125 ${form.participationType === type.id ? "scale-110" : ""}`}>
                      {type.icon}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-center">
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {form.participationType === "nominated as award" ? (
              <>
                {/* Category Selection Block */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/5">
                  <div className="sm:col-span-2 mb-2">
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#d4af37]"></span> Award Classification
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Primary Category *</label>
                    <select
                      name="category"
                      ref={el => inputRef.current.category = el}
                      value={form.category}
                      onChange={handleChange}
                      className={getSelectClass("category")}
                    >
                      <option value="" className="bg-[#3a1418]">-- Select Sector --</option>
                      {Object.keys(categoryMap).map((t) => (
                        <option key={t} value={t} className="bg-[#3a1418]">{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Sub-category *</label>
                    <select
                      name="subCategory"
                      ref={el => inputRef.current.subCategory = el}
                      value={form.subCategory}
                      onChange={handleChange}
                      disabled={!form.category}
                      className={getSelectClass("subCategory")}
                    >
                      <option value="" className="bg-[#3a1418]">-- Pick an Award --</option>
                      {Object.entries(groupedSubCategories).map(([group, list]) => (
                        <optgroup key={group} label={group} className="bg-black text-[#d4af37] font-bold">
                          {list.map((item) => (
                            <option key={item} value={item} className="bg-[#3a1418] text-white font-normal">
                              {item}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                      {form.category && (
                        <option value="Other" className="bg-[#3a1418] text-[#d4af37] font-bold italic">Other Category...</option>
                      )}
                    </select>
                  </div>

                  {form.subCategory === "Other" && (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-2">Custom Category Details *</label>
                      <input
                        name="otherSubCategory"
                        ref={el => inputRef.current.otherSubCategory = el}
                        value={form.otherSubCategory}
                        onChange={handleChange}
                        placeholder="Type your suggested category title here"
                        className={`${getInputClass("otherSubCategory")} border-[#d4af37]/30 ring-[#d4af37]/10`}
                      />
                    </div>
                  )}
                </div>

                {/* Nominee Details */}
                <div className="md:col-span-2">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#d4af37]"></span> Nominee Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Name of Nominee / Professional *</label>
                      <input
                        name="nomineeName"
                        ref={el => inputRef.current.nomineeName = el}
                        value={form.nomineeName}
                        onChange={handleChange}
                        className={getInputClass("nomineeName")}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Organization / Hospital / Corporate Identity *</label>
                      <input
                        name="organization"
                        ref={el => inputRef.current.organization = el}
                        value={form.organization}
                        onChange={handleChange}
                        className={getInputClass("organization")}
                      />
                    </div>
                  </div>
                </div>

                {/* Organization Head Details */}
                <div className="md:col-span-2 pt-6 border-t border-white/5">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#d4af37]"></span> Organization Head Profile
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Head Name *</label>
                      <input
                        name="orgHeadName"
                        ref={el => inputRef.current.orgHeadName = el}
                        value={form.orgHeadName}
                        onChange={handleChange}
                        className={getInputClass("orgHeadName")}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Designation *</label>
                      <input
                        name="orgHeadDesignation"
                        ref={el => inputRef.current.orgHeadDesignation = el}
                        value={form.orgHeadDesignation}
                        onChange={handleChange}
                        className={getInputClass("orgHeadDesignation")}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mobile Number *</label>
                      <input
                        name="orgHeadMobile"
                        ref={el => inputRef.current.orgHeadMobile = el}
                        value={form.orgHeadMobile}
                        onChange={handleChange}
                        className={getInputClass("orgHeadMobile")}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Official Email *</label>
                      <input
                        name="orgHeadEmail"
                        ref={el => inputRef.current.orgHeadEmail = el}
                        value={form.orgHeadEmail}
                        onChange={handleChange}
                        className={getInputClass("orgHeadEmail")}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Person Details */}
                <div className="md:col-span-2 pt-6 border-t border-white/5">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#d4af37]"></span> Liaison / Contact Person
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Name *</label>
                      <input
                        name="contactName"
                        ref={el => inputRef.current.contactName = el}
                        value={form.contactName}
                        onChange={handleChange}
                        className={getInputClass("contactName")}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Designation *</label>
                      <input
                        name="contactDesignation"
                        ref={el => inputRef.current.contactDesignation = el}
                        value={form.contactDesignation}
                        onChange={handleChange}
                        className={getInputClass("contactDesignation")}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Mobile *</label>
                      <input
                        name="contactMobile"
                        ref={el => inputRef.current.contactMobile = el}
                        value={form.contactMobile}
                        onChange={handleChange}
                        className={getInputClass("contactMobile")}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Email *</label>
                      <input
                        name="contactEmail"
                        ref={el => inputRef.current.contactEmail = el}
                        value={form.contactEmail}
                        onChange={handleChange}
                        className={getInputClass("contactEmail")}
                      />
                    </div>
                  </div>
                </div>

                {/* Corporate Presence */}
                <div className="md:col-span-2 pt-6 border-t border-white/5 grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Corporate Website</label>
                    <input name="website" value={form.website} onChange={handleChange} className={getInputClass("website")} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Annual Turnover</label>
                    <input name="turnover" value={form.turnover} onChange={handleChange} className={getInputClass("turnover")} />
                  </div>
                </div>

                {/* Logistics */}
                <div className="md:col-span-2 pt-6 border-t border-white/5 space-y-6">
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#d4af37]"></span> Location & Logistics
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Street Address *</label>
                      <input
                        name="street"
                        ref={el => inputRef.current.street = el}
                        value={form.street}
                        onChange={handleChange}
                        className={getInputClass("street")}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">City *</label>
                      <input name="city" ref={el => inputRef.current.city = el} value={form.city} onChange={handleChange} className={getInputClass("city")} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">State *</label>
                      <input name="state" ref={el => inputRef.current.state = el} value={form.state} onChange={handleChange} className={getInputClass("state")} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">ZIP Code *</label>
                      <input name="zip" ref={el => inputRef.current.zip = el} value={form.zip} onChange={handleChange} className={getInputClass("zip")} />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Simple Form Block */}
                <div className="md:col-span-2 p-5 sm:p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#d4af37]/20 flex items-center justify-center mb-6 border border-[#d4af37]/30 shadow-inner">
                    <span className="text-2xl sm:text-3xl">📝</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#d4af37] mb-2 uppercase tracking-tighter text-center px-2">Registration Form</h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-8 sm:mb-10 font-light italic text-center max-w-md px-4">
                    You are registering to {form.participationType.replace("attend as", "attend as a")}. Our team will review your profile and reach out for coordination.
                  </p>

                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-black text-[#d4af37] uppercase tracking-[0.2em] mb-3 ml-1">Full Name *</label>
                      <input
                        name="nomineeName"
                        ref={el => inputRef.current.nomineeName = el}
                        placeholder="Ex: Dr. Prashant Kumar"
                        value={form.nomineeName}
                        onChange={handleChange}
                        className={getInputClass("nomineeName")}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-[#d4af37] uppercase tracking-[0.2em] mb-3 ml-1">Organization *</label>
                      <input
                        name="organization"
                        ref={el => inputRef.current.organization = el}
                        placeholder="Company / Institution Name"
                        value={form.organization}
                        onChange={handleChange}
                        className={getInputClass("organization")}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-[#d4af37] uppercase tracking-[0.2em] mb-3 ml-1">Designation *</label>
                      <input
                        name="designation"
                        ref={el => inputRef.current.designation = el}
                        placeholder="Current Job Title"
                        value={form.designation}
                        onChange={handleChange}
                        className={getInputClass("designation")}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-[#d4af37] uppercase tracking-[0.2em] mb-3 ml-1">Mobile Contact *</label>
                      <input
                        name="mobile"
                        ref={el => inputRef.current.mobile = el}
                        placeholder="+91 XXXXX XXXXX"
                        value={form.mobile}
                        onChange={handleChange}
                        className={getInputClass("mobile")}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-[#d4af37] uppercase tracking-[0.2em] mb-3 ml-1">Official Email *</label>
                      <input
                        name="email"
                        ref={el => inputRef.current.email = el}
                        placeholder="work@domain.com"
                        value={form.email}
                        onChange={handleChange}
                        className={getInputClass("email")}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-[#d4af37] uppercase tracking-[0.2em] mb-3 ml-1">Portfolio / Website</label>
                      <input
                        name="website"
                        placeholder="https://example.com"
                        value={form.website}
                        onChange={handleChange}
                        className={getInputClass("website")}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Location Section */}
            <div className="md:col-span-2 pt-8 border-t border-white/5 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#d4af37]"></span> Preferred Award Event Location
              </h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-1 md:ml-4">(Optional - Please select your preference)</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 px-1 md:px-2">
                {["New Delhi", "Dubai", "London", "USA"].map((loc) => (
                  <label
                    key={loc}
                    className={`flex items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer text-center
                      ${form.preferredLocation === loc
                        ? "bg-[#d4af37] border-transparent text-black font-bold shadow-[0_5px_15px_rgba(212,175,55,0.3)]"
                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20"
                      }`}
                  >
                    <input
                      type="radio"
                      name="preferredLocation"
                      value={loc}
                      checked={form.preferredLocation === loc}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <span className="text-xs uppercase tracking-tighter">{loc}</span>
                  </label>
                ))}
              </div>
              {form.preferredLocation && (
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, preferredLocation: "" }))}
                  className="text-[10px] text-[#d4af37] hover:underline ml-4 flex items-center gap-1"
                >
                  <FiX /> Clear Selection
                </button>
              )}
            </div>

            {/* Remarks Section */}
            <div className="md:col-span-2 pt-8 border-t border-white/5">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Additional Remarks</label>
              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                rows={4}
                placeholder="Share any specific information or requests with our team..."
                className={`${getInputClass("remarks")} resize-none`}
              />
            </div>

            {/* Premium Multi-step Terms Section */}
            <div className="md:col-span-2 bg-white/5 border border-white/5 p-6 rounded-2xl group transition-all hover:bg-white/[0.07]">
              <label className="flex gap-4 cursor-pointer select-none">
                <div className="relative flex items-center pt-1">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    ref={el => inputRef.current.acceptTerms = el}
                    checked={form.acceptTerms}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-2 border-[#d4af37]/40 bg-transparent checked:bg-[#d4af37] appearance-none transition-all cursor-pointer"
                  />
                  {form.acceptTerms && <span className="absolute left-[3px] top-[4px] text-black text-[10px] font-bold pointer-events-none">✓</span>}
                </div>
                <div className="flex-1">
                  <p className={`text-sm leading-relaxed transition-colors ${fieldErrors.acceptTerms ? "text-red-400" : "text-gray-300"}`}>
                    <span className="font-bold text-[#d4af37]">DECLARATION:</span> I hereby verify that I have thoroughly reviewed the Selection Procedures and Terms & Conditions. The data provided above is accurate to the best of my knowledge and I consent to its review by the jury panel.
                  </p>
                </div>
              </label>
            </div>

            {/* Centered Submit Button */}
            <div className="md:col-span-2 flex flex-col items-center gap-4 py-8 md:py-4">
              <button
                type="submit"
                disabled={submitting}
                className="group relative inline-flex items-center justify-center w-full sm:w-auto px-12 py-4 font-black tracking-[0.2em] uppercase transition-all duration-300 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black rounded-full overflow-hidden shadow-[0_20px_40px_-10px_rgba(212,175,55,0.4)] hover:shadow-[0_20px_50px_-5px_rgba(212,175,55,0.6)] hover:-translate-y-1 active:scale-95 disabled:grayscale disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    <>Submit Registration <span className="text-xl group-hover:translate-x-2 transition-transform">→</span></>
                  )}
                </span>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer"></div>
              </button>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Secure SSL Encrypted Transmission</p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
