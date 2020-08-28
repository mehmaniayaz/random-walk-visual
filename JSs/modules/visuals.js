export {scatterPlot}
var dataset=[]

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#Interaction-Rate-Plot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");

// Add X axis
var x = d3.scaleLinear()
    .domain([0,5*60])//we are limiting the x-axis to only 5 minutes
    .range([ 0, width]);

svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

// Add Y axis
var y = d3.scaleLinear()
    .domain([0, 1000])
    .range([ height, 0]);
svg.append("g")
    .call(d3.axisLeft(y));

//Add X-axis label
svg.append("text")
    .attr("class","x label")
    .attr("text-anchor","end")
    .attr("x",width)
    .attr("y",height-6)
    .text("time elapsed (ms)")

//Add Y-axis label
svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor","end")
    .attr("y",6)
    .attr("dy","0.75em")
    .attr("transform","rotate(-90)")
    .text("interacted particles")
/**
 * 
 * @param {integer} new_time additional (elapsed time) of particle
 * @param {integer} new_particles additional number of interacted particles
 */
function scatterPlot(new_time,new_particles){
    if (new_time<5*60){
        dataset.push([new_time,new_particles])
        svg.selectAll("circle")
        .data(dataset) 
        .enter()
        .append("circle")
        .attr("cx",function(d){
            return x(d[0]);})
        .attr("cy",function(d){
            return y(d[1])})
        .attr("r",7)
        .attr("fill","red");
    }
}