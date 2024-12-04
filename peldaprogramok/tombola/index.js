const express = require("express");
const fs = require("fs");
const path = require("path");
const Tickets = require("./tickets.js");
const { random, shuffleArray } = require("./func.js");
const { log } = require("console");

let tickets;

const publicPath = (path) => path.join(__dirname, "public", path);

const app = express();

app.use(express.static(path.join(__dirname, "public")));

/*
app.get('/', (req, res) => {
    if (tickets instanceof Tickets)
        res.sendFile(publicPath('ticket.html'));
    else res.sendFile(publicPath('index.html'));
});
*/

app.get('/newtickets/:num', (req, res) => {
    const num = parseInt(req.params.num);
    const prizes = parseInt(req.params.prozes);

    if (num >= 20){
        tickets = new Tickets(num, prizes);
        res.status(200).json(tickets.tickets);
    } else {
        res.status(400).json({message: 'Helytelen darabszám'});
    }
});

app.get('/tickets', (req, res) => {
    
    if (tickets instanceof Tickets)
        res.status(200).json({tickets: tickets.tickets});
    else
        res.status(404).json({message: 'Nincs tombolahúzás indítva', tickets: null});
});

app.use(express.json());

app.post('/bytickets', (req, res) => {
    const byTickets = req.body.tickets;
    const sold = tickets.buyTickets(byTickets);

    if (sold.length > 0)
        res.status(200).json({tickets: tickets.tickets, message: 'Sikeres vásárlás.'});
    else
        res.status(200).json({tickets: sold, message: 'A kívánt tombolajegyeket már megvásárolták, vagy érvénytelenek.'});
});

app.get('/lot', (req, res) => {

});

app.listen(3000);