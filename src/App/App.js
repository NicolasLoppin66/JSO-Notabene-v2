import '../assets/style.css';

import { Nota } from './Nota';
import { NotaService } from './Services/NotaServices';

// Propiété statique
const
    STORAGE_NAME = 'notabene';

class App {
    // Element DOM
    elInputNewNotaTitle;
    elTextareaNewNotaTitle;
    elOlNotaList;

    // Propriété fonctionnel
    /**
     * Service de données
     */
    notaService;

    /**
     * Tableau des nota affiché
     */
    arrNota = [];

    /**
     * Indicateur de l'activation d'un mode 'Edition'
     */
    isEditMode = false;

    start() {
        console.log('App démarrer ...');

        // Création du service
        this.notaService = new NotaService();

        // Chargement du l'interface utilisateur
        this.loadDom();

        // Récupération des anciennes données sauvegardées
        this.arrNota = this.notaService.getAll();

        // Si le storage était vide (donc que arrNotas reste vide), on sort sans rien faire de plus
        if (this.arrNotas.length <= 0) return;

        // On lance le rendu des notas
        this.renderNotas();
    }

    /**
     * Création du DOM de l'interface graphique ( GUI )
     */
    loadDom() {
        // Template :
        // <header>
        //     <h1>NotaBene</h1>
        // <h1>NotaBene</h1> - Création <header>
        const domHeader = document.createElement('header');
        domHeader.innerHTML = '<h1>Notabene</h1>';

        //     <form novalidate>
        //         <input type="text" placeholder="Titre">
        //         <textarea placeholder="Contenu"></textarea>
        //         <button type="button">➕</button>
        //     </form>
        // <form novalidate> - Création <form>
        const elForm = document.createElement('form');
        elForm.noValidate = true;

        // <input type="text" placeholder="Titre"> - titre
        this.elInputNewNotaTitle = document.createElement('input');
        this.elInputNewNotaTitle.setAttribute('type', 'text');
        this.elInputNewNotaTitle.setAttribute('placeholder', 'Titre');

        // <textarea placeholder="Contenu"></textarea> - contenu
        this.elTextareaNewNotaTitle = document.createElement('textarea');
        this.elTextareaNewNotaTitle.setAttribute('placeholder', 'Content');

        // <button type="button">➕</button> - Ajouter
        const elBtnNewNotaAdd = document.createElement('button');
        elBtnNewNotaAdd.type = 'button';
        elBtnNewNotaAdd.textContent = '➕';
        elBtnNewNotaAdd.addEventListener('click', this.handlerAddNewNota.bind(this))

        // Injection des elements crée dans le formulaire
        elForm.append(this.elInputNewNotaTitle, this.elTextareaNewNotaTitle, elBtnNewNotaAdd)

        //     <div>
        //         <button type="button" id="clear-all">🗑️</button>
        //     </div>
        // - <div>
        const elDivClear = document.createElement('div');

        // <button type="button" id="clear-all">🗑️</button> Supprimer tous
        const elBtnClearAll = document.createElement('button');
        elBtnClearAll.type = 'button';
        elBtnClearAll.textContent = '🗑️';
        elBtnClearAll.addEventListener('click', this.handlerClearAll.bind(this))

        // Injection du button dans la div
        elDivClear.append(elBtnClearAll);

        // <form>, <div> => <header> Injection
        elHeader.append(elForm, elDivClear);

        // </header>

        // <main>
        //     <ol id="nota-list"></ol>
        // </main>

        // -- <main>
        const elMain = document.createElement('main');

        // - <ol id="nota-list"></ol>
        this.elOlNotaList = document.createElement('ol');
        this.elOlNotaList.id = 'nota-list';

        // <ol> => <main>
        elMain.append(this.elOlNotaList);

        // -- <header> + <main>
        document.body.append(elHeader, elMain);
    }

    /**
     * Reconstruit l'affichage des Notas
     */
    renderNotas() {
        // On vide le <ol>
        this.elOlNotaList.innerHTML = "";

        // On retrie par date de mise à jour inverse
        this.arrNota.sort((a, b) => b.dateUpdate - a.dateUpdate);

        // On parcours le tableau pour créer le DOM
        for (let nota of this.arrNota)
            this.elOlNotaList.append(nota.getDom());
    }

    // ++++ Gestionnaire d'evenement ++++
    /**
     * Fiontionnalité d'ajout d'une nouvelle Nota
     */
    handlerAddNewNota(evt) {
        // On récupère le timestamp de la creation
        let now = Date.now(),
            newTitle = this.elInputNewNotaTitle.value.trim(),
            newContent = this.elTextareaNewNotaTitle.value.trim();

        if (newTitle === "" || newContent === "") {
            this.elInputNewNotaTitle.value
                = this.elTextareaNewNotaTitle.value
                = "";

            return;
        }

        // On reconstitue un objet de données
        const newNotaLiteral = {
            title: newTitle,
            content: newContent,
            dateCreate: now,
            dateUpdate: now,
        };

        // On ajoute cet objet au tableau de travail
        this.arrNotas.push(new Nota(newNotaLiteral));

        // Sauvegarde des données
        this.saveAll();

        // On vide le formulaire d'ajout
        this.elInputNewNotaTitle.value
            = this.elTextareaNewNotaTitle.value
            = "";

        // On met le focus sur le premier champ
        this.elInputNewNotaTitle.focus();

        // On relance le rendu des notas
        this.renderNotas();
    }

    /**
     * Fonctionnalité de suppresion de toute les nota
    */
    handlerClearAll(evt) {
        // Vidage du tableau de travail
        this.arrNotas = [];

        // Mise a jours des données stockées
        this.notaService.saveAll();

        // On vide la liste à l'affichage
        this.elOlNotaList.innerHTML = "";
    }
}

const app = new App();

export default app;