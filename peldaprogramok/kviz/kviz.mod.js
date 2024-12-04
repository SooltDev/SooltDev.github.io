function singleSelect(selector, cssName = 'selected'){
    
    const element = typeof selector == 'string' ? document.querySelector(selector) : selector;

    if (element instanceof HTMLElement){
        
        element.querySelectorAll(':scope > *').forEach(child => {
            child.addEventListener('click', function(){
                const selectedElement = element.querySelector('.'+cssName);
                
                if (selectedElement)
                    selectedElement.classList.remove(cssName);

                this.classList.add(cssName);
            });

        });
    }
}

const quiz = function(opt){

    const tpl = `
        <div class="quiz-ct">
            <div class="quiz-inner">
                <div class="question"><h3></h3></div>
                <div class="answer-ct"></div>
                <div class="c-panel">
                    <div class="btn btn-start">Kezdés</div>
                </div>
            </div>
            <div class="quiz-top-layer"></div>
            <div class="quiz-messagebox">message</div>
        </div>
    `;

    const parentElement = document.querySelector(opt.parentSelector);
    const { questions } = opt;
    const elements = {};

    let questionIndex = 0;
    let points = 0;

    let quizElement = document.createElement('div');
    parentElement.appendChild(quizElement);

    function random(a, b){
        return Math.floor(Math.random() * (b - a)) + a;
    }

    const haveAQueastion = () => questionIndex < questions.length-1;

    const render = () => {
        quizElement.insertAdjacentHTML('beforeend', tpl);

        elements.questionCt = quizElement.querySelector('.question h3');
        elements.answerCt = quizElement.querySelector('.answer-ct');
        elements.btn = quizElement.querySelector('.btn.btn-start');
        elements.topLayer = quizElement.querySelector('.quiz-top-layer');
        elements.messageBox = quizElement.querySelector('.quiz-messagebox');

        elements.questionCt.textContent = 'Ha készen állsz a jétékra, nyomd meg a kezéd gombot.';

        elements.btn.addEventListener('click', firstClickHandler);

    }

    const displayMessage = s => {
        elements.messageBox.textContent = s;
        elements.topLayer.style.display = 'block';
        elements.topLayer.classList.add('quiz-messagebox-layer');
        elements.messageBox.style.display = 'block';
        setTimeout(() => {
            elements.topLayer.style.display = 'none';
            elements.topLayer.classList.remove('quiz-messagebox-layer');

            elements.messageBox.style.display = 'none';
        }, 1500);
    }

    const nextQuestion = () => {
        const answers = [];
        let randomAnswaer;

        elements.questionCt.textContent = questions[questionIndex].kerdes;
        
        for (let i = 0; i < 3; i++){

            do {
                randomAnswaer = questions[random(0, questions.length)].valasz;
            } while (answers.includes(randomAnswaer) || randomAnswaer == questions[questionIndex].valasz)

            answers.push(randomAnswaer);
        }

        let answerIndex = random(0, 3);
        if (answerIndex === 0)
            answers.unshift(questions[questionIndex].valasz)
        else
            answers.splice(answerIndex, 0, questions[questionIndex].valasz);
    

        elements.answerCt.innerHTML = '';

        answers.forEach( answer => {
            const element = document.createElement('div');
            element.className = 'answer';
            element.textContent = answer;
            element.dataset.answer = answer;

            elements.answerCt.appendChild(element);
        });

        singleSelect(elements.answerCt);

        elements.topLayer.style.display = 'none';

    }

    const firstClickHandler = () => {
        nextQuestion();
        elements.btn.textContent = 'Kérem a következőt';
        elements.btn.removeEventListener('click', firstClickHandler);
        elements.btn.addEventListener('click', nextClickkHandler);
    }

    const nextClickkHandler = () => {
        if (checkCorrect()) {
            elements.topLayer.style.display = 'block';
            if (haveAQueastion()){
                questionIndex++;
                console.log('vanKerdes', questionIndex);
                setTimeout(nextQuestion, 1500);
            } else {
                setTimeout(() => {
                    displayScore();
                    elements.btn.textContent = 'Megpróbálom mégegyszer';
                    elements.btn.removeEventListener('click', nextClickkHandler);
                    elements.btn.addEventListener('click', firstClickHandler);
                    reset();
                }, 1500);
            }
        }
    }

    const displayScore = () => {
        const score = (points * 100) / questions.length;
        console.log(score, points);
        elements.answerCt.innerHTML = '';
        let playerResult = '';
        switch (true){
            case score < 20:
                playerResult = 'Hát... azért van mit még gyakorolni. Próbáld meg még egyszer.';
                break;
            case score < 60:
                playerResult = 'A teljesítményed, a rossznál egy picivel jobb! Gyakorolj még.';
                break;
            case score < 80:
                playerResult = 'Csak így tovább, következőre jobban is menni fog.';
                break;
            case score < 100:
                playerResult = 'Gratulálok, majdnem mind jól válaszoltál';
                break;
            default:
                playerResult = 'Kiválló teljesítmény! Az összes kérdésre helyesen válaszoltál!';
        }

        elements.questionCt.innerHTML = `
            <div>${playerResult}</div>
            <div>A megválaszolt kérdesid száma: <b>${points} / ${questions.length}</b></div>
        `;
    }

    const checkCorrect = () => {
        const selected = elements.answerCt.querySelector('.selected');

        if (selected) {

            const correctAnswer = questions[questionIndex].valasz;

            if (selected.dataset.answer == correctAnswer){
                selected.classList.add('correct');
                points++;
            }
            else {
                elements.answerCt.querySelector(`[data-answer="${correctAnswer}"]`).classList.add('correct');
                selected.classList.add('incorrect');
            }

            return true;
        }

        displayMessage('Még nem jelelölted meg a választ!');
        return false;
    }

    const reset = () =>{
        questionIndex = 0;
        points = 0;
        if (elements.topLayer)
            elements.topLayer.style.display = 'none';
    }

    const start = () => {
        quizElement.innerHTML = '';
        reset();
        render();
    }

    return {
        start
    }

}

/*
    Az oldalon legyen egy "Kezdés" gomb, melyre kattintva elindul a játék, azaz megmutattok egy kérdést a játékosnak.
    A kérdés alá választható válaszokat generáltok, melyek közé a helyes válasz is el van rejtve.
    A játékosnak választania kell egy választ, majd a következő gombra kattintva, jöjjön a következő kérdés. Amíg le nem jár a játék.
    Közben mérjétek az időt, és számoljátok a helyes válaszokat.
    A jéték végén a pontok alapján értékeljétek a játékos teljesítményét.

    Opcionálisan, aki érez magában kellő potenciált erre:  A következő gombra klikkelve, 2 másodpercig, mutassátok meg, hogy helyes volt-e a válasz
        Ha helyes volt, zölddel, ha helytelen, pirossal keretezzétek be. Helytelen esetén zölddel keretezve mutassátok meg a helyes választ is.

*/

/*
    Jó munkát! :)
*/