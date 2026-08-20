import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Share2, MapPin, Calendar } from "lucide-react";
import { getVilla } from "../services/villaService";

const VILLA_ID = import.meta.env.VITE_VILLA_ID;

const categories = ["All", "Exterior", "Living Room", "Bedrooms", "Kitchen", "Pool", "Lawn"];

const fallbackImages = [
  { category: "Exterior", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80", publicId: "f1" },
  { category: "Pool", url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&q=80", publicId: "f2" },
  { category: "Lawn", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80", publicId: "f3" },
  { category: "Living Room", url: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80", publicId: "f4" },
  { category: "Bedrooms", url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80", publicId: "f5" },
  { category: "Kitchen", url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&q=80", publicId: "f6" },
];

const Gallery = () => {
  const navigate = useNavigate();
  const [villa, setVilla] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    getVilla(VILLA_ID).then((res) => setVilla(res.data));
  }, []);

  const images = villa?.gallery?.length ? villa.gallery : fallbackImages;
  const filtered = activeCategory === "All" ? images : images.filter((img) => img.category === activeCategory);

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-4">
        <button onClick={() => navigate(-1)}><ChevronLeft className="text-navy" size={22} /></button>
        <h1 className="font-serif text-xl font-semibold">Gallery</h1>
        <Share2 className="text-navy" size={20} />
      </div>
      <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-1 mb-4">
        <MapPin size={14} /> Saniddhya Villas, Lonavala
      </p>

      <div className="flex gap-2 px-4 overflow-x-auto pb-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
              activeCategory === cat ? "bg-navy text-white" : "bg-white text-navy"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-3">
        {filtered.map((img, i) => (
          <div key={img.publicId || i} className="relative rounded-2xl overflow-hidden h-52">
            <img src={img.url} alt={img.category} className="w-full h-full object-cover" />
            <span className="absolute bottom-3 left-3 text-white font-serif font-bold text-lg">{img.category}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-navy/40 py-10 text-sm">No images in this category yet.</p>
        )}
      </div>

      <div className="px-4 mt-6 pb-4">
        <button onClick={() => navigate("/check-availability")} className="btn-primary w-full">
          <Calendar size={18} /> Book This Villa
        </button>
      </div>
    </div>
  );
};

export default Gallery;