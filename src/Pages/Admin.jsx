import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Button, Form, Table, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faUserMd, 
  faCalendarCheck, 
  faBell, 
  faSignOutAlt, 
  faUserCircle, 
  faPlus, 
  faTimes 
} from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
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
    age: '',
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
      age: form.age,
      email: form.email,
      role: form.role,
      password: form.password,
    };

    const updatedUsers = [...users, nouveauUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    setForm({ username: '', age: '', email: '', role: '', password: '' });
    setShowForm(false);
  };

  const handleDeleteUser = (indexToDelete) => {
    const updatedUsers = users.filter((_, i) => i !== indexToDelete);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={3} lg={2} className="admin-sidebar">
          <div className="sidebar-content">
            <h3 className="text-center mb-4 fw-bold text-white">
              <FontAwesomeIcon icon={faUserCircle} className="me-2" />
              Espace Administrateur
            </h3>
            <Nav className="flex-column">
              <Nav.Link 
                className={`admin-nav-link text-white ${selectedSection === 'utilisateurs' ? 'active' : ''}`}
                onClick={() => setSelectedSection('utilisateurs')}
              >
                <FontAwesomeIcon icon={faUsers} className="me-2" />
                Gestion des Utilisateurs
              </Nav.Link>
              <Nav.Link 
                className={`admin-nav-link text-white ${selectedSection === 'medecins' ? 'active' : ''}`}
                onClick={() => setSelectedSection('medecins')}
              >
                <FontAwesomeIcon icon={faUserMd} className="me-2" />
                Gestion des Médecins
              </Nav.Link>
              <Nav.Link 
                className={`admin-nav-link text-white ${selectedSection === 'rdv' ? 'active' : ''}`}
                onClick={() => setSelectedSection('rdv')}
              >
                <FontAwesomeIcon icon={faCalendarCheck} className="me-2" />
                Gestion des RDV
              </Nav.Link>
              <Nav.Link 
                className={`admin-nav-link text-white ${selectedSection === 'notifications' ? 'active' : ''}`}
                onClick={() => setSelectedSection('notifications')}
              >
                <FontAwesomeIcon icon={faBell} className="me-2" />
                Notifications
              </Nav.Link>
            </Nav>
          </div>
          
          <div className="logout-container">
            <button className="logout-btn" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
              Déconnexion
            </button>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={9} lg={10} className="admin-content px-4 py-3">
          <div className="admin-card">
            <h2 className="mb-4 d-flex align-items-center">
              <FontAwesomeIcon icon={faUserCircle} className="me-2" />
              Bienvenue {user?.username || 'Administrateur'}
            </h2>
            
            {selectedSection === 'utilisateurs' && (
              <div className="admin-card">
                <Button 
                  variant="primary" 
                  className="admin-button mb-3"
                  onClick={() => setShowForm(!showForm)}
                >
                  <FontAwesomeIcon icon={showForm ? faTimes : faPlus} className="me-2" />
                  {showForm ? 'Annuler' : 'Ajouter un utilisateur'}
                </Button>

                {showForm && (
                  <Form onSubmit={handleAddUser} className="mb-4">
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Nom d'utilisateur</Form.Label>
                          <Form.Control
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Âge</Form.Label>
                          <Form.Control
                            type="text"
                            name="age"
                            value={form.age}
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
                            value={form.email}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Rôle</Form.Label>
                          <Form.Select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            required
                          >
                            <option value="">-- Choisir un rôle --</option>
                            <option value="patient">Patient</option>
                            <option value="medecin">Médecin</option>
                            <option value="admin">Administrateur</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Mot de passe</Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Button type="submit" variant="success">
                          Enregistrer
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}

                {users.length > 0 && (
                  <Table className="admin-table" striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Nom d'utilisateur</th>
                        <th>Email</th>
                        <th>Âge</th>
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
                            <Button 
                              variant="warning" 
                              size="sm" 
                              className="me-2"
                              onClick={() => alert(`Modifier ${user.username}`)}
                            >
                              Modifier
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => handleDeleteUser(index)}
                            >
                              Supprimer
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
            )}

            {selectedSection === 'medecins' && (
              <div className="admin-card">
                <h3 className="mb-3">Liste des Médecins</h3>
                {medecins.length > 0 ? (
                  <Table className="admin-table" striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Âge</th>
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
                            <Button 
                              variant="warning" 
                              size="sm" 
                              className="me-2"
                              onClick={() => alert(`Modifier ${med.username}`)}
                            >
                              Modifier
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => handleDeleteUser(users.indexOf(med))}
                            >
                              Supprimer
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info">
                    Aucun médecin enregistré.
                  </Alert>
                )}
              </div>
            )}

            {selectedSection === 'rdv' && (
              <div className="admin-card">
                <h3 className="mb-3">Gestion des Rendez-vous</h3>
                {rendezVous.length > 0 ? (
                  <Table className="admin-table" striped bordered hover responsive>
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
              </div>
            )}

            {selectedSection === 'notifications' && (
              <div className="admin-card">
                <Alert variant="info">
                  Pas de notifications pour l'instant.
                </Alert>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Admin;