import { Camera, Image as ImageIcon } from "lucide-react";

const IdUploadBox = ({ onFileSelect, fileName }) => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <label className="bg-[#F2E9DC] rounded-xl py-6 flex flex-col items-center gap-2 cursor-pointer">
          <Camera size={22} className="text-navy" />
          <span className="text-sm font-semibold text-navy">Upload from Camera</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => onFileSelect(e.target.files[0])}
          />
        </label>
        <label className="bg-[#F2E9DC] rounded-xl py-6 flex flex-col items-center gap-2 cursor-pointer">
          <ImageIcon size={22} className="text-navy" />
          <span className="text-sm font-semibold text-navy">Upload from Gallery</span>
          <input
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => onFileSelect(e.target.files[0])}
          />
        </label>
      </div>
      {fileName && (
        <p className="text-xs text-teal mt-2 font-medium">✓ Selected: {fileName}</p>
      )}
      <p className="text-xs text-gray-400 mt-2">Accepted: Aadhaar Card, PAN Card, Passport</p>
    </div>
  );
};

export default IdUploadBox;