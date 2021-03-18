import React, { Component } from 'react';
import * as d3 from 'd3';


//run after map is loaded in
let createMap = (states, cities, w, h) => {

  var height = h/1.5;
  var width = w/4;
  var margin = h/5;
  
  var years = ["2018", "2019", "2020"];
  var xScale = d3.scaleBand()
    .range([0, width])
    .domain(years);
      
  const yScale = d3.scaleLinear() //sale for sales graph
    .range([height, 0])
    .domain([0, 40000000]);
  
  const yScale2 = d3.scaleLinear() //scale for meals graph
    .range([height, 0])
    .domain([0, 1000000]);

  var proj = d3.geoAlbersUsa()
    .translate([250, 250])
    .scale(700);

  var gpath = d3.geoPath()
    .projection(proj);

  var svg =d3.select('#frame')

  var svg2 = d3.select("#frame2")

  var titleDiv = d3.select("#title")

  // draw country boundaries

  svg
    .selectAll('path')
    .data(states.features)
    .enter()
    .append('path')
      .attr('d', function(d) { return gpath(d); })
      .attr('stroke-width', 0.25)
      .attr('stroke', '#ffffff')
      .attr('fill', '#a5c9bd')

      //restaurant points
    var points = svg
      .selectAll('circle')
      .data(cities)
      .enter()
      .append('circle')
      .attr('r', w/80)
      .attr('cx', d => proj([d.x, d.y])[0])
      .attr('cy', d => proj([d.x, d.y])[1])
      .attr('stroke-width', 0.25)
      .attr('stroke', '#fff')
      .attr('fill', '#8A87C2')
      .on('mouseover', function(e, d) {
          var element = d3.select(this)
          if(element.style('fill') != 'rgb(128, 23, 14)'){
          element
          .attr('fill', '#545275')
          
        }
            })
      .on('mouseout', function(e,d){
        var element = d3.select(this)
        console.log(element.style('fill'))
        if(element.style('fill') != 'rgb(128, 23, 14)'){
          element
          .attr('fill', '#8A87C2')
        }
      })
      .on('click', function(e,d){
        svg.selectAll('circle')
        .attr('fill', '#8A87C2')
        d3.select(this)
        .attr('fill', '#80170e')
        loadBars(d)
      })


    points.append("title")
    .text(d=> d.name)

   var mapZoom = d3.zoom()
    .on('zoom', function(e){
      proj
      .translate([e.transform.x, e.transform.y])
      .scale(e.transform.k);

      // redraw map with new projection settings
      svg.selectAll('path')
        .attr('d', gpath);

      svg.selectAll('circle')
        .attr('cx', d => proj([d.x, d.y])[0])
        .attr('cy', d => proj([d.x, d.y])[1])
    });

  var zoomSettings = d3.zoomIdentity
    .translate(w/2, h/2)
    .scale(700);
  svg
    .call(mapZoom)
    .call(mapZoom.transform, zoomSettings);

  var barcharts = svg2.append('g')
    .attr('transform',`translate(0, ${margin})` )
//draw axes for bar charts
    barcharts.append('g')
        .style("stroke-width", 0.25)
        .style("opacity", 0.7)
        .style("font-size", "10px")
        .attr('transform', 'translate('+(w/5)+', ' +(height + height/10)+')')
        .call(d3.axisBottom(xScale).tickSize(2));


    barcharts.append('g')
        .style("stroke-width", 0.25)
        .style("font-size", "10px")
        .style("opacity", 0.7)
        .attr('transform', 'translate('+(w/2)+', ' +(height + height/10)+')')
        .call(d3.axisBottom(xScale).tickSize(2));

      barcharts.append('g')
       .style("font-size", "10px")
       .style("stroke-width", 0.25)
       .style("opacity", 0.7)
       .attr('transform', 'translate('+(w/5)+', ' +(height/10)+')')
       .call(d3.axisLeft(yScale).tickSize(2));

       barcharts.append('g')
       .style("font-size", "10px")
       .style("stroke-width", 0.25)
       .style("opacity", 0.7)
       .attr('transform', 'translate('+(w/2)+', ' +(height/10)+')')
       .call(d3.axisLeft(yScale2).tickSize(2));


       //set up 'empty' bars for when page is initially loaded
       var startData = [[0, "2018"], [0, "2019"], [0,"2020"]]

       var moneyBars = barcharts.selectAll("rect")
       .data(startData)
       .enter().append('rect')
       .attr('x', function(d){return xScale(d[1])+1})
       .attr('y', function(d){return yScale(0)})
       .attr('height', function(d){return height - yScale(0)})
       .attr('width', xScale.bandwidth()-2)
       .attr('transform', 'translate('+(w/5)+', ' +(height/10)+')')

       var mealBars = barcharts.selectAll("dot")
       .data(startData)
       .enter().append('rect')
       .attr('x', function(d){return xScale(d[1])+1})
       .attr('y', function(d){return yScale2(0)})
       .attr('height', function(d){return height - yScale2(0)})
       .attr('width', xScale.bandwidth()-2)
       .attr('transform', 'translate('+(w/2)+', ' +(height/10)+')')

       //chart labels 

      barcharts.append('text')
       .attr('x', w/5 + w/8)
       .attr('y', height + height/5 )
       .style('text-anchor', "middle")
       .style('font-size', 15)
       .style('font-family', "sans-serif")
       .style('font-weight', 'bold')
       .text('Year')

       barcharts.append('text')
       .attr('x', w/2 + w/8)
       .attr('y', height + height/5 )
       .style('text-anchor', "middle")
       .style('font-size', 15)
       .style('font-family', "sans-serif")
       .style('font-weight', 'bold')
       .text('Year')

       var title1 = barcharts.append('text')
       .attr('x', w/5 + w/8)
       .attr('y', 15)
       .style('text-anchor', "middle")
       .style('font-size', 15)
       .style('font-family', "sans-serif")
       .style('font-weight', 'bolder')
       .text('Sales')

       title1.append("tspan")
       .style('font-weight', 'lighter')
       .text(" (in USD)")

       var title2 = barcharts.append('text')
       .attr('x', w/2 + w/8)
       .attr('y', 15 )
       .style('text-anchor', "middle")
       .style('font-size', 15)
       .style('font-family', "sans-serif")
       .style('font-weight', 'bolder')
       .text('Meals Served')

      var titleTop = barcharts.append('text')
      .attr('x', w/2)
      .attr('y', 0)
      .style('text-anchor', 'middle')
      .style('font-size', 18)
      .style('font-family', "sans-serif")
      .style('font-weight', 'bolder')
      .text("Select a restaurant from the map to see its data!")


      //call when clicking on a dot on the map, loads bar chart data for specific restaurant 
       function loadBars(city){

        var currentProfitBars = []
        var currentMealBars = []
        currentProfitBars.push([city.sales18, "2018"])
        currentProfitBars.push([city.sales19, "2019"])
        currentProfitBars.push([city.sales20, "2020"])

        currentMealBars.push([city.meals18, "2018"])
        currentMealBars.push([city.meals19, "2019"])
        currentMealBars.push([city.meals20, "2020"])

        titleTop.text(city.name + " in " +  city.city + ", " + city.state)

        moneyBars
        .data(currentProfitBars)
        .transition()
        .duration(600)
        .attr("y", function(d) { return yScale(d[0]); })
        .attr("height", function(d) { return height - yScale(d[0]); })
        .attr('fill', '#6b997a')
        .delay(function(d,i){ return(i*20)})

        mealBars
        .data(currentMealBars)
        .transition()
        .duration(600)
        .attr("y", function(d) { return yScale2(d[0]) ;})
        .attr("height", function(d) { return height - yScale2(d[0]); })
        .attr('fill', '#565985')
        .delay(function(d,i){ return(i*20)})

       }


}

