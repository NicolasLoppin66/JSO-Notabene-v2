export class LabelEntity {
    id;
    title;
    content;

    constructor(jsonData) {
        this.id = jsonData.id;
        this.title = jsonData.title;
        this.content = jsonData.content;
    }
}