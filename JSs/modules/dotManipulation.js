var i=0, 
    angle=0,
    x_position=0,
    y_position=0,
    x=[],
    element = []
//obtain the coordinates of the bounding box for particles to remain within
let elem = document.getElementById("box-container")
let coords = elem.getBoundingClientRect()
let x_bounding_left = coords['left']
let x_bounding_right = coords['right']
let y_bounding_top = coords['top']
let y_bounding_bottom = coords['bottom']

export {addDot,addOrRemove,distanceBreakdown,ETL,interactionCheck,boundaryCorrection}

/**
 * 
 * @param {integer} n_previous Number of previous-step's dots for each status
 * @param {integer} dn Number of dots to be added
 * @param {boolean} status true of dot is active, false if inactive
 */
function addDot(n_previous,dn,status,indices){//function parameter list too long - shorten it
    let i_start_active,i_start_inactive
    if (indices["active"].length>0){
        i_start_active = indices["active"].reduce(function(a,b){
            return Math.max(a,b)
        }) + 1;
    }else{
        i_start_active=0
    }
    if (indices["inactive"].length>0){
        i_start_inactive = indices["inactive"].reduce(function(a,b){
            return Math.max(a,b)
        }) + 1;
    }else{
        i_start_inactive=0
    }

    for (i=0;i<dn;i++){
        angle = Math.random()*2*Math.PI;
        x_position = x_bounding_left + Math.ceil((x_bounding_right-x_bounding_left)/2);
        y_position = y_bounding_bottom + Math.ceil((y_bounding_top-y_bounding_bottom)/2);
        x = document.createElement('div');
        if (status){
            x.style.backgroundColor="red"
            indices["active"].push(i_start_active+i)
            x.setAttribute("id","dot-active" + (i_start_active+i))
        }else{
            x.style.backgroundColor = 'darkgreen';
            if (Number.isNaN(i_start_inactive+i)){
                console.log("NaN found")
            }
            indices["inactive"].push(i_start_inactive+i) 
            x.setAttribute("id","dot-inactive" + (i_start_inactive+i))
        }

        x.style.width = '25px';
        x.style.height = '25px';
        x.style.top = y_position + 'px';
        x.style.left = x_position + 'px';

        x.style.position = 'absolute';
        x.style.borderRadius = '50%'
        document.body.appendChild(x);
    }
    return indices
}
/**
 * 
 * @param {integer} n_previous Number of previous-step's dots
 * @param {integer} dn Number of dots to be subtracted.
 * @param {boolean} status Status of the particles (active versus inactive)
 * @param {dictionary} indices Dictinary that lists the active and inactive arrays for two keys ["inactive","active"]
 * "]
 */
function removeDot(n_previous,dn,status,indices){
    //currently dots are removed last added, last removed. TODO: remove dots randomly
    if (status){
        for (i=n_previous;i>(n_previous-dn);i--){
            element = document.getElementById("dot-active"+indices["active"][i-1]);//we are using "i-1" since dot-indices start with 1
            element.remove();
            indices["active"].pop()
        }
    }else{
        for (i=n_previous;i>(n_previous-dn);i--){
            element = document.getElementById("dot-inactive"+indices["inactive"][i-1]);
            element.remove();
            indices["inactive"].pop()
        }

    }
    return indices;
}


/**
 * add or remove particles based on information from previous and current number of active
 * and inactive particles
 * @param {*} n_inactive_particles Number of inactive particles at the current step
 * @param {*} n_inactive_previous Number of inactive particles at the previous step
 * @param {*} n_active_particles Number of active particles at the current step
 * @param {*} n_active_previous Number of active particles at the previous step
 */
function addOrRemove(indices,n_inactive_particles,n_inactive_previous,n_active_particles,n_active_previous){
    //decide whether to add or remove inactive from HTML
    if (n_inactive_particles>n_inactive_previous){
        //can we shorten this invocation?
        indices = addDot(n_inactive_previous,n_inactive_particles - n_inactive_previous,false,indices)
    }
    if (n_inactive_particles<n_inactive_previous){
        indices = removeDot(n_inactive_previous,n_inactive_previous-n_inactive_particles,false,indices)
    }

    //decide whether to add or remove active particles from HTML
    if (n_active_particles>n_active_previous){
        //can we shorten this invocation?
        indices = addDot(n_active_previous,n_active_particles - n_active_previous,true,indices)
    }
    if (n_active_particles<n_active_previous){
        indices = removeDot(n_active_previous,n_active_previous-n_active_particles,true,indices)
    }
    return indices
}

/**
 * Breakdown total distance intervals without imposing directional bias
 * @param {*} x_distance Total distance traversed in the x-direction
 * @param {*} y_distance Total distance traversed in the y-direction
 * @param {*} n_distance_interval Breakdown intervals of the distances
 */
