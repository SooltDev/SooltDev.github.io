const fs = require('fs');
const fsp = fs.promises;

const express = require('express');
const path = require('path');
const { JSONModifier } = require('./jsonmodifier.js');

const app = express();

app.use( express.static( path.join(__dirname, 'assets') ) );
app.use( express.json() );

const categoryJSON = new JSONModifier( path.join(__dirname, 'jsondata', 'category.json') );
const exercicesJSON = new JSONModifier( path.join(__dirname, 'jsondata', 'exercices.json') );
const teamJSON = new JSONModifier( path.join(__dirname, 'jsondata', 'team.json') );

//#region Category
app.get('/category', async (req, res) => {
    res.json(await categoryJSON.read());
});

app.post('/category', async (req, res) => {
    const categ = req.body;
    delete categ.id;
    
    const insData = await categoryJSON.insert(categ);
    
    const data = await categoryJSON.read();
    res.status(201).send({message: `Category saved OK`, data});
});

app.patch('/category', async (req, res) => {
    const upData = await categoryJSON.update(req.body, req.body.id);

    const data = await categoryJSON.read();
    res.status(201).send({message: `Category saved OK`, data});
});

app.delete('/category/:id', async (req, res) => {
    const response = await categoryJSON.delete(req.params.id);
    res.status(200).send({message: 'sikeres törlés'});
});

//#endregion

//#region teams
app.get('/teams', async (req, res) => {
    
    res.json(await teamJSON.read());
});

app.post('/teams', async (req, res) => {
    const categ = req.body;
    delete categ.id;
    
    const insData = await teamJSON.insert(categ);
    
    const data = await teamJSON.read();
    res.status(201).send({message: `Teams saved OK`, data});
});

app.patch('/teams', async (req, res) => {
    const upData = await teamJSON.update(req.body, req.body.id);

    const data = await teamJSON.read();
    res.status(201).send({message: `Teams saved OK`, data});
});

app.patch('/teams/homework', async (req, res) => {
    const jsonData = await teamJSON.read();
    const team = jsonData.find( element => element.id === req.body.id);
    
    if (team){
        if (!team.examples)
            team.examples = [];

        team.examples = [... new Set([...team.examples, ...req.body.examples])];

         fs.writeFile(teamJSON.filePath, JSON.stringify(jsonData, null, "    "), (err) => {
            if (err)
                res.status(400).send({message: "Sikertelen mentés", status: 400});
            else 
                res.status(200).send({message: "Sikeres Mentés", status: 200});
         });
    } else {
        res.status(404).send({message: "Nem találtuk a csoportot", status: 404});
    }
});

app.delete('/teams/:id', async (req, res) => {
    const response = await teamJSON.delete(req.params.id);
    res.status(200).send({message: 'Sikeres törlés'});
});
//#endregion

//#region exercices
app.get('/exercices', async (req, res) => {
    
    res.json(await exercicesJSON.read());
});

app.post('/exercices', async (req, res) => {
    const categ = req.body;
    delete categ.id;
    
    const insData = await exercicesJSON.insert(categ);
    
    const data = await exercicesJSON.read();
    res.status(201).send({message: `Teams saved OK`, data});
});

app.patch('/exercices', async (req, res) => {
    const upData = await exercicesJSON.update(req.body, req.body.id);

    const data = await exercicesJSON.read();
    res.status(201).send({message: `Teams saved OK`, data});
});

app.delete('/exercices/:id', async (req, res) => {
    const response = await exercicesJSON.delete(req.params.id);
    res.status(200).send({message: 'Sikeres törlés'});
});

app.get('/exercices/category/:categId', async (req, res) => {
    const data = await exercicesJSON.read();
    const categId = Number(req.params.categId);
    
    const filteredData = data.filter( d => d.category.includes(categId));
    
    res.status(200).send(filteredData);
});

app.get('/exercices/page/:num/:perPage', async (req, res) => {
    const data = await exercicesJSON.read();
    const pageNumber = Number(req.params.num);
    const itemPerPage = Number(req.params.perPage);

    const nextPageFirstIndex = pageNumber * itemPerPage;
    const nextPageLastIndex = nextPageFirstIndex + itemPerPage;


    const items = data.slice(nextPageFirstIndex, nextPageLastIndex);

    const responseData = {
        totalPage: Math.ceil(data.length / itemPerPage),
        pageNumber,
        total: data.length,
        from: data.length < nextPageFirstIndex ? 0 : nextPageFirstIndex + 1,
        to: data.length < nextPageFirstIndex ? 0 : nextPageFirstIndex + items.length,
        items
    }
    
    res.status(200).send(responseData);
});



//#endregion

app.listen(3000);
