// Gestion du thème sombre/clair
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Charger le thème sauvegardé
function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

// Fonction pour démarrer le vote
function startVoting() {
  // Animation de transition
  document.body.style.opacity = '0';
  document.body.style.transform = 'scale(0.95)';
  
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 300);
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  
  // Animation d'entrée
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'all 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});