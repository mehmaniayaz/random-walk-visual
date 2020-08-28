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

export {addDot,removeDot}

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
            x.style.backgroundColor="darkred"
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


