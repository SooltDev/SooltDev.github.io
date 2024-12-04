
//document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="style.css">');
const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = 'style.css';

document.head.appendChild(style);

class Circle{
    
    element;

    constructor(x, y, r, color){
        this.element = document.createElement('div');
        this.element.className = 'circle';
        document.body.appendChild(this.element);

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
        this.element.style.color = c;
    }

    get color(){
        return this.element.style.color;
    }

}

export {
    style, Circle
}
