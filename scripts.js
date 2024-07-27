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

async function loadData() {
    const data = await d3.csv("https://raw.githubusercontent.com/KAkabu2/KAkabu2.github.io/main/Data/data.csv", function(data) {
        console.log("Data length is " + data.length);
        console.log(data[0]);

        for (let i = 0; i < data.length; i++) {
            const d = data[i];
            d["Anxiety disorders (%)"] = +d["Anxiety disorders (%)"];
            if (d.Entity === "United States" && d.Year >= 1970 && d.Year <= 2017) {
                scenes[0].data.push(d);
            } else if (d.Entity === "Somalia" && d.Year >= 1970 && d.Year <= 2017) {
                scenes[1].data.push(d);
            }
        }

        scenes.forEach(scene => {
            scene.svg = d3.select("svg").append("g").style("display", "none");
        });
    
        renderScene(scenes[currentSceneIndex]);
    
        document.getElementById("next-btn").addEventListener("click", function() {
            currentSceneIndex = (currentSceneIndex + 1) % scenes.length;
            renderScene(scenes[currentSceneIndex]);
        });
    
        document.getElementById("prev-btn").addEventListener("click", function() {
            currentSceneIndex = (currentSceneIndex - 1 + scenes.length) % scenes.length;
            renderScene(scenes[currentSceneIndex]);
        });
    });
}

async function initialize() {
    loadData();
    console.log("made it to line 50");
    
}

function renderScene(scene) {
    d3.selectAll("g").style("display", "none");
    scene.svg.style("display", "block");
    if (scene.svg.select("path").empty()) {
        console.log("attempting to draw line graph for scene" + scene);
        drawLineGraph(scene);
    }
}

function drawLineGraph(scene) {
    const margin = {top: 20, right: 30, bottom: 30, left: 40},
          width = +d3.select("svg").attr("width") - margin.left - margin.right,
          height = +d3.select("svg").attr("height") - margin.top - margin.bottom;

    const x = d3.scaleLinear().range([0, width]),
          y = d3.scaleLinear().range([height, 0]);

    const line = d3.line()
        .x(d => x(d.Year))
        .y(d => y(d["Anxiety disorders (%)"]));

    const g = scene.svg
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(scene.data, d => d.Year));
    y.domain([0, d3.max(scene.data, d => d["Anxiety disorders (%)"])]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

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
        .attr("d", line);
}

initialize();
