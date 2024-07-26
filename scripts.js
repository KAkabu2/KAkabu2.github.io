import * as d3 from "d3";
//let currentScene = 0;
//const scenes = [s1, s2, s3];

//  window.onload = renderScene;

//  document 

async function loadData() {
    const data = await d3.csv("https://raw.githubusercontent.com/KAkabu2/KAkabu2.github.io/main/Data/data.csv");
    const filtered = data.filter(d => {
        return (d.Entity === "United States" || d.Entity === "Somalia") &&
        (parseInt(d.Year) >= 1990 && parseInt(d.Year) <= 2017);
    });
    return filtered;
}   

loadData().then(filteredData => {
    console.log(filteredData);
    // const margin = {top: 20, right: 30, bottom: 40, left: 40};
    // const width = 800 - margin.left - margin.right;
    // const height = 400 - margin.top - margin.bottom;

    // const svg = d3.select("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    //   .append("g")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // const x = d3.scaleLinear().domain([1990, 2017]).range([0, width]);
    // console.log(x);
    // const y = d3.scaleLinear().domain([0, d3.max(filteredData, d => +d.Eatingdisorders)]).range([height, 0]);

    // svg.append("g")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(x).tickFormat(d3.format("~d")));

    // svg.append("g")
    //     .call(d3.axisLeft(y));

    // const lineAmerica = d3.line()
    //     .x(d => x(d.Year))
    //     .y(d => y(d.Eatingdisorders));

    // svg.append("path")
    //     .datum(filteredData.filter(d => d.Entity === "United States"))
    //     .attr("fill", "none")
    //     .attr("stroke", "blue")
    //     .attr("stroke-width", 1.5)
    //     .attr("d", lineAmerica);

    // const lineSomalia = d3.line()
    //     .x(d => x(d.Year))
    //     .y(d => y(d.Eatingdisorders));

    // svg.append("path")
    //     .datum(filteredData.filter(d => d.Entity === "Somalia"))
    //     .attr("fill", "none")
    //     .attr("stroke", "red")
    //     .attr("stroke-width", 1.5)
    //     .attr("d", lineSomalia);
});