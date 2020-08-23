import {addDot,removeDot} from "./modules/dotManipulation.js"
var compStyle=[],
    topValue=[],
    leftValue=[],
    i=[],
    n_previous=0,
    distance = [], //distance in pixel that the dot travels at each time step
    step_delay_time = 10,//ms
    dx=[],
    dy=[],
    end_distance=[],
    x_end_distance=[],
    y_end_distance=[],
    angle=0,
    dot_i=[],
    distance = 10,
    purple ='rgb(128,0,128)',
    n_distance_interval = 10

var n_particles = Number(document.getElementById("id-particle-number").value);

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
var rand_ceil_or_floor_x=0
var rand_ceil_or_floor_y=0


function setPosition(){
    distance = Number(document.getElementById("id-particle-distance").value);
    step_delay_time = Number(document.getElementById("id-particle-speed").value);
    n_previous = n_particles;
    n_particles = Number(document.getElementById("id-particle-number").value);
    //INPUT NUMBER OF PARTICLES 
    //IF NUMBER OF PARTICLES ARE DIFFERENT THAN CURRENT NUMBER THEN 
    //(1) IF NUMBER OF NEW PARTICLES IS BIGGER THAN CURRENT NUMBER THEN
    //ADD MORE PARTICLES WITHOUT CHANGING THE CURRENT OBJECTS TREJECTORY
    //(2) IF THE NUMBER OF PARTICLES IS SMALLER THAN CURRENT ONES THEN RANDOMLY
    //REMOVE SOME OF THEM BUT DO NOT AFFECT THE REMAINING ONES' TREJECTORY
    if (n_particles>n_previous){
        addDot(n_previous,n_particles - n_previous)
    }
    if (n_particles<n_previous){
        removeDot(n_previous,n_previous-n_particles)
    }
    dx=[],dy=[],x_end_distance=[],y_end_distance=[]
    end_distance = 0;
    for (i=1;i<=n_particles;i++){
        angle = Math.random()*2*Math.PI;

        x_distance =  Math.cos(angle)*distance
        y_distance = Math.sin(angle)*distance

        rand_ceil_or_floor_x = -0.5 + Math.random()
        rand_ceil_or_floor_y = -0.5 + Math.random()

        //this is to avoid directional bias for the random walkers
        if (rand_ceil_or_floor_x<0){
            dx[i] = Math.floor(x_distance/n_distance_interval)
        }else{
            dx[i] = Math.ceil(x_distance/n_distance_interval)
        }
        if (rand_ceil_or_floor_y<0){
            dy[i] = Math.floor(y_distance/n_distance_interval)
        }else{
            dy[i] = Math.ceil(y_distance/n_distance_interval)
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

                within_boundary = true
                if ((Number(leftValue) + dx[i])>x_bounding_right){
                    within_boundary = false
                    x_end_distance[i] = x_bounding_right - Math.abs(Number(leftValue)+dx[i]-x_bounding_right);
                    dx[i] = -dx[i]

                } else if ((Number(leftValue) + dx[i])<x_bounding_left){
                    within_boundary = false
                    x_end_distance[i] = x_bounding_left + Math.abs(Number(leftValue)+dx[i]-x_bounding_left);
                    dx[i] = -dx[i]
                }

                if ((Number(topValue) + dy[i])<y_bounding_top){
                    within_boundary = false
                    y_end_distance[i] = y_bounding_top +  Math.abs(Number(topValue)+dy[i]-y_bounding_top);
                    dy[i]=-dy[i]

                } else if ((Number(topValue) + dy[i])>y_bounding_bottom){
                    within_boundary = false
                    y_end_distance[i] = y_bounding_bottom - Math.abs(Number(topValue)+dy[i]-y_bounding_bottom);
                    dy[i]=-dy[i]
                }

                if (within_boundary){
                    x_end_distance[i] = Number(leftValue) + dx[i];
                    y_end_distance[i] = Number(topValue) + dy[i];
                }

                dot_i.style.top = y_end_distance[i] + "px";
                dot_i.style.left = x_end_distance[i] + "px";                  
            }
            end_distance +=distance/n_distance_interval;
            setTimeout(miniStep,step_delay_time)
        }
    }
    setTimeout(setPosition,step_delay_time*n_distance_interval*2)
}


function randomColor() { 
    r1 = Math.floor(Math.random() * 255) 
    r2 = Math.floor(Math.random() * 255) 
    r3 = Math.floor(Math.random() * 255) 
    return 'rgb(' + r1 + "," + r2 + "," + r3 + ')';
}

setPosition()