import { useState } from 'react';
import { X, Upload, CheckCircle } from 'lucide-react';

const EvidenceModal = ({ task, onClose, onSubmit }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('Please select an image!');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('evidence', file);

    try {
      await onSubmit(task._id, formData);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload evidence');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-3 text-emerald-500 mb-3">
            <CheckCircle size={32} />
            <h2 className="text-2xl font-bold text-white">Task Complete!</h2>
          </div>
          <p className="text-lg text-white font-semibold mb-2">"{task.title}"</p>
          <div className="bg-emerald-900/20 border border-emerald-700 rounded-lg p-4 mb-2">
            <p className="text-emerald-300 font-semibold text-base mb-1">
              📸 Upload Evidence Required
            </p>
            <p className="text-sm text-slate-300">
              Take a photo or screenshot of your work to validate this task and maintain your streak 🔥
            </p>
          </div>
        </div>

        {/* File Upload Area */}
        <div className="mb-6">
          {!preview ? (
            <label className="border-2 border-dashed border-slate-600 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition-colors">
              <Upload size={48} className="text-slate-500 mb-2" />
              <span className="text-slate-400 text-sm">Click to upload image</span>
              <span className="text-slate-500 text-xs mt-1">PNG, JPG, GIF (Max 5MB)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!file || uploading}
            className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
          >
            {uploading ? 'Uploading...' : 'Submit Evidence'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvidenceModal;
