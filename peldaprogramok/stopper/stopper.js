const tpl = `
    <div class="stopper">
        <div class="display">
            <div class="crono">00:00:00:00</div>
            <hr>
            <div class="flag">00:00:00:00</div>
        </div>
        <div class="btn-ct">
            <button class="part-btn btn">Part Time</button>
            <button class="part-btn-prev btn">◄</button>
            <button class="part-btn-next btn">►</button>
        </div>
        <div class="btn-ct">
            <button class="start-btn btn">Start</button>
            <button class="stop-btn btn">Pause</button>
            <button class="reset-btn btn">Reset</button>
        </div>
    </div>
`;

let date = timerId = pauseDate = null;
let partTimes = [];
let paused = true;
let partIndex = 0;

let 
    parentElement = document.querySelector('#content'),
    element,
    display,
    partTime,
    partTimeBtn,
    startBtn,
    stopBtn,
    resetBtn,
    prevBtn,
    nextBtn;

const render = () => {
    const div = document.createElement('div');
    div.innerHTML = tpl;

    element = div.firstElementChild;
    
    display = element.querySelector('.crono');
    partTime = element.querySelector('.flag');
    partTimeBtn = element.querySelector('.part-btn');
    startBtn = element.querySelector('.start-btn');
    stopBtn = element.querySelector('.stop-btn');
    resetBtn = element.querySelector('.reset-btn');
    prevBtn = element.querySelector('.part-btn-prev');
    nextBtn = element.querySelector('.part-btn-next');

    startBtn.onclick = start;
    stopBtn.onclick = stop;
    resetBtn.onclick = reset;
    partTimeBtn.onclick = setPartTime;
    nextBtn.onclick = nextPart;
    prevBtn.onclick = prevPart;

    parentElement.appendChild(element);
}

const twoDigit = n => n < 10 ? '0' + n : '' + n;

const start = () => {
    paused = false;
    if (timerId === null){
        if (date === null)
            date = Date.now() + (1000 * 60 * 60);
        else date = date + (Date.now() - pauseDate);

        timerId = setInterval( () => {
            const d = new Date();
            d.setTime( d.getTime() - date );

            display.textContent = 
                `${twoDigit(d.getHours())}:${twoDigit(d.getMinutes())}:${twoDigit(d.getSeconds())}:${twoDigit(Math.floor(d.getMilliseconds()/10))}`;
        }, 10);
    }
}

const stop = () => {
    clearInterval(timerId);
    timerId = null;
    pauseDate = Date.now() //+ (1000 * 60 * 60);
    paused = true;
}

const reset = () => {
    stop();
    date = null;
    display.textContent = '00:00:00:00';
    partTime.textContent = display.textContent;
    paused = true;
    partTimes = [];
}

const setPartTime = () => {
    if (!paused){
        partTime.textContent = display.textContent;
        partIndex = partTimes.push(display.textContent) - 1;
    }
}

const nextPart = () => {
    if (partTimes.length > 0 && partIndex < partTimes.length - 1){
        partIndex++;
        partTime.textContent = `${partTimes[partIndex]}`;
    }
}

const prevPart = () => {
    if (partTimes.length > 0 && partIndex > 0){
        partIndex--;
        partTime.textContent = `${partTimes[partIndex]}`;
    }
}

render();


