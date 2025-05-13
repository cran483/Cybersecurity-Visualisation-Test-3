import { matrix } from './matrix.js';
import { barchart } from './barchart.js';
import { network } from './network.js';
import { input } from './input.js';
import { toggle } from './toggle.js';
import { filters } from './filters.js';
import { sliders } from './sliders.js';
import { benignProcess } from './benignProcess.js';

const svg = d3.select('svg');

let data;
let benignData;
let networkContent;
let networkData;
let networkUpdated = false;
let sliderUpdated = false;
let littleUpdate = false;
let rowsRemoved = false;

let selectedSource;
let selectedDestination;
let selectedProtocol;
let sizeSelected = false;
let selectedStart;
let selectedEnd;
let xScaleBarchart;
let minByte;
let maxByte;
let togX = 750
let togY = 400
let filterWidth = 300
let protocols = ["ALL PROTOCOLS","TCP","DNS","MQTT","ARP","OTHER"];
let floorplan = true;
let normalised = false;
let slideLx;
let slideRx;
let startX;
let risk = false;
let vulnerability = false;
let barXscale;
let srcAddresses;
let dstAddresses;
let loaded = false;
let pageNumber = 0;
//data = []
//console.log(data)

// event handlers
const setSrcAddresses = (d) => {srcAddresses = d}
const setDstAddresses = (d) => {dstAddresses = d}
const changeBarScale = (d) => {
    barXscale = d
}
const resetFilters = () => {
    selectedSource = null;
    selectedDestination = null;
    selectedProtocol = null;
    sizeSelected = false;
    selectedStart = null;
    selectedEnd = null;
    floorplan = true;
    normalised = false;
    risk = false;
    vulnerability = false;
    updateVis();

}
const resetAddresses = () => {
    selectedSource = null;
    selectedDestination = null;
    updateVis()
}
const onSourceSelected = (event,d) => {
    //console.log(event)
    selectedSource = d
    console.log('here')
    console.log(selectedSource + " source")
    pageNumber = 0
    updateBarchart()
    updateInput()
    updateNetwork()
    littleUpdate = true
    updateMatrix()
    littleUpdate = false
}
const onDestinationSelected = (destination) => {
    selectedDestination = destination
    console.log(selectedDestination + " destination")
    pageNumber = 0
    updateBarchart()
    updateInput()
    updateNetwork()
    littleUpdate = true
    updateMatrix()
    littleUpdate = false
    //updateMatrix()
}
const onProtocolSelected = (value) => {
    if (selectedProtocol != value) {selectedProtocol = value}
    else{selectedProtocol = null}
    pageNumber = 0
    console.log(value)
    updateBarchart()
    updateFilters()
    updateMatrix()
    updateInput()
}
const onSizeOrCountSelected = (option) => {
    if (option == 0){sizeSelected = false}
    else {sizeSelected = true}
    updateBarchart()
    updateFilters()
}
const onMinByteSelected = (byte) => {
    if(byte != minByte){minByte = byte}
    else {minByte = null}
    pageNumber = 0
    updateFilters()
    updateInput()
    updateBarchart()
    updateMatrix()
}
const onMaxByteSelected = (byte) => {
    if(byte != maxByte){maxByte = byte}
    else{maxByte = null}
    pageNumber = 0
    updateFilters()
    updateInput()
    updateBarchart()
    updateMatrix()
}
const removeRows = () => {
    rowsRemoved = !rowsRemoved
    updateFilters()
    updateMatrix()
}
const floorplanClick = () => {
    floorplan = !floorplan
    updateFilters()
    updateNetwork()
}
const normaliseClick = () => {
    normalised = !normalised
    updateFilters()
    updateMatrix()
}
const riskClick = () => {
    risk = !risk
    updateFilters()
    updateMatrix()
}
const vulnerabilityClick = () => {
    vulnerability = !vulnerability
    updateFilters()
    updateMatrix()
}
const nextPage = () => {
    pageNumber += 1;
    updateInput()
}
const previousPage = () => {
    if (pageNumber > 0) {pageNumber -=1};
    updateInput()
}
const startedSlideLeft  = function(event) {
    const tog = d3.select('.sliderL')
    //tog.attr('fill', 'yellow')
}
//margin : {top: (togY+2), bottom: 10, left: (togX+2), right: 10}
const draggingSlideLeft = (event) => {
    let margin = {top: (togY+2), bottom: 10, left: (togX+2), right: 10}
    var xCoor = d3.pointer(event)[0]
    var yCoor = d3.pointer(event)[1]
    console.log(xCoor + " " + yCoor)
    //console.log(event.subject.cx)
    const tog = d3.select('.sliderL')
    tog
    .attr("cx", ( xCoor - (margin.left) > 50 ? ((xCoor-margin.left) < (1500 - margin.left) ? (xCoor-margin.left) : (1500 - margin.left)) : 50))

    //togX = xCoor
    //togY = yCoor
}
const endedSlideLeft = (event) => {
    d3.select('.sliderL')
    .attr('fill','red')
    var endX = d3.pointer(event)[0]
    slideLx = endX
    var endTime = xScaleBarchart.invert(endX)
    console.log(xScaleBarchart + " scale")
    console.log(endX+ "  " + (endTime-1230) + "  " + xScaleBarchart(endTime))
    selectedStart = endTime-1230
    updateMatrix()
    updateBarchart()
    updateSliders()
    updateInput()
}
const startedSlideRight  = function(event) {
    const tog = d3.select('.sliderR')
    //tog.attr('fill', 'yellow')
}
const draggingSlideRight = (event) => {
    var xCoord = d3.pointer(event)[0]
    var yCoord = d3.pointer(event)[1]
    console.log(xCoord + " " + yCoord)
    //console.log(event.subject.cx)
    const tog = d3.select('.sliderR')
    tog
    .attr("cx", (xCoord - 750) > 50 ? ((xCoord-750) < 700 ? (xCoord-750) : 700) : 50)

    //d3.selectAll('.bar').attr('fill', (d.x > xCoor -750) ? 'red' : 'red')

    //togX = xCoor
    //togY = yCoor
}
const endedSlideRight = (event) => {
    d3.select('.sliderR')
    var endX = d3.pointer(event)[0]
    slideRx = endX
    var endTime = xScaleBarchart.invert(endX)
    console.log(xScaleBarchart + " scale")
    console.log(endX+ "  " + (endTime-1230) + "  " + xScaleBarchart(endTime))
    selectedEnd = endTime-1230
    //attr('fill','red')
   //updateVis()
    //updateToggle()
    updateMatrix()
    updateBarchart()
    updateSliders()
    updateInput()
}
const started  = function(event) {
    const tog = d3.select('.toggle')
    startX = d3.pointer(event)[0]
    tog.attr('fill', 'red')
}
const dragging = (event) => {
    var xCoor = d3.pointer(event)[0]
    var yCoor = d3.pointer(event)[1]
    console.log(xCoor + " " + yCoor)
    //console.log(event.subject.cx)
    const tog = d3.select('.toggle')
    tog
    .attr("cx", xCoor)
    .attr("cy", yCoor)

    togX = xCoor
    togY = yCoor

}
const ended = (event) => {
    d3.select('.toggle')
    .attr('fill','#cce6ff')

    var xCoor = d3.pointer(event)[0]
    slideLx = slideLx + barXscale(xCoor - startX)
    slideRx = slideRx + (xCoor - startX)

    updateVis()
}
const getScale = (scale) => {
    xScaleBarchart = scale
}
const updateVis = () => {
    //updateToggle();
    updateMatrix();
    updateInput();
    updateBarchart();
    updateNetwork();
    updateFilters();
    //updateSliders();
    updateToggle();
}
const updateMatrix = () => {
    /* if (normalised && !loaded) {
        processBenignData()
        loaded = true
    }*/
    svg.call(matrix, {
        data : data,
        networkContent : networkContent,
        margin : {top: 10, bottom: (800 - togY + 2), left: (togX + 2), right: 10},
        onSourceSelected : onSourceSelected,
        onDestinationSelected : onDestinationSelected,
        filterWidth : filterWidth,
        selectedProtocol : selectedProtocol,
        selectedEnd : selectedEnd,
        selectedStart : selectedStart,
        normalised : normalised,
        risk : risk,
        vulnerability : vulnerability,
        setSrcAddresses : setSrcAddresses,
        setDstAddresses : setDstAddresses,
        normalisedMatrix : normalisedMatrix,
        littleUpdate : littleUpdate,
        selectedSource : selectedSource,
        selectedDestination : selectedDestination,
        rowsRemoved : rowsRemoved,
        minByte : minByte,
        maxByte : maxByte,
    });
}
const updateInput = () => {
    svg.call(input, {
        data : data,
        margin : {top:(togY+2), bottom:10, left: 10, right:(1500 - togX+2)},
        onProtocolSelected : onProtocolSelected,
        filterWidth : filterWidth,
        selectedSource : selectedSource,
        selectedDestination : selectedDestination,
        selectedProtocol : selectedProtocol,
        nextPage : nextPage,
        pageNumber : pageNumber,
        previousPage : previousPage,
        selectedStart : selectedStart,
        selectedEnd : selectedEnd,
        minByte : minByte,
        maxByte : maxByte,
    })
}
const updateBarchart = () => {
    svg.call(barchart,{
        data : data,
        margin : {top: (togY+2), bottom: 10, left: (togX+2), right: 10},
        selectedSource : selectedSource,
        selectedDestination : selectedDestination,
        selectedProtocol : selectedProtocol,
        filterWidth : filterWidth,
        sizeSelected : sizeSelected,
        getScale : getScale,
        selectedEnd : selectedEnd,
        selectedStart : selectedStart,
        changeBarScale : changeBarScale,
        startedSlideLeft : startedSlideLeft,
        draggingSlideLeft : draggingSlideLeft,
        endedSlideLeft : endedSlideLeft,
        startedSlideRight : startedSlideRight,
        draggingSlideRight : draggingSlideRight,
        endedSlideRight : endedSlideRight,
        sliderUpdated : sliderUpdated,
        slideLx : slideLx,
        slideRx : slideRx,
        minByte : minByte,
        maxByte : maxByte,
    });
    sliderUpdated = true
    //updateSliders()
}
const updateNetwork = () => {
    svg.call(network, {
        data : networkData,
        margin : {top: 10, bottom: (800 - togY + 2), left: 10, right: (1500 - togX+2)},
        filterWidth : filterWidth,
        updated : networkUpdated,
        floorplan : floorplan,
        selectedSource : selectedSource,
        selectedDestination : selectedDestination,
        onSourceSelected : onSourceSelected,
        onDestinationSelected : onDestinationSelected,
        resetAddresses : resetAddresses,
    })
    networkUpdated = true
    
}
const updateFilters = () => {
    svg.call(filters, {
        margin : {top: 10, bottom: 10, left: 1495, right: 10},
        protocols : protocols,
        onProtocolSelected,
        selectedProtocol : selectedProtocol,
        onSizeOrCountSelected,
        sizeSelected : sizeSelected,
        floorplan : floorplan,
        floorplanClick : floorplanClick,
        normalised : normalised,
        normaliseClick : normaliseClick,
        riskClick : riskClick,
        vulnerabilityClick : vulnerabilityClick,
        risk : risk,
        vulnerability : vulnerability,
        resetFilters : resetFilters,
        minByte : minByte,
        maxByte : maxByte,
        onMinByteSelected : onMinByteSelected,
        onMaxByteSelected : onMaxByteSelected,
        rowsRemoved : rowsRemoved,
        removeRows : removeRows,
    })
}
const updateToggle = () => {
    svg.call(toggle,{
        started : started,
        dragging : dragging,
        ended : ended
    })
}
const updateSliders = () => {
    /*
    svg.call(sliders, {
    margin : {top: (togY+2), bottom: 10, left: (togX+2), right: 10},
    startedSlideLeft : startedSlideLeft,
    draggingSlideLeft : draggingSlideLeft,
    endedSlideLeft : endedSlideLeft,
    startedSlideRight : startedSlideRight,
    draggingSlideRight : draggingSlideRight,
    endedSlideRight : endedSlideRight,
    sliderUpdated : sliderUpdated,
    slideLx : slideLx,
    slideRx : slideRx
    });
    sliderUpdated = true*/
};

