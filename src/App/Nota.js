import app from './App';

const
    MODE_VIEW = 'view',
    MODE_EDIT = 'edit';

/* Modèle objet litteral d'un Nota
{
    title: 'Toto à la plage',
    content: 'Il nage le crawl au milieu des requins',
    dateCreate: 1666180099794,
    dateUpdate: 1666180099794
}
*/
export class Nota {

    title;
    content;
    dateCreate;
    dateUpdate;

    constructor(notaLiteral) {

        this.title = notaLiteral.title;
        this.content = notaLiteral.content;
        this.dateCreate = notaLiteral.dateCreate;
        this.dateUpdate = notaLiteral.dateUpdate;

    }

    /**
     * Construit et retourne l'élément DOM pour le Nota
     */
    getDOM() {

        const elLi = document.createElement('li');
        elLi.classList.add('nota');
        elLi.dataset.mode = MODE_VIEW;

        let
            dateCreate = new Date(this.dateCreate),
            dateUpdate = new Date(this.dateUpdate);

        // header
        let innerDom = '<div class="nota-header">';
        innerDom += '<div class="nota-times">';
        innerDom += `<strong>création: </strong>${dateCreate.toLocaleString()}<br>`;
        innerDom += `<strong>màj: </strong>${dateUpdate.toLocaleString()}`;
        innerDom += '</div><div class="nota-cmd">';
        innerDom += '<div data-cmd="view">';
        innerDom += '<button type="button" data-role="edit">✏️</button>';
        innerDom += '<button type="button" data-role="delete">🗑️</button>';
        innerDom += '</div>';
        innerDom += '<div data-cmd="edit">';
        innerDom += '<button type="button" data-role="save">💾</button>';
        innerDom += '<button type="button" data-role="cancel">❌</button>';
        innerDom += '</div>';
        innerDom += '</div></div>';


        // title
        innerDom += `<div class="nota-title">${this.title}</div>`;

        // content
        innerDom += `<div class="nota-content">${this.content}</div>`;

        elLi.innerHTML = innerDom;

        elLi.addEventListener('click', this.handlerClick.bind(this));

        return elLi;

    }

    toJSON() {
        return {
            title: this.title,
            content: this.content,
            dateCreate: this.dateCreate,
            dateUpdate: this.dateUpdate
        };
    }

    // ********** Gestionaires d'événement **********
    /**
     * Click sur un des boutons de commande du Nota
     */
    handlerClick(evt) {

        const
            elLi = evt.currentTarget,
            elBtn = evt.target,
            elTitle = elLi.querySelector('.nota-title'),
            elContent = elLi.querySelector('.nota-content'),
            idxLi = Array.from(elLi.parentElement.children).indexOf(elLi),
            objNota = app.arrNotas[idxLi];

        // Si le <li> n'est pas cohérent avec les datas (après manipulation de la console, ... )
        if (!app.isEditMode && elTitle.textContent !== objNota.title) return;

        switch (elBtn.dataset.role) {
            case 'edit':
                // Si on n'est pas sensé avoir accès à edit, on sort
                if (app.isEditMode) return;

                app.isEditMode = true;
                elLi.dataset.mode = MODE_EDIT;
                elTitle.contentEditable
                    = elContent.contentEditable
                    = true;

                break;

            case 'delete':
                // Si on n'est pas sensé avoir accès à delete, on sort
                if (app.isEditMode) return;

                // On supprime le nota du tableau
                app.arrNotas.splice(idxLi, 1);

                // Sauvegarde des données
                app.notaService.saveAll();

                // On regénère les notas
                app.renderNotas();

                break;

            case 'save':
                // Si on n'est pas sensé avoir accès à cancel, on sort
                if (!app.isEditMode) return;

                // Mise à jour des donnée du tableau (dataNota pointe dans le tableau)
                objNota.dateUpdate = Date.now();
                objNota.title = elTitle.textContent;
                objNota.content = elContent.textContent;

                app.notaService.saveAll();

                app.isEditMode = false;

                app.renderNotas();
                break;

            case 'cancel':
                // Si on n'est pas sensé avoir accès à cancel, on sort
                if (!app.isEditMode) return;

                app.isEditMode = false;
                elLi.dataset.mode = MODE_VIEW;
                app.renderNotas();
                break;

            default:
                return;
        }

    }

}