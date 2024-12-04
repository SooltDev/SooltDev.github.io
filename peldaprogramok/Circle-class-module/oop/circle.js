class Circle{
    
    element;

    constructor(x, y, r, color){
        this.element = document.createElement('div');
        document.body.appendChild(this.element);

        Object.assign(this.element.style, {
            "position": "absolute",
            "border-radius": "50%"
        });

        this.radius = r;
        this.color = color;
        this.moveToXY(x, y);
    }

    moveToXY(x, y){
        Object.assign(this.element.style, {
            "top": y + 'px',
            "left": x + 'px'
        });
    }

    set radius(r){
        Object.assign(this.element.style, {
            width: (r * 2) + 'px',
            height: (r * 2) + 'px'
        });
    }

    get radius(){
        return this.element.offsetWidth;
    }

    set color(c){
        this.element.style.backgroundColor = c;
    }

    get color(){
        return this.element.style.backgroundColor;
    }

}