class RestrauntCaseStudy extends Component {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = { windowWidth: window.innerWidth,
                   windowHeight: window.innerHeight };
  }

  handleResize = (e) => {
    this.setState({ windowWidth: window.innerWidth,
                    windowHeight: window.innerHeight});
  };

  componentDidMount() {
    //Responsive Sizing
    window.addEventListener("resize", this.handleResize);
    let { windowWidth, windowHeight } = this.state; 
    let w = windowWidth / 2;
    let h = windowHeight / 2; 
    //Create Background Region
    //Access D3 this way, use width and height to size dynamically
    let accessToRef = d3.select(this.myRef.current)
                          .append("div")
                          .attr("id", "parent")
                          .attr("class", "RCSParent");

    let flexRCS = accessToRef.append("div")
                    .attr("width", "100%")
                    .attr("height", "50%")
                    .attr("class", "flexRCS");

    flexRCS.append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("id", "frame")
      .style("float", "left");

    flexRCS.append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("id", "frame2")
      .style("float", "left");

    d3.json("data/states.json").then(states => {
    d3.csv("data/restaurantData.csv").then(function(cities) {
      console.log(states);
      console.log(cities);
      createMap(states, cities, w, h);
    });
    });

  }

  componentWillUnmount() {
    window.addEventListener("resize", this.handleResize);
  } 

  render() {
    return <div>
              <h3>Case Study: Independent Restaurants</h3>
              <h4>How has Covid-19 impacted the United States' top restaurants? Using data collected from Restaurant Business Magazine's</h4>
              <h4>Top 100 Independents, the following viz was created. Explore the restaurant map to see how America's</h4>
              <h4>most successful restaurants have been impacted by the pandemic in terms of both sales and meals served.</h4>
              <div ref={this.myRef}>
              </div>
            </div>
  }
} 

export default RestrauntCaseStudy;