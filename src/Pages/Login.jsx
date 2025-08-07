import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Login.css';

const fakeUsers = [
  { username: 'admin', password: 'admin123', role: 'admin', email: 'admin@gmail.com' },
  { username: 'mika', password: 'patient123', role: 'patient', email: 'mika@gmail.com' },
  { username: 'drsmith', password: 'medecin123', role: 'medecin', email: 'medecin@gmail.com' },
];

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

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
  };

  return (
    <div className="container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="section" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="section-title" style={{ textAlign: 'center' }}>Connexion</h2>
        {erreur && <p style={{ color: 'red', textAlign: 'center' }}>{erreur}</p>}
        <form className="form" onSubmit={handleLogin}>
          <div>
            <label className="label" htmlFor="username">Nom d'utilisateur</label>
            <input style={{ textAlign: 'center' ,background:'#f1efefff', color: '#323232ff' }}
              id="username"
              className="input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entrez votre nom d'utilisateur"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="label" htmlFor="password">Mot de passe</label>
            <input style={{textAlign: 'center', background: '#f1efefff', color: '#323232ff'}}
              id="password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="submit-button">Se connecter</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
