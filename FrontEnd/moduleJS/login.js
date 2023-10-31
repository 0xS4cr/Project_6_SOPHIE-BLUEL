import apiUrl from './apiUrl.js';

async function login() {
  try {
    // On récupère les données à envoyer
    const loginForm = document.querySelector(".login-in");
    // On récupère l'élément qui affichera le message d'erreur
    const error = document.querySelector(".error");
    // On écoute l'événement submit du formulaire
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      // On récupère les données du formulaire
      const logData = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=motdepasse]").value,
      };
      // On envoie les données au serveur
      try {
        const response = await fetch(`${apiUrl}users/login`, {
          // On précise la méthode POST pour envoyer les données au serveur (par défaut c'est GET)
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(logData),
        });

        // On vérifie si la requête a réussi avec les conditions
        if (response.ok) {
          const token = await response.json();
          // On stocke le token récupéré dans le sessionStorage
          sessionStorage.setItem("token", JSON.stringify(token));
          // On redirige vers la page d'accueil
          window.location.href = "../index.html";
        } else {
          // Affiche un message d'erreur en cas d'échec
          error.textContent = "Erreur dans l’identifiant ou le mot de passe";
        }
      } catch (error) {
        // En cas de problème connexion serveur
        alert("Problème de connexion au serveur");
      }
    });
  } catch (error) {
    console.error(error);
  }
}

login();
