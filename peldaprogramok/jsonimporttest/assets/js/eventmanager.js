class EventManager{
    #events;
    
    constructor (events){
        
        this.#events = {};

        if (Array.isArray(events))
            for (const eventName of events)
                this.registerEvent(eventName);

    }

    registerEvent(eventName){
        if ( !(eventName in this.#events) )
            this.#events[eventName] = [];
    }

    isRegisteredEvent(eventName){
        return (eventName in this.#events);
    }

    on(event, fn){
        this.registerEvent(event);
        if (typeof fn =='function')
            this.#events[event].push(fn);
    }

    un(event, ref){
        if (this.#events[event] != undefined){
            let ind = this.#events[event].indexOf(ref);
            if (ind > -1)
                this.#events[event].splice(ind, 1);
        }
    }

    trigger(event){
        if (this.#events[event] != undefined)
            for (const eventFn of this.#events[event])
                eventFn.call(this);
    }
    
}

export default EventManager;