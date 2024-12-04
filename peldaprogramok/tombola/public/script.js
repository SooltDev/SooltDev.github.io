console.log("tombola is started");

import { getElement, createElement } from "./stools.js";
import newticketTpl from "./tickets/newticket.tpl.js";
import Ticket from "./tickets/tickets.js";
import ticketsTpl from "./tickets/tickets.tpl.js";

const content = getElement('#content');

let TICKETS = [];

function newTickets(){
    content.innerHTML = newticketTpl;

    const numInput = content.querySelector('#ticketnum');
    
    content.querySelector('#new-tickets').addEventListener('click', async () => {
        const num = Number(numInput.value);
        if (num >= 20){
            const res = await fetch(`/newtickets/${num}`);
            const resData = await res.json();
            renderTickets(resData);
        } else {
            alert('Legkevesebb 20 tombolajgygyel lehet új húzást kezdeményezni.');
        }
    });
}

function renderTickets(tickets){
    content.innerHTML = ticketsTpl;

    const ticketsCt = content.querySelector('.tickets');

    TICKETS = [];

    for (const n in tickets){
        const t = new Ticket(n, tickets[n], ticketsCt);
        TICKETS.push(t);

        console.log(t);
    }

    document.querySelector('#by-tickets').addEventListener('click', async () => {
        const cart = [];
        for (const ticket of TICKETS){
            if (ticket.selected){
                console.log(ticket);
                cart.push(ticket.num);
            }
        }
        console.log(cart);
        if (cart.length > 0){
            const res = await fetch('/bytickets', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({tickets: cart})
            });
            const resData = await res.json();
            alert(resData.message);
            renderTickets(resData.tickets);

        } else {
            alert('Válassz a választható tombilák közül.');
        }
    });
}

const start = async function(){
    const res = await fetch('/tickets');
    const responseData = await res.json();

    if (!responseData.tickets){
        console.log(responseData);
        newTickets();
    } else {
        renderTickets(responseData.tickets);
    }
};

start();
