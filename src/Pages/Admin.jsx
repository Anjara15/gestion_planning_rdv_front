import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Admin.css';

const Admin = () => {
  const [selectedSection, setSelectedSection] = useState('utilisateurs');
  const [user, setUser] = useState(null);
  const [rendezVous, setRendezVous] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [medecins, setMedecins] = useState([]);
  const [form, setForm] = useState({
    username: '',
    email: '',
    role: '',
    password: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedRDV = JSON.parse(localStorage.getItem('rendezVous')) || [];
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

    if (!storedUser || storedUser.role !== 'admin') {
      navigate('/');
    } else {
      setUser(storedUser);
      setRendezVous(storedRDV);
      setUsers(storedUsers);
      setMedecins(storedUsers.filter((u) => u.role === 'medecin'));         
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddUser = (e) => {
    e.preventDefault();

    const nouveauUser = {
      username: form.username,
      age:form.age,
      email: form.email,
      role: form.role,
      password: form.password,
    };

    const updatedUsers = [...users, nouveauUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    setForm({ username: '',age: '' , email: '', role: '', password: '' });
    setShowForm(false);
  };

  const handleDeleteUser = (indexToDelete) => {
    const updatedUsers = users.filter((_, i) => i !== indexToDelete);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'utilisateurs':
        return (
          <div className="user-management">
            <div className="user-form-side">
              <button
                className="submit-button"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Annuler' : 'Ajouter un utilisateur'}
              </button>

              {showForm && (
                <form className="form" onSubmit={handleAddUser}>
                  <label className="label">Nom d'utilisateur :</label>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="input"
                  /><label className="label">Äge :</label>
                  <input
                    type="text"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    required
                    className="input"
                  />

                  <label className="label">Email :</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="input"
                  />

                  <label className="label">Rôle :</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    required
                    className="input"
                  >
                    <option value="">-- Choisir un rôle --</option>
                    <option value="patient">Patient</option>
                    <option value="medecin">Médecin</option>
                    <option value="admin">Administrateur</option>
                  </select>

                  <label className="label">Mot de passe :</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="input"
                    autoComplete="current-password"
                  />

                  <button type="submit" className="submit-button">
                    Enregistrer
                  </button>
                </form>
              )}
            </div>

            {users.length > 0 && (
             <div className="user-list-side">
                <h3 className="section-subtitle">Liste des Utilisateurs</h3>
                <table className="styled-table">
                  <thead>
                    <tr>
                      <th>Nom d'utilisateur</th>
                      <th>Email</th>
                      <th>Age</th>
                      <th>Rôle</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={index}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.age}</td>
                        <td>{user.role}</td>
                        <td>
                          <button
                            className="action-button"
                            onClick={() => alert(`Modifier ${user.username}`)}
                          >
                            Modifier
                          </button>
                          <button
                            className="action-button action-button-delete"
                            onClick={() => handleDeleteUser(index)}
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            )}
          </div>

        );

      case 'medecins':
        return (
          <div className="section">
            <h2 className="section-title">Liste des Médecins</h2>
            {medecins.length > 0 ? (
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {medecins.map((med, index) => (
                    <tr key={index}>
                      <td>{med.username}</td>
                      <td>{med.email}</td>
                      <td>{med.age}</td>
                      <td>
                        <button
                          className="action-button"
                          onClick={() => alert(`Modifier ${med.username}`)}
                        >
                          Modifier
                        </button>
                        <button
                          className="action-button action-button-delete"
                          onClick={() => handleDeleteUser(users.indexOf(med))}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="section-text">Aucun médecin enregistré.</p>
            )}
          </div>
        );


      case 'rdv':
        return (
          <div className="section">
            <h2 className="section-title">Gestion des Rendez-vous</h2>
            {rendezVous.length > 0 ? (
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Date</th>
                    <th>Heure</th>
                    <th>Médecin</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rendezVous.map((rdv, index) => (
                    <tr key={index}>
                      <td>{rdv.nom}</td>
                      <td>{rdv.prenom}</td>
                      <td>{rdv.date}</td>
                      <td>{rdv.heure}</td>
                      <td>{rdv.medecin}</td>
                      <td>
                        <button className="action-button">Modifier</button>
                        <button className="action-button action-button-delete">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="section-text">Aucun rendez-vous enregistré.</p>
            )}

          </div>
        );

    

      case 'notifications':
        return (
          <div className="section">
            <h2 className="section-title">Notifications</h2>
            <p className="section-text">Pas de notifications pour l’instant.</p>
          </div>
        );

      default:
        return <p className="section-text">Section inconnue</p>;
    }
  };

  return (
    <div className="container">
      <nav className="sidebar">
        <h2 className="sidebar-title">Espace Administrateur</h2>
        <ul className="nav-list">
          {[
            { key: 'utilisateurs', label: 'Gestion des Utilisateurs' },
            { key: 'medecins', label: 'Gestion des Médecins' },
            { key: 'rdv', label: 'Gestion des RDV' },
            { key: 'notifications', label: 'Notifications' },
          ].map((item) => (
            <li
              key={item.key}
              onClick={() => setSelectedSection(item.key)}
              className={`nav-item ${selectedSection === item.key ? 'nav-item-active' : ''}`}
              aria-label={item.label}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedSection(item.key)}
            >
              {item.label}
            </li>
          ))}
        </ul>
        <button onClick={handleLogout} className="logout-btn" aria-label="Déconnexion">
          Déconnexion
        </button>
      </nav>

      <main className="main">
        <h1 className="main-title">Bienvenue {user?.username || 'Administrateur'}</h1>
        {renderContent()}
      </main>
    </div>
  );
};

export default Admin;
