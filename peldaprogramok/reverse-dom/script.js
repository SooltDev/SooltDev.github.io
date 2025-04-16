document.querySelector("#rev").addEventListener('click', () => {
    const list = document.querySelector("#list");
    const firstChild = list.firstElementChild;


    while (firstChild.nextElementSibling){
        list.insertAdjacentElement('afterbegin', firstChild.nextElementSibling)
    }

});