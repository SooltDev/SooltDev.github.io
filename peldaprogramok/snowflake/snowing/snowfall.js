import { Circle } from "./circle.js";
import { random, colorRange } from "./tools.js";

const snowflakes = [];

let snowflakeNumber = 300;
let snowflakeSpeed = 25;
let snowflakeSize = 5;
let snowflakeSpeedOffset = 10;
let snowflakeSizeOffset = 2;
let snowflakeColor = 'rgb(182, 213, 239)';
let snowflakeColorRange = [-5, 30];

export function snowfall(options){

    snowflakeNumber = options.number || 300;
    snowflakeSpeed = options.speed || 25;
    snowflakeSpeedOffset = options.speedOffset || 15;
    snowflakeSize = options.size || 5;
    snowflakeSizeOffset = options.sizeOffset || 2;
    snowflakeColor = options.color || 'rgb(182, 213, 239)';
    snowflakeColorRange = options.colorRange || [-5, 30];

    for (let i = 0; i < snowflakeNumber; i++){
        
        const r = random(snowflakeSize - snowflakeSizeOffset, snowflakeSize + snowflakeSizeOffset);
        const circle = new Circle(
            random(0, window.innerWidth - (2 * r)), 
            random(0, -(window.innerHeight - (2 * r))), 
            r, 
            colorRange(snowflakeColor, random(...snowflakeColorRange))
        );

        snowflakes.push(circle);
    }

    const start = () => {
        for (let snowflake of snowflakes){
            snowflake.y = random(0, -(window.innerHeight - (2 * snowflake.radius)));
            snowflake.snowing(
                random(
                    snowflakeSpeed - snowflakeSpeedOffset, 
                    snowflakeSpeed + snowflakeSpeedOffset)
            );
        }
    }

    const stop = () => {
        for (let snowflake of snowflakes)
            snowflake.stopSnowing();
    }

    const clear = () => {

    }

    return {
        start, stop, clear
    }
}