"use strict";

const { random, shuffleArray } = require("./func");

class Tickets {

    #tickets = {};
    #hat = [];
    #winners = [];
    #prizes = [];

    constructor (num, prizes){
        this.#prizes = prizes;
        this.reset(num);
    }

    reset(num){
        this.#tickets = {};
        this.#hat = [];
        this.#winners = [];
        this.#prizes = [];

        for (let i = 1; i <= num; i++)
            this.#tickets[i] = {
                sale: false, 
                lot: false
            };
    }

    get tickets(){
        return this.#tickets;
    }

    buyTickets(tickets){
        const sales = [];
        if (Array.isArray(tickets)){
            for (const t of tickets){
                if (t in this.#tickets){
                    this.#tickets[t].sale = true;
                    sales.push(this.#tickets[t]);
                    this.#hat.push(t);
                }
            }
        }
        
        return sales;
    }

    get sales(){ //eladott
        const sale = [];
        for (const num in this.#tickets)
            if (this.#tickets[num].sale)
                sale.push(num);
        
        return sale;
    }

    get offers(){ // eladó
        const sale = [];
        for (const num in this.#tickets)
            if (!this.#tickets[num].sale)
                sale.push(num);
        
        return sale;
    }

    get hat(){
        return this.#hat;
    }

    lot(){
        shuffleArray(this.#hat);

        const randIndex = random(0, this.#hat.length);
        const randTicketKey = this.#hat[randIndex];
    }
}

module.exports = Tickets;