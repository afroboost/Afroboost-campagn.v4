/**
 * MediaViewer - Lecteur vidéo Afroboost
 * Simple et efficace : vidéo + bouton CTA
 */
import { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL || '';

const MediaViewer = ({ slug }) => {
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        console.log('MediaViewer: Loading media for slug:', slug);
        const response = await axios.get(`${API}/api/media/${slug}`);
        console.log('MediaViewer: Media loaded:', response.data);
        setMedia(response.data);
      } catch (err) {
        console.error('MediaViewer: Error loading media:', err);
        setError(err.response?.data?.detail || 'Média non trouvé');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadMedia();
    }
  }, [slug]);

  // Écran de chargement
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#fff', fontSize: '18px' }}>Chargement...</p>
      </div>
    );
  }

  // Écran d'erreur
  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <p style={{ color: '#ff4444', fontSize: '18px', marginBottom: '20px' }}>{error}</p>
        <a href="https://afroboosteur.com" style={{ color: '#d91cd2', textDecoration: 'none' }}>Retour à l'accueil</a>
      </div>
    );
  }

  // URL YouTube embed
  const youtubeUrl = media.youtube_id 
    ? `https://www.youtube.com/embed/${media.youtube_id}?rel=0&modestbranding=1`
    : media.video_url;

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Header */}
      <header style={{ background: '#d91cd2', padding: '15px 20px', textAlign: 'center' }}>
        <a href="https://afroboosteur.com" style={{ color: '#fff', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
          🎧 Afroboost
        </a>
      </header>

      {/* Contenu */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '30px 20px' }}>
        
        {/* Titre */}
        <h1 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '25px' }} data-testid="media-title">
          {media.title}
        </h1>

        {/* Vidéo */}
        <div style={{ position: 'relative', paddingBottom: '56.25%', marginBottom: '25px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #d91cd2' }} data-testid="video-container">
          <iframe
            src={youtubeUrl}
            title={media.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        </div>

        {/* Description */}
        {media.description && (
          <p style={{ textAlign: 'center', color: '#ccc', fontSize: '16px', marginBottom: '30px', lineHeight: '1.6' }}>
            {media.description}
          </p>
        )}

        {/* BOUTON CTA - ROSE AFROBOOST */}
        {media.cta_text && media.cta_link && (
          <div style={{ textAlign: 'center', marginBottom: '40px' }} data-testid="cta-section">
            <a
              href={media.cta_link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '18px 40px',
                background: '#d91cd2',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
              data-testid="cta-button"
            >
              {media.cta_text} →
            </a>
          </div>
        )}

        {/* Partage */}
        <div style={{ textAlign: 'center', borderTop: '1px solid #333', paddingTop: '25px' }}>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>Partager</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://afroboosteur.com/v/${media.slug}`);
                alert('Lien copié !');
              }}
              style={{ padding: '10px 20px', background: '#333', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              📋 Copier le lien
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(media.title + ' - https://afroboosteur.com/v/' + media.slug)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: '10px 20px', background: '#25D366', color: '#fff', textDecoration: 'none', borderRadius: '6px' }}
            >
              WhatsApp
            </a>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '20px', color: '#666', fontSize: '12px' }}>
        © Afroboost 2025
      </footer>
    </div>
  );
};

export default MediaViewer;
