

let warehouse = {};
let posdepth = 2; //depth of each row
let posSize = 15;
let posPadding = 3;
let maxrows = 0;
let maxlevels = 0;
let maxx = 0;
let maxy = 0;
let colors = ['#0d6efd','#ffc107','#0dcaf0','#20c997','#198754','#ffc107','#fd7e14'];
let activePos;//data on selected position


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

const fillColor = (d) => {
    k = 255/maxlevels*d.level;
    return "#" + hex(k) + hex(k) + hex(k)};
const fillRevertColor = (d) => {
      k = 255-255/maxlevels*d.level;
      return "#" + hex(k) + hex(k) + hex(k)};

    
function fillElements(position){//draw elements
  pos.attr("fill", "#444")
    .attr("cursor", "pointer")
    .selectAll("rect")
    .data(position,function(d){
      return d.code;
    })
    .enter()
    .append("g")
    .on("click", clicked)
    .append("rect")
    .attr("x", d=>d.globalX*(posSize+posPadding)+((d.row-1)*posSize))
    .attr("y", d=>d.globalY*(posSize+posPadding)*4)
    .attr("width", posSize)
    .attr("height", posSize*4)
    .attr("stroke", "black")
    .attr("fill", d=>{return fillColor(d)})
    .append("title")
    .text(d=>d.name);

    pos.selectAll("g")
    .append("text")
    .attr("fill", d=>{return fillRevertColor(d)})
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
}


function prepareData(data){//prepare data - add cell coordinates
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
  
  return position;
}

