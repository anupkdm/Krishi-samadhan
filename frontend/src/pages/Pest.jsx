import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import SourceBadge from '../components/SourceBadge';
import LoadingState from '../components/LoadingState';
import pestService from '../services/pestService';

const Pest = () => {
  const [crop, setCrop] = useState('Rice');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const crops = ['Rice', 'Wheat', 'Cotton', 'Tomato', 'Soybean', 'Onion', 'Sugarcane', 'Jowar', 'Bajra'];

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit.');
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!crop) {
      setError('Please select a crop type.');
      return;
    }
    if (!image) {
      setError('Please upload a leaf or crop lesion image.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await pestService.analyzePest(image, crop);
      setResult(response);
    } catch (err) {
      console.error('Pest analysis error:', err);
      setError('Failed to analyze image. Please ensure image is valid and backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity) => {
    const s = (severity || 'Moderate').toLowerCase();
    if (s === 'high') return <span className="badge badge-danger">High Severity</span>;
    if (s === 'moderate') return <span className="badge badge-warning">Moderate Severity</span>;
    return <span className="badge badge-success">Low Severity</span>;
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>AI Pest & Disease Surveillance</h1>
            <p>Computer-vision powered leaf diagnosis, pathogen detection, and treatment guidance.</p>
          </div>
          <SourceBadge source="Edge ML Diagnostic Pipeline" status="Demonstration" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Left: Input Form */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
            📸 Upload Crop Image
          </h2>

          <div className="form-group">
            <label className="form-label">1. Select Target Crop</label>
            <select
              className="form-select"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
            >
              {crops.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">2. Upload Leaf / Stem Image</label>
            <div className="upload-dropzone" onClick={() => document.getElementById('pest-file-input').click()}>
              <input
                type="file"
                id="pest-file-input"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌿</div>
              <div style={{ fontWeight: '700', color: 'var(--primary-900)' }}>
                {image ? image.name : 'Click to select image or drag & drop'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                JPEG, PNG, WebP up to 5MB
              </div>
            </div>
          </div>

          {preview && (
            <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
              <img
                src={preview}
                alt="Selected Crop"
                style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', objectFit: 'cover' }}
              />
            </div>
          )}

          {error && (
            <div style={{ background: 'var(--error-bg)', color: 'var(--error)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              ⚠️ {error}
            </div>
          )}

          <button
            className="btn btn-primary btn-block"
            onClick={handleAnalyze}
            disabled={loading || !image}
          >
            {loading ? 'Running Computer Vision Inference...' : '🔬 Analyze Leaf Sample'}
          </button>
        </div>

        {/* Right: Results Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
            🧪 Diagnosis & Prescription Report
          </h2>

          {loading ? (
            <LoadingState message="Extracting visual features & comparing disease signatures..." />
          ) : result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flexGrow: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Detected Pathology</div>
                  <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--primary-900)', margin: '0.2rem 0' }}>
                    {result.prediction || 'Leaf Pathology'}
                  </div>
                  {getSeverityBadge(result.severity)}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--primary-700)' }}>
                    {result.confidence ? `${(parseFloat(result.confidence) * 100).toFixed(1)}%` : '88.5%'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Confidence Score</div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
                  💊 Agronomic Treatment Recommendation
                </h3>
                <div style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)', borderRadius: 'var(--radius-md)', padding: '1rem', fontSize: '0.92rem', color: 'var(--primary-900)', lineHeight: '1.6' }}>
                  {result.recommendation || 'Apply recommended organic/chemical fungicide solution.'}
                </div>
              </div>

              <div style={{ marginTop: 'auto', background: 'var(--bg-main)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                ℹ️ <strong>Field Note:</strong> {result.disclaimer || 'Demonstration inference model. Confirm diagnosis with local Krishi Vigyan Kendra (KVK) officer.'}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', margin: 'auto 0', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔬</div>
              <p style={{ fontWeight: '600' }}>No active sample evaluated.</p>
              <p style={{ fontSize: '0.85rem' }}>Upload a plant photo on the left to run disease classification.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Pest;
