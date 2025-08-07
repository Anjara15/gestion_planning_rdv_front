import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Button, Form, Table, Alert, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faCalendarPlus, 
  faHistory, 
  faBell, 
  faSignOutAlt,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
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
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <div className="sidebar">
          <div className="d-flex flex-column h-100">
            <div className="sidebar-header">
              <h3 className="text-white text-center">
                <FontAwesomeIcon icon={faUserCircle} className="me-2" />
                Espace Patient
              </h3>
            </div>
            
            <Nav className="flex-column sidebar-nav">
              <Nav.Link 
                className={`d-flex align-items-center ${selectedSection === 'profil' ? 'active' : ''}`}
                onClick={() => setSelectedSection('profil')}
              >
                <FontAwesomeIcon icon={faUser} className="me-2 text-white" />
                Mon Profil
              </Nav.Link>
              
              <Nav.Link 
                className={`d-flex align-items-center ${selectedSection === 'rdv' ? 'active' : ''}`}
                onClick={() => setSelectedSection('rdv')}
              >
                <FontAwesomeIcon icon={faCalendarPlus} className="me-2" />
                Nouveau RDV
              </Nav.Link>
              
              <Nav.Link 
                className={`d-flex align-items-center ${selectedSection === 'historique' ? 'active' : ''}`}
                onClick={() => setSelectedSection('historique')}
              >
                <FontAwesomeIcon icon={faHistory} className="me-2" />
                Mes RDV
              </Nav.Link>
              
              <Nav.Link 
                className={`d-flex align-items-center ${selectedSection === 'notifications' ? 'active' : ''}`}
                onClick={() => setSelectedSection('notifications')}
              >
                <FontAwesomeIcon icon={faBell} className="me-2" />
                Messages
              </Nav.Link>
            </Nav>

            <Button   variant="danger"   className="mt-auto"  onClick={handleLogout}  >
              <FontAwesomeIcon icon={faSignOutAlt} className="me-2 " />
              Se déconnecter
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <h2 className="mb-4 d-flex align-items-center">
            <FontAwesomeIcon icon={faUserCircle} className="me-2" />
            Bienvenue {user?.username}
          </h2>

          {selectedSection === 'rdv' && (
            <Card>
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Prendre un Rendez-vous</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleRDVSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Nom</Form.Label>
                        <Form.Control
                          type="text"
                          name="nom"
                          value={rdvData.nom}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Prénom</Form.Label>
                        <Form.Control
                          type="text"
                          name="prenom"
                          value={rdvData.prenom}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={rdvData.email}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Téléphone</Form.Label>
                        <Form.Control
                          type="tel"
                          name="telephone"
                          value={rdvData.telephone}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Spécialité</Form.Label>
                        <Form.Select
                          name="specialite"
                          value={rdvData.specialite}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Choisir une spécialité --</option>
                          <option value="generaliste">Médecine générale</option>
                          <option value="cardiologie">Cardiologie</option>
                          <option value="dermatologie">Dermatologie</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Médecin (facultatif)</Form.Label>
                        <Form.Control
                          type="text"
                          name="medecin"
                          value={rdvData.medecin}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="date"
                          value={rdvData.date}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Heure</Form.Label>
                        <Form.Select
                          name="heure"
                          value={rdvData.heure}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Choisir une heure --</option>
                          <option value="08:00">08:00</option>
                          <option value="10:00">10:00</option>
                          <option value="14:00">14:00</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Button type="submit" variant="primary">
                        Valider le rendez-vous
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          )}

          {selectedSection === 'historique' && (
            <Card>
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Historique des Rendez-vous</h5>
              </Card.Header>
              <Card.Body>
                {rendezVous.length > 0 ? (
                  <Table hover responsive>
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Date</th>
                        <th>Heure</th>
                        <th>Spécialité</th>
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
                          <td>{rdv.specialite}</td>
                          <td>{rdv.medecin}</td>
                          <td>
                            <Button variant="warning" size="sm" className="me-2">
                              Modifier
                            </Button>
                            <Button variant="danger" size="sm">
                              Supprimer
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info">
                    Aucun rendez-vous enregistré.
                  </Alert>
                )}
              </Card.Body>
            </Card>
          )}

          {selectedSection === 'notifications' && (
            <Card>
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Notifications</h5>
              </Card.Header>
              <Card.Body>
                <Alert variant="info">
                  Pas de notifications pour l'instant.
                </Alert>
              </Card.Body>
            </Card>
          )}
        </div>
      </Row>
    </Container>
  );
};

export default Patient;
