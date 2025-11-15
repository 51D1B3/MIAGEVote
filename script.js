// --- Liste par défaut ---
const defaultCandidates = [
  { id: 1, name: "THOMAS LAMAH", photo: "./images/homme-calme.jpg" },
  { id: 2, name: "MAHAMADOU SIDIBE", photo: "./images/Mon_image.jpg" },
  { id: 3, name: "JOSEPH SAGNO", photo: "./images/portrait-de-succes-entrepreneur.jpg" },
];

// --- Charger les candidats depuis localStorage (si modifiés) ---
let candidates = JSON.parse(localStorage.getItem("candidates")) || [...defaultCandidates];

// --- Charger votes depuis localStorage ---
let votes = JSON.parse(localStorage.getItem("votes")) || {};
candidates.forEach(c => {
  if (!votes[c.id]) votes[c.id] = 0;
});
// Bulletin nul
if (!votes.null) votes.null = 0;

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
    votes.null = 0;
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
  }
}

// Voter nul
function voteNull() {
  const confirmVote = confirm("Voulez-vous vraiment voter bulletin nul (ne voter pour aucun candidat) ?");
  if (confirmVote) {
    votes.null++;
    saveVotes();
    alert("✅ Votre bulletin nul a été enregistré !");
  }
}

// Voir résultats
function showResults() {
  const container = document.getElementById("results");

  container.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <h2>Résultats des votes</h2>
      <button onclick="downloadPDF()" class="pdf-btn">📄 Télécharger</button>
      <button class="reset-btn" onclick="resetVotes()">🔄 Reset Votes</button>
    </div>
    <div class='candidates'></div>
  `;

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  const nullVotes = votes.null || 0;
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
        <div class="progress-fill" style="width: ${percentage}%;"></div>
      </div>
    `;
    resultContainer.appendChild(div);
  });

  // Afficher les bulletins nuls
  const nullPercentage = totalVotes > 0 ? ((nullVotes / totalVotes) * 100).toFixed(1) : 0;
  const nullDiv = document.createElement("div");
  nullDiv.className = "candidate";
  nullDiv.innerHTML = `
    <div style="width: 100%; height: 220px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; border-radius: 12px; border: 2px solid #dc3545;">
      <span style="font-size: 80px; color: #dc3545;">❌</span>
    </div>
    <h3>Bulletins Nuls</h3>
    <div class="votes">${nullVotes} votes (${nullPercentage}%)</div>
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${nullPercentage}%; background: #dc3545;"></div>
    </div>
  `;
  resultContainer.appendChild(nullDiv);
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
  
  // Ajouter le bulletin nul
  const nullDiv = document.createElement("div");
  nullDiv.className = "candidate";
  nullDiv.innerHTML = `
    <div style="width: 100%; height: 220px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; border-radius: 12px; border: 2px solid #dc3545;">
      <span style="font-size: 80px; color: #dc3545;">❌</span>
    </div>
    <h3>Bulletin Nul</h3>
    <div style="height: 40px;"></div>
    <button onclick="voteNull()" style="background: linear-gradient(135deg, #dc3545, #c82333);">Voter Nul</button>
  `;
  container.appendChild(nullDiv);
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

// // Fonction pour télécharger le PDF des résultats
// function downloadPDF() {
//     if (candidates.length === 0) {
//         alert("Aucun candidat à exporter !");
//         return;
//     }

//     const sorted = [...candidates].sort((a, b) => votes[b.id] - votes[a.id]);
//     const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
//     const nullVotes = votes.null || 0;
    
//     const now = new Date();
//     const dateTime = now.toLocaleDateString("fr-FR") + " à " + now.toLocaleTimeString("fr-FR");
//     const fileDateTime = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);

//     // Créer un élément temporaire visible
//     const tempDiv = document.createElement('div');
//     tempDiv.style.position = 'absolute';
//     tempDiv.style.left = '-9999px';
//     tempDiv.style.top = '0';
//     tempDiv.style.width = '210mm';
//     tempDiv.style.backgroundColor = 'white';
//     tempDiv.style.padding = '20px';
//     tempDiv.style.fontFamily = 'Arial, sans-serif';
    
//     let html = `
//         <div style="text-align: center; margin-bottom: 30px;">
//             <h1 style="color: #333; margin-bottom: 10px;">Résultats des Votes SidiVote</h1>
//             <p style="color: #666; font-size: 14px;">Généré le : ${dateTime}</p>
//         </div>
//         <h2 style="color: #333; margin-bottom: 20px;">Classement des candidats</h2>
//     `;

//     sorted.forEach((c, index) => {
//         const percentage = totalVotes > 0 ? ((votes[c.id] / totalVotes) * 100).toFixed(1) : 0;
//         const isWinner = index === 0;
        
//         html += `
//             <div style="padding: 15px; margin: 10px 0; border: 1px solid #ddd; border-radius: 8px; ${isWinner ? 'background: #d4f8d4; border: 2px solid #27ae60;' : 'background: white;'}">
//                 <div style="font-size: 18px; font-weight: bold; ${isWinner ? 'color: #27ae60;' : 'color: #333;'}">
//                     ${index + 1}${isWinner ? '. 🏆' : '.'} ${c.name}
//                 </div>
//                 <div style="font-size: 14px; margin-top: 5px; ${isWinner ? 'color: #27ae60; font-weight: bold;' : 'color: #666;'}">
//                     ${votes[c.id]} votes (${percentage}%)
//                 </div>
//             </div>
//         `;
//     });

//     const validVotes = totalVotes - nullVotes;
//     const avgVotes = validVotes > 0 ? (validVotes / candidates.length).toFixed(1) : 0;
//     const candidateVotes = candidates.map(c => votes[c.id]);
//     const maxVotes = Math.max(...candidateVotes);
//     const minVotes = Math.min(...candidateVotes);

//     html += `
//         <div style="margin-top: 30px; padding: 20px; background: #f5f5f5; border-radius: 8px;">
//             <h3 style="margin-bottom: 15px; color: #333;">📊 Statistiques finales</h3>
//             <div style="font-size: 14px; line-height: 1.8; color: #333;">
//                 • Total des votes : <strong>${totalVotes}</strong><br>
//                 • Votes valides : <strong>${validVotes}</strong><br>
//                 • Bulletins nuls : <strong>${nullVotes}</strong><br>
//                 • Nombre de candidats : <strong>${candidates.length}</strong><br>
//                 • Moyenne de votes par candidat : <strong>${avgVotes}</strong><br>
//                 • Votes maximum : <strong>${maxVotes}</strong><br>
//                 • Votes minimum : <strong>${minVotes}</strong><br>
//                 • Taux de participation gagnant : <strong>${totalVotes > 0 ? ((maxVotes / totalVotes) * 100).toFixed(1) : 0}%</strong>
//             </div>
//         </div>
//     `;

//     tempDiv.innerHTML = html;
//     document.body.appendChild(tempDiv);

//     const options = {
//         margin: 15,
//         filename: `votes_${fileDateTime}.pdf`,
//         image: { type: 'jpeg', quality: 0.98 },
//         html2canvas: { scale: 2 },
//         jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
//     };

//     html2pdf().set(options).from(tempDiv).save().then(() => {
//         document.body.removeChild(tempDiv);
//     });
// }
