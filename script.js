let h = 550;
let w = 850;
let padding = 50;
let svg = d3.select('#svg')
          .append('svg')
          .attr('width', w)
          .attr('height', h);

let tooltip = d3.select('#svg')
              .append('div')
              .attr('id', 'tooltip')
              .style('opacity', 0)
              .style('background', '#c7ecee')
              //.style('width', '300px')
              //.style('height', '100px')
              .style('position', 'absolute');

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(function(data){

    let years = data.map((d)=>d.Year);
    let time = data.map((d)=>d.Time);
  
    let timeFormat = d3.timeFormat('%M:%S');
    let timeParse = d3.timeParse('%M:%S');
    let timeDate = time.map((t) => timeParse(t));

    let xScale = d3.scaleLinear() 
      .domain([d3.min(years)-1, d3.max(years)+1])
      .range([padding, w-padding]);
  
    let xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  
    let yScale = d3.scaleTime()
      .domain([d3.min(timeDate), d3.max(timeDate)])
      .range([padding,h-padding]);
    
    let yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);
    
    let dataPoint = svg.selectAll('circle')
       .data(data)
       .enter()
       .append('circle')
       .attr('cx', (d,i)=> xScale(years[i]))
       .attr('cy', (d,i)=> yScale(timeDate[i]))
       .attr('r', 7)
       .attr('class', 'dot')
       .attr('data-xvalue', (d,i)=>years[i])
       .attr('data-yvalue', (d,i)=>timeDate[i])
       .attr('index', (d,i)=> i)
       .style('fill', (d)=>{return d.Doping === '' ? 'blue':'red'})
       .on('mouseover', (e, d)=>{
         
      tooltip.transition()
             .duration(200)
             .style('opacity', 0.9);
             
      tooltip.html('Name: '+ d.Name +'<br/>Time: '+d.Time + '<br/>Year: ' +d.Year +'<br/>'+ d.Doping)
         .attr('data-year', d.Year)
         .style('left', (e.pageX+15)+'px')
         .style('top', e.pageY+'px')
    })
      .on('mouseout', (e,d)=>{
      tooltip.transition()
             .style('opacity', 0);
    })
  
    //Legend
    svg.append('text')
       .text('Legend')
       .attr('id', 'legend')
       .attr('transform','translate('+(w-padding-130) +',' + (h/2-50) + ')');
    svg.append('text')
       .text('Has Doping Allegation')
       .attr('id', 'legend')
       .attr('transform','translate('+(w-padding-130) +',' + (h/2-30) + ')');
    svg.append('text')
       .text('No Doping Allegations')
       .attr('id', 'legend')
       .attr('transform','translate('+(w-padding-130) +',' + (h/2-10) + ')');
    svg.append('circle')
       .attr('cx', w-20)
       .attr('cy', (h/2-35))
       .attr('r', 5)
       .style('fill', 'red');
    svg.append('circle')
       .attr('cx', w-20)
       .attr('cy', (h/2-15))
       .attr('r', 5)
       .style('fill', 'blue');
    svg.append('rect')
       .attr('width', 180)
       .attr('height', 75)
       .attr('x', w-188)
       .attr('y', h/2-70)
       .style('fill', 'none')
       .style('stroke', 'black')
  
    //Axes Labels and axis
    svg.append('text')
       .text('Year')
       .attr('transform','translate('+(w/2) +',' + (h - 10) + ')');
  
    svg.append('text')
       .text('Time (minutes)')
       .attr('transform', 'rotate(-90)')
       .attr('x', -300)
       .attr('y', 13);
    
    svg.append('g')
      .attr('transform','translate(0,'+(h-padding)+')')
      .call(xAxis)
      .attr('id', 'x-axis');
    
    svg.append('g')
      .attr('transform','translate('+padding+',0)')
      .call(yAxis)
      .attr('id', 'y-axis');
    
  
})