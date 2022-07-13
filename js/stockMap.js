

let warehouses = [];
let warehouse = {};
let position;
let posdepth = 2;
let posSize = 15;
let posPadding = 3;
let maxrows = 0;
let maxlevels = 0;
let maxx = 0;
let maxy = 0;
let colors = ['#0d6efd','#ffc107','#0dcaf0','#20c997','#198754','#ffc107','#fd7e14'];


width = $(window).width();
height = $(window).height(); 
let svg = d3.select("#chart").append("svg")
.attr('width', width)
.attr('height', height)
.on("click", reset);

const g = svg.append("g");
const topLabel = g.append("g");
const pos = g.append("g");

const hex = (x) => {
  return x.toString(16).padStart(2, '0')
};

function getWarehouses(){
  $.get( "/WebGetLocationsPlaces.hal", function( data ) {
    $( ".result" ).html( data );
    data.locations.forEach(element => {
      if(element.location==="MAIN"){
        position = element.places;
        

        for(i=0;i<position.length;i++){
          position[i].row = position[i].name[0].charCodeAt(0)-64;
          if(maxrows<position[i].row){
            maxrows=position[i].row;
          }
          position[i].level = parseInt(position[i].name[1]);
          if(maxlevels<position[i].level){maxlevels=position[i].level}
          position[i].x = parseInt(position[i].name.substring(3,5));
          position[i].y = parseInt((position[i].x-0.1)/posdepth+1);
          position[i].x = position[i].x - (position[i].y-1) * posdepth;
          if(maxx<position[i].x){maxx=position[i].x}
          if(maxy<position[i].y){maxy=position[i].y}
          position[i].color = colors[position[i].level];
        }
        for(i=0;i<position.length;i++){
          position[i].globalX = position[i].x + (position[i].level-1)*posdepth + (position[i].row-1)*posdepth*maxlevels;
          position[i].globalY = position[i].y;
        }
      }
    });
  
    pos.attr("fill", "#444")
    .attr("cursor", "pointer")
    .selectAll("rect")
    .data(position,function(d){
      return d.code;
    })
    .enter()
    .append("g")
    .append("rect")
    .on("click", clicked)
    .attr("x", d=>d.globalX*(posSize+posPadding)+((d.row-1)*posSize))
    .attr("y", d=>d.globalY*(posSize+posPadding)*4)
    .attr("width", posSize)
    .attr("height", posSize*4)
    .attr("fill", d=>{
      k = 255/maxlevels*d.level;
      return "#" + hex(k) + hex(k) + hex(k)})
    .append("title")
    .text(d=>d.name);

    pos.selectAll("g")
    .append("text")
    .attr("fill", d=>{
      k = 255 - 255/maxlevels*d.level;
      return "#" + hex(k) + hex(k) + hex(k)})
    .attr("font-size","10")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .attr("transform",d=>{
      x = d.globalX*(posSize+posPadding)+((d.row-1)*posSize)+4
      y = d.globalY*(posSize+posPadding)*4;
      return "translate("+x+","+y+") rotate(90)";})
    .text(d=>d.name);

    blockheight = (posSize + posPadding) * maxlevels * posdepth;
    spaceheight = maxlevels * posdepth;
    for(i=0;i<maxrows;i++){
      topLabel.append("text")
        .attr("x",i * (blockheight + spaceheight) + blockheight/2)
        .attr("y",30)
        .attr("dy", ".35em")
        .attr("font-size","50")
        .text(String.fromCharCode(65+i));
    }
    
  });
}

const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", zoomed);

svg.call(zoom);

function resize() {
  width = $(window).width(); 
  height = $(window).height(); 
  d3.select('#chart svg')
    .attr('width', width)
    .attr('height', height);
}

function clicked(event, d) {
  //const [[x0, y0], [x1, y1]] = path.bounds(d);
  event.stopPropagation();
  pos.transition().style("fill", "null");
  d3.select(this).transition().style("fill", "red");
  /*svg.transition().duration(750).call(
    zoom.transform,
    d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
      .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
    d3.pointer(event, svg.node())
  );*/
  d3.pointer(event, svg.node())
}

function reset() {
  pos.transition().style("fill", null);
  svg.transition().duration(750).call(
    zoom.transform,
    d3.zoomIdentity,
    d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
  );
}

function zoomed(event) {
  const {transform} = event;
  g.attr("transform", transform);
  g.attr("stroke-width", 1 / transform.k);
}

window.onresize = resize;

$(document).ready(function(){
  console.log('test');
  getWarehouses();
});