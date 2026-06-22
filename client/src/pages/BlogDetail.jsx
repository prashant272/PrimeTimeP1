import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchBlogBySlug } from "../services/api.js";
import { Calendar, User, ArrowLeft } from "lucide-react";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const data = await fetchBlogBySlug(slug);
        setBlog(data);
      } catch (err) {
        setError("Failed to load the blog or it may have been removed.");
      } finally {
        setLoading(false);
      }
    };
    loadBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0503] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#d4af37]/30 border-t-[#d4af37] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-[#0a0503] text-white flex flex-col items-center justify-center pt-24 px-6">
        <p className="text-red-400 text-xl mb-6">{error || "Blog not found."}</p>
        <Link to="/blogs" className="px-6 py-2 border border-[#d4af37] text-[#d4af37] rounded-full hover:bg-[#d4af37] hover:text-black transition font-bold">
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0503] text-white pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <Link to="/blogs" className="inline-flex items-center gap-2 text-[#d4af37] hover:text-white transition font-bold mb-10 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to All Blogs
        </Link>

        {blog.image && (
          <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12 border border-[#d4af37]/20 shadow-2xl shadow-[#d4af37]/5">
            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex items-center gap-6 text-sm font-semibold text-[#d4af37]/70 uppercase tracking-widest mb-6">
          <span className="flex items-center gap-2">
            <Calendar size={16} />
            {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>
          <span className="flex items-center gap-2">
            <User size={16} />
            {blog.author}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-[#f3e5ab] mb-12 leading-tight">
          {blog.title}
        </h1>

        <div 
          className="prose prose-invert prose-lg max-w-none prose-headings:text-[#e9d781] prose-a:text-[#d4af37] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:border prose-img:border-[#d4af37]/20"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
}
