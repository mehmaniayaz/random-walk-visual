// TODO: figure out how to read the HTML file in Node.js for debugging purposes

var first_dot = compStyle=topValue=i=[]
// const x_initial_position = 400; const y_initial_position = 500;
var distance = 30; //distance in pixel that the dot travels at each time step
n_particles = Number(document.getElementById("id-particle-number").value);
var timeoutID = null;

//TODO: create an initial set of objects
addDot(0,n_particles)


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
    for (i=1;i<=n_particles;i++){
        angle = Math.random()*2*Math.PI;
        x_position = Math.sin(angle)*distance;
        y_position = Math.cos(angle)*distance;
        dot_i = document.getElementById("dot"+i);
        compStyle = window.getComputedStyle(dot_i);
        topValue = compStyle.getPropertyValue("top").replace("px", "");
        leftValue = compStyle.getPropertyValue("left").replace("px","");
        dot_i.style.top = (Number(topValue) + y_position) + "px";
        dot_i.style.left = (Number(leftValue) + x_position) + "px";

    }
    timedoutID = setTimeout(setPosition,1000)
}

/*
n: number of random particles to creates
*/
function addDot(n_current,n){
    for (i=n_current+1;i<=(n_current + n);i++){

        //TODO: refactor the position setter of a new dot into a function
        angle = Math.random()*2*Math.PI;
        // x_position = x_initial_position + Math.sin(angle)*distance;
        // y_position = y_initial_position + Math.cos(angle)*distance;
        x_position = screen.availWidth*Math.random();
        y_position = screen.availHeight* Math.random();
        var x = document.createElement('div');
        x.setAttribute("id","dot" + i)
        x.style.width = '25px';
        x.style.height = '25px';
        x.style.top = y_position + 'px';
        x.style.left = x_position + 'px';
        x.style.backgroundColor = 'red';
        x.style.position = 'absolute';
        x.style.borderRadius = '50%'
        document.body.appendChild(x);

    }


}

function removeDot(){

}

setPosition();