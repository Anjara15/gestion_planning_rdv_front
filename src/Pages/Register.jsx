import { useState } from "react";

const Register = () => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [role, setRole] = useState("EMPLOYE"); 
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8081/api/utilisateurs/inscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ nom, email, motDePasse, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Inscription réussie !");
        setNom("");
        setEmail("");
        setMotDePasse("");
        setRole("EMPLOYE");
      } else {
        setMessage(data.message || "Erreur lors de l'inscription.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      setMessage("Erreur serveur.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Créer un compte</h2>
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
            style={styles.input}
            autoComplete="current-password"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            style={styles.input}
          >
            <option value="EMPLOYE">Employé</option>
            <option value="TECHNICIEN">Technicien</option>
            <option value="ADMIN">Administrateur</option>
          </select>
          <button type="submit" style={styles.button}>S'inscrire</button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #74ebd5, #9face6)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    overflow: "hidden",
  },
  card: {
    padding: "2.5rem",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#ffffff",
    width: "100%",
    maxWidth: "420px",
    animation: "fadeIn 0.6s ease-in-out",
  },
  title: {
    textAlign: "center",
    marginBottom: "2rem",
    color: "#333",
    fontSize: "1.8rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
  input: {
    padding: "0.85rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    transition: "border-color 0.3s",
    outline: "none",
  },
  button: {
    padding: "0.85rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#4a6cf7",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  message: {
    marginTop: "1rem",
    textAlign: "center",
    color: "#444",
    fontSize: "1rem",
  },
};

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
`,
  styleSheet.cssRules.length
);

export default Register;