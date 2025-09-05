// --- Liste par défaut ---
const defaultCandidates = [
  { id: 1, name: "THOMAS LAMAH", photo: "./images/homme-calme.jpg" },
  { id: 2, name: "MAHAMADOU SIDIBE", photo: "./images/Mon_image.jpg" },
  { id: 3, name: "JOSEPH SAGNO", photo: "./images/portrait-de-succes-entrepreneur.jpg" },
  { id: 4, name: "BOUBACAR DIALLO", photo: "./images/je-sais-exactement-ce-que-je-veux.jpg" }
];

// --- Charger les candidats depuis localStorage (si modifiés) ---
let candidates = JSON.parse(localStorage.getItem("candidates")) || [...defaultCandidates];

// --- Charger votes depuis localStorage ---
let votes = JSON.parse(localStorage.getItem("votes")) || {};
candidates.forEach(c => {
  if (!votes[c.id]) votes[c.id] = 0;
});

// Sauvegarde votes
function saveVotes() {
  localStorage.setItem("votes", JSON.stringify(votes));
}

// Sauvegarde candidats modifiés
function saveCandidates() {
  localStorage.setItem("candidates", JSON.stringify(candidates));
}

// Réinitialiser les votes uniquement
function resetVotes() {
  if (confirm("⚠️ Voulez-vous vraiment réinitialiser tous les votes ?")) {
    votes = {};
    candidates.forEach(c => votes[c.id] = 0);
    saveVotes();
    renderCandidates();
    document.getElementById("results").innerHTML = "<h2>Résultats des votes</h2>";
    alert("✅ Votes réinitialisés avec succès !");
  }
}

// Réinitialiser complètement (votes + candidats par défaut) en cas de reload
window.addEventListener("beforeunload", () => {
  // Supprimer les candidats pour forcer le retour aux valeurs par défaut
  localStorage.removeItem("candidates");
});

// Affichage candidats
function renderCandidates() {
  const container = document.getElementById("candidates");
  container.innerHTML = "";
  candidates.forEach(c => {
    const div = document.createElement("div");
    div.className = "candidate";
    div.innerHTML = `
      <img src="${c.photo}" alt="${c.name}">
      <h3 contenteditable="true" onblur="updateName(${c.id}, this.innerText)">${c.name}</h3>
      <input type="file" accept="image/*" onchange="updatePhoto(${c.id}, this)">
      <button onclick="vote(${c.id})">Voter</button>
    `;
    container.appendChild(div);
  });
}

// Mise à jour du nom d’un candidat
function updateName(id, newName) {
  const candidate = candidates.find(c => c.id === id);
  if (candidate) {
    candidate.name = newName;
    saveCandidates();
  }
}

// Mise à jour de la photo d’un candidat
function updatePhoto(id, input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const candidate = candidates.find(c => c.id === id);
    if (candidate) {
      candidate.photo = e.target.result; // stock en base64
      saveCandidates();
      renderCandidates(); // réaffiche avec nouvelle image
    }
  };
  reader.readAsDataURL(file);
}

// Voter
function vote(id) {
  const candidate = candidates.find(c => c.id === id);
  if (!candidate) return;

  const confirmVote = confirm(`Voulez-vous vraiment voter pour ${candidate.name} ?`);
  if (confirmVote) {
    votes[id]++;
    saveVotes();
    alert("✅ Votre vote pour " + candidate.name + " a été enregistré !");
  } else {
    alert("❌ Vote annulé.");
  }
}

// Voir résultats
function showResults() {
  const container = document.getElementById("results");

  container.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <h2>Résultats des votes</h2>
      <button class="reset-btn" onclick="resetVotes()">🔄 Reset Votes</button>
    </div>
    <div class='candidates'></div>
  `;

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  const sorted = [...candidates].sort((a, b) => votes[b.id] - votes[a.id]);

  const resultContainer = container.querySelector(".candidates");

  sorted.forEach(c => {
    const count = votes[c.id];
    const percentage = totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : 0;

    const div = document.createElement("div");
    div.className = "candidate";
    div.innerHTML = `
      <img src="${c.photo}" alt="${c.name}">
      <h3>${c.name}</h3>
      <div class="votes">${count} votes (${percentage}%)</div>
      <div class="progress-bar">
        <div class="progress" style="width: ${percentage}%;"></div>
      </div>
    `;
    resultContainer.appendChild(div);
  });
}

renderCandidates();

// Fonction d'affichage des candidats avec upload d'image
function renderCandidates() {
  const container = document.getElementById("candidates");
  container.innerHTML = "";
  candidates.forEach(c => {
    const div = document.createElement("div");
    div.className = "candidate";
    div.innerHTML = `
      <img src="${c.photo}" alt="${c.name}" id="photo-${c.id}">
      <h3 contenteditable="true" onblur="updateName(${c.id}, this.innerText)">${c.name}</h3>
      <div class="file-upload">
        <input type="file" id="file-${c.id}" accept="image/*" onchange="updatePhoto(event, ${c.id})">
        <label for="file-${c.id}">📂 Choisir une image</label>
      </div>
      <button onclick="vote(${c.id})">Voter</button>
    `;
    container.appendChild(div);
  });
}

// Mettre à jour le nom
function updateName(id, newName) {
  candidates.find(c => c.id === id).name = newName;
}

// Mettre à jour la photo
function updatePhoto(event, id) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById(`photo-${id}`).src = e.target.result;
      candidates.find(c => c.id === id).photo = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// Ajouter un nouveau candidat
function addCandidate() {
  const newId = candidates.length + 1;
  candidates.push({
    id: newId,
    name: "Nouveau Candidat",
    photo: "./images/default.jpg"
  });
  votes[newId] = 0;
  saveVotes();
  renderCandidates();
}

// Réinitialiser uniquement les nouveaux candidats et les modifications
function resetCandidates() {
  if (!confirm("⚠️ Réinitialiser les candidats aux valeurs par défaut ? Les nouveaux candidats seront supprimés et les modifications annulées.")) {
    return;
  }

  // Remettre les candidats par défaut exactement comme au départ
  candidates = defaultCandidates.map(c => ({ ...c }));
  
  // Réinitialiser les votes des candidats par défaut si besoin
  defaultCandidates.forEach(c => {
    if (!votes[c.id]) votes[c.id] = 0;
  });

  // Supprimer les votes ou candidats ajoutés non par défaut
  Object.keys(votes).forEach(id => {
    if (!defaultCandidates.find(c => c.id == id)) {
      delete votes[id];
    }
  });

  saveCandidates();
  saveVotes();
  renderCandidates();
  showResults();
  alert("✅ Candidats réinitialisés aux valeurs par défaut !");
}

// Le bouton Aide pour afficher l'utilisation du projet vote
function showHelp() {
  document.getElementById("help-box").style.display = "block";
}

function hideHelp() {
  document.getElementById("help-box").style.display = "none";
}