let normalisedMatrix;
const updateNormalisedMatrix = (d) => {normalisedMatrix = d}

const processBenignData = () => {
    //console.log(srcAddresses)
    //console.log(dstAddresses)
    svg.call(benignProcess, {
        srcAddresses : srcAddresses,
        dstAddresses : dstAddresses,
        updateNormalisedMatrix : updateNormalisedMatrix,
        benignData : benignData,
    })
}

d3.json('data/network.json')
    .then(loadedNetworkData => {
        networkData = loadedNetworkData
    })

d3.csv('data/network.csv')
.then(loadedNetworkContentData => {
    networkContent  = loadedNetworkContentData
    networkContent.forEach(d => {
        d.risk = +d.risk;
        d.vulnerability = +d.vulnerability;
    })
})
//console.log(networkContent)
/*
d3.csv('data/benign.csv')
    .then(loadedBenignData => {
        benignData  = loadedBenignData;
        benignData.forEach(d => {
            d.No = +d.No;
            d.Length = +d.Length;
        });

    });

console.log(benignData)*/

d3.csv('data/Spoofing.csv')
    .then(loadedData => {             // Data loading
        data = loadedData
        data.forEach(d => {
            d.No = +d.No;
            d.Length = +d.Length;
        });
    updateVis()
    console.log('done this')
    processBenignData()
    //console.log('benign data')
    });

//console.log('benign data')
//processBenignData()
//console.log(data)

