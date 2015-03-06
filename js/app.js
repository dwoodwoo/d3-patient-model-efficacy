var margin = {top: 20, right: 20, bottom: 20, left: 50};

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    nodes = 
      [{"x":6.5,"y":0.6,"r":10, "desc": "Outcome Variable (Hospital Readmissions)<br># of Patients (n): 650/10,000<br>percent of total patients(%): 0.65<br>c-index: 0.60"},
      {"x":7,"y":0.70,"r":10, "desc": "Outcome Variable (Hospital Readmissions)<br># of Patients (n): 700/10,000<br>percent of total patients(%): 0.70<br>c-index: 0.70"},
      {"x":8,"y":0.80,"r":10, "desc": "Outcome Variable (Hospital Readmissions)<br># of Patients (n): 800/10,000<br>percent of total patients(%): 0.80<br>c-index: 0.80"}
   ];

    
 var xAxisScale = d3.scale.linear()
    .domain([d3.min(nodes, function(d) { return d.x; })-1, d3.max(nodes, function(d) { return d.x; })+1])
    .range([0, width]);

 var yAxisScale = d3.scale.linear()
    .domain([0, 1])
    .range([height, 0]);


var xAxis = d3.svg.axis()
    .tickFormat(function(d) { return d + "%"; })
    .scale(xAxisScale);

var yAxis = d3.svg.axis()
    .orient("left")
    .scale(yAxisScale);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  // .html(function(d) { return d.x + ", " + d.y ; });
  .html(function(d) { return d.desc; });


