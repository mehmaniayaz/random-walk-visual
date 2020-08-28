import {addDot,addOrRemove,distanceBreakdown,ETL,interactionCheck,boundaryCorrection} from "./modules/dotManipulation.js"
import {scatterPlot} from "./modules/visuals.js"
var compStyle=[],
    topValue=[],
    leftValue=[],
    i=[],
    distance = [], //distance in pixel that the dot travels at each time step
    step_delay_time = 10,//ms
    dx=[],
    dy=[],
    traversed_distance=[],
    x_end_position=[],
    y_end_position=[],
    angle=0,
    distance = 10,
    n_distance_interval = 10,
    x_distance=0,
    y_distance=0,
    within_boundary=false,
    n_inactive_previous=0,
    n_inactive_particles=0,
    n_active_particles=0,
    n_active_previous=0,
    elapsedTime=0,
    active=false,
    activity_strength,
    indices = {"inactive":[],"active":[]},
    index,
    dot_index


//obtain the coordinates of the bounding box for particles to remain within
let elem = document.getElementById("box-container"),
    coords = elem.getBoundingClientRect(),
    x_bounding_left = coords['left'],
    x_bounding_right = coords['right'],
    y_bounding_top = coords['top'],
    y_bounding_bottom = coords['bottom']

n_inactive_particles = Number(document.getElementById("id-inactive-particle-number").value);
indices= addDot(0,n_inactive_particles,active=false,indices)    

//plot the skeleton of scatterplot
scatterPlot()


function setPosition(){
    scatterPlot(elapsedTime,n_active_particles)
    elapsedTime +=1
    //record number of active versus inactive particles from previous step
    n_inactive_previous = n_inactive_particles;
    n_active_previous = n_active_particles;

    [step_delay_time,distance,n_inactive_particles,n_active_particles,activity_strength]=ETL();

    indices = addOrRemove(indices,n_inactive_particles,n_inactive_previous,n_active_particles,n_active_previous);

    //set dx,dy,x_end_position, y_end_position to null arrays
    dx=[],dy=[],x_end_position=[],y_end_position=[]
    traversed_distance = 0; //distance particles have traveled at each mini-time step
    for (i=0;i<(n_inactive_particles+n_active_particles);i++){
        angle = Math.random()*2*Math.PI; //select a random angle for the particle to head to
        x_distance =  Math.cos(angle)*distance; //determine the x-coordinate distance of that direction
        y_distance = Math.sin(angle)*distance; //determine the y-coordinate distancee of that direction
        //this section is to avoid directional bias for the random walkers
        [dx[i],dy[i]] = distanceBreakdown(x_distance,y_distance,n_distance_interval);
    }
    miniStep()
    setTimeout(setPosition,step_delay_time*n_distance_interval*2)
}

setPosition()


/**
 * Create a smoother traverse of particles by breaking down the mini-steps with each time step
 * by breaking down the distance with n_distance_interval
 */
function miniStep(){
    if (traversed_distance<=distance){
        for (i=0;i<(n_inactive_particles+n_active_particles);i++){             
            //first go through inactive particles and then active particles
            if (i<n_inactive_particles){
                index=indices["inactive"][i];
                dot_index = document.getElementById("dot-inactive"+index);

            }else{
                index=indices["active"][i-n_inactive_particles];
                dot_index = document.getElementById("dot-active"+index);
            }
            compStyle = window.getComputedStyle(dot_index);
            
            topValue = compStyle.getPropertyValue("top").replace("px", "");
            leftValue = compStyle.getPropertyValue("left").replace("px","");

            [x_end_position[i],y_end_position[i],dx[i],dy[i]] = boundaryCorrection(topValue,leftValue,dx[i],dy[i])

            dot_index.style.top = y_end_position[i] + "px";
            dot_index.style.left = x_end_position[i] + "px";                  
        }

        [indices,n_active_particles,n_inactive_particles] = interactionCheck(indices,n_active_particles,n_inactive_particles);
    
        traversed_distance +=distance/n_distance_interval;
        setTimeout(miniStep,step_delay_time)
    }
}
