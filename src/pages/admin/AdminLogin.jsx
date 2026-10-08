import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, AlertTriangle, Clock } from 'lucide-react';

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 2 * 60 * 1000; // 2 minutos
const STORAGE_KEY = 'admin_login_attempts';

function getAttemptData() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { count: 0, blockedUntil: null };
  } catch { return { count: 0, blockedUntil: null }; }
}

function saveAttemptData(data) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // Verificar bloqueo al cargar y cada segundo
  useEffect(() => {
    const check = () => {
      const data = getAttemptData();
      if (data.blockedUntil && Date.now() < data.blockedUntil) {
        setBlocked(true);
        setSecondsLeft(Math.ceil((data.blockedUntil - Date.now()) / 1000));
        setAttempts(data.count);
      } else {
        if (data.blockedUntil && Date.now() >= data.blockedUntil) {
          saveAttemptData({ count: 0, blockedUntil: null });
          setAttempts(0);
        }
        setBlocked(false);
        setSecondsLeft(0);
        setAttempts(data.count);
      }
    };

    check();
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = getAttemptData();
    if (data.blockedUntil && Date.now() < data.blockedUntil) return;

    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      // Login exitoso: limpiar intentos
      saveAttemptData({ count: 0, blockedUntil: null });
      navigate('/admin/productos');
    } catch {
      const newCount = (data.count || 0) + 1;
      const isBlocked = newCount >= MAX_ATTEMPTS;
      saveAttemptData({
        count: newCount,
        blockedUntil: isBlocked ? Date.now() + BLOCK_DURATION_MS : null,
      });
      setAttempts(newCount);

      if (isBlocked) {
        setError(null);
        setBlocked(true);
      } else {
        setError(`Credenciales incorrectas. ${MAX_ATTEMPTS - newCount} intento${MAX_ATTEMPTS - newCount !== 1 ? 's' : ''} restante${MAX_ATTEMPTS - newCount !== 1 ? 's' : ''}.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div style={{ width: 64, height: 64, background: 'var(--rose-50)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Lock size={32} />
          </div>
          <h1 className="login-title">Administración</h1>
          <p className="login-subtitle">Ingresa tus credenciales para continuar</p>
        </div>

        {blocked ? (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '0.75rem', padding: '1.25rem', textAlign: 'center' }}>
            <Clock size={28} color="#ef4444" style={{ marginBottom: '0.5rem' }} />
            <p style={{ fontWeight: 700, color: '#dc2626', marginBottom: '0.25rem' }}>Acceso bloqueado temporalmente</p>
            <p style={{ fontSize: '0.85rem', color: '#7f1d1d' }}>Demasiados intentos fallidos.</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#dc2626', marginTop: '0.5rem' }}>
              Espera {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="login-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={16} />
                {error}
              </div>
            )}

            {attempts > 0 && !error && (
              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '0.5rem', padding: '0.75rem', fontSize: '0.82rem', color: '#9a3412' }}>
                ⚠️ {MAX_ATTEMPTS - attempts} intento{MAX_ATTEMPTS - attempts !== 1 ? 's' : ''} restante{MAX_ATTEMPTS - attempts !== 1 ? 's' : ''} antes del bloqueo.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} autoComplete="off">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  id="email" type="email" className="form-input"
                  value={email} onChange={e => setEmail(e.target.value)} required
                  autoComplete="username"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="password">Contraseña</label>
                <input
                  id="password" type="password" className="form-input"
                  value={password} onChange={e => setPassword(e.target.value)} required
                  autoComplete="current-password"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                {loading ? 'Verificando...' : 'Ingresar'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
