import '../assets/style.css';

import { Nota } from './Nota';
import { NotaService } from './Services/NotaService';

const STORAGE_NAME = 'notabene';

class App {

    // ********** Eléments du DOM ********** 
    elInputNewNotaTitle;
    elTextareaNewNotaTitle;
    elOlNotaList;

    // ********** Propriétés de fonctionnement **********
    /**
     * Service de données
     */
    notaService;

    /**
     * Tableau des notas affichés
     */
    arrNotas = [];

    /**
     * Indicateur de l'activation d'un mode "édition"
     */
    isEditMode = false;

    /**
     * Démarrage de l'application
     */
    start() {

        console.log( 'App démarrée...');

        // Création du service de données
        this.notaService = new NotaService();

        // Chargement de l'interface utilisateur
        this.loadDOM();

        // Récupération des anciennes données sauvegardées
        this.arrNotas = this.notaService.getAll();

        // Si le storage était vide (donc que arrNotas reste vide), on sort sans rien faire de plus
        if( this.arrNotas.length <= 0 ) return;

        // On lance le rendu des notas
        this.renderNotas();

    }

    /**
     * Création du DOM de l'interface graphique (GUI)
     */
    loadDOM() {
        /*
        Template:

        <header>
            <h1>NotaBene</h1>

            <form novalidate>
                <input type="text" placeholder="Titre">
                <textarea placeholder="Contenu"></textarea>
                <button type="button">➕</button>
            </form>

            <div>
                <button type="button">🗑️</button>
            </div>
        </header>

        <main>
            <ol id="nota-list"></ol>
        </main>
        */

        // -- <header>
        const elHeader = document.createElement( 'header' );
        elHeader.innerHTML = '<h1>NotaBene</h1>';

        // - <form novalidate>
        const elForm = document.createElement( 'form' );
        elForm.noValidate = true;

        // <input type="text" placeholder="Titre">
        this.elInputNewNotaTitle = document.createElement( 'input' );
        this.elInputNewNotaTitle.setAttribute( 'type', 'text' );
        this.elInputNewNotaTitle.setAttribute( 'placeholder', 'Titre' );

        // <textarea placeholder="Contenu"></textarea>
        this.elTextareaNewNotaTitle = document.createElement( 'textarea' );
        this.elTextareaNewNotaTitle.setAttribute( 'placeholder', 'Contenu' );

        // <button type="button">➕</button>
        const elBtnNewNotaAdd = document.createElement( 'button' );
        elBtnNewNotaAdd.type = 'button';
        elBtnNewNotaAdd.textContent = '➕';
        elBtnNewNotaAdd.addEventListener( 'click', this.handlerAddNewNota.bind( this ) );

        // <input> + <textarea> + <button> => <form>
        elForm.append( this.elInputNewNotaTitle, this.elTextareaNewNotaTitle, elBtnNewNotaAdd );

        // - <div>
        const elDivClear = document.createElement( 'div' );

        // <button type="button">🗑️</button>
        const elBtnClearAll = document.createElement( 'button' );
        elBtnClearAll.type = 'button';
        elBtnClearAll.textContent = '🗑️';
        elBtnClearAll.addEventListener( 'click', this.handlerClearAll.bind( this ) );

        // <button> => <div>
        elDivClear.append( elBtnClearAll );

        // <form> + <div> => <header>
        elHeader.append( elForm, elDivClear );


        // -- <main>
        const elMain = document.createElement( 'main' );

        // - <ol id="nota-list"></ol>
        this.elOlNotaList = document.createElement( 'ol' );
        this.elOlNotaList.id = 'nota-list';

        // <ol> => <main>
        elMain.append( this.elOlNotaList );


        // -- <header> + <main> => <body>
        document.body.append( elHeader, elMain );
        
    }

    /**
     * Génération de l'affchage de la liste de Notas
     */
    renderNotas() {
        // On vide le <ol>
        this.elOlNotaList.innerHTML = '';

        // On retrie par date de mise à jour inverse
        this.arrNotas.sort( ( a, b ) => b.dateUpdate - a.dateUpdate );

        // On parcours le tableau pour créer le DOM
        for( let nota of this.arrNotas )
            this.elOlNotaList.append( nota.getDOM() );
    }

    // ********** Gestionnaires d'événements **********
    
    /**
     * Fonctionnalité d'ajout d'un nouveau Nota
     */
    handlerAddNewNota( evt ) {

        // On récupère le timestamp de la creation
        let 
            now = Date.now(),
            newTitle = this.elInputNewNotaTitle.value.trim(),
            newContent = this.elTextareaNewNotaTitle.value.trim();

        if( newTitle === '' || newContent === '' ) {
            this.elInputNewNotaTitle.value
                = this.elTextareaNewNotaTitle.value
                = '';

            return;
        }

        // On reconstitue un objet de données
        const newNotaLiteral = {
            title: newTitle,
            content: newContent,
            dateCreate: now,
            dateUpdate: now
        };

        // On ajoute cet objet au tableau de travail
        this.arrNotas.push( new Nota( newNotaLiteral ) );

        // Sauvegarde des données
        this.notaService.saveAll();

        // On vide le formulaire d'ajout
        this.elInputNewNotaTitle.value
            = this.elTextareaNewNotaTitle.value
            = '';

        // On met le focus sur le premier champ
        this.elInputNewNotaTitle.focus();

        // On relance le rendu des notas
        this.renderNotas();

    }

    /**
     * Fonctionnalité suppression de tous les notas
     */
    handlerClearAll( evt ) {

        // Vidage du tableau de travail
        this.arrNotas = [];

        // Mise à jour des données stockées
        this.notaService.saveAll();

        // On vide la liste à l'affichage
        this.elOlNotaList.innerHTML = '';

    }

}

const app = new App();

export default app;