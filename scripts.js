import * as d3 from "d3";

async function loadData() {
    const data = await d3.csv("https://github.com/KAkabu2/KAkabu2.github.io/blob/main/Data/data.csv");
    return data;
}

var dep = loadData();

console.log(dep);