import { snowfall } from "./snowing/snowfall.js";
import { colorRange } from "./snowing/tools.js";

///*
for (let i = -100; i < 100; i++){
    const color = colorRange('rgb(82, 7, 57)', i);
    const div = document.createElement("div");
    Object.assign(div.style, {
        backgroundColor: color,
        height: i == 0 ? "20px" : "2px",
        border: i == 0 ? "1px solid #fff" : "0"
    });

    document.body.appendChild(div);
}
//*/

const snowing = snowfall({
    color: 'rgb(182, 213, 240)',
    speed: 30,
    speedOffset: 20,
    size: 4,
    sizeOffset: 2,
    colorRange: [-10, 40],
    snowflakeNumber: 350
});

document.getElementById('snowing').addEventListener('click', snowing.start);
document.getElementById('stop-snowing').addEventListener('click', snowing.stop);

//snowing.start();




