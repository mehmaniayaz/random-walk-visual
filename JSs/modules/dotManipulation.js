var i=0, angle=0,x_position=0,y_position=0
//obtain the coordinates of the bounding box for particles to remain within
let elem = document.getElementById("box-container")
let coords = elem.getBoundingClientRect()
let x_bounding_left = coords['left']
let x_bounding_right = coords['right']
let y_bounding_top = coords['top']
let y_bounding_bottom = coords['bottom']

export {addDot,removeDot}


function addDot(n_previous,dn){
    //n: number of new dots to add
    //n_current: number of current dots
    for (i=n_previous+1;i<=(n_previous + dn);i++){

        //TODO: refactor the position setter of a new dot into a function
        angle = Math.random()*2*Math.PI;
        x_position = x_bounding_left + Math.ceil((x_bounding_right-x_bounding_left)/2);
        // x_position = screeen.availWidth*Math.random();
        y_position = y_bounding_bottom + Math.ceil((y_bounding_top-y_bounding_bottom)/2);
        // y_position = screen.availHeight* Math.random();
        var x = document.createElement('div');
        x.setAttribute("id","dot" + i)
        x.style.width = '25px';//make this a constant
        x.style.height = '25px';
        x.style.top = y_position + 'px';
        x.style.left = x_position + 'px';
        // x.style.backgroundColor = randomColor(); 
        x.style.backgroundColor = 'purple'; 
        x.style.position = 'absolute';
        x.style.borderRadius = '50%'
        document.body.appendChild(x);

    }

}

function removeDot(n_previous,dn){
    //currently dots are removed last added, last removed. TODO: remove dots randomly
    for (i=n_previous;i>(n_previous-dn);i--){
        // Removes an element from the document
        var element = document.getElementById("dot"+i);
        element.remove();
    }
}