function getWarehouses(){ //Download warehouse structure data
  let edata;
  console.log(window.location.protocol);
  if(window.location.protocol!=='file:'){//for real data remote request
      $.get("/WebGetLocationsPlaces.hal", function( data ) {
        //$( ".result" ).html( data );
        edata = data;
        let position = prepareData(edata); 
        fillElements(position);
      });
    
  } else {//for local test enviropment data from string - CROS not working :(
    edata = {"locations":[{"location":"00","name":"","places":[]},{"location":"EURO","name":"00","places":[]},{"location":"MAIN","name":"","places":[{"code":"A1-01","name":"A1-01"},{"code":"A1-02","name":"A1-02"},{"code":"A1-03","name":"A1-03"},{"code":"A1-04","name":"A1-04"},{"code":"A1-05","name":"A1-05"},{"code":"A1-06","name":"A1-06"},{"code":"A1-07","name":"A1-07"},{"code":"A1-08","name":"A1-08"},{"code":"A1-09","name":"A1-09"},{"code":"A1-10","name":"A1-10"},{"code":"A1-11","name":"A1-11"},{"code":"A1-12","name":"A1-12"},{"code":"A1-13","name":"A1-13"},{"code":"A1-14","name":"A1-14"},{"code":"A1-15","name":"A1-15"},{"code":"A1-16","name":"A1-16"},{"code":"A1-17","name":"A1-17"},{"code":"A1-18","name":"A1-18"},{"code":"A2-01","name":"A2-01"},{"code":"A2-02","name":"A2-02"},{"code":"A2-03","name":"A2-03"},{"code":"A2-04","name":"A2-04"},{"code":"A2-05","name":"A2-05"},{"code":"A2-06","name":"A2-06"},{"code":"A2-07","name":"A2-07"},{"code":"A2-08","name":"A2-08"},{"code":"A2-09","name":"A2-09"},{"code":"A2-10","name":"A2-10"},{"code":"A2-11","name":"A2-11"},{"code":"A2-12","name":"A2-12"},{"code":"A2-13","name":"A2-13"},{"code":"A2-14","name":"A2-14"},{"code":"A2-15","name":"A2-15"},{"code":"A2-16","name":"A2-16"},{"code":"A2-17","name":"A2-17"},{"code":"A2-18","name":"A2-18"},{"code":"A3-01","name":"A3-01"},{"code":"A3-02","name":"A3-02"},{"code":"A3-03","name":"A3-03"},{"code":"A3-04","name":"A3-04"},{"code":"A3-05","name":"A3-05"},{"code":"A3-06","name":"A3-06"},{"code":"A3-07","name":"A3-07"},{"code":"A3-08","name":"A3-08"},{"code":"A3-09","name":"A3-09"},{"code":"A3-10","name":"A3-10"},{"code":"A3-11","name":"A3-11"},{"code":"A3-12","name":"A3-12"},{"code":"A3-13","name":"A3-13"},{"code":"A3-14","name":"A3-14"},{"code":"A3-15","name":"A3-15"},{"code":"A3-16","name":"A3-16"},{"code":"A3-17","name":"A3-17"},{"code":"A3-18","name":"A3-18"},{"code":"A4-01","name":"A4-01"},{"code":"A4-02","name":"A4-02"},{"code":"A4-03","name":"A4-03"},{"code":"A4-04","name":"A4-04"},{"code":"A4-05","name":"A4-05"},{"code":"A4-06","name":"A4-06"},{"code":"A4-07","name":"A4-07"},{"code":"A4-08","name":"A4-08"},{"code":"A4-09","name":"A4-09"},{"code":"A4-10","name":"A4-10"},{"code":"A4-11","name":"A4-11"},{"code":"A4-12","name":"A4-12"},{"code":"A4-13","name":"A4-13"},{"code":"A4-14","name":"A4-14"},{"code":"A4-15","name":"A4-15"},{"code":"A4-16","name":"A4-16"},{"code":"A4-17","name":"A4-17"},{"code":"A4-18","name":"A4-18"},{"code":"B1-01","name":"B1-01"},{"code":"B1-02","name":"B1-02"},{"code":"B1-03","name":"B1-03"},{"code":"B1-04","name":"B1-04"},{"code":"B1-05","name":"B1-05"},{"code":"B1-06","name":"B1-06"},{"code":"B1-07","name":"B1-07"},{"code":"B1-08","name":"B1-08"},{"code":"B1-09","name":"B1-09"},{"code":"B1-10","name":"B1-10"},{"code":"B1-11","name":"B1-11"},{"code":"B1-12","name":"B1-12"},{"code":"B1-13","name":"B1-13"},{"code":"B1-14","name":"B1-14"},{"code":"B1-15","name":"B1-15"},{"code":"B1-16","name":"B1-16"},{"code":"B1-17","name":"B1-17"},{"code":"B1-18","name":"B1-18"},{"code":"B2-01","name":"B2-01"},{"code":"B2-02","name":"B2-02"},{"code":"B2-03","name":"B2-03"},{"code":"B2-04","name":"B2-04"},{"code":"B2-05","name":"B2-05"},{"code":"B2-06","name":"B2-06"},{"code":"B2-07","name":"B2-07"},{"code":"B2-08","name":"B2-08"},{"code":"B2-09","name":"B2-09"},{"code":"B2-10","name":"B2-10"},{"code":"B2-11","name":"B2-11"},{"code":"B2-12","name":"B2-12"},{"code":"B2-13","name":"B2-13"},{"code":"B2-14","name":"B2-14"},{"code":"B2-15","name":"B2-15"},{"code":"B2-16","name":"B2-16"},{"code":"B2-17","name":"B2-17"},{"code":"B2-18","name":"B2-18"},{"code":"B3-01","name":"B3-01"},{"code":"B3-02","name":"B3-02"},{"code":"B3-03","name":"B3-03"},{"code":"B3-04","name":"B3-04"},{"code":"B3-05","name":"B3-05"},{"code":"B3-06","name":"B3-06"},{"code":"B3-07","name":"B3-07"},{"code":"B3-08","name":"B3-08"},{"code":"B3-09","name":"B3-09"},{"code":"B3-10","name":"B3-10"},{"code":"B3-11","name":"B3-11"},{"code":"B3-12","name":"B3-12"},{"code":"B3-13","name":"B3-13"},{"code":"B3-14","name":"B3-14"},{"code":"B3-15","name":"B3-15"},{"code":"B3-16","name":"B3-16"},{"code":"B3-17","name":"B3-17"},{"code":"B3-18","name":"B3-18"},{"code":"B4-01","name":"B4-01"},{"code":"B4-02","name":"B4-02"},{"code":"B4-03","name":"B4-03"},{"code":"B4-04","name":"B4-04"},{"code":"B4-05","name":"B4-05"},{"code":"B4-06","name":"B4-06"},{"code":"B4-07","name":"B4-07"},{"code":"B4-08","name":"B4-08"},{"code":"B4-09","name":"B4-09"},{"code":"B4-10","name":"B4-10"},{"code":"B4-11","name":"B4-11"},{"code":"B4-12","name":"B4-12"},{"code":"B4-13","name":"B4-13"},{"code":"B4-14","name":"B4-14"},{"code":"B4-15","name":"B4-15"},{"code":"B4-16","name":"B4-16"},{"code":"B4-17","name":"B4-17"},{"code":"B4-18","name":"B4-18"},{"code":"C1-01","name":"C1-01"},{"code":"C1-02","name":"C1-02"},{"code":"C1-03","name":"C1-03"},{"code":"C1-04","name":"C1-04"},{"code":"C1-05","name":"C1-05"},{"code":"C1-06","name":"C1-06"},{"code":"C1-07","name":"C1-07"},{"code":"C1-08","name":"C1-08"},{"code":"C1-09","name":"C1-09"},{"code":"C1-10","name":"C1-10"},{"code":"C1-11","name":"C1-11"},{"code":"C1-12","name":"C1-12"},{"code":"C1-13","name":"C1-13"},{"code":"C1-14","name":"C1-14"},{"code":"C1-15","name":"C1-15"},{"code":"C1-16","name":"C1-16"},{"code":"C1-17","name":"C1-17"},{"code":"C1-18","name":"C1-18"},{"code":"C2-01","name":"C2-01"},{"code":"C2-02","name":"C2-02"},{"code":"C2-03","name":"C2-03"},{"code":"C2-04","name":"C2-04"},{"code":"C2-05","name":"C2-05"},{"code":"C2-06","name":"C2-06"},{"code":"C2-07","name":"C2-07"},{"code":"C2-08","name":"C2-08"},{"code":"C2-09","name":"C2-09"},{"code":"C2-10","name":"C2-10"},{"code":"C2-11","name":"C2-11"},{"code":"C2-12","name":"C2-12"},{"code":"C2-13","name":"C2-13"},{"code":"C2-14","name":"C2-14"},{"code":"C2-15","name":"C2-15"},{"code":"C2-16","name":"C2-16"},{"code":"C2-17","name":"C2-17"},{"code":"C2-18","name":"C2-18"},{"code":"C3-01","name":"C3-01"},{"code":"C3-02","name":"C3-02"},{"code":"C3-03","name":"C3-03"},{"code":"C3-04","name":"C3-04"},{"code":"C3-05","name":"C3-05"},{"code":"C3-06","name":"C3-06"},{"code":"C3-07","name":"C3-07"},{"code":"C3-08","name":"C3-08"},{"code":"C3-09","name":"C3-09"},{"code":"C3-10","name":"C3-10"},{"code":"C3-11","name":"C3-11"},{"code":"C3-12","name":"C3-12"},{"code":"C3-13","name":"C3-13"},{"code":"C3-14","name":"C3-14"},{"code":"C3-15","name":"C3-15"},{"code":"C3-16","name":"C3-16"},{"code":"C3-17","name":"C3-17"},{"code":"C3-18","name":"C3-18"},{"code":"C4-01","name":"C4-01"},{"code":"C4-02","name":"C4-02"},{"code":"C4-03","name":"C4-03"},{"code":"C4-04","name":"C4-04"},{"code":"C4-05","name":"C4-05"},{"code":"C4-06","name":"C4-06"},{"code":"C4-07","name":"C4-07"},{"code":"C4-08","name":"C4-08"},{"code":"C4-09","name":"C4-09"},{"code":"C4-10","name":"C4-10"},{"code":"C4-11","name":"C4-11"},{"code":"C4-12","name":"C4-12"},{"code":"C4-13","name":"C4-13"},{"code":"C4-14","name":"C4-14"},{"code":"C4-15","name":"C4-15"},{"code":"C4-16","name":"C4-16"},{"code":"C4-17","name":"C4-17"},{"code":"C4-18","name":"C4-18"},{"code":"D1-01","name":"D1-01"},{"code":"D1-02","name":"D1-02"},{"code":"D1-03","name":"D1-03"},{"code":"D1-04","name":"D1-04"},{"code":"D1-05","name":"D1-05"},{"code":"D1-06","name":"D1-06"},{"code":"D1-07","name":"D1-07"},{"code":"D1-08","name":"D1-08"},{"code":"D1-09","name":"D1-09"},{"code":"D1-10","name":"D1-10"},{"code":"D1-11","name":"D1-11"},{"code":"D1-12","name":"D1-12"},{"code":"D1-13","name":"D1-13"},{"code":"D1-14","name":"D1-14"},{"code":"D1-15","name":"D1-15"},{"code":"D1-16","name":"D1-16"},{"code":"D1-17","name":"D1-17"},{"code":"D1-18","name":"D1-18"},{"code":"D2-01","name":"D2-01"},{"code":"D2-02","name":"D2-02"},{"code":"D2-03","name":"D2-03"},{"code":"D2-04","name":"D2-04"},{"code":"D2-05","name":"D2-05"},{"code":"D2-06","name":"D2-06"},{"code":"D2-07","name":"D2-07"},{"code":"D2-08","name":"D2-08"},{"code":"D2-09","name":"D2-09"},{"code":"D2-10","name":"D2-10"},{"code":"D2-11","name":"D2-11"},{"code":"D2-12","name":"D2-12"},{"code":"D2-13","name":"D2-13"},{"code":"D2-14","name":"D2-14"},{"code":"D2-15","name":"D2-15"},{"code":"D2-16","name":"D2-16"},{"code":"D2-17","name":"D2-17"},{"code":"D2-18","name":"D2-18"},{"code":"D3-01","name":"D3-01"},{"code":"D3-02","name":"D3-02"},{"code":"D3-03","name":"D3-03"},{"code":"D3-04","name":"D3-04"},{"code":"D3-05","name":"D3-05"},{"code":"D3-06","name":"D3-06"},{"code":"D3-07","name":"D3-07"},{"code":"D3-08","name":"D3-08"},{"code":"D3-09","name":"D3-09"},{"code":"D3-10","name":"D3-10"},{"code":"D3-11","name":"D3-11"},{"code":"D3-12","name":"D3-12"},{"code":"D3-13","name":"D3-13"},{"code":"D3-14","name":"D3-14"},{"code":"D3-15","name":"D3-15"},{"code":"D3-16","name":"D3-16"},{"code":"D3-17","name":"D3-17"},{"code":"D3-18","name":"D3-18"},{"code":"D4-01","name":"D4-01"},{"code":"D4-02","name":"D4-02"},{"code":"D4-03","name":"D4-03"},{"code":"D4-04","name":"D4-04"},{"code":"D4-05","name":"D4-05"},{"code":"D4-06","name":"D4-06"},{"code":"D4-07","name":"D4-07"},{"code":"D4-08","name":"D4-08"},{"code":"D4-09","name":"D4-09"},{"code":"D4-10","name":"D4-10"},{"code":"D4-11","name":"D4-11"},{"code":"D4-12","name":"D4-12"},{"code":"D4-13","name":"D4-13"},{"code":"D4-14","name":"D4-14"},{"code":"D4-15","name":"D4-15"},{"code":"D4-16","name":"D4-16"},{"code":"D4-17","name":"D4-17"},{"code":"D4-18","name":"D4-18"},{"code":"E1-01","name":"E1-01"},{"code":"E1-02","name":"E1-02"},{"code":"E1-03","name":"E1-03"},{"code":"E1-04","name":"E1-04"},{"code":"E1-05","name":"E1-05"},{"code":"E1-06","name":"E1-06"},{"code":"E2-01","name":"E2-01"},{"code":"E2-02","name":"E2-02"},{"code":"E2-03","name":"E2-03"},{"code":"E2-04","name":"E2-04"},{"code":"E2-05","name":"E2-05"},{"code":"E2-06","name":"E2-06"},{"code":"E3-01","name":"E3-01"},{"code":"E3-02","name":"E3-02"},{"code":"E3-03","name":"E3-03"},{"code":"E3-04","name":"E3-04"},{"code":"E3-05","name":"E3-05"},{"code":"E3-06","name":"E3-06"},{"code":"E4-01","name":"E4-01"},{"code":"E4-02","name":"E4-02"},{"code":"E4-03","name":"E4-03"},{"code":"E4-04","name":"E4-04"},{"code":"E4-05","name":"E4-05"},{"code":"E4-06","name":"E4-06"},{"code":"E5-01","name":"E5-01"},{"code":"E5-02","name":"E5-02"},{"code":"E5-03","name":"E5-03"},{"code":"E5-04","name":"E5-04"},{"code":"E5-05","name":"E5-05"},{"code":"E5-06","name":"E5-06"}]}]};
    let position = prepareData(edata); 
    fillElements(position);
  }

}


