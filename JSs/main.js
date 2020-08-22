import {addDot} from "./modules/dotManipulation.js"
var compStyle=[],topValue=[],leftValue=[],i=[],n_current=0
var distance = []; //distance in pixel that the dot travels at each time step
var step_delay_time = 10;//move the circles one millisecond at a time
var n_particles = Number(document.getElementById("id-particle-number").value);
var dx=[],dy=[],end_distance=[],x_end_distance=[],y_end_distance=[]
var angle=0,dot_i=[]
var distance = 10;//pixels
var purple ='rgb(128,0,128)';
var n_distance_interval = 10;
var step_delay_time = 10;//move the circles one millisecond at a time
//TODO: create an initial set of objects
addDot(0,n_particles)


//obtain the coordinates of the bounding box for particles to remain within
let elem = document.getElementById("box-container")
let coords = elem.getBoundingClientRect()
let x_bounding_left = coords['left']
let x_bounding_right = coords['right']
let y_bounding_top = coords['top']
let y_bounding_bottom = coords['bottom']


var x_distance=0, y_distance=0
var within_boundary=false


function setPosition(){
    distance = Number(document.getElementById("id-particle-distance").value);
    n_current = n_particles;
    n_particles = Number(document.getElementById("id-particle-number").value);
    //INPUT NUMBER OF PARTICLES 
    //IF NUMBER OF PARTICLES ARE DIFFERENT THAN CURRENT NUMBER THEN 
    //(1) IF NUMBER OF NEW PARTICLES IS BIGGER THAN CURRENT NUMBER THEN
    //ADD MORE PARTICLES WITHOUT CHANGING THE CURRENT OBJECTS TREJECTORY
    //(2) IF THE NUMBER OF PARTICLES IS SMALLER THAN CURRENT ONES THEN RANDOMLY
    //REMOVE SOME OF THEM BUT DO NOT AFFECT THE REMAINING ONES' TREJECTORY
    if (n_particles>n_current){
        addDot(n_current,n_particles - n_current)
    }
    //TODO: if n_particles<n_current remove some of the particles without disturbing the others' trajectory
    end_distance = 0;
    for (i=1;i<=n_particles;i++){
        angle = Math.random()*2*Math.PI;
        dot_i = document.getElementById("dot"+i);
        compStyle = window.getComputedStyle(dot_i);
        topValue = compStyle.getPropertyValue("top").replace("px", "");
        leftValue = compStyle.getPropertyValue("left").replace("px","");
        x_distance =  Math.cos(angle)*distance
        y_distance = Math.sin(angle)*distance

        within_boundary = true
        if ((Number(leftValue) + x_distance)>x_bounding_right){
            within_boundary = false
            x_end_distance[i] = x_bounding_left + Math.abs(Number(leftValue)+x_distance-x_bounding_right);

        } else if ((Number(leftValue) + x_distance)<x_bounding_left){
            within_boundary = false
            x_end_distance[i] = x_bounding_right - Math.abs(Number(leftValue)+x_distance-x_bounding_left);
        }

        if ((Number(topValue) + y_distance)<y_bounding_top){
            within_boundary = false
            y_end_distance[i] = y_bounding_bottom -  Math.abs(Number(topValue)+y_distance-y_bounding_top);

        } else if ((Number(topValue) + y_distance)>y_bounding_bottom){
            within_boundary = false
            y_end_distance[i] = y_bounding_top + Math.abs(Number(topValue)+y_distance-y_bounding_bottom);
        }

        if (within_boundary){
            x_end_distance[i] = Number(leftValue) + Math.cos(angle)*distance;
            y_end_distance[i] = Number(topValue) + Math.sin(angle)*distance;
        }

    }

    miniStep()

    function miniStep(){
        if (end_distance<=distance){
            for (i=1;i<=n_particles;i++){            
                dot_i = document.getElementById("dot"+i);
                compStyle = window.getComputedStyle(dot_i);
                topValue = compStyle.getPropertyValue("top").replace("px", "");
                leftValue = compStyle.getPropertyValue("left").replace("px","");
                // dot_i.style.top = (Number(topValue) + dy[i]) + "px";
                // dot_i.style.left = (Number(leftValue) + dx[i]) + "px";

                dot_i.style.top = y_end_distance[i] + "px";
                dot_i.style.left = x_end_distance[i] + "px";                  
            }
            end_distance +=distance/n_distance_interval;
            setTimeout(miniStep,step_delay_time)
        }
    }
    setTimeout(setPosition,step_delay_time*n_distance_interval*2)
}

/*
n: number of random particles to creates
*/

function removeDot(){

}

function randomColor() { 
    r1 = Math.floor(Math.random() * 255) 
    r2 = Math.floor(Math.random() * 255) 
    r3 = Math.floor(Math.random() * 255) 
    return 'rgb(' + r1 + "," + r2 + "," + r3 + ')';
}

setPosition()
