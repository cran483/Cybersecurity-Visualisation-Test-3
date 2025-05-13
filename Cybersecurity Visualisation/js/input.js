export const input = (parent,props) => {
    const{
        data,
        margin,
        onProtocolSelected,
        filterWidth,
        selectedSource,
        selectedDestination,
        selectedProtocol,
        nextPage,
        pageNumber,
        previousPage,
        selectedStart,
        selectedEnd,
        minByte,
        maxByte,
    } = props;
    
    const totalHeight = +parent.attr('height') - margin.top - margin.bottom;
    const totalWidth = +parent.attr('width') - margin.left - margin.right - filterWidth;

    let entries = Math.floor(((totalHeight-100) / (290 / 11)))
    let xFactor = totalWidth-750

    // Chart taking care of inner margins
    parent.selectAll('g.input').remove()
    parent.selectAll('.menu').remove()

    const chart = parent.selectAll('input').data([null]);

    //chart.selectAll('.bar').remove();

    let dataFiltered = selectedSource ? data.filter(function(d){return d.Source == selectedSource}) : data
    dataFiltered = selectedDestination ? dataFiltered.filter(function(d){return  d.Destination == selectedDestination}) : dataFiltered
    dataFiltered = selectedProtocol ? selectedProtocol == 'OTHER' ? dataFiltered.filter(function(d){return !(d.Protocol == "TCP" || d.Protocol == "DNS" || d.Protocol == "MQTT" || d.Protocol == "ARP")}) : selectedProtocol == 'ALL PROTOCOLS' ? dataFiltered : dataFiltered.filter(function(d){return d.Protocol == selectedProtocol}) : dataFiltered
    dataFiltered = selectedEnd ? dataFiltered.filter(function(d){return d.Time <= selectedEnd}) : dataFiltered //Filtering for below right slider
    dataFiltered = selectedStart ? dataFiltered.filter(function(d){return d.Time >= selectedStart}) : dataFiltered //Filtering for after left slider
    dataFiltered = minByte ? dataFiltered.filter(function(d){return d.Length <= minByte}) : dataFiltered
    dataFiltered = maxByte ? dataFiltered.filter(function(d){return d.Length >= maxByte}) : dataFiltered
    
    //console.log(selectedSource + " " + selectedProtocol)

    const chartEnter = chart
      .enter().append('g')
        .attr('class','input')
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
        .attr('width', totalWidth-100)
        .attr('height', totalHeight)
        .attr('fill', " #cce6ff");

      chartEnter
        .append('rect')
        .attr('class', 'background')
        .attr("x", "0")
        .attr("y", "0")
        .attr('width', totalWidth - 100)
        .attr('height', totalHeight - 100)
        .attr('fill', "rgb(255, 255, 255)")
        .attr('transform', 'translate(50,50)');

      chartEnter
        .append('rect')
        .attr('class', 'background')
        .attr("x", "0")
        .attr("y", "0")
        .attr('width', totalWidth - 100)
        .attr('height', totalHeight - 100)
        .attr('fill', "rgba(255, 255, 255, 0)")
        .attr('stroke', 'black')
        .attr('transform', 'translate(50,50)');
      
      chartEnter
        .append('text')
        .attr('class','chart-title')
        .attr('text-anchor', 'middle')
        .attr('x', totalWidth/2)
        .attr('y', '30')
        .text('Packet Information')
      
      chartEnter
        .append('rect')
        .attr('class', 'reset')
        .attr("x", totalWidth - 100)
        .attr("y",  totalHeight - 35)
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('width', 'Next Page'.length*5 + 30)
        .attr('height', "15")
        .attr('fill', 'rgb(255, 255, 255)')
        .attr('stroke', 'rgb(0,0,0)')
        .on("click", function(d) {nextPage()})
      
      chartEnter
        .append('text')
        .attr("x", totalWidth - 100 + 'Next Page'.length*5/2 + 15)
        .attr("y", totalHeight - 35 + 10)
        .attr('text-anchor', 'middle')
        .attr("font-size", '10')
        .attr('fill', 'rgb(0,0,0)')
        .text('Next Page');

      chartEnter
        .append('rect')
        .attr('class', 'reset')
        .attr("x", totalWidth - 200)
        .attr("y",  totalHeight - 35)
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('width', 'Previous Page'.length*5 + 30)
        .attr('height', "15")
        .attr('fill', 'rgb(255, 255, 255)')
        .attr('stroke', 'rgb(0,0,0)')
        .on("click", function(d) {previousPage()})
        
      chartEnter
        .append('text')
        .attr("x", totalWidth - 200 + 'Previous Page'.length*5/2 + 15)
        .attr("y", totalHeight - 35 + 10)
        .attr('text-anchor', 'middle')
        .attr("font-size", '10')
        .attr('fill', 'rgb(0,0,0)')
        .text('Previous Page');
    }
    setFormat()

    const printdata = () => {
      /*chartEnter.append('text')
        .attr("x", 60)
        .attr("y",  80)
        .attr('text-anchor', 'left')
        .attr("font-size", '10')
        .attr('fill', 'black')
        .text('No.')*/

      chartEnter.append('text')
        .attr("x", 80)
        .attr("y",  65)
        .attr('text-anchor', 'left')
        .attr("font-size", '10')
        .attr('fill', totalWidth <= 120 ? 'transparent' : 'black')
        .text('Time')
      
      chartEnter.append('text')
        .attr("x", 120)
        .attr("y",  65)
        .attr('text-anchor', 'left')
        .attr("font-size", '10')
        .attr('fill', totalWidth <= 230 ? 'transparent' : 'black')
        .text('Source')
      
      chartEnter.append('text')
        .attr("x", 230)
        .attr("y",  65)
        .attr('text-anchor', 'left')
        .attr("font-size", '10')
        .attr('fill', totalWidth <= 340 ? 'transparent' :'black')
        .text('Destination')

      chartEnter.append('text')
        .attr("x", 340)
        .attr("y",  65)
        .attr('text-anchor', 'left')
        .attr("font-size", '10')
        .attr('fill', totalWidth <= 400 ? 'transparent' :'black')
        .text('Protocol')

      chartEnter.append('text')
        .attr("x", 400)
        .attr("y",  65)
        .attr('text-anchor', 'left')
        .attr("font-size", '10')
        .attr('fill', totalWidth <= 440 ? 'transparent' :'black')
        .text('Length')

      chartEnter.append('text')
        .attr("x", 440)
        .attr("y",  65)
        .attr('text-anchor', 'left')
        .attr("font-size", '10')
        .attr('fill', totalWidth <= 500 ? 'transparent' :'black')
        .text('Information')

      chartEnter.append('line')
        .attr('x1', '50')
        .attr('x2', totalWidth-50)
        .attr('y1', '70')
        .attr('y2', '70')
        .attr('stroke', totalWidth <= 78 ? 'transparent' :'black')
      
      chartEnter.append('line')
        .attr('x1', '78')
        .attr('x2', '78')
        .attr('y1', '50')
        .attr('y2', totalHeight - 50)
        .attr('stroke', totalWidth <= 118 ? 'transparent' :'black')

      chartEnter.append('line')
        .attr('x1', '118')
        .attr('x2', '118')
        .attr('y1', '50')
        .attr('y2', totalHeight - 50)
        .attr('stroke', totalWidth <= 228 ? 'transparent' :'black')

      chartEnter.append('line')
        .attr('x1', '228')
        .attr('x2', '228')
        .attr('y1', '50')
        .attr('y2', totalHeight - 50)
        .attr('stroke',totalWidth <= 338 ? 'transparent' : 'black')

      chartEnter.append('line')
        .attr('x1', '338')
        .attr('x2', '338')
        .attr('y1', '50')
        .attr('y2', totalHeight - 50)
        .attr('stroke', totalWidth <= 398 ? 'transparent' :'black')
      
      chartEnter.append('line')
        .attr('x1', '398')
        .attr('x2', '398')
        .attr('y1', '50')
        .attr('y2', totalHeight - 50)
        .attr('stroke', totalWidth <= 438 ? 'transparent' :'black')

      chartEnter.append('line')
        .attr('x1', '438')
        .attr('x2', '438')
        .attr('y1', '50')
        .attr('y2', totalHeight - 50)
        .attr('stroke', totalWidth <= 500 ? 'transparent' :'black')

      let lengthPrint = Math.min(entries,dataFiltered.length)
      for(let j=0 ; j < lengthPrint; j++){
        let i = pageNumber*entries + j
        chartEnter.append('text')
        .attr("x", 52)
        .attr("y",  90 + 25*j)
        .attr('text-anchor', 'left')
        .attr("font-size", '10')
        .attr('fill', totalWidth <= 130 ? 'transparent' : 'black')
        .text(dataFiltered[i].No ) //" " + dataFiltered[i].Source + " " +  dataFiltered[i].Destination + " "  + dataFiltered[i].Protocol + " " + dataFiltered[i].Info);

        chartEnter.append('text')
        .attr("x", 80)
        .attr("y",  90 + 25*j)
        .attr('text-anchor', 'left')
        .attr("font-size", '10')
        .attr('fill', totalWidth <= 170 ? 'transparent' :'black')
        .text(parseInt(dataFiltered[i].Time)) //" " + dataFiltered[i].Source + " " +  dataFiltered[i].Destination + " "  + dataFiltered[i].Protocol + " " + dataFiltered[i].Info);

        chartEnter.append('line')
        .attr('x1', '50')
        .attr('x2', totalWidth-50)
        .attr('y1', 93 + 25*j)
        .attr('y2', 92 + 25*j)
        .attr('stroke', 'gray')

        chartEnter.append('text')
        .attr("x", 120)
        .attr("y",  90 + 25*j)
        .attr('text-anchor', 'left')
        .attr("font-size", '10')
        .attr('fill',  totalWidth <= 280 ? 'transparent' : 'black')
        .text(dataFiltered[i].Source )//+ " " +  dataFiltered[i].Destination + " "  + dataFiltered[i].Protocol + " " + dataFiltered[i].Info);

        chartEnter.append('text')
        .attr("x", 230)
        .attr("y",  90 + 25*j)
        .attr('text-anchor', 'left')
        .attr("font-size", '10')
        .attr('fill',  totalWidth <= 390 ? 'transparent' :'black')
        .text(dataFiltered[i].Destination )//+ " "  + dataFiltered[i].Protocol + " " + dataFiltered[i].Info);

        chartEnter.append('text')
        .attr("x", 340)
        .attr("y",  90 + 25*j)
        .attr('text-anchor', 'left')
        .attr("font-size", '10')
        .attr('fill',  totalWidth <= 440 ? 'transparent' :'black')
        .text(dataFiltered[i].Protocol) //+ " " + dataFiltered[i].Info);

        chartEnter.append('text')
        .attr("x", 400)
        .attr("y",  90 + 25*j)
        .attr('text-anchor', 'left')
        .attr("font-size", '10')
        .attr('fill',  totalWidth <= 490 ? 'transparent' :'black')
        .text(dataFiltered[i].Length)

        chartEnter.append('text')
        .attr("x", 440)
        .attr("y",  90 + 25*j)
        .attr('text-anchor', 'left')
        .attr("font-size", '10')
        .attr('fill',  totalWidth <= 500 ? 'transparent' :'black')
        .text(dataFiltered[i].Info.substring(0,60 + 0.23 * xFactor))
        .attr('font-size', '8');
      }
    }
    printdata()
      
}      