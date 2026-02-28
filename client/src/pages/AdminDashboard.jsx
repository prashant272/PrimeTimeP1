import { useEffect, useMemo, useState } from "react";
import {
  fetchAdminNominations,
  updateNominationStatus,
  updateNomination,
  deleteNomination,
} from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { ShieldCheck, Edit2, Trash2, FileText, Search, Eye } from "lucide-react";
import AdminPreviousEditions from "../components/AdminPreviousEditions.jsx";

/* ------------------ Constants ------------------ */
const goldGrad =
  "linear-gradient(90deg,#e9d781 0%,#dac24a 29.69%,#fee19a 70%,#bc9830 100%)";

const STATUS_OPTIONS = [
  { value: "nominated", label: "Nomination Received" },
  { value: "evaluation", label: "Under Evaluation" },
  { value: "in_progress", label: "In Progress (Shortlisted for user)" },
  { value: "selected", label: "Selected (Winner)" },
  { value: "rejected", label: "Rejected" },
];

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  ...STATUS_OPTIONS,
];

const PARTICIPATION_TYPE_FILTER_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "nominated as award", label: "Award Nomination" },
  { value: "attend as speaker", label: "Speaker" },
  { value: "attend as exhibitor", label: "Exhibitor" },
  { value: "attend as sponsor", label: "Sponsor" },
];

const LOCATION_FILTER_OPTIONS = [
  { value: "all", label: "All Locations" },
  { value: "New Delhi", label: "New Delhi" },
  { value: "Dubai", label: "Dubai" },
  { value: "London", label: "London" },
  { value: "USA", label: "USA" },
];

/* ------------------ Status Badge ------------------ */
function StatusBadge({ status }) {
  const normalized = status || "nominated";
  const adminLabel =
    STATUS_OPTIONS.find((s) => s.value === normalized)?.label ||
    "Nomination Received";

  const colorClasses = {
    nominated:
      "bg-gradient-to-r from-[#393d63] to-[#5263a6] text-blue-50 border-blue-400/60 shadow shadow-blue-800/40",
    evaluation:
      "bg-gradient-to-r from-[#a38e65] to-[#ffe69d] text-yellow-800 border-yellow-400/60 shadow shadow-yellow-900/20",
    in_progress:
      "bg-gradient-to-r from-[#4d7330] to-[#bafa6b] text-lime-900 border-lime-400/60 shadow shadow-lime-800/20",
    selected:
      "bg-gradient-to-r from-[#155449] to-[#4eecbe] text-emerald-50 border-emerald-400/70 shadow shadow-emerald-800/20",
    rejected:
      "bg-gradient-to-r from-[#512a23] to-[#a04534] text-red-50 border-red-400/60 shadow shadow-red-800/30",
  }[normalized];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.3 text-[11px] font-semibold uppercase tracking-wide backdrop-blur-sm ${colorClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {adminLabel}
    </span>
  );
}

const PAYMENT_STATUS_OPTIONS = [
  { value: "not_paid", label: "Not Paid" },
  { value: "initial_paid", label: "Initial Payment" },
  { value: "paid", label: "Paid (Completed)" },
  { value: "not_interested", label: "Not Interested" },
];

