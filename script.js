// Liste des candidats
const candidates = [
  { id: 1, name: "THOMAS LAMAH", photo: "./images/homme-calme.jpg" },
  { id: 2, name: "MAHAMADOU SIDIBE", photo: "./images/11503652.jpg" },
  { id: 3, name: "JOSEPH SAGNO", photo: "./images/portrait-de-succes-entrepreneur.jpg" },
  { id: 4, name: "BOUBACAR DIALLO", photo: "./images/je-sais-exactement-ce-que-je-veux.jpg" }
];

// Charger votes depuis localStorage
let votes = JSON.parse(localStorage.getItem("votes")) || {};
candidates.forEach(c => {
  if (!votes[c.id]) votes[c.id] = 0;
});

// Sauvegarde
function saveVotes() {
  localStorage.setItem("votes", JSON.stringify(votes));
}

// Affichage candidats
function renderCandidates() {
  const container = document.getElementById("candidates");
  container.innerHTML = "";
  candidates.forEach(c => {
    const div = document.createElement("div");
    div.className = "candidate";
    div.innerHTML = `
      <img src="${c.photo}" alt="${c.name}">
      <h3>${c.name}</h3>
      <button onclick="vote(${c.id})">Voter</button>
    `;
    container.appendChild(div);
  });
}

// Voter avec confirmation
function vote(id) {
  const candidate = candidates.find(c => c.id === id);
  let confirmation = confirm(`Voulez-vous vraiment voter pour ${candidate.name} ?`);

  if (confirmation) {
    votes[id]++;
    saveVotes();
    alert("✅ Vote pour " + candidate.name + " a été enregistré avec succès !");
  } else {
    alert("❌ Vote annulé !");
  }
}

// Réinitialiser les votes
function resetVotes() {
  if (confirm("⚠️ Voulez-vous vraiment réinitialiser tous les votes ?")) {
    votes = {};
    candidates.forEach(c => votes[c.id] = 0);
    saveVotes();
    renderCandidates();
    document.getElementById("results").innerHTML = "<h2>Résultats des votes</h2>";
    
    // Message de confirmation
    alert("✅ Votes réinitialisés avec succès !");
  }
}

// Voir résultats
function showResults() {
  const container = document.getElementById("results");

  // Bouton Reset en haut du titre
  container.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <h2>Résultats des votes</h2>
      <button class="reset-btn" onclick="resetVotes()">🔄 Reset</button>
    </div>
    <div class='candidates'></div>
  `;

  // Total des votes
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  // Trier par nombre de votes décroissant
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
