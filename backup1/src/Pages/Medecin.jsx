import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Medecin.css';

const Medecin = () => {
  const [selectedSection, setSelectedSection] = useState('rdv');
  const [user, setUser] = useState(null);
  const [rendezVous, setRendezVous] = useState([]);
  const [creneaux, setCreneaux] = useState([]);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedRDV = JSON.parse(localStorage.getItem('rendezVous')) || [];
    const storedCreneaux = JSON.parse(localStorage.getItem('creneaux')) || [];
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const storedPatients = allUsers.filter(u => u.role === 'patient');

    if (!storedUser || storedUser.role !== 'medecin') {
      navigate('/');
    } else {
      setUser(storedUser);
      setRendezVous(storedRDV);
      setCreneaux(storedCreneaux);
      setPatients(storedPatients);
    }
  }, [navigate]);


  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleAddCreneau = (e) => {
    e.preventDefault();
    const form = e.target;
    const nouveauCreneau = {
      date: form.date.value,
      heureDebut: form.heureDebut.value,
      heureFin: form.heureFin.value,
      remarques: form.remarques.value,
    };

    const updatedCreneaux = [...creneaux, nouveauCreneau];
    setCreneaux(updatedCreneaux);
    localStorage.setItem('creneaux', JSON.stringify(updatedCreneaux));
    form.reset();
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'rdv':
        return (
          <div className="section">
            <h2 className="section-title">Liste des Rendez-vous</h2>
            {rendezVous.length > 0 ? (
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Prenom</th>
                    <th>Date</th>
                    <th>Heure</th>
                    <th>Statut</th>
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
                      <td>{rdv.statut || 'à venir'}</td>
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

      case 'creneaux':
        return (
          <div className="section">
            <h2 className="section-title">Gérer les Créneaux</h2>
            <form className="form" onSubmit={handleAddCreneau}>
              <label className="label">Date :</label>
              <input type="date" name="date" required className="input" />

              <label className="label">Heure de début :</label>
              <input type="time" name="heureDebut" required className="input" />

              <label className="label">Heure de fin :</label>
              <input type="time" name="heureFin" required className="input" />

              <label className="label">Remarques (facultatif) :</label>
              <textarea name="remarques" rows="3" className="textarea" />

              <button type="submit" className="submit-button">
                Ajouter Créneau
              </button>
            </form>
          </div>
        );

      case 'patients':
        return (
          <div className="section">
            <h2 className="section-title">Gestion des Patients</h2>
            {patients.length > 0 ? (
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Age</th>
                    <th>Dossier</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient, index) => (
                    <tr key={index}>
                      <td>{patient.username}</td>
                      <td>{patient.age}</td>
                      <td>{patient.dossier}</td>
                      <td>
                        <button className="action-button">Modifier</button>
                        <button className="action-button action-button-delete">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="section-text">Aucun patient enregistré.</p>
            )}
          </div>
        );

      case 'historique':
        return (
          <div className="section">
            <h2 className="section-title">Historique des Rendez-vous</h2>
            {rendezVous.length > 0 ? (
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Date</th>
                    <th>Heure</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rendezVous.map((rdv, index) => (
                    <tr key={index}>
                      <td>{rdv.nom}</td>
                      <td>{rdv.date}</td>
                      <td>{rdv.heure}</td>
                      <td>{rdv.statut}</td>
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

      case 'listeCreneaux':
        return (
          <div className="section">
            <h2 className="section-title">Liste des Créneaux</h2>
            {creneaux.length > 0 ? (
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Heure de début</th>
                    <th>Heure de fin</th>
		                <th>Remarques</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {creneaux.map((cr, index) => (
                    <tr key={index}>
                      <td>{cr.date}</td>
                      <td>{cr.heureDebut}</td>
                      <td>{cr.heureFin}</td>
                      <td>{cr.remarques && `  ${cr.remarques}`}</td>
                      <td>
                        <button className="action-button">Modifier</button>
                        <button className="action-button action-button-delete">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="section-text">Aucun créneau enregistré.</p>
            )}
          </div>
        );


      default:
        return <p className="section-text">Section inconnue</p>;
    }
  };

  return (
    <div className="container">
      <nav className="sidebar">
        <h2 className="sidebar-title">Espace Médecin</h2>
        <ul className="nav-list">
          <li onClick={() => setSelectedSection('rdv')} className={`nav-item ${selectedSection === 'rdv' ? 'nav-item-active' : ''}`}>
            Liste des RDV
          </li>
         <li onClick={() => setSelectedSection('listeCreneaux')} className={`nav-item ${selectedSection === 'listeCreneaux' ? 'nav-item-active' : ''}`}>
            Liste des Créneaux
          </li>
          <li onClick={() => setSelectedSection('creneaux')} className={`nav-item ${selectedSection === 'creneaux' ? 'nav-item-active' : ''}`}>
            Gérer les Créneaux
          </li>
          <li onClick={() => setSelectedSection('patients')} className={`nav-item ${selectedSection === 'patients' ? 'nav-item-active' : ''}`}>
            Gestion des Patients
          </li>
          <li onClick={() => setSelectedSection('historique')} className={`nav-item ${selectedSection === 'historique' ? 'nav-item-active' : ''}`}>
            Historique
          </li>

        </ul>
        <button onClick={handleLogout} className="logout-btn">
          Déconnexion
        </button>
      </nav>
      <main className="main">
        <h1 className="main-title">Bienvenue {user?.username || 'Médecin'}</h1>
        {renderContent()}
      </main>
    </div>
  );
};

export default Medecin;