var svg1 = d3.select("#area1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg2 = d3.select("#area2");


var xAxisGroup = svg1.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

var yAxisGroup = svg1.append("g")
    .attr("class", "axis")
    .call(yAxis);

// y-axis label
svg1.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Reliability (c-index)");


// x-axis label
svg1.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", xAxisScale(d3.max(nodes, function(d) { return d.x; }) + 1))
    .attr("y", yAxisScale(0.01))
    .text("total % of patients");

// efficacy area
svg1.append("rect")
  .attr('class', 'cutoff')
  .attr('x', '0')
  .attr('y', yAxisScale(0.65))
  .attr('height', height - yAxisScale(0.65))
  .attr('width', width)
  .style("fill", "steelblue")
  .style("opacity", "0.1");

svg1.append("text")
    .attr('x', xAxisScale(d3.min(nodes, function(d) { return d.x; }) - 1))
    .attr('y', yAxisScale(0.66))
    .text("acceptable");

svg1.append("text")
    .attr('x', xAxisScale(d3.min(nodes, function(d) { return d.x; }) - 1))
    .attr('y', yAxisScale(0.62))
    .text("unacceptable");



var circle = svg1.append("g")
    .attr("class", "circles-group")
    .selectAll("circle")
    .data(nodes)
  .enter()
    //add a url link
    //as in http://stackoverflow.com/questions/13104681/hyperlinks-in-d3-js-objects
    // .append("svg:a")
    // .attr("xlink:href", "http://www.cnet.com")
  .append("circle")
    .attr("cx", function(d) { return xAxisScale(d.x) ; })
    .attr("cy", function(d) { return yAxisScale(d.y) ; })
    .attr("r", function(d) { return d.r; })
    .style("fill", "steelblue")
    .on('mouseover', function (d) {tip.show(d); })
    .on('mouseout', function(d) {tip.hide(d);
      // console.log(this);
     })
    .on("click", function(d, i){
            d3.select(this)
                .transition()
                  .duration(750)
                  .ease("bounce")
                  .attr('r', 25)
                  .style("fill","lightcoral")
                .transition()
                  .duration(1500)
                  .ease("bounce")
                  .attr('r', 10)
                  .style("fill", "steelblue");
                  console.log("click event d", d, "i", i);
                  //manually empty #area2...pie.redraw() doesn't do it right
                  d3.select("#area2").html("");
                  document.getElementById("area2").innerHTML = "";
                  var pie = new d3pie("area2", piejsonarr[i]);
                  d3.select("#area2").append('br')
                  d3.select("#area2").append('div')
                    .attr('class', 'btn btn-primary')
                    .style("text-align", "center")
                    .html('Predict Change in Outcome');
                  d3.select("#area2").append('div')
                    .attr('class', 'btn btn-primary')
                    .style("text-align", "center")
                    .html('Calculate Potential Cost Savings');
                  
            // d3.select("#area2")
            //     .transition()
            //     .duration(2000)
            //     .style("opacity", 1); 
        })
    .call(tip);


var piejsonarr = [];
var piejson1 = {
  "header": {
    "title": {
      "text": "30 Day Readmissions",
      "fontSize": 24,
      "font": "sans-serif"
    },
    "subtitle": {
      "text": "Patient Characteristics, Illness Risk Factors, Hospital Course Risk Factors",
      "color": "#999999",
      "fontSize": 12,
      "font": "sans-serif"
    },
    "titleSubtitlePadding": 9
  },
  "footer": {
    "color": "#999999",
    "fontSize": 10,
    "font": "sans-serif",
    "location": "bottom-left"
  },
  "size": {
    "canvasWidth": 960,
    "pieInnerRadius": "20%",
  },
  "data": {
    "sortOrder": "",
    "content": [
      {"label":"One or more admissions in past year", "value": 8, "sign":"+", "color": "#5a84fa"},
      {"label":"Married males", "value": 2, "sign": "+", "color": "#678dfb"},
      {"label":"Medicare or Medi-Cal", "value": 2, "sign": "+", "color": "#7597fb"},
      {"label":"Urgent admission", "value": 2, "sign": "+", "color": "#81a0fa"},
      {"label":"Self-admit to ED", "value": 1, "sign": "+", "color": "#90abfb"},
      {"label":"15 or more diagnoses", "value": 3, "sign": "+", "color": "#3b0300"},
      {"label":"Any infectious disease", "value": 2, "sign": "+", "color": "#470500"},
      {"label":"Any digestive disorder", "value": 1, "sign": "+", "color": "#510600"},
      {"label":"Primary Dx of COPD", "value": 1, "sign": "+", "color": "#5c0702"},
      {"label":"Musculoskeletal disorder", "value": 2, "sign": "-", "color": "#670901"},
      {"label":"Current LOS 7 days or more", "value": 1, "sign": "+", "color": "#022c00"},
      {"label":"Discharge to Hospice", "value": 2, "sign": "-", "color": "#043500"}
    ]
  },
  "labels": {
    "outer": {
      "pieDistance": 32
    },
    "inner": {
      "format": "value"
    },
    "mainLabel": {
      "fontSize": 11
    },
    "percentage": {
      "color": "#ffffff",
      "decimalPlaces": 0
    },
    "value": {
      "color": "#adadad",
      "fontSize": 11
    },
    "lines": {
      "enabled": true
    }
  },
  "effects": {
    "pullOutSegmentOnClick": {
      "effect": "linear",
      "speed": 400,
      "size": 8
    }
  },
  "misc": {
    "gradient": {
      "enabled": true,
      "percentage": 100
    }
  }
};


var piejson2 = {
  "header": {
    "title": {
      "text": "30 Day Readmissions",
      "fontSize": 24,
      "font": "sans-serif"
    },
    "subtitle": {
      "text": "Patient Characteristics, Illness Risk Factors, Hospital Course Risk Factors",
      "color": "#999999",
      "fontSize": 12,
      "font": "sans-serif"
    },
    "titleSubtitlePadding": 9
  },
  "footer": {
    "color": "#999999",
    "fontSize": 10,
    "font": "sans-serif",
    "location": "bottom-left"
  },
  "size": {
    "canvasWidth": 960,
    "pieInnerRadius": "20%",
  },
  "data": {
    "sortOrder": "",
    "content": [
      {"label":"One or more admissions in past year", "value": 6, "sign":"+", "color": "#5a84fa"},
      {"label":"Married males", "value": 2, "sign": "+", "color": "#678dfb"},
      {"label":"Medicare or Medi-Cal", "value": 2, "sign": "+", "color": "#7597fb"},
      {"label":"Urgent admission", "value": 2, "sign": "+", "color": "#81a0fa"},
      {"label":"Self-admit to ED", "value": 2, "sign": "+", "color": "#90abfb"},
      {"label":"15 or more diagnoses", "value": 3, "sign": "+", "color": "#3b0300"},
      {"label":"Any infectious disease", "value": 2, "sign": "+", "color": "#470500"},
      {"label":"Any digestive disorder", "value": 2, "sign": "+", "color": "#510600"},
      {"label":"Primary Dx of COPD", "value": 1, "sign": "+", "color": "#5c0702"},
      {"label":"Musculoskeletal disorder", "value": 1, "sign": "-", "color": "#670901"},
      {"label":"Current LOS 7 days or more", "value": 1, "sign": "+", "color": "#022c00"},
      {"label":"Discharge to Hospice", "value": 2, "sign": "-", "color": "#043500"}
    ]
  },
  "labels": {
    "outer": {
      "pieDistance": 32
    },
    "inner": {
      "format": "value"
    },
    "mainLabel": {
      "fontSize": 11
    },
    "percentage": {
      "color": "#ffffff",
      "decimalPlaces": 0
    },
    "value": {
      "color": "#adadad",
      "fontSize": 11
    },
    "lines": {
      "enabled": true
    }
  },
  "effects": {
    "pullOutSegmentOnClick": {
      "effect": "linear",
      "speed": 400,
      "size": 8
    }
  },
  "misc": {
    "gradient": {
      "enabled": true,
      "percentage": 100
    }
  }
};

var piejson3 = {
  "header": {
    "title": {
      "text": "30 Day Readmissions",
      "fontSize": 24,
      "font": "sans-serif"
    },
    "subtitle": {
      "text": "Patient Characteristics, Illness Risk Factors, Hospital Course Risk Factors",
      "color": "#999999",
      "fontSize": 12,
      "font": "sans-serif"
    },
    "titleSubtitlePadding": 9
  },
  "footer": {
    "color": "#999999",
    "fontSize": 10,
    "font": "sans-serif",
    "location": "bottom-left"
  },
  "size": {
    "canvasWidth": 960,
    "pieInnerRadius": "20%",
  },
  "data": {
    "sortOrder": "",
    "content": [
      {"label":"One or more admissions in past year", "value": 9, "sign":"+", "color": "#5a84fa"},
      {"label":"Married males", "value": 2, "sign": "+", "color": "#678dfb"},
      {"label":"Medicare or Medi-Cal", "value": 2, "sign": "+", "color": "#7597fb"},
      {"label":"Urgent admission", "value": 2, "sign": "+", "color": "#81a0fa"},
      {"label":"Self-admit to ED", "value": 1, "sign": "+", "color": "#90abfb"},
      {"label":"15 or more diagnoses", "value": 1, "sign": "+", "color": "#3b0300"},
      {"label":"Any infectious disease", "value": 2, "sign": "+", "color": "#470500"},
      {"label":"Any digestive disorder", "value": 2, "sign": "+", "color": "#510600"},
      {"label":"Primary Dx of COPD", "value": 1, "sign": "+", "color": "#5c0702"},
      {"label":"Musculoskeletal disorder", "value": 1, "sign": "-", "color": "#670901"},
      {"label":"Current LOS 7 days or more", "value": 1, "sign": "+", "color": "#022c00"},
      {"label":"Discharge to Hospice", "value": 2, "sign": "-", "color": "#043500"}
    ]
  },
  "labels": {
    "outer": {
      "pieDistance": 32
    },
    "inner": {
      "format": "value"
    },
    "mainLabel": {
      "fontSize": 11
    },
    "percentage": {
      "color": "#ffffff",
      "decimalPlaces": 0
    },
    "value": {
      "color": "#adadad",
      "fontSize": 11
    },
    "lines": {
      "enabled": true
    }
  },
  "effects": {
    "pullOutSegmentOnClick": {
      "effect": "linear",
      "speed": 400,
      "size": 8
    }
  },
  "misc": {
    "gradient": {
      "enabled": true,
      "percentage": 100
    }
  }
};



piejsonarr.push(piejson1);
piejsonarr.push(piejson2);
piejsonarr.push(piejson3);