function getStockMovData(smNum){ //Download warehouse structure data
  let edata;
  console.log(window.location.protocol);
  if(window.location.protocol!=='file:'){//for real data remote request
      $.get("/WebGetStockMoveInfo.hal?number="+smNum, function( data ) {
        //$( ".result" ).html( data );
        edata = data;
        let position = prepareData(edata); 
        fillElements(position);
      });
    
  } else {//for local test enviropment data from string - CROS not working :(
    edata = {"locations":[{"location":"00","name":"","places":[]},{"location":"EURO","name":"00","places":[]},{"location":"MAIN","name":"","places":[{"code":"A1-01","name":"A1-01"},{"code":"A1-02","name":"A1-02"},{"code":"A1-03","name":"A1-03"},{"code":"A1-04","name":"A1-04"},{"code":"A1-05","name":"A1-05"},{"code":"A1-06","name":"A1-06"},{"code":"A1-07","name":"A1-07"},{"code":"A1-08","name":"A1-08"},{"code":"A1-09","name":"A1-09"},{"code":"A1-10","name":"A1-10"},{"code":"A1-11","name":"A1-11"},{"code":"A1-12","name":"A1-12"},{"code":"A1-13","name":"A1-13"},{"code":"A1-14","name":"A1-14"},{"code":"A1-15","name":"A1-15"},{"code":"A1-16","name":"A1-16"},{"code":"A1-17","name":"A1-17"},{"code":"A1-18","name":"A1-18"},{"code":"A2-01","name":"A2-01"},{"code":"A2-02","name":"A2-02"},{"code":"A2-03","name":"A2-03"},{"code":"A2-04","name":"A2-04"},{"code":"A2-05","name":"A2-05"},{"code":"A2-06","name":"A2-06"},{"code":"A2-07","name":"A2-07"},{"code":"A2-08","name":"A2-08"},{"code":"A2-09","name":"A2-09"},{"code":"A2-10","name":"A2-10"},{"code":"A2-11","name":"A2-11"},{"code":"A2-12","name":"A2-12"},{"code":"A2-13","name":"A2-13"},{"code":"A2-14","name":"A2-14"},{"code":"A2-15","name":"A2-15"},{"code":"A2-16","name":"A2-16"},{"code":"A2-17","name":"A2-17"},{"code":"A2-18","name":"A2-18"},{"code":"A3-01","name":"A3-01"},{"code":"A3-02","name":"A3-02"},{"code":"A3-03","name":"A3-03"},{"code":"A3-04","name":"A3-04"},{"code":"A3-05","name":"A3-05"},{"code":"A3-06","name":"A3-06"},{"code":"A3-07","name":"A3-07"},{"code":"A3-08","name":"A3-08"},{"code":"A3-09","name":"A3-09"},{"code":"A3-10","name":"A3-10"},{"code":"A3-11","name":"A3-11"},{"code":"A3-12","name":"A3-12"},{"code":"A3-13","name":"A3-13"},{"code":"A3-14","name":"A3-14"},{"code":"A3-15","name":"A3-15"},{"code":"A3-16","name":"A3-16"},{"code":"A3-17","name":"A3-17"},{"code":"A3-18","name":"A3-18"},{"code":"A4-01","name":"A4-01"},{"code":"A4-02","name":"A4-02"},{"code":"A4-03","name":"A4-03"},{"code":"A4-04","name":"A4-04"},{"code":"A4-05","name":"A4-05"},{"code":"A4-06","name":"A4-06"},{"code":"A4-07","name":"A4-07"},{"code":"A4-08","name":"A4-08"},{"code":"A4-09","name":"A4-09"},{"code":"A4-10","name":"A4-10"},{"code":"A4-11","name":"A4-11"},{"code":"A4-12","name":"A4-12"},{"code":"A4-13","name":"A4-13"},{"code":"A4-14","name":"A4-14"},{"code":"A4-15","name":"A4-15"},{"code":"A4-16","name":"A4-16"},{"code":"A4-17","name":"A4-17"},{"code":"A4-18","name":"A4-18"},{"code":"B1-01","name":"B1-01"},{"code":"B1-02","name":"B1-02"},{"code":"B1-03","name":"B1-03"},{"code":"B1-04","name":"B1-04"},{"code":"B1-05","name":"B1-05"},{"code":"B1-06","name":"B1-06"},{"code":"B1-07","name":"B1-07"},{"code":"B1-08","name":"B1-08"},{"code":"B1-09","name":"B1-09"},{"code":"B1-10","name":"B1-10"},{"code":"B1-11","name":"B1-11"},{"code":"B1-12","name":"B1-12"},{"code":"B1-13","name":"B1-13"},{"code":"B1-14","name":"B1-14"},{"code":"B1-15","name":"B1-15"},{"code":"B1-16","name":"B1-16"},{"code":"B1-17","name":"B1-17"},{"code":"B1-18","name":"B1-18"},{"code":"B2-01","name":"B2-01"},{"code":"B2-02","name":"B2-02"},{"code":"B2-03","name":"B2-03"},{"code":"B2-04","name":"B2-04"},{"code":"B2-05","name":"B2-05"},{"code":"B2-06","name":"B2-06"},{"code":"B2-07","name":"B2-07"},{"code":"B2-08","name":"B2-08"},{"code":"B2-09","name":"B2-09"},{"code":"B2-10","name":"B2-10"},{"code":"B2-11","name":"B2-11"},{"code":"B2-12","name":"B2-12"},{"code":"B2-13","name":"B2-13"},{"code":"B2-14","name":"B2-14"},{"code":"B2-15","name":"B2-15"},{"code":"B2-16","name":"B2-16"},{"code":"B2-17","name":"B2-17"},{"code":"B2-18","name":"B2-18"},{"code":"B3-01","name":"B3-01"},{"code":"B3-02","name":"B3-02"},{"code":"B3-03","name":"B3-03"},{"code":"B3-04","name":"B3-04"},{"code":"B3-05","name":"B3-05"},{"code":"B3-06","name":"B3-06"},{"code":"B3-07","name":"B3-07"},{"code":"B3-08","name":"B3-08"},{"code":"B3-09","name":"B3-09"},{"code":"B3-10","name":"B3-10"},{"code":"B3-11","name":"B3-11"},{"code":"B3-12","name":"B3-12"},{"code":"B3-13","name":"B3-13"},{"code":"B3-14","name":"B3-14"},{"code":"B3-15","name":"B3-15"},{"code":"B3-16","name":"B3-16"},{"code":"B3-17","name":"B3-17"},{"code":"B3-18","name":"B3-18"},{"code":"B4-01","name":"B4-01"},{"code":"B4-02","name":"B4-02"},{"code":"B4-03","name":"B4-03"},{"code":"B4-04","name":"B4-04"},{"code":"B4-05","name":"B4-05"},{"code":"B4-06","name":"B4-06"},{"code":"B4-07","name":"B4-07"},{"code":"B4-08","name":"B4-08"},{"code":"B4-09","name":"B4-09"},{"code":"B4-10","name":"B4-10"},{"code":"B4-11","name":"B4-11"},{"code":"B4-12","name":"B4-12"},{"code":"B4-13","name":"B4-13"},{"code":"B4-14","name":"B4-14"},{"code":"B4-15","name":"B4-15"},{"code":"B4-16","name":"B4-16"},{"code":"B4-17","name":"B4-17"},{"code":"B4-18","name":"B4-18"},{"code":"C1-01","name":"C1-01"},{"code":"C1-02","name":"C1-02"},{"code":"C1-03","name":"C1-03"},{"code":"C1-04","name":"C1-04"},{"code":"C1-05","name":"C1-05"},{"code":"C1-06","name":"C1-06"},{"code":"C1-07","name":"C1-07"},{"code":"C1-08","name":"C1-08"},{"code":"C1-09","name":"C1-09"},{"code":"C1-10","name":"C1-10"},{"code":"C1-11","name":"C1-11"},{"code":"C1-12","name":"C1-12"},{"code":"C1-13","name":"C1-13"},{"code":"C1-14","name":"C1-14"},{"code":"C1-15","name":"C1-15"},{"code":"C1-16","name":"C1-16"},{"code":"C1-17","name":"C1-17"},{"code":"C1-18","name":"C1-18"},{"code":"C2-01","name":"C2-01"},{"code":"C2-02","name":"C2-02"},{"code":"C2-03","name":"C2-03"},{"code":"C2-04","name":"C2-04"},{"code":"C2-05","name":"C2-05"},{"code":"C2-06","name":"C2-06"},{"code":"C2-07","name":"C2-07"},{"code":"C2-08","name":"C2-08"},{"code":"C2-09","name":"C2-09"},{"code":"C2-10","name":"C2-10"},{"code":"C2-11","name":"C2-11"},{"code":"C2-12","name":"C2-12"},{"code":"C2-13","name":"C2-13"},{"code":"C2-14","name":"C2-14"},{"code":"C2-15","name":"C2-15"},{"code":"C2-16","name":"C2-16"},{"code":"C2-17","name":"C2-17"},{"code":"C2-18","name":"C2-18"},{"code":"C3-01","name":"C3-01"},{"code":"C3-02","name":"C3-02"},{"code":"C3-03","name":"C3-03"},{"code":"C3-04","name":"C3-04"},{"code":"C3-05","name":"C3-05"},{"code":"C3-06","name":"C3-06"},{"code":"C3-07","name":"C3-07"},{"code":"C3-08","name":"C3-08"},{"code":"C3-09","name":"C3-09"},{"code":"C3-10","name":"C3-10"},{"code":"C3-11","name":"C3-11"},{"code":"C3-12","name":"C3-12"},{"code":"C3-13","name":"C3-13"},{"code":"C3-14","name":"C3-14"},{"code":"C3-15","name":"C3-15"},{"code":"C3-16","name":"C3-16"},{"code":"C3-17","name":"C3-17"},{"code":"C3-18","name":"C3-18"},{"code":"C4-01","name":"C4-01"},{"code":"C4-02","name":"C4-02"},{"code":"C4-03","name":"C4-03"},{"code":"C4-04","name":"C4-04"},{"code":"C4-05","name":"C4-05"},{"code":"C4-06","name":"C4-06"},{"code":"C4-07","name":"C4-07"},{"code":"C4-08","name":"C4-08"},{"code":"C4-09","name":"C4-09"},{"code":"C4-10","name":"C4-10"},{"code":"C4-11","name":"C4-11"},{"code":"C4-12","name":"C4-12"},{"code":"C4-13","name":"C4-13"},{"code":"C4-14","name":"C4-14"},{"code":"C4-15","name":"C4-15"},{"code":"C4-16","name":"C4-16"},{"code":"C4-17","name":"C4-17"},{"code":"C4-18","name":"C4-18"},{"code":"D1-01","name":"D1-01"},{"code":"D1-02","name":"D1-02"},{"code":"D1-03","name":"D1-03"},{"code":"D1-04","name":"D1-04"},{"code":"D1-05","name":"D1-05"},{"code":"D1-06","name":"D1-06"},{"code":"D1-07","name":"D1-07"},{"code":"D1-08","name":"D1-08"},{"code":"D1-09","name":"D1-09"},{"code":"D1-10","name":"D1-10"},{"code":"D1-11","name":"D1-11"},{"code":"D1-12","name":"D1-12"},{"code":"D1-13","name":"D1-13"},{"code":"D1-14","name":"D1-14"},{"code":"D1-15","name":"D1-15"},{"code":"D1-16","name":"D1-16"},{"code":"D1-17","name":"D1-17"},{"code":"D1-18","name":"D1-18"},{"code":"D2-01","name":"D2-01"},{"code":"D2-02","name":"D2-02"},{"code":"D2-03","name":"D2-03"},{"code":"D2-04","name":"D2-04"},{"code":"D2-05","name":"D2-05"},{"code":"D2-06","name":"D2-06"},{"code":"D2-07","name":"D2-07"},{"code":"D2-08","name":"D2-08"},{"code":"D2-09","name":"D2-09"},{"code":"D2-10","name":"D2-10"},{"code":"D2-11","name":"D2-11"},{"code":"D2-12","name":"D2-12"},{"code":"D2-13","name":"D2-13"},{"code":"D2-14","name":"D2-14"},{"code":"D2-15","name":"D2-15"},{"code":"D2-16","name":"D2-16"},{"code":"D2-17","name":"D2-17"},{"code":"D2-18","name":"D2-18"},{"code":"D3-01","name":"D3-01"},{"code":"D3-02","name":"D3-02"},{"code":"D3-03","name":"D3-03"},{"code":"D3-04","name":"D3-04"},{"code":"D3-05","name":"D3-05"},{"code":"D3-06","name":"D3-06"},{"code":"D3-07","name":"D3-07"},{"code":"D3-08","name":"D3-08"},{"code":"D3-09","name":"D3-09"},{"code":"D3-10","name":"D3-10"},{"code":"D3-11","name":"D3-11"},{"code":"D3-12","name":"D3-12"},{"code":"D3-13","name":"D3-13"},{"code":"D3-14","name":"D3-14"},{"code":"D3-15","name":"D3-15"},{"code":"D3-16","name":"D3-16"},{"code":"D3-17","name":"D3-17"},{"code":"D3-18","name":"D3-18"},{"code":"D4-01","name":"D4-01"},{"code":"D4-02","name":"D4-02"},{"code":"D4-03","name":"D4-03"},{"code":"D4-04","name":"D4-04"},{"code":"D4-05","name":"D4-05"},{"code":"D4-06","name":"D4-06"},{"code":"D4-07","name":"D4-07"},{"code":"D4-08","name":"D4-08"},{"code":"D4-09","name":"D4-09"},{"code":"D4-10","name":"D4-10"},{"code":"D4-11","name":"D4-11"},{"code":"D4-12","name":"D4-12"},{"code":"D4-13","name":"D4-13"},{"code":"D4-14","name":"D4-14"},{"code":"D4-15","name":"D4-15"},{"code":"D4-16","name":"D4-16"},{"code":"D4-17","name":"D4-17"},{"code":"D4-18","name":"D4-18"},{"code":"E1-01","name":"E1-01"},{"code":"E1-02","name":"E1-02"},{"code":"E1-03","name":"E1-03"},{"code":"E1-04","name":"E1-04"},{"code":"E1-05","name":"E1-05"},{"code":"E1-06","name":"E1-06"},{"code":"E2-01","name":"E2-01"},{"code":"E2-02","name":"E2-02"},{"code":"E2-03","name":"E2-03"},{"code":"E2-04","name":"E2-04"},{"code":"E2-05","name":"E2-05"},{"code":"E2-06","name":"E2-06"},{"code":"E3-01","name":"E3-01"},{"code":"E3-02","name":"E3-02"},{"code":"E3-03","name":"E3-03"},{"code":"E3-04","name":"E3-04"},{"code":"E3-05","name":"E3-05"},{"code":"E3-06","name":"E3-06"},{"code":"E4-01","name":"E4-01"},{"code":"E4-02","name":"E4-02"},{"code":"E4-03","name":"E4-03"},{"code":"E4-04","name":"E4-04"},{"code":"E4-05","name":"E4-05"},{"code":"E4-06","name":"E4-06"},{"code":"E5-01","name":"E5-01"},{"code":"E5-02","name":"E5-02"},{"code":"E5-03","name":"E5-03"},{"code":"E5-04","name":"E5-04"},{"code":"E5-05","name":"E5-05"},{"code":"E5-06","name":"E5-06"}]}]};
    let position = prepareData(edata); 
    fillElements(position);
  }

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


function resetFill(){
  pos.transition()
  .selectAll("g rect")
  .style("fill", d=>{return fillColor(d)});
  pos.transition()
  .selectAll("g text")
  .attr("fill",d=>{
    return fillRevertColor(d)});
}

function clicked(event, d) {
  event.stopPropagation();
  resetFill();

  d3.select(this).select("text").transition().attr("fill", "white");
  d3.select(this).select("rect").transition().style("fill", "red");
  
  activePos = d3.select(this).data();

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

d3.select("#input-text").on("keypress", function(key) {
  if(key.key=='Enter'){
    console.log(this.value);
    getStockMovData(this.value);
    this.value = '';
    resetFill();
    

  }
  //update(+this.value);
});

$(document).ready(function(){
  console.log('test');
  getWarehouses();
});