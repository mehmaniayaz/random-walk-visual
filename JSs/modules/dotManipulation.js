import * as allVars from "./constVars.js";
console.log(allVars.i)
export {addDot}


function addDot(n_current,n){
    for (i=n_current+1;i<=(n_current + n);i++){

        //TODO: refactor the position setter of a new dot into a function
        angle = Math.random()*2*Math.PI;
        x_position = Math.ceil(screen.availWidth/2);
        // x_position = screeen.availWidth*Math.random();
        y_position = Math.ceil(screen.availWidth/5);
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
