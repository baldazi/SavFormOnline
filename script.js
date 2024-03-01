document.addEventListener('DOMContentLoaded', function() {
    

    const modeRetraitInputs = document.querySelectorAll('input[name="mode-retrait"]');
    modeRetraitInputs.forEach(input => input.addEventListener('change', handleModeRetraitChange));

    const refCdeInput = document.getElementById('ref-cde');
    refCdeInput.addEventListener('input', handleRefCdeInput);

    const ajouterArticleBtn = document.getElementById('ajouter-article');
    ajouterArticleBtn.addEventListener('click', ajouterArticle);

    const retirerArticleBtn = document.getElementById('retirer-article');
    retirerArticleBtn.addEventListener('click', retirerArticle);

    const motifDemande = document.getElementById('motif-demande');
    motifDemande.addEventListener('input', handleMotifInput);

    // Initialise un champ d'article par défaut
    ajouterArticle();

    // Sélectionne les champs obligatoires
    const champsObligatoires = document.querySelectorAll('#prenom, #nom, #telephone, #email');
    champsObligatoires.forEach(champ => {
        champ.addEventListener('input', verifierChampsObligatoires);
    });

    // Initialise la vérification au chargement pour gérer le rechargement de la page avec des valeurs en cache
    verifierChampsObligatoires();

    // Masque initialement le conteneur du "Numéro référence Cde" jusqu'à ce qu'une option de mode de retrait soit sélectionnée
    document.getElementById('ref-cde-container').classList.add('hidden');
    
    // Ajoutez des écouteurs pour les champs de fichier
    document.getElementById('photo-facture').addEventListener('change', verifierConditionsEnvoyer);
    document.getElementById('photos').addEventListener('change', verifierConditionsEnvoyer);
    


    // Appel initial pour définir l'état initial du bouton Envoyer
    verifierConditionsEnvoyer();
});

function submitForm() {
    // Logique personnalisée de soumission du formulaire
    console.log("Formulaire soumis");
    // N'oubliez pas de prévenir la soumission par défaut si nécessaire
    // event.preventDefault();
}

function verifierConditionsEnvoyer() {
    // Vérification des champs textuels obligatoires
    const prenom = document.getElementById('prenom').value.trim();
    const nom = document.getElementById('nom').value.trim();
    const telephone = document.getElementById('telephone').value.trim();
    const email = document.getElementById('email').value.trim();

    // Vérification du mode de retrait sélectionné
    const modeRetraitChecked = document.querySelector('input[name="mode-retrait"]:checked') !== null;

    // Vérification du format du numéro de référence Cde
    const refCdeValide = /^\d{3}\/\d{10}$/.test(document.getElementById('ref-cde').value);
    document.getElementById('ref-cde-error').textContent = refCdeValide ? "" : "Format requis : 3 chiffres, un slash, 10 chiffres.";

    // Vérification des numéros d'articles
    const articlesInputs = document.querySelectorAll('#articles-container input');
    let articlesValides = Array.from(articlesInputs).every(input => /^\d{4,8}$/.test(input.value));
    document.getElementById('articles-error').textContent = articlesValides ? "" : "Doit contenir entre 4 et 8 chiffres pour chaque numéro d'article.";
    document.getElementById('some-element-id').textContent = "Un message d'erreur";

    // Vérification de la longueur du motif de la demande
    const motifDemandeValide = document.getElementById('motif-demande').value.trim().length >= 15;
    document.getElementById('motif-demande-error').textContent = motifDemandeValide ? "" : "Le motif de la demande doit contenir au moins 15 caractères.";

    // Vérification de la sélection de la photo de la facture
    const photoFactureSelectionnee = document.getElementById('photo-facture').files.length > 0;
    document.getElementById('photo-facture-error').textContent = photoFactureSelectionnee ? "" : "Une photo de la facture est requise.";

    // Vérification de la sélection des photos supplémentaires
    const photosSelectionnees = document.getElementById('photos').files.length > 0;
    document.getElementById('photos-error').textContent = photosSelectionnees ? "" : "Au moins une photo supplémentaire est requise.";

    // Condition finale pour activer le bouton "Envoyer"
    const formulaireComplet = prenom && nom && telephone && email && modeRetraitChecked && refCdeValide && articlesValides && motifDemandeValide && photoFactureSelectionnee && photosSelectionnees;

    document.getElementById('submit-btn').disabled = !formulaireComplet;
}



    

function handleModeRetraitChange() {
    // Vérifie si au moins un input de mode de retrait est coché
    const modeRetraitChecked = Array.from(document.querySelectorAll('input[name="mode-retrait"]')).some(input => input.checked);
    if(modeRetraitChecked) {
        // Si un mode de retrait est sélectionné, affiche le conteneur du "Numéro référence Cde"
        document.getElementById('ref-cde-container').classList.remove('hidden');
    } else {
        // Sinon, le cache
        document.getElementById('ref-cde-container').classList.add('hidden');
    }
}

