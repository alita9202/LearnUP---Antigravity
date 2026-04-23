import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

const InstallPWA = () => {
  const [installPromptEvent, setInstallPromptEvent] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPromptEvent(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPromptEvent) return;
    
    installPromptEvent.prompt();
    const { outcome } = await installPromptEvent.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Usuario aceptó instalar la PWA');
      setInstallPromptEvent(null);
    }
  };

  if (!installPromptEvent) return null;

  return (
    <button onClick={handleInstallClick} className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', color: '#ecc94b', borderColor: '#ecc94b' }}>
      <Download size={18} /> Instalar App
    </button>
  );
};

export default InstallPWA;
