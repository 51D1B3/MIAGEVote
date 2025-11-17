// --- Liste par défaut ---
const defaultCandidates = [
  { id: 1, name: "THOMAS LAMAH", photo: "../images/Président.jpg" },
  { id: 2, name: "MAHAMADOU SIDIBE", photo: "../images/Mon_image.jpg" },
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
    <div style="width: 100%; height: 160px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; border-radius: 12px; border: 2px solid #dc3545;">
      <span style="font-size: 48px; color: #dc3545;">❌</span>
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

// Fonction pour exporter les résultats en PDF
function exportResultsToPDF() {
  try {
    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
    
    if (totalVotes === 0) {
      alert("⚠️ Il n'y a pas encore de votes à exporter !");
      return;
    }

    const sorted = [...candidates].sort((a, b) => votes[b.id] - votes[a.id]);
    const nullVotes = votes.null || 0;
    const now = new Date();

    // Vérifier que jsPDF est disponible (UMD exposes window.jspdf.jsPDF)
    let PDFConstructor = null;
    if (window.jspdf && window.jspdf.jsPDF) {
      PDFConstructor = window.jspdf.jsPDF;
    } else if (typeof jsPDF !== 'undefined') {
      PDFConstructor = jsPDF;
    }
    if (!PDFConstructor) {
      alert("❌ La bibliothèque jsPDF n'est pas chargée. Veuillez rafraîchir la page.");
      return;
    }

    // Créer le PDF directement avec le constructeur détecté
    const pdf = new PDFConstructor({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    let yPosition = 20;
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;

    // En-tête
    pdf.setFontSize(18);
    pdf.setTextColor(99, 102, 241); // couleur primaire
  pdf.text('Résultats des Votes', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 10;
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Application SidiVote', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Rapport généré le ${now.toLocaleString('fr-FR')}`, pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 12;
    pdf.setFontSize(12);
    pdf.setTextColor(50, 50, 50);
    pdf.text(`Total des votes : ${totalVotes}`, margin, yPosition);

    yPosition += 15;

    // Ajouter les candidats
    sorted.forEach((c, index) => {
      const count = votes[c.id];
      const percentage = totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : 0;

      // Vérifier si besoin de nouvelle page
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }

      // Numéro et nom
      pdf.setFontSize(11);
      pdf.setTextColor(50, 50, 50);
      pdf.text(`${index + 1}. ${c.name}`, margin, yPosition);

      // Votes et pourcentage
      yPosition += 7;
      pdf.setFontSize(10);
      pdf.setTextColor(99, 102, 241);
      pdf.text(`Votes: ${count} (${percentage}%)`, margin + 5, yPosition);

      // Barre de progression
      yPosition += 6;
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(margin + 5, yPosition, pageWidth - 2 * margin - 10, 3);
      
      pdf.setDrawColor(99, 102, 241);
      pdf.setFillColor(99, 102, 241);
      const barWidth = ((pageWidth - 2 * margin - 10) * percentage) / 100;
      pdf.rect(margin + 5, yPosition, barWidth, 3, 'F');

      yPosition += 8;
    });

    // Bulletins nuls
    if (yPosition > pageHeight - 25) {
      pdf.addPage();
      yPosition = 20;
    }

    const nullPercentage = totalVotes > 0 ? ((nullVotes / totalVotes) * 100).toFixed(1) : 0;
    pdf.setFontSize(11);
    pdf.setTextColor(220, 53, 69); // rouge
  pdf.text('Bulletins Nuls', margin, yPosition);

    yPosition += 7;
    pdf.setFontSize(10);
    pdf.setTextColor(220, 53, 69);
    pdf.text(`Votes: ${nullVotes} (${nullPercentage}%)`, margin + 5, yPosition);

    yPosition += 6;
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(margin + 5, yPosition, pageWidth - 2 * margin - 10, 3);
    
    pdf.setDrawColor(220, 53, 69);
    pdf.setFillColor(220, 53, 69);
    const nullBarWidth = ((pageWidth - 2 * margin - 10) * nullPercentage) / 100;
    pdf.rect(margin + 5, yPosition, nullBarWidth, 3, 'F');

    // Footer - obtenir le nombre de pages de façon sûre
    const pageCount = typeof pdf.getNumberOfPages === 'function'
      ? pdf.getNumberOfPages()
      : (pdf.internal && pdf.internal.pages ? Object.keys(pdf.internal.pages).length : 1);
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(9);
      pdf.setTextColor(180, 180, 180);
      pdf.text(
        `Page ${i} sur ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

  // Télécharger le PDF
    const filename = `resultats-votes-${now.getTime()}.pdf`;
    pdf.save(filename);
    
    alert("✅ PDF téléchargé avec succès !");

  } catch (error) {
    console.error("Erreur lors de l'export PDF:", error);
    alert("❌ Erreur lors de l'export PDF:\n" + error.message);
  }
}
