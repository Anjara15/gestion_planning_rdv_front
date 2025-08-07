import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faTimes, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../Styles/Login.css';

const fakeUsers = [
  { username: 'admin', password: 'admin123', role: 'admin', email: 'admin@gmail.com' },
  { username: 'mika', password: 'patient123', role: 'patient', email: 'mika@gmail.com' },
  { username: 'drsmith', password: 'medecin123', role: 'medecin', email: 'drsmith@gmail.com' },
];

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [erreur, setErreur] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErreur('');

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = fakeUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'patient':
          navigate('/patient');
          break;
        case 'medecin':
          navigate('/medecin');
          break;
        default:
          navigate('/');
      }
    } else {
      setErreur('Identifiants invalides !');
    }
    setIsLoading(false);
  };

  const clearError = () => setErreur('');

  return (
    <div className="container">
      <div className="section" role="region" aria-label="Formulaire de connexion ou d'inscription">
        <h2 className="section-title">Cabinet Médical</h2>
        <p className="section-text">{showRegister ? 'Créer un compte' : 'Espace de connexion'}</p>

        {showRegister ? (
          <Register setShowRegister={setShowRegister} />
        ) : (
          <>
            {erreur && (
              <div className="error-message" role="alert" aria-live="assertive">
                <span>{erreur}</span>
                <button className="error-close" onClick={clearError} aria-label="Fermer l'erreur">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            )}
            <form className="form" onSubmit={handleLogin}>
              <div>
                <label htmlFor="username" className="label">
                  Nom d'utilisateur
                </label>
                <input
                  id="username"
                  type="text"
                  className="input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Entrez votre identifiant"
                  required
                  autoComplete="username"
                  aria-label="Nom d'utilisateur"
                />
              </div>
              <div style={{ position: 'relative' }}>
                <label htmlFor="password" className="label">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  required
                  autoComplete="current-password"
                  aria-label="Mot de passe"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? (
                  <>
                    Connexion... <span className="loading-spinner" aria-hidden="true"></span>
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="link"
                  onClick={() => setShowRegister(true)}
                >
                  <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '0.5rem' }} />
                  Pas de compte ? Inscrivez-vous
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

// Register Component
const Register = ({ setShowRegister }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [erreur, setErreur] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErreur('');

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const storedUsers = JSON.parse(localStorage.getItem('users')) || fakeUsers;
    if (storedUsers.some((u) => u.username === form.username)) {
      setErreur('Ce nom d’utilisateur est déjà pris !');
      setIsLoading(false);
      return;
    }
    if (storedUsers.some((u) => u.email === form.email)) {
      setErreur('Cet email est déjà utilisé !');
      setIsLoading(false);
      return;
    }
    if (!form.role) {
      setErreur('Veuillez sélectionner un rôle !');
      setIsLoading(false);
      return;
    }

    const newUser = {
      username: form.username,
      email: form.email,
      password: form.password,
      role: form.role,
    };
    const updatedUsers = [...storedUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('user', JSON.stringify(newUser));

    switch (form.role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'patient':
        navigate('/patient');
        break;
      case 'medecin':
        navigate('/medecin');
        break;
      default:
        navigate('/');
    }
    setIsLoading(false);
  };

  const clearError = () => setErreur('');

  return (
    <>
      {erreur && (
        <div className="error-message" role="alert" aria-live="assertive">
          <span>{erreur}</span>
          <button className="error-close" onClick={clearError} aria-label="Fermer l'erreur">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}
      <form className="form" onSubmit={handleRegister}>
        <div>
          <label htmlFor="register-username" className="label">
            Nom d'utilisateur
          </label>
          <input
            id="register-username"
            type="text"
            className="input"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Entrez votre identifiant"
            required
            autoComplete="username"
            aria-label="Nom d'utilisateur"
          />
        </div>
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Entrez votre email"
            required
            autoComplete="email"
            aria-label="Email"
          />
        </div>
        <div style={{ position: 'relative' }}>
          <label htmlFor="register-password" className="label">
            Mot de passe
          </label>
          <input
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            className="input"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Entrez votre mot de passe"
            required
            autoComplete="new-password"
            aria-label="Mot de passe"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        <div>
          <label htmlFor="role" className="label">
            Rôle
          </label>
          <select
            id="role"
            name="role"
            className="select"
            value={form.role}
            onChange={handleChange}
            required
            aria-label="Rôle"
          >
            <option value="">-- Choisir un rôle --</option>
            <option value="patient">Patient</option>
            <option value="medecin">Médecin</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? (
            <>
              Inscription... <span className="loading-spinner" aria-hidden="true"></span>
            </>
          ) : (
            'S\'inscrire'
          )}
        </button>
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            type="button"
            className="link"
            onClick={() => setShowRegister(false)}
          >
            <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '0.5rem' }} />
            Déjà un compte ? Se connecter
          </button>
        </div>
      </form>
    </>
  );
};

export default Login;