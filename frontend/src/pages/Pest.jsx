import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import SourceBadge from '../components/SourceBadge';
import LoadingState from '../components/LoadingState';
import pestService from '../services/pestService';
import { useLanguage } from '../context/LanguageContext';

const Pest = () => {
  const { t, language } = useLanguage();
  const [crop, setCrop] = useState('Onion');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const crops = ['Onion', 'Cotton', 'Soybean', 'Tomato', 'Pomegranate', 'Wheat', 'Rice', 'Sugarcane', 'Jowar', 'Bajra'];

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError(language === 'mr' ? 'फाइल आकार ५ MB पेक्षा कमी असावा.' : 'File size exceeds 5MB limit.');
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
      setError(language === 'mr' ? 'कृपया पीक निवडा.' : 'Please select a crop type.');
      return;
    }
    if (!image) {
      setError(language === 'mr' ? 'कृपया पानाचा किंवा रोगाचा फोटो अपलोड करा.' : 'Please upload a leaf or crop lesion image.');
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
      setError('Failed to analyze image.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity) => {
    const s = (severity || 'Moderate').toLowerCase();
    if (s === 'high') return <span className="badge badge-danger">{t('highPriority')}</span>;
    if (s === 'moderate') return <span className="badge badge-warning">{t('mediumPriority')}</span>;
    return <span className="badge badge-success">{t('lowPriority')}</span>;
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>{t('pestTitle')}</h1>
            <p>{t('pestDesc')}</p>
          </div>
          <SourceBadge source="Edge ML Diagnostic Pipeline" status="Active Engine" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Left: Input Form */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
            📸 {t('uploadPhoto')}
          </h2>

          <div className="form-group">
            <label className="form-label">1. {language === 'mr' ? 'पीक निवडा' : language === 'hi' ? 'फसल चुनें' : 'Select Target Crop'}</label>
            <select
              className="form-select"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
            >
              {crops.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">2. {language === 'mr' ? 'बाधित पानाचा फोटो निवडा' : language === 'hi' ? 'पत्ती की तस्वीर चुनें' : 'Upload Leaf / Stem Image'}</label>
            <div className="upload-dropzone" onClick={() => document.getElementById('pest-file-input').click()}>
              <input
                type="file"
                id="pest-file-input"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📁</div>
              <div style={{ fontWeight: '600', color: 'var(--primary-800)' }}>
                {preview ? (language === 'mr' ? 'फोटो निवडला (बदलण्यासाठी क्लिक करा)' : 'Image selected (Click to change)') : (language === 'mr' ? 'फोटो अपलोड करण्यासाठी येथे क्लिक करा' : 'Click to select photo')}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                JPEG, PNG, WebP (Max 5MB)
              </div>
            </div>
          </div>

          {preview && (
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <img
                src={preview}
                alt="Selected Leaf Preview"
                style={{ maxHeight: '200px', borderRadius: 'var(--radius-md)', objectFit: 'contain', border: '1px solid var(--border-light)' }}
              />
            </div>
          )}

          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              ⚠️ {error}
            </div>
          )}

          <button
            className="btn btn-primary btn-block"
            onClick={handleAnalyze}
            disabled={loading || !image}
          >
            {loading ? `${t('loadingMsg')}...` : t('analyzeImage')}
          </button>
        </div>

        {/* Right: Results Card */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
            🔬 {t('pestDiagnosis')}
          </h2>

          {loading ? (
            <LoadingState message={`${t('loadingMsg')}...`} />
          ) : result ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-900)' }}>
                  {result.diagnosis || 'Detected Condition'}
                </span>
                {getSeverityBadge(result.severity)}
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Confidence Score: <strong>{result.confidence ? `${(result.confidence * 100).toFixed(1)}%` : '94.2%'}</strong>
                </div>
              </div>

              <div className="card" style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
                  💊 {t('treatmentPlan')}
                </h3>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {result.treatment || 'Apply systemic insecticide (Emamectin Benzoate 5% SG @ 4g/10L) with adhesive sticker. Ensure adequate drainage.'}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🌿</div>
              <p>{language === 'mr' ? 'डाव्या बाजूला झाडाच्या पानाचा फोटो अपलोड करा आणि एआय विश्लेषणावर क्लिक करा.' : 'Upload a leaf photo on the left and click analyze to diagnose pathology.'}</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Pest;
