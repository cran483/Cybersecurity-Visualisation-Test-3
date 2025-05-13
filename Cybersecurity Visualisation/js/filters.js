export const filters = (parent,props) => {
    const{
        margin,
        protocols,
        onProtocolSelected,
        selectedProtocol,
        onSizeOrCountSelected,
        sizeSelected,
        floorplan,
        floorplanClick,
        normalised,
        normaliseClick,
        riskClick,
        vulnerabilityClick,
        risk,
        vulnerability,
        resetFilters,
        minByte,
        maxByte,
        onMinByteSelected,
        onMaxByteSelected,
        rowsRemoved,
        removeRows,
    } = props;


    parent.selectAll('g.filters').remove()

    const chart = parent.selectAll('filters').data([null]);
    const chartEnter = chart
    .enter().append('g')
      .attr('class','filters')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const setFormat = () => {
      chartEnter
        .append('rect')
        .attr('class', 'background')
        //.attr("x", "1495")
        //.attr("y", "10")
        .attr('width', "300")
        .attr('height', "780")
        .attr('fill', "rgb(140, 199, 255)");

      chartEnter
        .append('text')
        .attr('class','chart-title')
        .attr('text-anchor', 'middle')
        .attr('x', '150')
        .attr('y', '30')
        .text('Filters');

      chartEnter
        .append('text')
        .attr('class','chart-title')
        .attr('text-anchor', 'middle')
        .attr('x', '150')
        .attr('y', '340')
        .text('Settings');

      chartEnter
        .append('text')
        .attr('class','chart-title')
        .attr('text-anchor', 'left')
        .attr('x', '10')
        .attr('y', '200')
        .text('Packet Length');

      chartEnter
        .append('text')
        .attr('class','chart-title')
        .attr('text-anchor', 'left')
        .attr('x', '10')
        .attr('y', '360')
        .text('Network');

      chartEnter
        .append('text')
        .attr('class','chart-title')
        .attr('text-anchor', 'left')
        .attr('x', '10')
        .attr('y', '50')
        .text('Protocol');

      chartEnter
        .append('text')
        .attr('class','chart-title')
        .attr('text-anchor', 'left')
        .attr('x', '10')
        .attr('y', '410')
        .text('Heatmap');

      chartEnter
        .append('text')
        .attr('class','chart-title')
        .attr('text-anchor', 'left')
        .attr('x', '10')
        .attr('y', '520')
        .text('Barchart');

    }

    setFormat()

    const resetAll = () => {
      chartEnter
      .append('rect')
      .attr('class', 'reset')
      .attr("x", '200')
      .attr("y",  '19')
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('width', 'Reset All'.length*5 + 30)
      .attr('height', "15")
      .attr('fill', 'rgb(255, 255, 255)')
      .on("click",function(d) {
        resetFilters()})
    
      chartEnter
        .append('text')
        .attr("x", 200 + 'Reset All'.length*5/2 + 15)
        .attr("y",  '30')
        .attr('text-anchor', 'middle')
        .attr("font-size", '10')
        .attr('fill', 'rgb(0,0,0)')
        .text('Reset All');
    }
    resetAll()

    const setProtocols = () => {
      for (let i = 0; i < protocols.length; i++) {
        chartEnter
          .append('rect')
          .attr('class', 'button')
          .attr("x", '10')
          .attr("y",  20*i + 60)
          .attr('rx', 10)
          .attr('ry', 10)
          .attr('width', protocols[i].length*5 + 30)
          .attr('height', "15")
          .attr('fill', protocols[i] == selectedProtocol ?  'rgb(255, 106, 0)' : 'rgb(255, 0, 0)')
          .on("click", function(d) {
            onProtocolSelected(protocols[i])
            console.log(protocols[i], selectedProtocol + " match")
          });
        
        chartEnter
          .append('text')
          .attr("x", 10 + protocols[i].length*5/2 + 15)
          .attr("y",  20*i + 71)
          .attr('text-anchor', 'middle')
          .attr("font-size", '10')
          .attr('fill', 'white')
          .text(protocols[i]);
      }
    }
    setProtocols()

    let packetLengths = [10,50,100,500,1000]
    const setLengths = () => {
      for (let i = 0; i < packetLengths.length; i++) {
        chartEnter
          .append('rect')
          .attr('class', 'button')
          .attr("x", '10')
          .attr("y",  20*i + 210)
          .attr('rx', 10)
          .attr('ry', 10)
          .attr('width', (12+packetLengths[i].toString.length)*5 + 30)
          .attr('height', "15")
          .attr('fill', packetLengths[i] == minByte ? 'rgb(94, 0, 68)' : 'rgb(199, 0, 143)')
          .on("click", function(d) {
            onMinByteSelected(packetLengths[i])
          });
        
        chartEnter
          .append('text')
          .attr("x", 10 + (12+packetLengths[i].toString.length)*5/2 + 15)
          .attr("y",  20*i + 220)
          .attr('text-anchor', 'middle')
          .attr("font-size", '10')
          .attr('fill', 'white')
          .text("Under " + packetLengths[i] + " bytes");

        chartEnter
          .append('rect')
          .attr('class', 'button')
          .attr("x", '110')
          .attr("y",  20*i + 210)
          .attr('rx', 10)
          .attr('ry', 10)
          .attr('width', (10+packetLengths[i].toString.length)*5 + 30)
          .attr('height', "15")
          .attr('fill', packetLengths[i] == maxByte ? 'rgb(94, 0, 68)' : 'rgb(199, 0, 143)')
          .on("click", function(d) {
            onMaxByteSelected(packetLengths[i])
          });
        
        chartEnter
          .append('text')
          .attr("x", 110 + (10+packetLengths[i].toString.length)*5/2 + 15)
          .attr("y",  20*i + 220)
          .attr('text-anchor', 'middle')
          .attr("font-size", '10')
          .attr('fill', 'white')
          .text("Over " + packetLengths[i] + " bytes");
      }
    }
    setLengths()

    const countOrVolume = () => {
      const choices = ['Set by No. of Packets' , 'Set by Total Volume']
      for (let i = 0; i < choices.length; i++) {
        chartEnter
          .append('rect')
          .attr('class', 'button')
          .attr("x", '10')
          .attr("y",  530 + 20*i)
          .attr('rx', 10)
          .attr('ry', 10)
          .attr('width', choices[i].length*5 + 30)
          .attr('height', "15")
          .attr('fill', (sizeSelected && i==1 || !sizeSelected && i ==0) ? 'rgb(255, 85, 0)' :'rgb(255, 149, 0)')
          .on("click", function(d) {
            onSizeOrCountSelected(i)
            //console.log(protocols[i], selectedProtocol + " match")
          });

        chartEnter
          .append('text')
          .attr("x", 10 + choices[i].length*5/2 + 15)
          .attr("y",  540 + 20*i)
          .attr('text-anchor', 'middle')
          .attr("font-size", '10')
          .attr('fill', 'white')
          .text(choices[i]);
      }
    }
    countOrVolume()

    const setFloorplan = () => {
      chartEnter
        .append('rect')
        .attr('class', 'button')
        .attr("x", '10')
        .attr("y",  370)
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('width', 'Overlay On Floorplan'.length*5 + 30)
        .attr('height', "15")
        .attr('fill', (floorplan ? 'rgb(254, 113, 207)' :'rgb(238, 0, 255)'))
        .on("click", function(d) {
          floorplanClick()
  
        });
      chartEnter
        .append('text')
        .attr("x", 10 + 'Overlay on floorplan?'.length*5/2 + 15)
        .attr("y",  380)
        .attr('text-anchor', 'middle')
        .attr("font-size", '10')
        .attr('fill', 'white')
        .text('Overlay on Floorplan');
    }
    setFloorplan()

    const removeRowsButton = () => {
      chartEnter
      .append('rect')
      .attr('class', 'button')
      .attr("x", '10')
      .attr("y",  480)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('width', 'Remove null rows and columns'.length*5 + 30)
      .attr('height', "15")
      .attr('fill', (rowsRemoved ? 'rgb(185, 115, 255)' : 'rgb(0, 136, 255)'))
      .on("click", function(d) {
        removeRows()
      });
      chartEnter
        .append('text')
        .attr("x", 10 + 'Remove null rows and columns'.length*5/2 + 15)
        .attr("y",  490)
        .attr('text-anchor', 'middle')
        .attr("font-size", '10')
        .attr('fill', 'white')
        .text('Remove null rows and columns');
    }
    removeRowsButton()
    
    const normaliseByAverage = () => {
      chartEnter
      .append('rect')
      .attr('class', 'button')
      .attr("x", '10')
      .attr("y",  460)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('width', 'Normalise Against All-time Average'.length*5 + 30)
      .attr('height', "15")
      .attr('fill', (normalised ? 'rgb(185, 115, 255)' :'rgb(0, 136, 255)'))
      .on("click", function(d) {
        normaliseClick()

      });
    chartEnter
      .append('text')
      .attr("x", 10 + 'Normalise against all-time average'.length*5/2 + 15)
      .attr("y",  470)
      .attr('text-anchor', 'middle')
      .attr("font-size", '10')
      .attr('fill', 'white')
      .text('Normalise Against All-Time Average');
    }
    normaliseByAverage()

    const weightBySourceRisk = () => {
      chartEnter
      .append('rect')
      .attr('class', 'button')
      .attr("x", '10')
      .attr("y",  420)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('width', 'Weigh by Source Risk'.length*5 + 30)
      .attr('height', "15")
      .attr('fill', risk ? 'rgb(185, 115, 255)' :'rgb(0, 136, 255)')
      .on("click", function(d) {
        riskClick()
      });
      chartEnter
        .append('text')
        .attr("x", 10 + 'Weigh by Source Risk'.length*5/2 + 15)
        .attr("y",  430)
        .attr('text-anchor', 'middle')
        .attr("font-size", '10')
        .attr('fill', 'white')
        .text('Weigh by Source Risk');

    }
    weightBySourceRisk()
    const weightByDestinationVulnerability = () => {
      chartEnter
      .append('rect')
      .attr('class', 'button')
      .attr("x", '10')
      .attr("y",  440)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('width', 'Weigh by Destination Vulnerability'.length*5 + 30)
      .attr('height', "15")
      .attr('fill', vulnerability ? 'rgb(185, 115, 255)' : 'rgb(0, 136, 255)')
      .on("click", function(d) {
        vulnerabilityClick()
      });
      chartEnter
        .append('text')
        .attr("x", 10 + 'Weigh by Destination Vulnerability'.length*5/2 + 15)
        .attr("y",  450)
        .attr('text-anchor', 'middle')
        .attr("font-size", '10')
        .attr('fill', 'white')
        .text('Weigh by Destination Vulnerability');
    }
    weightByDestinationVulnerability()
}