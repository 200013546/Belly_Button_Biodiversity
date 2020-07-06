// Function to build plots
function getPlots(id) {
    // Get samples.json
    d3.json("samples.json").then (sampledata =>{
            // Setup inital values
            var sampleValues =  sampledata.samples[0].sample_values.slice(0,10).reverse();
            var OTUTop = ( sampledata.samples[0].otu_ids.slice(0, 10));
            var OTUId = OTUTop.map(d => "OTU " + d);
            var OTULabels =  sampledata.samples[0].otu_labels.slice(0,10);

            // Build Bar chart
            var trace = {
                x: sampleValues,
                y: OTUId,
                text: OTULabels,
                marker: {
                color: "royalblue"},
                type: "bar",
                orientation: "h",
            };
            var data = [trace];
            var layout = {
                title: "Top 10 OTU",
                yaxis:{
                    tickmode: "linear",
                    linewidth: 1,
                    mirror: true
                },
                margin: {
                    l: 100,
                    r: 100,
                    t: 100,
                    b: 30
                }
            };
        Plotly.newPlot("bar", data, layout);

        // Build Bubble chart
        var trace1 = {
                x: sampledata.samples[0].otu_ids,
                y: sampledata.samples[0].sample_values,
                mode: "markers",
                marker: {
                    size: sampledata.samples[0].sample_values,
                    color: sampledata.samples[0].otu_ids
                },
                text:  sampledata.samples[0].otu_labels
            };

            var bubble_layout = {
                xaxis:{title: "OTU ID"},
                height: 600,
                width: 1000,
                autorange: true
            };

            var bubble_data = [trace1];
        Plotly.newPlot("bubble", bubble_data, bubble_layout); 
        
        });
    }  

    // Function to build Demographic Info
    function getDemoInfo(id) {
        d3.json("samples.json").then((data)=> {
            var metadata = data.metadata;
            var result = metadata.filter(meta => meta.id.toString() === id)[0];
            var demographicInfo = d3.select("#sample-metadata");
            demographicInfo.html("");
            Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
            });
        });
    }

    // Run this when dropdown changes and rerun functions
    function optionChanged(id) {
        getPlots(id);
        getDemoInfo(id);
    }
    
    // Initial function for dropdown list
    function init() {
        var dropdown = d3.select("#selDataset");
        d3.json("samples.json").then((data)=> {
            data.names.forEach(function(name) {
                dropdown.append("option").text(name).property("value");
            });
            // Run function to build plots of bar chart and bubble chart
            getPlots(data.names[0]);
            // Run function to build Demographic Info
            getDemoInfo(data.names[0]);
        });
    }
    
    // Run initial function
    init();