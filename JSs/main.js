import {addDot,addOrRemove,distanceBreakdown,ETL} from "./modules/dotManipulation.js"
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
    dot_index,
    active_index,
    dot_active_index,
    topValue_active,
    leftValue_active,
    inactive_index,
    dot_inactive_index,
    topValue_inactive,
    leftValue_inactive,
    new_active_index

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
            //TODO: refactor the bottom
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

            dot_index.style.top = y_end_position[i] + "px";
            dot_index.style.left = x_end_position[i] + "px";                  
        }

        [indices,n_active_particles,n_inactive_particles] = interactionCheck(indices,n_active_particles,n_inactive_particles);
    
        traversed_distance +=distance/n_distance_interval;
        setTimeout(miniStep,step_delay_time)
    }
}
function interactionCheck(indices,n_active_particles,n_inactive_particles){
    //if condition then flag that circle as active (red) - refactor below
    for (let i_active_index=0;i_active_index<indices["active"].length;i_active_index++){
        active_index = indices["active"][i_active_index];
        dot_active_index = document.getElementById("dot-active"+active_index);
        compStyle = window.getComputedStyle(dot_active_index);
        topValue_active = Number(compStyle.getPropertyValue("top").replace("px", ""));
        leftValue_active = Number(compStyle.getPropertyValue("left").replace("px",""));
        for (let i_inactive_index=0; i_inactive_index<indices["inactive"].length;i_inactive_index++){
            inactive_index = indices["inactive"][i_inactive_index]
            dot_inactive_index = document.getElementById("dot-inactive"+inactive_index);
            compStyle = window.getComputedStyle(dot_inactive_index);
            topValue_inactive = Number(compStyle.getPropertyValue("top").replace("px", ""));
            leftValue_inactive = Number(compStyle.getPropertyValue("left").replace("px",""));
            if (Math.sqrt((Math.pow(leftValue_active-leftValue_inactive,2)+Math.pow(topValue_active-topValue_inactive,2)))<25){
                new_active_index = indices["active"].length+1
                document.getElementById("dot-inactive"+inactive_index).setAttribute("id","dot-active" + new_active_index);
                document.getElementById("dot-active"+new_active_index).style.backgroundColor="darkred"
                indices["inactive"].splice(i_inactive_index,1)
                indices["active"].push(new_active_index)
                n_active_particles+=1
                n_inactive_particles-=1
            }                    
        }
    }
    return [indices, n_active_particles,n_inactive_particles]
}