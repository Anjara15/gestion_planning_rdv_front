import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Patient.css';

const Patient = () => {
  const [selectedSection, setSelectedSection] = useState('rdv');
  const [user, setUser] = useState(null);
  const [rendezVous, setRendezVous] = useState([]);
  const [rdvData, setRdvData] = useState({
    nom: '', prenom: '',  email: '',   telephone: '',   specialite: '',   medecin: '',   date: '',   heure: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedRDV = JSON.parse(localStorage.getItem('rendezVous')) || [];

    if (!storedUser || storedUser.role !== 'patient') {
      navigate('/');
    } else {
      setUser(storedUser);
      setRendezVous(storedRDV);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRdvData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRDVSubmit = (e) => {
    e.preventDefault();

    const newRdv = {
      ...rdvData, id: Date.now(), username: user.username, 
    };

    const updatedRDVs = [...rendezVous, newRdv];
    setRendezVous(updatedRDVs);
    localStorage.setItem('rendezVous', JSON.stringify(updatedRDVs));

    setRdvData({ nom: '', prenom: '', email: '', telephone: '', specialite: '', medecin: '', date: '', heure: '',
    });

    alert('Rendez-vous enregistré avec succès !');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'profil':
        return (
          <div className="section">
            <h2 className="section-title">Mon profil</h2>
            <p className="section-text"><strong>Nom d'utilisateur :</strong> {user?.username}</p>
            <p className="section-text"><strong>Email :</strong> {user?.email || 'non défini'}</p>
            <button className="button" onClick={() => alert('Modification à venir')}>Modifier mes informations</button>
          </div>
        );
      case 'rdv':
        return (
          <div className="section">
            <h2 className="section-title">Prendre un Rendez-vous</h2>
            <p className="section-text">
              Choisissez un médecin et un créneau horaire pour prendre un rendez-vous.
            </p>
            <form className="form" onSubmit={handleRDVSubmit}>
              <label className="label">Nom :</label>
              <input type="text" name="nom" required className="input" value={rdvData.nom} onChange={handleChange} />

              <label className="label">Prénom :</label>
              <input type="text" name="prenom" required className="input" value={rdvData.prenom} onChange={handleChange} />

              <label className="label">Email :</label>
              <input type="email" name="email" required className="input" value={rdvData.email} onChange={handleChange} />

              <label className="label">Téléphone :</label>
              <input type="tel" name="telephone" required className="input" value={rdvData.telephone} onChange={handleChange} />

              <label className="label">Spécialité :</label>
              <select name="specialite" required className="input" value={rdvData.specialite} onChange={handleChange}>
                <option value="">-- Choisir une spécialité --</option>
                <option value="generaliste">Médecine générale</option>
                <option value="cardiologie">Cardiologie</option>
                <option value="dermatologie">Dermatologie</option>
              </select>

              <label className="label">Médecin (facultatif) :</label>
              <input type="text" name="medecin" className="input" value={rdvData.medecin} onChange={handleChange} />

              <label className="label">Date :</label>
              <input type="date" name="date" required className="input" value={rdvData.date} onChange={handleChange} />

              <label className="label">Plage horaire :</label>
              <select name="heure" required className="input" value={rdvData.heure} onChange={handleChange}>
                <option value="">-- Choisir une heure --</option>
                <option value="08:00">08:00</option>
                <option value="10:00">10:00</option>
                <option value="14:00">14:00</option>
              </select>

              <button type="submit" className="submit-button">Valider</button>
            </form>
          </div>
        );
      case 'historique':
        { const userRDVs = rendezVous.filter(rdv => rdv.username === user?.username);
        return (
          <div className="section">
            <h2 className="section-title">Historique des Rendez-vous</h2>
           {userRDVs.length > 0 ? (
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Date</th>
                    <th>Heure</th>
                    <th>Spécialités du Médecin</th>
                    <th>Médecin </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userRDVs.map((rdv, index) => (
                    <tr key={index}>
                      <td>{rdv.nom}</td>
                      <td>{rdv.prenom}</td>
                      <td>{rdv.date}</td>
                      <td>{rdv.heure}</td>
                      <td>{rdv.specialite}</td>
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
        ); }
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
        <h2 className="sidebar-title">Espace Patient</h2>
        <ul className="nav-list">
          <li className={`nav-item ${selectedSection === 'profil' ? 'nav-item-active' : ''}`} onClick={() => setSelectedSection('profil')}>Profil</li>
          <li className={`nav-item ${selectedSection === 'rdv' ? 'nav-item-active' : ''}`} onClick={() => setSelectedSection('rdv')}>Gestion de Rendez-vous</li>
          <li className={`nav-item ${selectedSection === 'historique' ? 'nav-item-active' : ''}`} onClick={() => setSelectedSection('historique')}>Historique</li>
          <li className={`nav-item ${selectedSection === 'notifications' ? 'nav-item-active' : ''}`} onClick={() => setSelectedSection('notifications')}>Notifications</li>
        </ul>
        <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
      </nav>
      <main className="main">
        <h1 className="main-title">Bienvenue {user?.username || 'Patient'}</h1>
        {renderContent()}
      </main>
    </div>
  );
};

export default Patient;
