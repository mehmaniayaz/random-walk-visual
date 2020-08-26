import {addDot,removeDot} from "./modules/dotManipulation.js"
import {scatterPlot} from "./modules/visuals.js"
var compStyle=[],
    topValue=[],
    leftValue=[],
    i=[],
    n_previous=0,
    distance = [], //distance in pixel that the dot travels at each time step
    step_delay_time = 10,//ms
    dx=[],
    dy=[],
    traversed_distance=[],
    x_end_position=[],
    y_end_position=[],
    angle=0,
    dot_i=[],
    distance = 10,
    red ='rgb(255,0,0)',
    n_distance_interval = 10,
    x_distance=0,
    y_distance=0,
    within_boundary=false,
    rand_ceil_or_floor_x=0,
    rand_ceil_or_floor_y=0,
    n_inactive_previous=0,
    n_inactive_particles=0,
    n_active_particles=0,
    n_active_previous=0,
    elapsedTime=0

n_inactive_particles = Number(document.getElementById("id-inactive-particle-number").value);
addDot(0,n_inactive_particles,active=0)


//obtain the coordinates of the bounding box for particles to remain within
let elem = document.getElementById("box-container"),
    coords = elem.getBoundingClientRect(),
    x_bounding_left = coords['left'],
    x_bounding_right = coords['right'],
    y_bounding_top = coords['top'],
    y_bounding_bottom = coords['bottom']

scatterPlot()
function setPosition(){
    scatterPlot(elapsedTime,n_active_particles)
    elapsedTime +=1
    step_delay_time = Number(document.getElementById("id-particle-speed").value);
    distance = Number(document.getElementById("id-particle-distance").value);

    //acquire information about inactive particles
    n_previous = n_particles;
    n_particles = Number(document.getElementById("id-particle-number").value);

    //acquire information about active particles
    n_inactive_previous = n_active_particles;
    n_active_particles = Number(document.getElementById("id-active-particle-number").value);
    activity_strength = Number(document.getElementById("id-activity-strength").value);

    //decide whether to add or remove inactive from HTML
    if (n_inactive_particles>n_inactive_previous){
        addDot(n_inactive_previous,n_inactive_particles - n_inactive_previous,active=0)
    }
    if (n_inactive_particles<n_inactive_previous){
        removeDot(n_inactive_previous,n_inactive_previous-n_inactive_particles,active=0)
    }

    //decide whether to add or remove active particles from HTML
    if (n_active_particles>n_active_previous){
        addDot(n_active_previous,n_active_particles - n_active_previous,active=1)
    }
    if (n_active_particles<n_active_previous){
        removeDot(n_active_previous,n_active_previous-n_active_particles,active=1)
    }

    //set dx,dy,x_end_position, y_end_position to null arrays
    dx=[],dy=[],x_end_position=[],y_end_position=[]
    travesered_distance = 0; //distance particles have traveled at each mini-time step
    for (i=1;i<=(n_active_particles+n_inactive_particles);i++){
        angle = Math.random()*2*Math.PI; //select a random angle for the particle to head to
        x_distance =  Math.cos(angle)*distance //determine the x-coordinate distance of that direction
        y_distance = Math.sin(angle)*distance //determine the y-coordinate distancee of that direction

        //this section is to avoid directional bias for the random walkers
        rand_ceil_or_floor_x = -0.5 + Math.random()
        rand_ceil_or_floor_y = -0.5 + Math.random()
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
    /*TODO: (1) determine the a dictionary of lines for each particle
            (2) determine which line intersect which one
            (3)activate inactive particles if they intersect path of active particles (based on activity strength - use default of 100%)*/

    miniStep()

    function miniStep(){
        if (traversed_distance<=distance){
            for (i=1;i<=n_particles;i++){ 
                //let's put the condition for iteractivity here. If two dots are at close proximity to each other at any single
                //point, then based on activity-strenght they interact.            
                dot_i = document.getElementById("dot"+i);
                compStyle = window.getComputedStyle(dot_i);
                topValue = compStyle.getPropertyValue("top").replace("px", "");
                leftValue = compStyle.getPropertyValue("left").replace("px","");

                within_boundary = true
                if ((Number(leftValue) + dx[i])>x_bounding_right){
                    within_boundary = false
                    x_end_position[i] = x_bounding_right - Math.abs(Number(leftValue)+dx[i]-x_bounding_right);
                    dx[i] = -dx[i]

                } else if ((Number(leftValue) + dx[i])<x_bounding_left){
                    within_boundary = false
                    x_end_position[i] = x_bounding_left + Math.abs(Number(leftValue)+dx[i]-x_bounding_left);
                    dx[i] = -dx[i]
                }

                if ((Number(topValue) + dy[i])<y_bounding_top){
                    within_boundary = false
                    y_end_position[i] = y_bounding_top +  Math.abs(Number(topValue)+dy[i]-y_bounding_top);
                    dy[i]=-dy[i]

                } else if ((Number(topValue) + dy[i])>y_bounding_bottom){
                    within_boundary = false
                    y_end_position[i] = y_bounding_bottom - Math.abs(Number(topValue)+dy[i]-y_bounding_bottom);
                    dy[i]=-dy[i]
                }

                if (within_boundary){
                    x_end_position[i] = Number(leftValue) + dx[i];
                    y_end_position[i] = Number(topValue) + dy[i];
                }

                dot_i.style.top = y_end_position[i] + "px";
                dot_i.style.left = x_end_position[i] + "px"; 
                //if condition then flag that circle as active (red)                 
            }
            traversed_distance +=distance/n_distance_interval;
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
