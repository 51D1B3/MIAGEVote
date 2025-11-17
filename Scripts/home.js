// Fonctions de la page d'accueil (animation et redirection)

// Fonction pour démarrer le vote
function startVoting() {
  // Animation de transition
  document.body.style.opacity = '0';
  document.body.style.transform = 'scale(0.95)';

  setTimeout(() => {
    // Redirige vers la page de vote située dans le dossier Pages
    window.location.href = 'Pages/page.html';
  }, 300);
}

// Initialisation (entrées visuelles uniquement)
document.addEventListener('DOMContentLoaded', () => {
  // Animation d'entrée
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'all 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});