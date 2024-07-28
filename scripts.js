// Initialize scenes array and current scene index
const scenes = [
    {
        country: "United States",
        data: [],
        svg: null
    },
    {
        country: "Somalia",
        data: [],
        svg: null
    },
    {
        country: "Summary",
        data: [],
        svg: null
    }
];
let currentSceneIndex = 0;
let prevScene = 0;

async function loadData() {
    const data = await d3.csv("https://raw.githubusercontent.com/KAkabu2/KAkabu2.github.io/main/Data/data.csv", function(data) {

        for (let i = 0; i < data.length; i++) {
            const d = data[i];
            d["Anxiety disorders (%)"] = +d["Anxiety disorders (%)"];
            if (d.Entity === "Canada" && d.Year >= 1970 && d.Year <= 2017) {
                scenes[0].data.push(d);
            } else if (d.Entity === "Ethiopia" && d.Year >= 1970 && d.Year <= 2017) {
                scenes[1].data.push(d);
            }
            scenes[2].data.push(d);
        }

        scenes.forEach(scene => {
            scene.svg = d3.select("svg").append("g").style("display", "none");
        });
    
        renderScene(scenes[currentSceneIndex]);
    
        document.getElementById("next-btn").addEventListener("click", function() {
            prevScene = 1;
            currentSceneIndex = (currentSceneIndex + 1) % scenes.length;
            renderScene(scenes[currentSceneIndex]);
        });
    
        document.getElementById("prev-btn").addEventListener("click", function() {
            prevScene = 1;
            currentSceneIndex = (currentSceneIndex - 1 + scenes.length) % scenes.length;
            renderScene(scenes[currentSceneIndex]);
        });
        document.getElementById("back-btn").addEventListener("click", function() {
            currentSceneIndex = 2;
            renderScene(scenes[currentSceneIndex]);
        });
    });
}

async function initialize() {
    loadData();
    
}

function renderScene(scene) {
    d3.selectAll("g").style("display", "none");

    scene.svg.style("display", "block");

    if (scene === scenes[2] && scene.svg.select("path.sphere").empty()) {
        drawMap(scene);
    } else if (scene === scenes[0] || scene === scenes[1]) {
        drawLineGraph(scene);
        transitionScene(scene);
    }
}

function transitionScene(scene) {
    // Handle transitions for line graphs
    const margin = {top: 20, right: 30, bottom: 30, left: 40},
          width = +d3.select("svg").attr("width") - margin.left - margin.right,
          height = +d3.select("svg").attr("height") - margin.top - margin.bottom;

    // Handle transitions for line graphs
    if (currentSceneIndex === 0 || currentSceneIndex === 1) {
        const svg = d3.select("svg").transition();
        
        const combinedData = scenes[0].data.concat(scenes[1].data);
        
        // Update the scales
        const x = d3.scaleLinear().domain(d3.extent(combinedData, d => d.Year)).range([0, width]);
        const y = d3.scaleLinear().domain(d3.extent(combinedData, d => d["Anxiety disorders (%)"])).range([height, 0]);

        const line = d3.line()
            .x(d => x(d.Year))
            .y(d => y(d["Anxiety disorders (%)"]));

        // Update the lines
        svg.select(".line")
            .duration(750)
            .attr("d", line(scenes[0].data));

        svg.select(".line.red")
            .duration(750)
            .attr("d", line(scenes[1].data));

        // Update the x-axis
        svg.select(".axis--x")
            .duration(750)
            .call(d3.axisBottom(x));

        // Update the y-axis
        svg.select(".axis--y")
            .duration(750)
            .call(d3.axisLeft(y));
    }
}

function drawLineGraph(scene) {
    const margin = {top: 20, right: 30, bottom: 30, left: 40},
          width = +d3.select("svg").attr("width") - margin.left - margin.right,
          height = +d3.select("svg").attr("height") - margin.top - margin.bottom;

    scene.svg.selectAll("*").remove();      

    const x = d3.scaleLinear().domain(d3.extent(scene.data, d => d.Year)).range([0, width]),
          y = d3.scaleLinear().domain(d3.extent(scene.data, d => d["Anxiety disorders (%)"])).range([height, 0]);

    const g = scene.svg
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const line = d3.line()
        .x(d => x(d.Year))
        .y(d => y(d["Anxiety disorders (%)"]));

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("fill", "#000")
        .attr("x", width - margin.right + 5)
        .attr("y", -15)
        .attr("dy", "0.71em")
        .attr("text-anchor", "start")
        .text("Year");

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Anxiety (%)");

    g.append("path")
        .datum(scene.data)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // scenes.forEach((sceneData, index) => {
    //     const color = index === 0 ? "black" : "red";
        
    //     g.selectAll(`.dot-${index}`)
    //         .data(sceneData.data)
    //         .enter().append("circle")
    //         .attr("class", `dot-${index}`)
    //         .attr("cx", d => x(d.Year))
    //         .attr("cy", d => y(d["Anxiety disorders (%)"]))
    //         .attr("r", 3)
    //         .attr("fill", color)
    //         .on("mouseover", function(event, d) {
    //             d3.select(this).attr("r", 6);
    //             tooltip.transition().duration(200).style("opacity", .9);
    //             tooltip.html(`Year: ${d.Year}<br>Anxiety: ${d["Anxiety disorders (%)"]}%`)
    //                 .style("left", (event.pageX + 5) + "px")
    //                 .style("top", (event.pageY - 28) + "px");
    //         })
    //         .on("mouseout", function(d) {
    //             d3.select(this).attr("r", 3);
    //             tooltip.transition().duration(500).style("opacity", 0);
    //         });
    // });
}

function drawMap(scene) {
    const svg = scene.svg;
    const projection = d3.geoNaturalEarth1();
    const pathGenerator = d3.geoPath().projection(projection);
    svg.append('path')
        .attr('class', 'sphere')
        .attr('d', pathGenerator({type: 'Sphere'}));
    
    d3.json("https://d3js.org/world-50m.v1.json", function(error, data) {
        if (error) throw error;
        
        const countries = topojson.feature(data, data.objects.countries);
        svg.selectAll('path.country').data(countries.features)
            .enter().append('path')
            .attr('class', 'country')
            .attr('d', pathGenerator);
    });
}
initialize();
