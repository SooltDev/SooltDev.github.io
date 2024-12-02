const fs = require('fs');
const fsp = fs.promises;

class JSONModifier {

    filePath;
    jsonData;

    constructor(path){
        this.filePath = path;
    }

    async read(filePath = this.filePath){
        const fileContent = await fsp.readFile(filePath);
        return this.jsonData = JSON.parse(fileContent);
    }

    async insert(data){
        const jsonData = await this.read();

        data.id = jsonData.length > 0 ? jsonData[jsonData.length - 1].id + 1 : 1;
        jsonData.push(data);

        await fsp.writeFile(this.filePath, JSON.stringify(jsonData, null, "    "));

        return data;
    }

    async update(data, id){
        const jsonData = await this.read();
        const edited = jsonData.find( element => element.id === id);

        if (edited){
            Object.assign(edited, data);
            return fsp.writeFile(this.filePath, JSON.stringify(jsonData, null, "    "));
        }

        return null;
    }

    async find(fn){
        const jsonData = await this.read();
        return jsonData.find(fn);
    }

    async delete(id) {
        const jsonData = await this.read();
        const prodIndex = jsonData.findIndex(el => el.id == id);

        if (prodIndex > -1) {
            jsonData.splice(prodIndex, 1);
            return fsp.writeFile(this.filePath, JSON.stringify(jsonData, null, "    "));
        }

        return null;
    }

    async getById(id){
        const jsonData = await this.read();
        return jsonData.find( element => element.id === id);
    }

}

module.exports = { JSONModifier }