import React, { useState } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';

interface ProcurementCase {
  tender_id: string;
  title: string;
  department: string;
  estimated_value: number;
  procurement_method: string;
  publication_date: string;
  bid_opening_date: string;
  bids: Array<{
    vendor_name: string;
    bid_amount: number;
    is_msme: boolean;
    technical_score: number;
  }>;
  selected_vendor: string;
  selection_reason: string;
  documents_available: string[];
}

interface CaseInputFormProps {
  onSubmit: (data: ProcurementCase) => void;
  onCancel: () => void;
}

const DEFAULT_CASE: ProcurementCase = {
  tender_id: "TENDER-2024-XXX",
  title: "",
  department: "",
  estimated_value: 0,
  procurement_method: "open_tender",
  publication_date: new Date().toISOString().split('T')[0],
  bid_opening_date: new Date().toISOString().split('T')[0],
  bids: [
    { vendor_name: "Vendor A", bid_amount: 0, is_msme: false, technical_score: 0 },
    { vendor_name: "Vendor B", bid_amount: 0, is_msme: false, technical_score: 0 }
  ],
  selected_vendor: "",
  selection_reason: "",
  documents_available: ["Tender Notice"]
};

const CaseInputForm: React.FC<CaseInputFormProps> = ({ onSubmit, onCancel }) => {
  const [mode, setMode] = useState<'form' | 'json'>('form');
  const [formData, setFormData] = useState<ProcurementCase>(DEFAULT_CASE);
  const [jsonInput, setJsonInput] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleJsonSubmit = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      // Basic validation
      if (!parsed.tender_id || !parsed.bids) {
        throw new Error("Missing required fields (tender_id, bids)");
      }
      onSubmit(parsed);
    } catch (e) {
      setError("Invalid JSON format. Please check your input.");
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Upload className="w-6 h-6 text-blue-600" />
          Analyze New Case
        </h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setMode('form')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            mode === 'form'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Form Input
        </button>
        <button
          onClick={() => setMode('json')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            mode === 'json'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Paste JSON
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {mode === 'json' ? (
        <div className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200 pointer-events-none group-hover:border-blue-400 transition" />
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste your case JSON here..."
              className="w-full h-96 p-6 font-mono text-sm bg-transparent border-none rounded-lg focus:ring-0 relative z-10"
            />
            {!jsonInput && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 pointer-events-none">
                <FileText className="w-12 h-12 mb-2 opacity-50" />
                <p>Paste JSON content here</p>
              </div>
            )}
          </div>
          <button
            onClick={handleJsonSubmit}
            className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white py-4 rounded-lg font-bold hover:from-slate-800 hover:to-slate-700 transition shadow-lg flex items-center justify-center gap-2 group"
          >
            Analyze Case
            <Upload className="w-4 h-4 group-hover:translate-y-[-2px] transition-transform" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Tender ID</label>
              <input
                type="text"
                required
                value={formData.tender_id}
                onChange={(e) => setFormData({...formData, tender_id: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Estimated Value (₹)</label>
              <input
                type="number"
                required
                value={formData.estimated_value}
                onChange={(e) => setFormData({...formData, estimated_value: Number(e.target.value)})}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Method</label>
              <select
                value={formData.procurement_method}
                onChange={(e) => setFormData({...formData, procurement_method: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="open_tender">Open Tender</option>
                <option value="limited_tender">Limited Tender</option>
                <option value="single_tender">Single Tender</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-4">Bids Received</h3>
            {formData.bids.map((bid, idx) => (
              <div key={idx} className="flex gap-4 mb-2 items-end">
                <div className="flex-1">
                   <label className="block text-xs text-slate-500">Vendor Name</label>
                   <input
                    type="text"
                    value={bid.vendor_name}
                    onChange={(e) => {
                      const newBids = [...formData.bids];
                      newBids[idx].vendor_name = e.target.value;
                      setFormData({...formData, bids: newBids});
                    }}
                    className="w-full p-2 border border-slate-300 rounded text-sm"
                  />
                </div>
                <div className="w-32">
                   <label className="block text-xs text-slate-500">Amount (₹)</label>
                   <input
                    type="number"
                    value={bid.bid_amount}
                    onChange={(e) => {
                      const newBids = [...formData.bids];
                      newBids[idx].bid_amount = Number(e.target.value);
                      setFormData({...formData, bids: newBids});
                    }}
                    className="w-full p-2 border border-slate-300 rounded text-sm"
                  />
                </div>
                <div className="flex items-center pb-2">
                   <input
                    type="checkbox"
                    checked={bid.is_msme}
                    onChange={(e) => {
                      const newBids = [...formData.bids];
                      newBids[idx].is_msme = e.target.checked;
                      setFormData({...formData, bids: newBids});
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">MSME?</span>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFormData({
                ...formData,
                bids: [...formData.bids, { vendor_name: "", bid_amount: 0, is_msme: false, technical_score: 0 }]
              })}
              className="text-sm text-blue-600 font-semibold mt-2 hover:underline"
            >
              + Add Another Bid
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition"
          >
            Analyze Case
          </button>
        </form>
      )}
    </div>
  );
};

export default CaseInputForm;
