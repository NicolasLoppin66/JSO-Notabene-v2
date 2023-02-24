// Import de class
import { LabelEntity } from "./labelEntity";

// Intanciation de App
import app from "../App";

export class Nota extends LabelEntity {
    // Déclaration des propriété static
    static counter = 0;
    
    // Déclaration des propriété public
    dateCreate;
    dateUpdate;

    constructor(jsonData) {
        Nota.counter++;
    }
}