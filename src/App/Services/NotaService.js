export class NotaService {

    /**
     * CRUD: Read all
     */
    getAll() {
        let result = [];

        // On récupère la version chaîne des données
        const serializedData = localStorage.getItem(STORAGE_NAME);

        try {
            // On tente de les désérializer
            arrNotas = JSON.parse(serializedData);
        } catch (error) {
            // Si cela ne fonctionne pas (pour cause de données corrompues )
            // On supprime les données
            localStorage.removeItem(STORAGE_NAME);
            // On vide le tableau de travail
            arrNotas = [];
        }

        return result;
    }

    /**
     * CRUD: Create all
     */
    saveAll() {
        // TODO: Code

        return false;
    }

}