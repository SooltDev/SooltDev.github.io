
const random = (a, b) => Math.floor(Math.random() * (b - a) ) + a;

const shuffleArray = (array, reindex = false) => {
    for (let i = array.length - 1; i > 0; i--) {
        let j = random(0, i+1);
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array
};

module.exports = {
    random, shuffleArray
}