/* ================== MAIN COMPONENT ================== */
export default function AdminDashboard() {
  const { token } = useAuth();

  const [nominations, setNominations] = useState([]);
  const [filteredNominations, setFilteredNominations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [participationTypeFilter, setParticipationTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // 'newest' or 'oldest'
  const [updatingId, setUpdatingId] = useState(null);

  const [editingNomination, setEditingNomination] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [viewingNomination, setViewingNomination] = useState(null);

  const [activeTab, setActiveTab] = useState("nominations");

  /* ------------------ Load Data ------------------ */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAdminNominations(token);
        setNominations(data);
      } catch (err) {
        setError(err.message || "Failed to load nominations");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  /* ------------------ Filter ------------------ */
  useEffect(() => {
    let filtered = [...nominations];

    if (statusFilter !== "all") {
      filtered = filtered.filter((n) => (n.status || "nominated") === statusFilter);
    }

    if (participationTypeFilter !== "all") {
      filtered = filtered.filter((n) => n.participationType === participationTypeFilter);
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter((n) => n.preferredLocation === locationFilter);
    }

    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      filtered = filtered.filter((n) => {
        const nameMatch = n.nomineeName?.toLowerCase().includes(s);
        const emailMatch = n.email?.toLowerCase().includes(s);
        const mobileMatch = (n.mobileNumber || n.phone)?.toLowerCase().includes(s);
        const orgMatch = n.organization?.toLowerCase().includes(s);
        return nameMatch || emailMatch || mobileMatch || orgMatch;
      });
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredNominations(filtered);
  }, [nominations, statusFilter, participationTypeFilter, locationFilter, searchTerm, sortOrder]);

  const paymentSummary = useMemo(() => {
    const summary = {
      total: nominations.length,
      not_paid: 0,
      initial_paid: 0,
      paid: 0,
      not_interested: 0,
    };
    nominations.forEach((n) => {
      const key = n.paymentStatus || "not_paid";
      if (summary[key] != null) summary[key] += 1;
    });
    return summary;
  }, [nominations]);

  const dailySummary = useMemo(() => {
    const groups = {};
    nominations.forEach((n) => {
      const dateKey = n.createdAt
        ? new Date(n.createdAt).toLocaleDateString("en-GB")
        : "Unknown Date";

      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: dateKey,
          total: 0,
          paid: 0,
          pending: 0,
          initial_paid: 0,
        };
      }
      groups[dateKey].total += 1;
      const status = n.paymentStatus || "not_paid";
      if (status === "paid") groups[dateKey].paid += 1;
      else if (status === "initial_paid") groups[dateKey].initial_paid += 1;
      else groups[dateKey].pending += 1;
    });

    // Sort by date descending
    return Object.values(groups).sort((a, b) => {
      if (a.date === "Unknown Date") return 1;
      if (b.date === "Unknown Date") return -1;
      const dateA = new Date(a.date.split("/").reverse().join("-"));
      const dateB = new Date(b.date.split("/").reverse().join("-"));
      return dateB - dateA;
    });
  }, [nominations]);

  /* ------------------ Status Change ------------------ */
  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);
      const updated = await updateNominationStatus(id, status, token);
      setNominations((prev) =>
        prev.map((n) => (n._id === id ? { ...n, ...updated } : n))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  /* ------------------ Edit ------------------ */
  const handleEdit = (n) => {
    setEditingNomination(n);
    setEditForm({ ...n });
  };

  const handleSaveEdit = async () => {
    try {
      setUpdatingId(editingNomination._id);
      const updated = await updateNomination(
        editingNomination._id,
        editForm,
        token
      );
      setNominations((prev) =>
        prev.map((n) => (n._id === updated._id ? updated : n))
      );
      setEditingNomination(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  /* ------------------ Delete ------------------ */
  const handleDelete = async () => {
    try {
      setUpdatingId(deleteConfirmId);
      await deleteNomination(deleteConfirmId, token);
      setNominations((prev) =>
        prev.filter((n) => n._id !== deleteConfirmId)
      );
      setDeleteConfirmId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const inputClass =
    "w-full rounded-lg bg-gradient-to-br from-[#23251c]/60 to-[#141015]/80 border border-[#d4af3790]/50 px-3 py-2 text-sm text-white shadow focus:(outline-none ring-2 ring-[#d4af37]/60) placeholder:text-[#d1c894]/60 font-semibold transition";

  /* ================== HELPERS ================== */
  const renderNominationsTable = () => (
    <div className="overflow-x-auto max-h-[90vh] border border-[#eaca5f80] rounded-2xl bg-gradient-to-tr from-[#23201aee] via-[#2b2313cf] to-[#10161aee] shadow-xl shadow-[#d4af3722] backdrop-blur relative">
      <table className="min-w-[1600px] w-full text-xs border-separate border-spacing-0">
        <thead>
          <tr className="bg-gradient-to-r from-[#231e09] to-[#2e2612] text-[#f2eab6] border-0">
            <th className="px-4 py-3 text-left">Participation</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-left">Mobile</th>
            <th className="px-4 py-3 text-left">Nominee</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Payment</th>
            <th className="px-4 py-3 text-left">Amount</th>
            <th className="px-4 py-3 text-left">Org Head</th>
            <th className="px-4 py-3 text-left">Contact</th>
            <th className="px-4 py-3 text-left">Business</th>
            <th className="px-4 py-3 text-left">Address</th>
            <th className="px-4 py-3 text-left">Remarks</th>
            <th className="px-4 py-3 text-left">Admin Remark</th>
            <th className="px-4 py-3 text-left">Submitted By</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 sticky right-0 bg-[#18130e] text-[#fae36f] z-20 w-[110px] rounded-tr-2xl shadow-xl">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredNominations.map((n, idx) => (
            <tr
              key={n._id}
              className={`transition border-t border-[#eaca5f22] h-[72px] ${idx % 2 === 0
                ? "bg-gradient-to-r from-[#14100a]/60 to-[#2a271ed9]"
                : "bg-gradient-to-r from-[#211c12be] to-[#35341be6]"
                }`}
            >
              <td className="px-4 py-4 font-semibold text-[#fee5af]">
                {n.participationType === "nominated as award" ? "🏆 Award" :
                  n.participationType === "attend as speaker" ? "🎤 Speaker" :
                    n.participationType === "attend as exhibitor" ? "🎪 Exhibitor" :
                      n.participationType === "attend as sponsor" ? "💎 Sponsor" : n.participationType}
              </td>
              <td className="px-4 py-4">
                {n.participationType === "nominated as award" ? (
                  <>
                    <div className="font-semibold text-yellow-300">{n.assignedCategory || n.category}</div>
                    <div className="text-[10px] text-gray-400 opacity-70">{n.subCategory}</div>
                  </>
                ) : (
                  <span className="text-gray-500 italic">N/A</span>
                )}
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-col gap-0.5">
                  {[n.mobile, n.contactMobile, n.orgHeadMobile].filter(Boolean).map((phone, i) => (
                    <span key={i} className="text-[#a4fbd2] font-mono text-[11px] whitespace-nowrap">
                      {phone}
                    </span>
                  ))}
                  {![n.mobile, n.contactMobile, n.orgHeadMobile].some(Boolean) && (
                    <span className="text-gray-500">—</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="font-semibold text-lg text-[#d4af37]">{n.nomineeName}</div>
                <div className="text-gray-300 text-[11px] font-mono">
                  {n.organization}
                </div>
              </td>
              <td className="px-4 py-4">
                <StatusBadge status={n.status} />
                <select
                  value={n.status || "nominated"}
                  onChange={(e) => handleStatusChange(n._id, e.target.value)}
                  className="mt-1 w-full rounded bg-[#282313]/60 border border-[#fae36f80] px-1 py-1 text-[11px] text-[#d4af37]"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-4">
                <select
                  value={n.paymentStatus || "not_paid"}
                  onChange={(e) =>
                    setNominations((prev) =>
                      prev.map((row) =>
                        row._id === n._id
                          ? { ...row, paymentStatus: e.target.value }
                          : row
                      )
                    )
                  }
                  onBlur={() =>
                    updateNomination(n._id, { paymentStatus: n.paymentStatus }, token)
                  }
                  className="w-full rounded bg-[#282313]/60 border border-[#fae36f80] px-1 py-1 text-[11px] text-[#d6ae37]"
                >
                  {PAYMENT_STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-4 text-[11px] text-[#e3cd96] font-semibold">
                {n.amount || <span className="text-gray-400 italic">—</span>}
              </td>
              <td className="px-4 py-4 text-[11px]">
                {n.orgHeadName}
                <br />
                <span className="text-gray-400">{n.orgHeadEmail}</span>
              </td>
              <td className="px-4 py-4 text-[11px]">
                {n.contactName}
                <br />
                <span className="text-gray-400">{n.contactEmail}</span>
              </td>
              <td className="px-4 py-4 text-[11px]">
                <span className="font-semibold">Website:</span>{" "}
                {n.website || "-"}
                <br />
                <span className="font-semibold">Turnover:</span>{" "}
                {n.turnover || "-"}
              </td>
              <td className="px-4 py-4 text-[11px]">
                {n.city}, {n.state}
              </td>
              <td className="px-4 py-4 max-w-xs">
                <div className="line-clamp-3">{n.remarks}</div>
              </td>
              <td className="px-4 py-4 max-w-xs text-[11px]">
                <div className="line-clamp-3">
                  {n.adminRemark || <span className="text-gray-500">—</span>}
                </div>
              </td>
              <td className="px-4 py-4 text-[11px]">
                {n.user?.email}
              </td>
              <td className="px-4 py-4 text-[11px] whitespace-nowrap">
                {new Date(n.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-4 sticky right-0 bg-gradient-to-l from-[#18130e] to-[#1f1810ac] z-20 shadow-lg rounded-tr-xl rounded-br-xl">
                <div className="flex gap-2">
                  {n.pdfUrl && (
                    <a
                      href={n.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center border border-blue-400/50 bg-[#101b23]/60 text-blue-400 rounded-full shadow transition hover:bg-gradient-to-tr hover:from-[#99c8fb] hover:to-[#3a86ce] hover:text-[#101b23]"
                      title="View PDF"
                    >
                      <FileText size={16} />
                    </a>
                  )}
                  <button
                    onClick={() => setViewingNomination(n)}
                    className="w-8 h-8 flex items-center justify-center border border-green-400/50 bg-[#102310]/60 text-green-400 rounded-full shadow transition hover:bg-gradient-to-tr hover:from-[#99fb99] hover:to-[#3ace3a] hover:text-[#102310]"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleEdit(n)}
                    className="w-8 h-8 flex items-center justify-center border border-[#d4af37]/70 bg-[#2b2512]/70 text-[#d4af37] rounded-full shadow transition hover:bg-gradient-to-tr hover:from-[#fbe399] hover:to-[#ceb655] hover:text-[#221d10]"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(n._id)}
                    className="w-8 h-8 flex items-center justify-center border border-red-400/50 bg-[#231010]/60 text-red-400 rounded-full shadow transition hover:bg-gradient-to-tr hover:from-[#fbad99] hover:to-[#ce5a3a] hover:text-[#321010]"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="absolute pointer-events-none left-0 top-0 h-full w-8 z-30 bg-gradient-to-r from-[#13110a] via-[#18130e00] to-transparent" />
      <div className="absolute pointer-events-none right-0 top-0 h-full w-8 z-30 bg-gradient-to-l from-[#13110a] via-[#18130e00] to-transparent" />
    </div>
  );

  const renderStatusTab = () => (
    <div className="overflow-x-auto max-h-[90vh] border border-[#eaca5f80] rounded-2xl bg-gradient-to-tr from-[#2b2313cf] via-[#23201aee] to-[#10161aee] shadow-xl shadow-[#d4af3722] backdrop-blur relative">
      <table className="min-w-[1100px] w-full text-xs border-separate border-spacing-0">
        <thead>
          <tr className="bg-gradient-to-r from-[#231e09] to-[#2e2612] text-[#f2eab6]">
            <th className="px-4 py-3 text-left rounded-tl-2xl">Name</th>
            <th className="px-4 py-3 text-left">Mobile</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Nomination Status (User View)</th>
            <th className="px-4 py-3 text-left">Payment Status</th>
            <th className="px-4 py-3 text-left">Amount</th>
            <th className="px-4 py-3 text-left rounded-tr-2xl">Remark</th>
          </tr>
        </thead>
        <tbody>
          {nominations.map((n, idx) => {
            const userLabel =
              n.status === "in_progress"
                ? "Shortlisted"
                : STATUS_OPTIONS.find((s) => s.value === n.status)?.label ||
                "Nomination Received";
            return (
              <tr
                key={n._id}
                className={`border-t border-[#eaca5f22] h-[60px] ${idx % 2 === 0
                  ? "bg-gradient-to-r from-[#18130a]/60 to-[#352a1eae]"
                  : "bg-gradient-to-r from-[#242108be] to-[#352a1eda]"
                  }`}
              >
                <td className="px-4 py-3">
                  <div className="font-semibold text-lg text-[#eed99b]">{n.nomineeName}</div>
                </td>
                <td className="px-4 py-3 text-[11px]">
                  {n.contactMobile || n.orgHeadMobile || "—"}
                </td>
                <td className="px-4 py-3 text-[11px]">
                  {n.user?.email || n.contactEmail || "—"}
                </td>
                <td className="px-4 py-3 text-[11px]">{userLabel}</td>
                <td className="px-4 py-3 text-[11px]">
                  {PAYMENT_STATUS_OPTIONS.find(
                    (s) => s.value === (n.paymentStatus || "not_paid")
                  )?.label || "Not Paid"}
                </td>
                <td className="px-4 py-3 text-[11px]">
                  {n.amount || "—"}
                </td>
                <td className="px-4 py-3 text-[11px]">
                  {n.adminRemark || "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="absolute pointer-events-none left-0 top-0 h-full w-8 z-30 bg-gradient-to-r from-[#13110a] via-[#18130e00] to-transparent" />
      <div className="absolute pointer-events-none right-0 top-0 h-full w-8 z-30 bg-gradient-to-l from-[#13110a] via-[#18130e00] to-transparent" />
    </div>
  );

  const renderUsersTab = () => {
    const byUser = new Map();
    nominations.forEach((n) => {
      if (!n.user?.email) return;
      const key = n.user.email;
      const existing = byUser.get(key) || {
        email: n.user.email,
        count: 0,
        latestStatus: n.status,
        latestAt: n.createdAt,
      };
      existing.count += 1;
      if (!existing.latestAt || new Date(n.createdAt) > new Date(existing.latestAt)) {
        existing.latestAt = n.createdAt;
        existing.latestStatus = n.status;
      }
      byUser.set(key, existing);
    });
    const rows = Array.from(byUser.values());

    return (
      <div className="overflow-x-auto max-h-[90vh] border border-[#eaca5f80] rounded-2xl bg-gradient-to-tr from-[#23201aee] via-[#2b2313cf] to-[#10161aee] shadow-xl shadow-[#d4af3722] backdrop-blur relative">
        <table className="min-w-[800px] w-full text-xs border-separate border-spacing-0">
          <thead>
            <tr className="bg-gradient-to-r from-[#231e09] to-[#2e2612] text-[#f2eab6]">
              <th className="px-4 py-3 text-left rounded-tl-2xl">Email</th>
              <th className="px-4 py-3 text-left">Total Nominations</th>
              <th className="px-4 py-3 text-left">Latest Status</th>
              <th className="px-4 py-3 text-left rounded-tr-2xl">Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.email}
                className={`border-t border-[#eaca5f22] h-[52px] ${idx % 2 === 0
                  ? "bg-gradient-to-r from-[#202012]/60 to-[#392b1eae]"
                  : "bg-gradient-to-r from-[#23201abe] to-[#463a1eda]"
                  }`}
              >
                <td className="px-4 py-3 font-semibold text-[#fee5af]">{row.email}</td>
                <td className="px-4 py-3">{row.count}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={row.latestStatus} />
                </td>
                <td className="px-4 py-3 text-[11px]">
                  {row.latestAt ? new Date(row.latestAt).toLocaleString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="absolute pointer-events-none left-0 top-0 h-full w-8 z-30 bg-gradient-to-r from-[#13110a] via-[#18130e00] to-transparent" />
        <div className="absolute pointer-events-none right-0 top-0 h-full w-8 z-30 bg-gradient-to-l from-[#13110a] via-[#18130e00] to-transparent" />
      </div>
    );
  };

  const renderAdminsTab = () => (
    <div className="border border-[#eaca5f80] rounded-2xl bg-gradient-to-tr from-[#23201aee] to-[#18130e] p-8 text-md text-[#e9e5ca] shadow-xl shadow-[#d4af3722] backdrop-blur-[3px]">
      <h2 className="text-2xl font-semibold mb-3 text-[#ffe9a1] flex items-center gap-2">
        <ShieldCheck className="inline text-[#ffe36d]" size={22} /> Admin Section
      </h2>
      <p className="mb-2 text-[#e9e3be]">
        future content
      </p>
      <ul className="list-disc list-inside space-y-1 text-[13px] text-[#c4b889]">
        <li>
          <span className="font-semibold text-[#e1c36a]">Nominations</span>
        </li>
        <li>
          <span className="font-semibold text-[#e1c36a]">Status</span>
        </li>
      </ul>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[#272316] to-[#1a160a] p-6 rounded-2xl border border-[#edd14830] shadow-lg">
          <p className="text-[#c7ba7e] text-xs font-bold uppercase tracking-widest mb-1">Total Registrations</p>
          <p className="text-3xl font-black text-white">{paymentSummary.total}</p>
        </div>
        <div className="bg-gradient-to-br from-[#272316] to-[#1a160a] p-6 rounded-2xl border border-[#edd14830] shadow-lg">
          <p className="text-[#c7ba7e] text-xs font-bold uppercase tracking-widest mb-1">Total Paid</p>
          <p className="text-3xl font-black text-green-400">{paymentSummary.paid}</p>
        </div>
        <div className="bg-gradient-to-br from-[#272316] to-[#1a160a] p-6 rounded-2xl border border-[#edd14830] shadow-lg">
          <p className="text-[#c7ba7e] text-xs font-bold uppercase tracking-widest mb-1">Initial Payments</p>
          <p className="text-3xl font-black text-blue-400">{paymentSummary.initial_paid}</p>
        </div>
        <div className="bg-gradient-to-br from-[#272316] to-[#1a160a] p-6 rounded-2xl border border-[#edd14830] shadow-lg">
          <p className="text-[#c7ba7e] text-xs font-bold uppercase tracking-widest mb-1">Pending/Not Paid</p>
          <p className="text-3xl font-black text-red-400">{paymentSummary.not_paid}</p>
        </div>
      </div>

      <div className="overflow-x-auto border border-[#eaca5f40] rounded-2xl bg-[#1a160ae6] backdrop-blur-md shadow-2xl">
        <table className="w-full text-sm text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-gradient-to-r from-[#231e09] to-[#2e2612] text-[#f2eab6]">
              <th className="px-6 py-4 font-black uppercase tracking-widest text-xs border-b border-[#edd14830]">Registration Date</th>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-xs border-b border-[#edd14830]">Daily Total</th>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-xs border-b border-[#edd14830]">Paid</th>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-xs border-b border-[#edd14830]">Partial Paid</th>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-xs border-b border-[#edd14830]">Pending</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edd14815]">
            {dailySummary.map((row, idx) => (
              <tr
                key={row.date}
                className={`hover:bg-[#d4af3708] transition-colors ${idx % 2 === 0 ? "bg-[#ffffff02]" : "bg-transparent"
                  }`}
              >
                <td className="px-6 py-4 font-bold text-[#fbe376]">{row.date}</td>
                <td className="px-6 py-4 font-black text-lg">{row.total}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                    {row.paid} Paid
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                    {row.initial_paid} Partial
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20">
                    {row.pending} Pending
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ================== UI ================== */
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#18130d] via-[#241b0a] to-[#11161c] text-white flex flex-col">
      {/* Top golden bar - optional, keeping as accent */}
      <div
        className="h-2 shadow-lg z-30 relative"
        style={{
          background: goldGrad,
          boxShadow: "0 3px 24px 6px #bb970f44, 0 1px 0 0 #d3b94f55",
        }}
      />

      <div className="flex flex-1">
        {/* Sidebar - Fixed to the left side */}
        <aside className="w-72 shrink-0 bg-[#16120b] border-r border-[#edd14830] shadow-2xl z-20 sticky top-0 h-screen overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-[#fbe376]" size={28} />
              <span className="font-bold text-xl tracking-wider gradient-text bg-gradient-to-r from-[#d2c44c] to-[#eddb92] bg-clip-text text-transparent">
                Admin Panel
              </span>
            </div>

            <div className="text-[13px] text-[#e8e2c7] space-y-2 bg-[#262002]/40 p-4 rounded-xl border border-[#edd14820]">
              <div className="flex justify-between">
                <span>Total Nominations</span>
                <span className="text-[#dbbe4f] font-bold">
                  {paymentSummary.total}
                </span>
              </div>
              <div className="h-px bg-[#edd14830] my-1" />
              <div className="flex justify-between opacity-80">
                <span>Completed</span>
                <span>{paymentSummary.paid}</span>
              </div>
              <div className="flex justify-between opacity-80">
                <span>Pending</span>
                <span>{paymentSummary.not_paid}</span>
              </div>
            </div>

            <nav className="space-y-2 font-medium">
              {[
                { id: "nominations", label: "Nominations", icon: "🏆" },
                { id: "status", label: "Status & Payment", icon: "💸" },
                { id: "analytics", label: "Daily Analytics", icon: "📊" },
                { id: "users", label: "Registered Users", icon: "👤" },
                { id: "previous-editions", label: "Previous Editions", icon: "🕰️" },
                { id: "admins", label: "Admin Settings", icon: "🛡️" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-semibold tracking-wide flex items-center gap-3 ${activeTab === tab.id
                    ? "bg-gradient-to-r from-[#ffe9a1] to-[#d4af37] text-black shadow-lg translate-x-1"
                    : "text-[#fbe6b8] hover:bg-[#ffffff0d] hover:text-[#ffe090]"
                    }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content - Scrollable */}
        <div className="flex-1 min-w-0 bg-[#0f0c08]/50 p-6 md:p-10">
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-[#ffe78c] via-[#c09a21] to-[#fae36e] bg-clip-text text-transparent drop-shadow-sm tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-[#eddfae] text-lg font-medium opacity-80">
              Manage nominations and user pipeline
            </p>
          </header>

          {activeTab !== "analytics" && activeTab !== "admins" && (
            <div className="flex flex-wrap items-center gap-4 mb-8 bg-[#1a160a]/40 p-4 rounded-2xl border border-[#ffffff0d] backdrop-blur-md">
              <span className="text-[#c7ba7e] font-semibold text-sm uppercase tracking-wider">
                Filter Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#272316] border border-[#edd14850] rounded-lg px-4 py-2 text-[#fbe376] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition shadow-inner"
              >
                {STATUS_FILTER_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>

              <span className="text-[#c7ba7e] font-semibold text-sm uppercase tracking-wider ml-2">
                Type:
              </span>
              <select
                value={participationTypeFilter}
                onChange={(e) => setParticipationTypeFilter(e.target.value)}
                className="bg-[#272316] border border-[#edd14850] rounded-lg px-4 py-2 text-[#fbe376] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition shadow-inner"
              >
                {PARTICIPATION_TYPE_FILTER_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>

              <span className="text-[#c7ba7e] font-semibold text-sm uppercase tracking-wider ml-2">
                Location:
              </span>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="bg-[#272316] border border-[#edd14850] rounded-lg px-4 py-2 text-[#fbe376] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition shadow-inner"
              >
                {LOCATION_FILTER_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>

              <div className="flex-grow max-w-sm relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#edd14880]" size={16} />
                <input
                  type="text"
                  placeholder="Search Name, Email, Mobile..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1a160a] border border-[#edd14830] rounded-lg pl-10 pr-4 py-2 text-sm text-[#fbe376] placeholder-[#edd14840] focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition"
                />
              </div>

              <span className="text-[#c7ba7e] font-semibold text-sm uppercase tracking-wider ml-2">
                Sort:
              </span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-[#272316] border border-[#edd14850] rounded-lg px-4 py-2 text-[#fbe376] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition shadow-inner"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>

              <span className="text-xs text-[#ffd975] font-mono bg-[#d4af37]/10 px-3 py-1 rounded-full border border-[#d4af37]/20">
                {filteredNominations.length} records
              </span>
              {error && (
                <span className="ml-auto text-sm text-red-400 bg-red-900/20 px-3 py-1 rounded border border-red-500/30">
                  Error: {error}
                </span>
              )}
              {loading && (
                <span className="ml-auto text-sm flex items-center gap-2 text-yellow-300">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
                  Loading data...
                </span>
              )}
            </div>
          )}

          <div className="w-full">
            {activeTab === "nominations" && renderNominationsTable()}
            {activeTab === "status" && renderStatusTab()}
            {activeTab === "analytics" && renderAnalyticsTab()}
            {activeTab === "users" && renderUsersTab()}
            {activeTab === "previous-editions" && <AdminPreviousEditions />}
            {activeTab === "admins" && renderAdminsTab()}
          </div>
        </div>
      </div>

      {/* ================== EDIT MODAL ================== */}
      {editingNomination && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] backdrop-blur-sm">
          <div className="bg-gradient-to-tr from-[#2e2b18] via-[#18130e] to-[#18130e] border-2 border-[#eaca5faa] shadow-2xl shadow-[#d4af3780] p-8 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-[#ffe6a3]">Edit Nomination Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Participation Type */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">Participation Type</label>
                <input
                  className={inputClass}
                  value={editForm.participationType || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      participationType: e.target.value,
                    })
                  }
                  placeholder="Type"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">
                  Category (User Selected)
                </label>
                <input
                  className={inputClass}
                  value={editForm.category || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                  placeholder="Category"
                />
              </div>

              {/* Sub Category */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">Sub Category</label>
                <input
                  className={inputClass}
                  value={editForm.subCategory || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, subCategory: e.target.value })
                  }
                  placeholder="Sub Category"
                />
              </div>

              {/* Other Sub Category */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">Other Sub Category</label>
                <input
                  className={inputClass}
                  value={editForm.otherSubCategory || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, otherSubCategory: e.target.value })
                  }
                  placeholder="Custom category if applicable"
                />
              </div>

              {/* Assigned Category */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">
                  Assigned Category (Admin)
                </label>
                <input
                  className={inputClass}
                  value={editForm.assignedCategory || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      assignedCategory: e.target.value,
                    })
                  }
                  placeholder="Assigned Category"
                />
              </div>

              {/* Nominee Name */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">Nominee Name</label>
                <input
                  className={inputClass}
                  value={editForm.nomineeName || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nomineeName: e.target.value })
                  }
                  placeholder="Enter nominee name"
                />
              </div>

              {/* Organization */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">Organization</label>
                <input
                  className={inputClass}
                  value={editForm.organization || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, organization: e.target.value })
                  }
                  placeholder="Organization name"
                />
              </div>

              {/* Turnover */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">Annual Turnover</label>
                <input
                  className={inputClass}
                  value={editForm.turnover || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, turnover: e.target.value })
                  }
                  placeholder="e.g., 50 Cr / 10M USD"
                />
              </div>

              {/* Designation (for simple form) */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">Designation</label>
                <input
                  className={inputClass}
                  value={editForm.designation || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, designation: e.target.value })
                  }
                  placeholder="Designation"
                />
              </div>

              {/* Mobile (for simple form) */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">Mobile</label>
                <input
                  className={inputClass}
                  value={editForm.mobile || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, mobile: e.target.value })
                  }
                  placeholder="Mobile number"
                />
              </div>

              {/* Email (for simple form) */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">Email</label>
                <input
                  className={inputClass}
                  value={editForm.email || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  placeholder="Email address"
                />
              </div>

              {/* Organization Head Name */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">
                  Organization Head Name
                </label>
                <input
                  className={inputClass}
                  value={editForm.orgHeadName || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, orgHeadName: e.target.value })
                  }
                  placeholder="Org Head Name"
                />
              </div>

              {/* Organization Head Designation */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">
                  Organization Head Designation
                </label>
                <input
                  className={inputClass}
                  value={editForm.orgHeadDesignation || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, orgHeadDesignation: e.target.value })
                  }
                  placeholder="Designation"
                />
              </div>

              {/* Organization Head Mobile */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">
                  Organization Head Mobile
                </label>
                <input
                  className={inputClass}
                  value={editForm.orgHeadMobile || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, orgHeadMobile: e.target.value })
                  }
                  placeholder="Mobile"
                />
              </div>

              {/* Organization Head Email */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">
                  Organization Head Email
                </label>
                <input
                  className={inputClass}
                  value={editForm.orgHeadEmail || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, orgHeadEmail: e.target.value })
                  }
                  placeholder="Email"
                />
              </div>

              {/* Contact Name */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">
                  Contact Name
                </label>
                <input
                  className={inputClass}
                  value={editForm.contactName || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, contactName: e.target.value })
                  }
                  placeholder="Contact Person"
                />
              </div>

              {/* Contact Designation */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">
                  Contact Designation
                </label>
                <input
                  className={inputClass}
                  value={editForm.contactDesignation || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, contactDesignation: e.target.value })
                  }
                  placeholder="Designation"
                />
              </div>

              {/* Contact Mobile */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">
                  Contact Mobile
                </label>
                <input
                  className={inputClass}
                  value={editForm.contactMobile || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, contactMobile: e.target.value })
                  }
                  placeholder="Mobile"
                />
              </div>

              {/* Contact Email */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">
                  Contact Email
                </label>
                <input
                  className={inputClass}
                  value={editForm.contactEmail || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, contactEmail: e.target.value })
                  }
                  placeholder="Email"
                />
              </div>

              {/* Website */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">Website</label>
                <input
                  className={inputClass}
                  value={editForm.website || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, website: e.target.value })
                  }
                  placeholder="https://example.com"
                />
              </div>

              {/* Facebook */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">Facebook</label>
                <input
                  className={inputClass}
                  value={editForm.facebook || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, facebook: e.target.value })
                  }
                  placeholder="Facebook profile/page link"
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">Instagram</label>
                <input
                  className={inputClass}
                  value={editForm.instagram || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, instagram: e.target.value })
                  }
                  placeholder="Instagram profile link"
                />
              </div>

              {/* YouTube */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">YouTube</label>
                <input
                  className={inputClass}
                  value={editForm.youtube || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, youtube: e.target.value })
                  }
                  placeholder="YouTube channel link"
                />
              </div>

              {/* Street */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">Street Address</label>
                <input
                  className={inputClass}
                  value={editForm.street || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, street: e.target.value })
                  }
                  placeholder="Street address"
                />
              </div>

              {/* City */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">City</label>
                <input
                  className={inputClass}
                  value={editForm.city || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, city: e.target.value })
                  }
                  placeholder="City"
                />
              </div>

              {/* State */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">State</label>
                <input
                  className={inputClass}
                  value={editForm.state || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, state: e.target.value })
                  }
                  placeholder="State"
                />
              </div>

              {/* ZIP */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">ZIP Code</label>
                <input
                  className={inputClass}
                  value={editForm.zip || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, zip: e.target.value })
                  }
                  placeholder="ZIP/Postal code"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">Amount</label>
                <input
                  className={inputClass}
                  placeholder="e.g. ₹25,000"
                  value={editForm.amount || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, amount: e.target.value })
                  }
                />
              </div>

              {/* Preferred Location */}
              <div>
                <label className="text-xs text-[#f6e589] font-semibold">Preferred Location</label>
                <input
                  className={inputClass}
                  value={Array.isArray(editForm.preferredLocation) ? editForm.preferredLocation.join(", ") : editForm.preferredLocation || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, preferredLocation: e.target.value })
                  }
                  placeholder="Preferred location(s)"
                />
              </div>

              {/* Public Remarks */}
              <div className="md:col-span-2">
                <label className="text-xs text-[#f6e589] font-semibold">
                  Public Remarks (User also sees)
                </label>
                <textarea
                  className={`${inputClass} min-h-[70px]`}
                  value={editForm.remarks || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, remarks: e.target.value })
                  }
                  placeholder="Remark for user (visible)"
                />
              </div>

              {/* Admin Remark */}
              <div className="md:col-span-2">
                <label className="text-xs text-[#f6e589] font-semibold">
                  Admin Remark (Internal only)
                </label>
                <textarea
                  className={`${inputClass} min-h-[70px]`}
                  value={editForm.adminRemark || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, adminRemark: e.target.value })
                  }
                  placeholder="Only for admin view"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setEditingNomination(null)}
                className="px-5 py-2.5 text-md font-medium text-[#f4e3a6] bg-gradient-to-r from-[#19140b]/80 to-[#0e0b08]/70 border border-[#bba44b80] rounded-lg shadow hover:bg-[#191400]/80 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-gradient-to-r from-[#ecd26c] to-[#d49d28] text-[#232012] border border-[#d4af37a8] px-8 py-2.5 rounded-lg text-md font-extrabold shadow-lg tracking-wider hover:from-[#fdf0bc] hover:to-[#fae36e] transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================== DELETE MODAL ================== */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-[#13110aee] backdrop-blur-[1.5px] flex items-center justify-center z-[9999]">
          <div className="bg-gradient-to-br from-[#292112f6] to-[#18130e] border border-[#edcc68be] shadow-2xl rounded-2xl max-w-md w-full min-h-[220px] flex flex-col justify-between py-10 px-8 gap-2">
            <h2 className="text-2xl font-semibold mb-2 text-[#fae36f] flex gap-2 items-center">
              <Trash2 className="text-red-400" size={26} /> Delete Nomination?
            </h2>
            <p className="text-base text-[#ffe8a7] mb-4">
              This action cannot be undone.<br />
              Are you sure you want to delete this nomination?
            </p>
            <div className="flex justify-end gap-5 mt-4">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="bg-gradient-to-r from-[#793717] to-[#161614] border border-[#dbbe4fad] text-[#ffe9a1] px-5 py-2 rounded-lg font-semibold hover:bg-[#edca8aec] shadow"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-gradient-to-tr from-[#f43e2c] to-[#7a1b0a] text-[#ffebd2] px-8 py-2 rounded-lg font-extrabold shadow-md hover:from-[#d42121] hover:to-[#772014]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================== VIEW MODAL ================== */}
      {viewingNomination && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] backdrop-blur-sm p-4">
          <div className="bg-gradient-to-tr from-[#2e2b18] via-[#18130e] to-[#18130e] border-2 border-[#eaca5faa] shadow-2xl shadow-[#d4af3780] p-8 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#ffe6a3]">Nomination Details</h2>
              <button
                onClick={() => setViewingNomination(null)}
                className="text-[#f6e589] hover:text-white transition"
              >
                <span className="text-2xl">✕</span>
              </button>
            </div>

            {/* Timestamps Section */}
            <div className="mb-6 p-4 bg-[#1a160a]/60 border border-[#d4af37]/30 rounded-xl">
              <h3 className="text-lg font-bold text-[#d4af37] mb-3">📅 Timeline Information</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[#c7ba7e] font-semibold">Submitted On:</span>
                  <p className="text-white font-mono mt-1">
                    {viewingNomination.createdAt
                      ? new Date(viewingNomination.createdAt).toLocaleString('en-IN', {
                        dateStyle: 'full',
                        timeStyle: 'medium'
                      })
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-[#c7ba7e] font-semibold">Last Updated:</span>
                  <p className="text-white font-mono mt-1">
                    {viewingNomination.updatedAt
                      ? new Date(viewingNomination.updatedAt).toLocaleString('en-IN', {
                        dateStyle: 'full',
                        timeStyle: 'medium'
                      })
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Details */}
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              {/* Participation Type */}
              <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                <label className="text-[#c7ba7e] font-semibold text-xs">Participation Type</label>
                <p className="text-white mt-1">{viewingNomination.participationType || '—'}</p>
              </div>

              {/* Category */}
              <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                <label className="text-[#c7ba7e] font-semibold text-xs">Category</label>
                <p className="text-white mt-1">{viewingNomination.category || '—'}</p>
              </div>

              {/* Sub Category */}
              <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                <label className="text-[#c7ba7e] font-semibold text-xs">Sub Category</label>
                <p className="text-white mt-1">{viewingNomination.subCategory || '—'}</p>
              </div>

              {/* Other Sub Category */}
              {viewingNomination.otherSubCategory && (
                <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                  <label className="text-[#c7ba7e] font-semibold text-xs">Other Sub Category</label>
                  <p className="text-white mt-1">{viewingNomination.otherSubCategory}</p>
                </div>
              )}

              {/* Nominee Name */}
              <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                <label className="text-[#c7ba7e] font-semibold text-xs">Nominee Name</label>
                <p className="text-white mt-1 font-semibold">{viewingNomination.nomineeName || '—'}</p>
              </div>

              {/* Organization */}
              <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                <label className="text-[#c7ba7e] font-semibold text-xs">Organization</label>
                <p className="text-white mt-1">{viewingNomination.organization || '—'}</p>
              </div>

              {/* Turnover */}
              {viewingNomination.turnover && (
                <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                  <label className="text-[#c7ba7e] font-semibold text-xs">Annual Turnover</label>
                  <p className="text-white mt-1">{viewingNomination.turnover}</p>
                </div>
              )}

              {/* Designation */}
              {viewingNomination.designation && (
                <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                  <label className="text-[#c7ba7e] font-semibold text-xs">Designation</label>
                  <p className="text-white mt-1">{viewingNomination.designation}</p>
                </div>
              )}

              {/* Mobile */}
              {viewingNomination.mobile && (
                <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                  <label className="text-[#c7ba7e] font-semibold text-xs">Mobile</label>
                  <p className="text-white mt-1 font-mono">{viewingNomination.mobile}</p>
                </div>
              )}

              {/* Email */}
              {viewingNomination.email && (
                <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                  <label className="text-[#c7ba7e] font-semibold text-xs">Email</label>
                  <p className="text-white mt-1">{viewingNomination.email}</p>
                </div>
              )}
            </div>

            {/* Organization Head Details */}
            {(viewingNomination.orgHeadName || viewingNomination.orgHeadEmail || viewingNomination.orgHeadMobile || viewingNomination.orgHeadDesignation) && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-[#d4af37] mb-3">👤 Organization Head Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {viewingNomination.orgHeadName && (
                    <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                      <label className="text-[#c7ba7e] font-semibold text-xs">Name</label>
                      <p className="text-white mt-1">{viewingNomination.orgHeadName}</p>
                    </div>
                  )}
                  {viewingNomination.orgHeadDesignation && (
                    <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                      <label className="text-[#c7ba7e] font-semibold text-xs">Designation</label>
                      <p className="text-white mt-1">{viewingNomination.orgHeadDesignation}</p>
                    </div>
                  )}
                  {viewingNomination.orgHeadMobile && (
                    <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                      <label className="text-[#c7ba7e] font-semibold text-xs">Mobile</label>
                      <p className="text-white mt-1 font-mono">{viewingNomination.orgHeadMobile}</p>
                    </div>
                  )}
                  {viewingNomination.orgHeadEmail && (
                    <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                      <label className="text-[#c7ba7e] font-semibold text-xs">Email</label>
                      <p className="text-white mt-1">{viewingNomination.orgHeadEmail}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact Person Details */}
            {(viewingNomination.contactName || viewingNomination.contactEmail || viewingNomination.contactMobile || viewingNomination.contactDesignation) && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-[#d4af37] mb-3">📞 Contact Person Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {viewingNomination.contactName && (
                    <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                      <label className="text-[#c7ba7e] font-semibold text-xs">Name</label>
                      <p className="text-white mt-1">{viewingNomination.contactName}</p>
                    </div>
                  )}
                  {viewingNomination.contactDesignation && (
                    <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                      <label className="text-[#c7ba7e] font-semibold text-xs">Designation</label>
                      <p className="text-white mt-1">{viewingNomination.contactDesignation}</p>
                    </div>
                  )}
                  {viewingNomination.contactMobile && (
                    <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                      <label className="text-[#c7ba7e] font-semibold text-xs">Mobile</label>
                      <p className="text-white mt-1 font-mono">{viewingNomination.contactMobile}</p>
                    </div>
                  )}
                  {viewingNomination.contactEmail && (
                    <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                      <label className="text-[#c7ba7e] font-semibold text-xs">Email</label>
                      <p className="text-white mt-1">{viewingNomination.contactEmail}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Social Media */}
            {(viewingNomination.website || viewingNomination.facebook || viewingNomination.instagram || viewingNomination.youtube) && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-[#d4af37] mb-3">🌐 Social Media & Website</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {viewingNomination.website && (
                    <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                      <label className="text-[#c7ba7e] font-semibold text-xs">Website</label>
                      <p className="text-blue-400 mt-1 break-all">
                        <a href={viewingNomination.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {viewingNomination.website}
                        </a>
                      </p>
                    </div>
                  )}
                  {viewingNomination.facebook && (
                    <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                      <label className="text-[#c7ba7e] font-semibold text-xs">Facebook</label>
                      <p className="text-blue-400 mt-1 break-all">
                        <a href={viewingNomination.facebook} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {viewingNomination.facebook}
                        </a>
                      </p>
                    </div>
                  )}
                  {viewingNomination.instagram && (
                    <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                      <label className="text-[#c7ba7e] font-semibold text-xs">Instagram</label>
                      <p className="text-blue-400 mt-1 break-all">
                        <a href={viewingNomination.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {viewingNomination.instagram}
                        </a>
                      </p>
                    </div>
                  )}
                  {viewingNomination.youtube && (
                    <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                      <label className="text-[#c7ba7e] font-semibold text-xs">YouTube</label>
                      <p className="text-blue-400 mt-1 break-all">
                        <a href={viewingNomination.youtube} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {viewingNomination.youtube}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Address */}
            {(viewingNomination.street || viewingNomination.city || viewingNomination.state || viewingNomination.zip) && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-[#d4af37] mb-3">📍 Address</h3>
                <div className="p-4 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                  <p className="text-white">
                    {[viewingNomination.street, viewingNomination.city, viewingNomination.state, viewingNomination.zip]
                      .filter(Boolean)
                      .join(', ') || '—'}
                  </p>
                </div>
              </div>
            )}

            {/* Preferred Location */}
            {viewingNomination.preferredLocation && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-[#d4af37] mb-3">🎯 Preferred Location</h3>
                <div className="p-4 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                  <p className="text-white">
                    {Array.isArray(viewingNomination.preferredLocation)
                      ? viewingNomination.preferredLocation.join(', ')
                      : viewingNomination.preferredLocation}
                  </p>
                </div>
              </div>
            )}

            {/* Remarks */}
            {viewingNomination.remarks && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-[#d4af37] mb-3">💬 Public Remarks</h3>
                <div className="p-4 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                  <p className="text-white whitespace-pre-wrap">{viewingNomination.remarks}</p>
                </div>
              </div>
            )}

            {/* Admin Remark */}
            {viewingNomination.adminRemark && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-[#d4af37] mb-3">🔒 Admin Remark (Internal)</h3>
                <div className="p-4 bg-[#1a160a]/40 rounded-lg border border-red-500/30">
                  <p className="text-white whitespace-pre-wrap">{viewingNomination.adminRemark}</p>
                </div>
              </div>
            )}

            {/* Status & Payment Info */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-[#d4af37] mb-3">📊 Status & Payment</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                  <label className="text-[#c7ba7e] font-semibold text-xs">Status</label>
                  <p className="text-white mt-1">{viewingNomination.status || 'nominated'}</p>
                </div>
                <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                  <label className="text-[#c7ba7e] font-semibold text-xs">Payment Status</label>
                  <p className="text-white mt-1">{viewingNomination.paymentStatus || 'not_paid'}</p>
                </div>
                <div className="p-3 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                  <label className="text-[#c7ba7e] font-semibold text-xs">Amount</label>
                  <p className="text-white mt-1">{viewingNomination.amount || '—'}</p>
                </div>
              </div>
            </div>

            {/* Submitted By */}
            {viewingNomination.user?.email && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-[#d4af37] mb-3">👨‍💼 Submitted By</h3>
                <div className="p-4 bg-[#1a160a]/40 rounded-lg border border-[#d4af37]/20">
                  <p className="text-white">{viewingNomination.user.email}</p>
                </div>
              </div>
            )}

            {/* Close Button */}
            <div className="flex justify-end mt-8">
              <button
                onClick={() => setViewingNomination(null)}
                className="bg-gradient-to-r from-[#ecd26c] to-[#d49d28] text-[#232012] border border-[#d4af37a8] px-8 py-2.5 rounded-lg text-md font-extrabold shadow-lg tracking-wider hover:from-[#fdf0bc] hover:to-[#fae36e] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
