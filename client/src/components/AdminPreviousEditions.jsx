import { useState, useEffect } from "react";
import {
    fetchPreviousEditions,
    createPreviousEdition,
    updatePreviousEdition,
    deletePreviousEdition,
} from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Edit2, Trash2, Plus, Image as ImageIcon } from "lucide-react";

const inputClass =
    "w-full rounded-lg bg-[#272316] border border-[#edd14850] px-3 py-2 text-sm text-[#fbe376] focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition";

export default function AdminPreviousEditions({ customToken }) {
    const authContext = useAuth();
    // Use customToken if provided (e.g., from DeveloperAuth), else use the App Auth context token
    const token = customToken || authContext.token;
    const [editions, setEditions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const [formData, setFormData] = useState({
        year: "",
        title: "",
        editionLabel: "",
        locations: "",
        date: "",
        hero: "",
        videoLinks: "",
    });
    const [images, setImages] = useState([]); // new files
    const [existingImages, setExistingImages] = useState([]); // strings (URLs)

    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        loadEditions();
    }, [token]);

    const loadEditions = async () => {
        try {
            setLoading(true);
            const res = await fetchPreviousEditions();
            setEditions(res.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            year: "",
            title: "",
            editionLabel: "",
            locations: "",
            date: "",
            hero: "",
            videoLinks: "",
        });
        setImages([]);
        setExistingImages([]);
        setIsEditing(false);
        setCurrentId(null);
        setShowModal(false);
    };

    const handleEdit = (edition) => {
        setFormData({
            year: edition.year,
            title: edition.title,
            editionLabel: edition.editionLabel,
            locations: edition.locations.join(", "),
            date: edition.date || "",
            hero: edition.hero || "",
            videoLinks: edition.videoLinks ? edition.videoLinks.join(", ") : "",
        });
        setExistingImages(edition.images || []);
        setImages([]);
        setIsEditing(true);
        setCurrentId(edition._id);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = new FormData();
            payload.append("year", formData.year);
            payload.append("title", formData.title);
            payload.append("editionLabel", formData.editionLabel);
            payload.append("locations", formData.locations);
            payload.append("date", formData.date);
            payload.append("hero", formData.hero);
            payload.append("videoLinks", formData.videoLinks);

            if (isEditing) {
                existingImages.forEach(img => payload.append("existingImages", img));
                images.forEach(img => payload.append("newImages", img));
                await updatePreviousEdition(currentId, payload, token);
            } else {
                images.forEach(img => payload.append("images", img));
                await createPreviousEdition(payload, token);
            }

            resetForm();
            loadEditions();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async () => {
        try {
            await deletePreviousEdition(deletingId, token);
            setDeletingId(null);
            loadEditions();
        } catch (err) {
            alert(err.message);
        }
    };

    const removeExistingImage = (imgUrl) => {
        setExistingImages(prev => prev.filter(i => i !== imgUrl));
    };

    if (loading) return <div className="text-yellow-300">Loading editions...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-[#ffe9a1]">Previous Editions</h2>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#ecd26c] to-[#d49d28] text-[#232012] px-4 py-2 rounded-lg font-bold hover:brightness-110 transition"
                >
                    <Plus size={18} /> Add New Edition
                </button>
            </div>

            {error && <div className="text-red-400 bg-red-900/20 p-3 rounded">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {editions.map((edition) => (
                    <div key={edition._id} className="bg-gradient-to-br from-[#272316] to-[#1a160a] p-5 rounded-2xl border border-[#edd14830] shadow-lg relative group">
                        <h3 className="text-xl font-bold text-[#fbe376] mb-1">{edition.year} - {edition.title}</h3>
                        <p className="text-sm text-[#c7ba7e] mb-2">{edition.editionLabel} | {edition.locations.join(", ")}</p>
                        <p className="text-xs text-gray-400 mb-4 line-clamp-2">{edition.hero}</p>

                        <div className="flex items-center gap-2 text-xs text-[#d4af37] mb-4">
                            <span className="flex items-center gap-1"><ImageIcon size={14} /> {edition.images?.length || 0} Photos</span>
                            <span className="mx-2 text-[#d4af37]/30">|</span>
                            <span>▶ {edition.videoLinks?.length || 0} Videos</span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(edition)}
                                className="flex-1 py-1.5 border border-[#d4af37]/50 text-[#d4af37] text-sm rounded hover:bg-[#d4af37]/10 flex items-center justify-center gap-1 transition"
                            >
                                <Edit2 size={14} /> Edit
                            </button>
                            <button
                                onClick={() => setDeletingId(edition._id)}
                                className="py-1.5 px-3 border border-red-500/50 text-red-400 text-sm rounded hover:bg-red-500/10 flex items-center justify-center transition"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit/Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] backdrop-blur-sm p-4">
                    <div className="bg-[#18130e] border border-[#d4af3780] shadow-2xl p-6 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-[#ffe6a3] mb-4">{isEditing ? "Edit Edition" : "Add New Edition"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-[#c7ba7e] mb-1 block">Year</label>
                                    <input required type="number" className={inputClass} value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs text-[#c7ba7e] mb-1 block">Edition Label (e.g. 13th Edition)</label>
                                    <input required className={inputClass} value={formData.editionLabel} onChange={e => setFormData({ ...formData, editionLabel: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-[#c7ba7e] mb-1 block">Title (e.g. Global Healthcare Excellence Awards)</label>
                                <input required className={inputClass} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>

                            <div>
                                <label className="text-xs text-[#c7ba7e] mb-1 block">Locations (comma separated)</label>
                                <input required className={inputClass} value={formData.locations} onChange={e => setFormData({ ...formData, locations: e.target.value })} />
                            </div>

                            <div>
                                <label className="text-xs text-[#c7ba7e] mb-1 block">Date (e.g. May 2025)</label>
                                <input className={inputClass} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                            </div>

                            <div>
                                <label className="text-xs text-[#c7ba7e] mb-1 block">Hero/Description</label>
                                <textarea className={inputClass} rows={3} value={formData.hero} onChange={e => setFormData({ ...formData, hero: e.target.value })} />
                            </div>

                            <div>
                                <label className="text-xs text-[#c7ba7e] mb-1 block">Video Gallery Links (comma-separated YouTube URLs)</label>
                                <textarea className={inputClass} rows={3} placeholder="https://youtube.com/watch?v=..., https://youtu.be/..." value={formData.videoLinks} onChange={e => setFormData({ ...formData, videoLinks: e.target.value })} />
                            </div>

                            {isEditing && existingImages.length > 0 && (
                                <div>
                                    <label className="text-xs text-[#c7ba7e] mb-2 block">Existing Images</label>
                                    <div className="flex flex-wrap gap-2">
                                        {existingImages.map((imgUrl, i) => (
                                            <div key={i} className="relative w-16 h-16 rounded overflow-hidden border border-[#d4af37]/30 group">
                                                <img src={imgUrl} alt="Edition" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => removeExistingImage(imgUrl)} className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-bl">×</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="text-xs text-[#c7ba7e] mb-1 block">Upload Media Gallery Photos</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={e => setImages(prev => [...prev, ...Array.from(e.target.files)])}
                                    className="w-full text-sm text-[#c7ba7e] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#d4af37]/10 file:text-[#d4af37] hover:file:bg-[#d4af37]/20"
                                />
                                {images.length > 0 && (
                                    <div className="mt-2 text-xs text-[#c7ba7e]">
                                        <p className="mb-2">Selected New Images ({images.length}):</p>
                                        <div className="flex flex-wrap gap-2">
                                            {images.map((file, i) => (
                                                <div key={i} className="relative w-16 h-16 rounded overflow-hidden border border-[#d4af37]/30 group">
                                                    <img src={URL.createObjectURL(file)} alt="New upload" className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-bl">×</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-[#d4af37]/20">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-[#d4af37]/50 text-[#d4af37] rounded hover:bg-[#d4af37]/10 transition">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-[#d4af37] text-black font-bold rounded hover:bg-[#ffe082] transition">Save Edition</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {deletingId && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] backdrop-blur-sm p-4">
                    <div className="bg-[#18130e] border border-red-500/50 p-6 rounded-2xl max-w-sm w-full">
                        <h2 className="text-xl font-bold text-red-400 mb-2">Delete Edition?</h2>
                        <p className="text-sm text-gray-400 mb-6">Are you sure you want to delete this edition? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setDeletingId(null)} className="px-4 py-2 border border-gray-600 text-gray-300 rounded hover:bg-gray-800 transition">Cancel</button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-500 transition">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
