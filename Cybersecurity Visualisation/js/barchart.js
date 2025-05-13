export const barchart = (parent,props) => {
    const{
        data,
        margin,
        selectedSource,
        selectedDestination,
        selectedProtocol,
        filterWidth,
        sizeSelected,
        getScale,
        selectedEnd,
        selectedStart,
        changeBarScale,
        startedSlideLeft,
        draggingSlideLeft,
        endedSlideLeft,
        startedSlideRight,
        draggingSlideRight,
        endedSlideRight,
        slideLx,
        slideRx,
        minByte,
        maxByte,
    } = props;

    const totalHeight = +parent.attr('height') - margin.top - margin.bottom;
    const totalWidth = +parent.attr('width') - margin.left - margin.right - filterWidth;

    parent.selectAll('g.linechart').remove();
    const chart = parent.selectAll('linechart').data([null]);

    const chartEnter = chart
    .enter().append('g')
      .attr('class','linechart')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const setFormat = () => {
      chartEnter
        .append('rect')
        .attr('class', 'background')
        .attr("x", "0")
        .attr("y", "0")
        .attr("rx", "50")
        .attr("ry", "50")
        .attr('width', totalWidth)
        .attr('height', totalHeight)
        .attr('fill', " #cce6ff")
      
      chartEnter
        .append('rect')
        .attr('class', 'background')
        .attr("x", "50")
        .attr("y", "0")
        .attr('width', totalWidth-50)
        .attr('height', totalHeight)
        .attr('fill', " #cce6ff");
      
      chartEnter
        .append('rect')
        .attr('class', 'background')
        .attr("x", "0")
        .attr("y", "50")
        .attr('width', totalWidth)
        .attr('height', totalHeight-50)
        .attr('fill', " #cce6ff");


      chartEnter
        .append('rect')
        .attr('class', 'background')
        .attr("x", "0")
        .attr("y", "0")
        .attr('width', totalWidth - 100)
        .attr('height', totalHeight - 100)
        .attr('fill', "white")
        .attr('transform', 'translate(50,50)');

      chartEnter
        .append('text')
        .attr('class','chart-subtitle')
        .attr('text-anchor', 'middle')
        .attr('x', totalWidth/2)
        .attr('y', totalHeight - 10)
        .attr('font-size','11')
        .text('Time (s)');

      chartEnter
        .append('text')
        .attr('class','chart-subtitle')
        .attr('text-anchor', 'middle')
        .attr('x', '15')
        .attr('y', totalHeight/2)
        .attr('font-size','11')
        .text('Packets Sent')
        //ttr('transform','translate(${totalWidth/2},${totalHeight})')
        .attr('transform', 'rotate(270,15,' + totalHeight/2 + ')')

      chartEnter
        .append('text')
        .attr('class','chart-title')
        .attr('text-anchor', 'middle')
        .attr('x', totalWidth/2)
        .attr('y', '30')
        .text(((selectedProtocol && selectedProtocol != 'All protocols') ? selectedProtocol + ' ' : '') + 'Packets Sent' + (selectedSource ? ' From ' + selectedSource : '')  + (selectedDestination ? ' To ' + selectedDestination : ''))


    }
    setFormat()

    let dataFiltered = selectedSource ? data.filter(function(d){return d.Source == selectedSource}) : data
    dataFiltered = selectedDestination ? dataFiltered.filter(function(d){return d.Destination == selectedDestination}) : dataFiltered
    dataFiltered = selectedProtocol ? selectedProtocol == 'OTHER' ? dataFiltered.filter(function(d){return !(d.Protocol == "TCP" || d.Protocol == "DNS" || d.Protocol == "MQTT" || d.Protocol == "ARP")}) : selectedProtocol == 'ALL PROTOCOLS' ? dataFiltered : dataFiltered.filter(function(d){return d.Protocol == selectedProtocol}) : dataFiltered
    dataFiltered = selectedStart ? dataFiltered.filter(function(d){return d.Time >= selectedStart}) : dataFiltered //Filtering for after left slider
    dataFiltered = minByte ? dataFiltered.filter(function(d){return d.Length <= minByte}) : dataFiltered
    dataFiltered = maxByte ? dataFiltered.filter(function(d){return d.Length >= maxByte}) : dataFiltered
    console.log(selectedSource + " " + selectedProtocol)

    var xArr = [] // Array for each unit of time in range
    for (let i = 0; i < (Math.floor(data[data.length-1].Time) + 1); i++) {
        xArr.push(i)
    }
    var yVal = []
    var yValSize = []
    var timeSize = 0
    var start = 1
    var entries = 0
    //console.log(Math.floor(data[i]))
    for(let i=0; i < dataFiltered.length;){ //check this logic
        //console.log(data[i].Time)
        if (Math.floor(dataFiltered[i].Time) < start){
            entries+=1;
            timeSize += dataFiltered[i].Length;
            i++;
        }
        else if(i == dataFiltered.length-1){
            yVal.push(entries);
            yValSize.push(timeSize);
            i++;
        }
        else{
            yVal.push(entries);
            yValSize.push(timeSize);
            start+=1;
            entries=0;
            timeSize=0;
        }
    }

    while(xArr.length > yVal.length){
        yVal.push(0)
        yValSize.push(0)
    }

    console.log(yValSize)

    const yArray = sizeSelected ? yValSize : yVal
    console.log(yArray)

    function yValue(d) {return yArray[d]}
    console.log(yValue(0))

    const xScale = d3.scaleBand()
        .domain(xArr) //d3.extent(xArr)
        .range([50,totalWidth-50])
        //.paddingInner(0.2);
        console.log(xScale + " scale")
    
    getScale(d3.scaleLinear().domain([0,1048]).range([50,totalWidth-50]))
    //console.log(xScale.invert(1000))

    changeBarScale(xScale)
    
    const xAxis = d3.axisBottom(xScale)
        .tickValues(xScale.domain().filter(function(d,i){ return !(i%50)}));

    const yScalePackets = d3.scaleLinear()
        .domain(d3.extent(yVal))
        .range([ (totalHeight - 50), 50]);

    const yScaleSize = d3.scaleLinear()
        .domain(d3.extent(yValSize))
        .range([ (totalHeight - 50), 50]);

    const yScale = sizeSelected ? yScaleSize : yScalePackets

    chartEnter.append("g")
        .attr("transform", "translate(50,0)")
        .call(d3.axisLeft(yScale));

    chartEnter.append("g")
        .attr("transform", "translate(0," + (totalHeight-50) + ")")
        .call(xAxis)
        .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    //console.log("test " + totalHeight + " " + yScale(yValue(0)))

    chartEnter
        .selectAll()
        .data(xArr)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(xArr[d]))
        .attr('width', xScale.bandwidth())
        .attr('height', d => {return totalHeight- 50 - yScale(yValue(d))})
        .attr('y', d => yScale(yValue(d)))
        .attr('fill', d => ((d >= selectedStart || !selectedStart) && (d <= selectedEnd || !selectedEnd )? 'black' : 'rgb(210, 210, 210)'))
        .on('mousemove',(event,d) => {
            const total = yValue(d)
              ? `<strong>${yValue(d)}</strong> total packets sent at time = ${xArr[d]}`
              : `0 packets sent at time = ${xArr[d]}`;
            d3.select('#tooltip')
              .style('display','block')
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY + 10) + 'px')
              .html(`
                <div>${total}</div>
                `);
          })
          .on('mouseleave',() => {
            d3.select('#tooltip').style('display','none');
          }); 

    parent.selectAll('g.sliders').remove()

    const chart2 = parent.selectAll('g.sliders').data([null]);
    const chartEnter2 = chart2
    .enter().append('g')
      .attr('class','sliders')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const slideLeft = chartEnter2
        .append('circle')
        .attr('class', 'sliderL')
        .attr('cx', slideLx ? slideLx - margin.left : '50')
        .attr('cy', 740 - margin.top)
        .attr('r',3)
        .attr('fill','red');

    const slideRight = chartEnter2
        .append('circle')
        .attr('class', 'sliderR')
        .attr('cx', slideRx ? slideRx - margin.left : xScale(xArr[xArr.length -1]))
        .attr('cy',740 - margin.top)
        .attr('r',3)
        .attr('fill','red');
    
    //slideLeft
    //slideRight
    const dragL = d3.drag()
        .on('start', startedSlideLeft)
        .on('drag', draggingSlideLeft)
        .on('end', endedSlideLeft);

    const dragR = d3.drag()
        .on('start', startedSlideRight)
        .on('drag', draggingSlideRight)
        .on('end', endedSlideRight);


    slideLeft.call(dragL);
    slideRight.call(dragR);
}