function handleRefCdeInput() {
    const validFormat = /^\d{3}\/\d{10}$/.test(this.value);
    const refCdeError = document.getElementById('ref-cde-error');
    const articleLabelContainer = document.getElementById('article-label-container');

    // Affiche ou cache la section des numéros d'article en fonction de la validité du numéro de commande
    if (validFormat) {
        refCdeError.textContent = '';
        articleLabelContainer.classList.remove('hidden');
    } else {
        articleLabelContainer.classList.add('hidden');
        refCdeError.textContent = this.value ? "Format requis : 3 chiffres, un slash, 10 chiffres." : '';
        // Cache également les sections suivantes si le format n'est pas valide
        document.getElementById('motif-demande-container').classList.add('hidden');
        document.getElementById('photo-facture-container').classList.add('hidden');
        document.getElementById('photos-container').classList.add('hidden');
        document.getElementById('submit-btn').classList.add('hidden');
    }
}

function ajouterArticle() {
    const articlesContainer = document.getElementById('articles-container');
    const articleInput = document.createElement('input');
    articleInput.type = 'text';
    articleInput.placeholder = 'Numéro d\'article';
    articleInput.oninput = verifierArticle;
    articlesContainer.appendChild(articleInput);
    verifierArticle(); // Vérifie immédiatement pour l'état initial
}

function retirerArticle() {
    const articlesContainer = document.getElementById('articles-container');
    if (articlesContainer.childNodes.length > 1) { // Garde un champ par défaut
        articlesContainer.removeChild(articlesContainer.lastChild);
    }
    verifierArticle(); // Vérifie après suppression
}

function verifierArticle() {
    const articlesInputs = document.querySelectorAll('#articles-container input');
    let tousValides = true;
    articlesInputs.forEach(input => {
        const isValid = /^\d{4,8}$/.test(input.value);
        tousValides = tousValides && isValid;
        document.getElementById('ref-cde-error').textContent = input.value && !isValid ? "Doit contenir entre 4 et 8 chiffres." : '';
    });

    // Cache ou affiche la section du motif de la demande en fonction de la validité des numéros d'article
    const suite = document.getElementById('motif-demande-container');
    const shouldHide = !tousValides || articlesInputs.length === 0 || articlesInputs[0].value === '';
    suite.classList.toggle('hidden', shouldHide);
    
    // Si les conditions ne sont pas remplies, cache également les sections suivantes
    if (shouldHide) {
        document.getElementById('photo-facture-container').classList.add('hidden');
        document.getElementById('photos-container').classList.add('hidden');
        document.getElementById('submit-btn').classList.add('hidden');
    }
}


function verifierChampsObligatoires() {
    const champsObligatoires = document.querySelectorAll('#prenom, #nom, #telephone, #email');
    let tousRemplis = true;

    champsObligatoires.forEach(champ => {
        if (!champ.value) {
            tousRemplis = false;
        }
    });

    const modeRetraitInputs = document.querySelectorAll('input[name="mode-retrait"]');
    modeRetraitInputs.forEach(input => {
        input.disabled = !tousRemplis;
    });

    // Ajoute cette vérification pour cacher le conteneur du "Numéro référence Cde" si les champs obligatoires ne sont pas tous remplis
    if (!tousRemplis) {
        document.getElementById('ref-cde-container').classList.add('hidden');
        // Optionnel : Réinitialiser également l'état de sélection des options de mode de retrait
        modeRetraitInputs.forEach(input => {
            input.checked = false;
        });
        // Cacher les éléments suivants s'ils étaient déjà affichés
        document.getElementById('article-label-container').classList.add('hidden');
        document.getElementById('motif-demande-container').classList.add('hidden');
        document.getElementById('photo-facture-container').classList.add('hidden');
        document.getElementById('photos-container').classList.add('hidden');
        document.getElementById('submit-btn').classList.add('hidden');
    }
}


function handleMotifInput() {
    const valeur = this.value;
    const motifDemandeError = document.getElementById('motif-demande-error'); // Récupère l'élément d'erreur

    if (valeur.length >= 15) {
        motifDemandeError.textContent = ''; // Efface le message d'erreur si la condition est remplie
        document.getElementById('photo-facture-container').classList.remove('hidden');
        document.getElementById('photos-container').classList.remove('hidden');
        document.getElementById('submit-btn').classList.remove('hidden');
    } else {
        motifDemandeError.textContent = valeur ? "Le motif de la demande doit contenir au moins 15 caractères." : ''; // Affiche l'erreur si nécessaire
        document.getElementById('photo-facture-container').classList.add('hidden');
        document.getElementById('photos-container').classList.add('hidden');
        document.getElementById('submit-btn').classList.add('hidden');
    }
}


