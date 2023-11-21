import Publication from "../modules/publication.js";

export default class Summary {
    constructor() {
        this.path = "/api/summary";
        this.publication = new Publication();
    }

    get = async (_, response) => {
        const publications = await this.publication.getAllFromSummary();
        const json = JSON.stringify(publications);
        return response.end(json);
    };

    init = () => {
        return {
            GET: this.get,
        };
    };
}
