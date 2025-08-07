import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <button
                className={`w-full mb-6 text-white py-2 px-4 rounded-lg font-semibold transition duration-200 ${
                  showForm 
                    ? 'btn btn-danger' 
                    : 'btn btn-success'
                }`}
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Annuler' : 'Ajouter un utilisateur'}
              </button>

              {showForm && (
                <form className="custom-form" onSubmit={handleAddUser}>
                  <div className="mb-3">
                    <label className="form-label">Nom d'utilisateur :</label>
                    <input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Âge :</label>
                    <input
                      type="text"
                      name="age"
                      value={form.age}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email :</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Rôle :</label>
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      required
                      className="form-select"
                    >
                      <option value="">-- Choisir un rôle --</option>
                      <option value="patient">Patient</option>
                      <option value="medecin">Médecin</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Mot de passe :</label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="form-control"
                      autoComplete="current-password"
                    />
                  </div>
                  
                  <div className="d-grid">
                    <button type="submit" className="btn btn-success w-100">
                      Enregistrer
                    </button>
                  </div>
                </form>
              )}
            </div>

            {users.length > 0 && (
             <div className="table-container mt-4">
                <h3 className="h4 mb-4">Liste des Utilisateurs</h3>
                <div className="table-responsive">
                  <table className="table table-hover table-bordered border-success">
                    <thead className="table-light">
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
                              className="btn btn-sm btn-success me-2"
                              onClick={() => alert(`Modifier ${user.username}`)}
                            >
                              Modifier
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
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
              </div>

            )}
          </div>

        );

      case 'medecins':
        return (
          <div className="section">
            <h2 className="section-title">Liste des Médecins</h2>
            {medecins.length > 0 ? (
              <table className="table table-hover table-bordered border-success">
                <thead className="table-light">
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
                          className="btn btn-sm btn-success me-2"
                          onClick={() => alert(`Modifier ${med.username}`)}
                        >
                          Modifier
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
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
              <table className="table table-hover table-bordered border-success">
                <thead className="table-light">
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
                        <button className="btn btn-sm btn-success me-2">Modifier</button>
                        <button className="btn btn-sm btn-danger">Supprimer</button>
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
        <div>
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
                className={`nav-item ${
                  selectedSection === item.key ? 'nav-item-active'
                    : 'hover:bg-white/10 hover:translate-x-2'
                }`}
                aria-label={item.label}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedSection(item.key)}
              >
                {item.label}
              </li>
            ))}
          </ul>
          <button
            onClick={handleLogout}
            className="logout-btn"
            aria-label="Déconnexion"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <main className="main">
        <h1 className="main-title">
          Bienvenue {user?.username || 'Administrateur'}
        </h1>
        <div className="section">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Admin;