function distanceBreakdown(x_distance,y_distance,n_distance_interval){
    let rand_ceil_or_floor_x=0,
    rand_ceil_or_floor_y=0,
    dx_i=0,
    dy_i=0
    rand_ceil_or_floor_x = -0.5 + Math.random()
    rand_ceil_or_floor_y = -0.5 + Math.random()
    if (rand_ceil_or_floor_x<0){
        dx_i = Math.floor(x_distance/n_distance_interval)
    }else{
        dx_i = Math.ceil(x_distance/n_distance_interval)
    }
    if (rand_ceil_or_floor_y<0){
        dy_i = Math.floor(y_distance/n_distance_interval)
    }else{
        dy_i = Math.ceil(y_distance/n_distance_interval)
    }
    return [dx_i, dy_i]
}

/**
 * gather information from fieldset 
 */
function ETL(){
    let step_delay_time = Number(document.getElementById("id-particle-speed").value);
    let distance = Number(document.getElementById("id-particle-distance").value);
    let n_inactive_particles = Number(document.getElementById("id-inactive-particle-number").value);
    let n_active_particles = Number(document.getElementById("id-active-particle-number").value);
    return [step_delay_time,distance,n_inactive_particles,n_active_particles];
}

/**
 * determine whether an active particle activates an inactive particle
 * @param {Dictionary that contains index list of activer and inactive partilces} indices Dictionary for list of indices for active and inactive particles
 * @param {Integer} n_active_particles Number of current active particles
 * @param {Integer} n_inactive_particles Number of current inactive particles
 */
function interactionCheck(indices,n_active_particles,n_inactive_particles,strength_rand){
    let activity_strength = Number(document.getElementById("id-activity-strength").value);
    //if condition then flag that circle as active (red) - refactor below
    for (let i_active_index=0;i_active_index<indices["active"].length;i_active_index++){
        let active_index = indices["active"][i_active_index];
        let dot_active_index = document.getElementById("dot-active"+active_index);
        let compStyle = window.getComputedStyle(dot_active_index);
        let topValue_active = Number(compStyle.getPropertyValue("top").replace("px", ""));
        let leftValue_active = Number(compStyle.getPropertyValue("left").replace("px",""));
        for (let i_inactive_index=0; i_inactive_index<indices["inactive"].length;i_inactive_index++){
            let inactive_index = indices["inactive"][i_inactive_index]
            let dot_inactive_index = document.getElementById("dot-inactive"+inactive_index);
            compStyle = window.getComputedStyle(dot_inactive_index);
            let topValue_inactive = Number(compStyle.getPropertyValue("top").replace("px", ""));
            let leftValue_inactive = Number(compStyle.getPropertyValue("left").replace("px",""));
            if (Math.sqrt((Math.pow(leftValue_active-leftValue_inactive,2)+Math.pow(topValue_active-topValue_inactive,2)))<25){
                if (activity_strength>strength_rand){
                    let new_active_index = indices["active"].length+1
                    document.getElementById("dot-inactive"+inactive_index).setAttribute("id","dot-active" + new_active_index);
                    document.getElementById("dot-active"+new_active_index).style.backgroundColor="red"
                    indices["inactive"].splice(i_inactive_index,1)
                    indices["active"].push(new_active_index)
                    n_active_particles+=1
                    n_inactive_particles-=1
                    document.getElementById("id-inactive-particle-number").value = n_inactive_particles
                    document.getElementById("id-active-particle-number").value = n_active_particles       
                } 
            }                    
        }
    }
    return [indices, n_active_particles,n_inactive_particles]
}

/**
 * 
 * @param {css attribute} topValue the y coordinate of particle
 * @param {css attribute} leftValue the x coordinate of particle
 * @param {integer} dx_i the x coordinate for the particle ministep
 * @param {integer} dy_i the y coordinate for particle ministep
 */
function boundaryCorrection(topValue,leftValue,dx_i,dy_i){
    let within_boundary = true
    let x_end_position_i,y_end_position_i
    if ((Number(leftValue) + dx_i)>x_bounding_right){
        within_boundary = false
        x_end_position_i = x_bounding_right - Math.abs(Number(leftValue)+dx_i-x_bounding_right);
        dx_i = -dx_i
    } else if ((Number(leftValue) + dx_i)<x_bounding_left){
        within_boundary = false
        x_end_position_i = x_bounding_left + Math.abs(Number(leftValue)+dx_i-x_bounding_left);
        dx_i = -dx_i
    }
    if ((Number(topValue) + dy_i)<y_bounding_top){
        within_boundary = false
        y_end_position_i = y_bounding_top +  Math.abs(Number(topValue)+dy_i-y_bounding_top);
        dy_i=-dy_i
    } else if ((Number(topValue) + dy_i)>y_bounding_bottom){
        within_boundary = false
        y_end_position_i = y_bounding_bottom - Math.abs(Number(topValue)+dy_i-y_bounding_bottom);
        dy_i=-dy_i
    }
    if (within_boundary){
        x_end_position_i = Number(leftValue) + dx_i;
        y_end_position_i = Number(topValue) + dy_i;
    }
    return [x_end_position_i,y_end_position_i,dx_i,dy_i]
}