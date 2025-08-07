import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Button, Form, Table, Alert, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendar, 
  faClock,
  faUserCircle, 
  faUserMd, 
  faHistory, 
  faSignOutAlt, 
  faPlus 
} from '@fortawesome/free-solid-svg-icons';
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
                      <td>
                        <span className={`badge bg-${rdv.statut === 'terminé' ? 'success' : 'warning'}`}>
                          {rdv.statut || 'à venir'}
                        </span>
                      </td>
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
              </table>
            ) : (
              <Alert variant="info">
                Aucun rendez-vous enregistré.
              </Alert>
            )}
          </div>
        );

      case 'creneaux':
        return (
          <div className="section">
            <h2 className="section-title">Gérer les Créneaux</h2>
            <form className="form" onSubmit={handleAddCreneau}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" name="date" required />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Heure de début</Form.Label>
                    <Form.Control type="time" name="heureDebut" required />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Heure de fin</Form.Label>
                    <Form.Control type="time" name="heureFin" required />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Remarques</Form.Label>
                    <Form.Control as="textarea" name="remarques" rows={3} />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Button type="submit" variant="primary">
                    Ajouter Créneau
                  </Button>
                </Col>
              </Row>
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
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={3} lg={2} className="bg-dark min-vh-100">
          <div className="d-flex flex-column h-100 p-3">
            <h3 className="text-white text-center mb-4">
              <FontAwesomeIcon icon={faUserMd} className="me-2" />
              Espace Médecin
            </h3>
            
            <Nav className="flex-column mb-auto">
              <Nav.Link 
                className={`text-white py-2 my-1 ${selectedSection === 'rdv' ? 'bg-primary rounded' : ''}`}
                onClick={() => setSelectedSection('rdv')}
              >
                <FontAwesomeIcon icon={faCalendar} className="me-2" />
                Liste des RDV
              </Nav.Link>
              <Nav.Link 
                className={`text-white py-2 my-1 ${selectedSection === 'listeCreneaux' ? 'bg-primary rounded' : ''}`}
                onClick={() => setSelectedSection('listeCreneaux')}
              >
                <FontAwesomeIcon icon={faClock} className="me-2" />
                Liste des Créneaux
              </Nav.Link>
              <Nav.Link 
                className={`text-white py-2 my-1 ${selectedSection === 'creneaux' ? 'bg-primary rounded' : ''}`}
                onClick={() => setSelectedSection('creneaux')}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Gérer les Créneaux
              </Nav.Link>
              <Nav.Link 
                className={`text-white py-2 my-1 ${selectedSection === 'patients' ? 'bg-primary rounded' : ''}`}
                onClick={() => setSelectedSection('patients')}
              >
                <FontAwesomeIcon icon={faUserMd} className="me-2" />
                Gestion des Patients
              </Nav.Link>
              <Nav.Link 
                className={`text-white py-2 my-1 ${selectedSection === 'historique' ? 'bg-primary rounded' : ''}`}
                onClick={() => setSelectedSection('historique')}
              >
                <FontAwesomeIcon icon={faHistory} className="me-2" />
                Historique
              </Nav.Link>
            </Nav>

            <Button 
              variant="danger" 
              className="mt-auto"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
              Déconnexion
            </Button>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={9} lg={10} className="bg-light min-vh-100">
          <div className="p-4">
              <h2 className="mb-4 d-flex align-items-center">
                <FontAwesomeIcon icon={faUserCircle} className="me-2" />
                Bienvenue {user?.username || 'Médecin'}
              </h2>
            {selectedSection === 'rdv' && (
              <Card>
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">Liste des Rendez-vous</h5>
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
                            <td>
                              <span className={`badge bg-${rdv.statut === 'terminé' ? 'success' : 'warning'}`}>
                                {rdv.statut || 'à venir'}
                              </span>
                            </td>
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

            {selectedSection === 'creneaux' && (
              <Card>
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">Gérer les Créneaux</h5>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleAddCreneau}>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Date</Form.Label>
                          <Form.Control type="date" name="date" required />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Heure de début</Form.Label>
                          <Form.Control type="time" name="heureDebut" required />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Heure de fin</Form.Label>
                          <Form.Control type="time" name="heureFin" required />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>Remarques</Form.Label>
                          <Form.Control as="textarea" name="remarques" rows={3} />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Button type="submit" variant="primary">
                          Ajouter Créneau
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            )}

            {selectedSection === 'patients' && (
              <Card>
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">Gestion des Patients</h5>
                </Card.Header>
                <Card.Body>
                  {patients.length > 0 ? (
                    <Table hover responsive>
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
                      Aucun patient enregistré.
                    </Alert>
                  )}
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

            {selectedSection === 'listeCreneaux' && (
              <Card>
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">Liste des Créneaux</h5>
                </Card.Header>
                <Card.Body>
                  {creneaux.length > 0 ? (
                    <Table hover responsive>
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
                      Aucun créneau enregistré.
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Medecin;
