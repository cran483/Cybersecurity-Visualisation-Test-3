export const matrix = (parent, props) => {
    const {
        data,
        networkContent,
        margin,
        onSourceSelected,
        onDestinationSelected,
        filterWidth,
        selectedProtocol,
        selectedEnd,
        selectedStart,
        normalised,
        risk,
        vulnerability,
        setSrcAddresses,
        setDstAddresses,
        normalisedMatrix,
        littleUpdate,
        selectedSource,
        selectedDestination,
        rowsRemoved,
        minByte,
        maxByte,
    } = props;
    

    const totalHeight = +parent.attr('height') - margin.top - margin.bottom;
    const totalWidth = +parent.attr('width') - margin.left - margin.right - filterWidth;
    let wholeRisk;
    let maxN = 0
    console.log(data)
    console.log(networkContent)

    if(!littleUpdate){parent.selectAll('g.matrix').remove()}

    //Filtering of data
    let dataFiltered = selectedProtocol ? selectedProtocol == 'OTHER' ? data.filter(function(d){return !(d.Protocol == "TCP" || d.Protocol == "DNS" || d.Protocol == "MQTT" || d.Protocol == "ARP")}) : selectedProtocol == 'ALL PROTOCOLS' ? data : data.filter(function(d){return d.Protocol == selectedProtocol}) : data //Filtering for protocol
    dataFiltered = selectedEnd ? dataFiltered.filter(function(d){return d.Time <= selectedEnd}) : dataFiltered //Filtering for below right slider
    dataFiltered = selectedStart ? dataFiltered.filter(function(d){return d.Time >= selectedStart}) : dataFiltered //Filtering for after left slider
    dataFiltered = minByte ? dataFiltered.filter(function(d){return d.Length <= minByte}) : dataFiltered
    dataFiltered = maxByte ? dataFiltered.filter(function(d){return d.Length >= maxByte}) : dataFiltered
    

    // Chart taking care of inner margins
    const chart = parent.selectAll('matrix').data([null]);
    const chartEnter = chart.enter().append('g').attr('class','matrix').attr('transform', `translate(${margin.left},${margin.top})`);

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
        .attr("y", "0")
        .attr('width', totalWidth)
        .attr('height', totalHeight-50)
        .attr('fill', " #cce6ff");
      
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
        .attr("y", "0")
        .attr('width', totalWidth - 100)
        .attr('height', totalHeight - 100)
        .attr('fill', "rgb(255, 255, 255)")
        .attr('transform', 'translate(50,60)');
      
      chartEnter
        .append('text')
        .attr('class','chart-title')
        .attr('text-anchor', normalised ? 'end' : 'middle')
        .attr('x', normalised ? 2.5*totalWidth/4 : totalWidth/2)
        .attr('y', '30')
        .text(((selectedProtocol && selectedProtocol != 'All protocols') ? selectedProtocol + ' ' : '') + 'Packets Sent Between Addresses' + (normalised ? ' (Compared to Average)' : ''))
      
      if (!normalised){
        for (let i = 0; i<40; i++){
          chartEnter
          .append('rect')
          .attr('x', (totalWidth - 200) + i*(175/40))
          .attr('y', '20')
          .attr('width', 175/40)
          .attr('height', '20')
          .attr('fill', 'rgb(255,' + (255 - i*6.4) + ',' + (255 - i*6.4) + ')')
        }
        chartEnter
          .append('rect')
          .attr('x',totalWidth - 200)
          .attr('y', '20')
          .attr('width', '175')
          .attr('height', '20')
          .attr('fill', 'transparent')
          .attr('stroke', 'black')

        chartEnter
          .append('text')
          .attr('class','key-title')
          .attr('text-anchor', 'middle')
          .attr('x', totalWidth - 200)
          .attr('y', '15')
          .text('0')
          .attr('font-size', '11')

        chartEnter
          .append('text')
          .attr('class','key-title')
          .attr('text-anchor', 'middle')
          .attr('x', totalWidth - 200 + 175)
          .attr('y', '15')
          .text('500')
          .attr('font-size', '11')
      }
      if (normalised){
        for (let i = 0; i<20; i++){
          chartEnter
          .append('rect')
          .attr('x', (totalWidth - 200) + i*(175/40))
          .attr('y', '20')
          .attr('width', 175/40)
          .attr('height', '20')
          .attr('fill', 'rgb(' + (0 + i*12.8) + ',' + (0 + i*12.8)  + ',255)')
        }
        for (let i = 20; i<40; i++){
          chartEnter
          .append('rect')
          .attr('x', (totalWidth - 200) + i*(175/40))
          .attr('y', '20')
          .attr('width', 175/40)
          .attr('height', '20')
          .attr('fill', 'rgb(255,' + (255 - (i-20)*12.8) + ',' + (255 - (i-20)*12.8)  + ')')
        }
        chartEnter
          .append('text')
          .attr('class','key-title')
          .attr('text-anchor', 'middle')
          .attr('x', totalWidth - 200)
          .attr('y', '15')
          .text('-5x')
          .attr('font-size', '11')

        chartEnter
          .append('text')
          .attr('class','key-title')
          .attr('text-anchor', 'middle')
          .attr('x', totalWidth - 200 + 175)
          .attr('y', '15')
          .text('500x')
          .attr('font-size', '11')

        chartEnter
          .append('text')
          .attr('class','key-title')
          .attr('text-anchor', 'middle')
          .attr('x', totalWidth - 200 + 87.5)
          .attr('y', '15')
          .text('0x')
          .attr('font-size', '11')
      }
      
      chartEnter
        .append('rect')
        .attr('x',totalWidth - 200)
        .attr('y', '20')
        .attr('width', '175')
        .attr('height', '20')
        .attr('fill', 'transparent')
        .attr('stroke', 'black')

      chartEnter
        .append('text')
        .attr('class','chart-subtitle')
        .attr('text-anchor', 'middle')
        .attr('x', totalWidth/2)
        .attr('y', totalHeight - 20)
        .attr('font-size','11')
        .text('Source');

      chartEnter
        .append('text')
        .attr('class','chart-subtitle')
        .attr('text-anchor', 'middle')
        .attr('x', '15')
        .attr('y', totalHeight/2)
        .attr('font-size','11')
        .text('Destination')
        //ttr('transform','translate(${totalWidth/2},${totalHeight})')
        .attr('transform', 'rotate(270,15,' + totalHeight/2 + ')')
    }
    if(!littleUpdate){setFormat()}

    const SrcAddresses = data.map( d => d.Source); // unique src and dst addresses
    let SetSrcAddresses = [...new Set(SrcAddresses)];
    setSrcAddresses(SetSrcAddresses)
    console.log(SetSrcAddresses)

    const DstAddresses = d3.map(data, d => d.Destination);
    let SetDstAddresses = [...new Set(DstAddresses)];
    setDstAddresses(SetDstAddresses)

    let listSrcAddresses = [...SetSrcAddresses]
    //console.log(listSrcAddresses)

    const oldSrcAddresses = SetSrcAddresses
    const oldDstAddresses = SetDstAddresses
    function oldSrcIndex(j){
      for (let i = 0; i < oldSrcAddresses.length; i++) {
        if (oldSrcAddresses[i] == SetSrcAddresses[j]){return i}
      }
      console.log('not found')
    }
    function oldDstIndex(j){
      for (let i = 0; i < oldDstAddresses.length; i++) {
        if (oldDstAddresses[i] == SetDstAddresses[j]){return i}
      }
      console.log('not found')
    }
    if (rowsRemoved){
      //for (let i in SetSrcAddresses){console.log((dataFiltered.filter(function(d){return d.Source == SetSrcAddresses[i]})))}
      SetSrcAddresses =  SetSrcAddresses.filter(function(e){return dataFiltered.filter(function(d){return d.Source == e}).length >= 1})
      console.log(SetSrcAddresses)
      //SetSrcAddresses = [...new Set(SetSrcAddressesSrcAddresses)]
      setSrcAddresses(SetSrcAddresses)
      listSrcAddresses = [...SetSrcAddresses]

      SetDstAddresses = SetDstAddresses.filter(function(e){return dataFiltered.filter(function(d){return d.Destination == e}).length >= 1})
      setDstAddresses(SetDstAddresses)
    }

    function NodeSource(d,di){return dataFiltered.filter(function(e){return e.Source == d && e.Destination == di}).length};
    function normalAmount(srcI,destJ){return normalisedMatrix[oldSrcIndex(srcI)][oldDstIndex(destJ)] * data[data.length-1].Time}
    function normalisedDiff(srcI,destJ){const j = NodeSource(SetSrcAddresses[srcI],SetDstAddresses[destJ]) - normalAmount(srcI,destJ); /*if (srcI == 0) {console.log(destJ + " " + j + " " + NodeSource(SetSrcAddresses[srcI],SetDstAddresses[destJ]) + " difference")}*/; return j}
    function NodeSourceNormalised(srcI,destJ){const k =  normalisedDiff(srcI,destJ) / (normalAmount(srcI,destJ) + 0.1); return k} //check logic

    function getRisk(d){ 
      let addr;
      for( let i=0; i< (networkContent.length - 1); i++){
        if (networkContent[i].Address == d){
           console.log('found')
           addr = networkContent[i]
          }
      }
      let result = addr ? addr.risk : 1
      return result
    }
    function getVulnerability(d){ 
      let addr;
      for( let i=0; i< (networkContent.length - 1); i++){
        if (networkContent[i].Address == d){
           console.log('found')
           addr = networkContent[i]
          }
      }
      let result = addr ? addr.vulnerability : 1
      return result
    }

    // Build X scales and axis:
   
    var x = d3.scaleBand()
    .range([50, totalWidth - 50])
    .domain(SetSrcAddresses)
    .padding(0.01);
    
    var y = d3.scaleBand()
    .range([totalHeight -50, margin.top + 50])
    .domain(SetDstAddresses)
    .padding(0.01);

    // Build color scale
    var myColor = d3.scaleLog().base(4)//scaleLinear()//scaleLog().base(100)
    .range(["white", 'rgb(255, 0, 0)'])//"#69b3a2"])
    .domain([1,maxN > 0 ? maxN : 1000]) 

    /*var myColorNormalised =  d3.scaleSequential(d3.interpolateRdBu)//scaleLog().base(100)
    //.range(["white", 'rgb(255, 0, 0)'])//"#69b3a2"])
    .domain([-5,5])*/

    var myColorNormalised =  d3.scaleDiverging(["blue", "white", "red"])//scaleLog().base(100)
    //.range(["white", 'rgb(255, 0, 0)'])//"#69b3a2"])
    .domain([-5,0,500])

    let riskWidthArray = [];
    const totalRisk = () => {
      let cTotal = 0;
      for (let i = 0; i < SetSrcAddresses.length; i++ ){
        //console.log(networkContent[i].risk)
        cTotal += getRisk(SetSrcAddresses[i])
        riskWidthArray.push(cTotal)
      }
      return cTotal
    }
    wholeRisk = totalRisk()
    const totalVulnerability = () => {
      let cTotal = 0;
      for (let i = 0; i < SetDstAddresses.length; i++ ){
        //console.log(networkContent[i].risk)
        cTotal += getVulnerability(SetDstAddresses[i])
      }
      return cTotal
    }
    let wholeVulnerability = totalVulnerability()

    
    const returnWidth = d => {
      //console.log(networkContent)
      //console.log(d)
      const name = networkContent.filter(function(e){return e.Address == d})
      //console.log(name)
      //console.log(name.length)
      //console.log(name[0] ? name[0].risk : 0)
      return name[0] ? name[0].risk : 0
    }
    let k = 0;
    const dataEnter = () => {
    const chartRectEnter = chartEnter.selectAll().data(SetSrcAddresses)
    if (!risk && !vulnerability){
      let currentWidth = 50
      let j = 0;
      for (let i = 0; i < SetDstAddresses.length; i++) {
          //console.log(j + "j" + i + "i")
          if(!littleUpdate){
          chartRectEnter
          .enter()
          .append("rect")
          .attr('class', 'matrixRect')
          .attr("transform", "translate(0,0)")
          .attr("x", risk ? currentWidth : function(d) {return x(d) })
          .attr("y", y(SetDstAddresses[i]) )
          .attr("width", function(d){ let cWidth = risk ? (totalWidth-100)*returnWidth(d)/wholeRisk || x.bandwidth() : x.bandwidth() ; currentWidth += cWidth; /*nsole.log("current width : " + currentWidth + " " + cWidth);*/ return cWidth;})
          .attr("height", y.bandwidth() )
          .style("fill", function(d) {normalised ? {} : k = NodeSource(d,SetDstAddresses[i]) ; maxN = Math.max(maxN,k); return normalised ?  myColorNormalised(NodeSourceNormalised(listSrcAddresses.indexOf(d),i)) : myColor(k) } )   
          //.style("stroke", d => d == selectedSource && SetDstAddresses[i] == selectedDestination ? 'black' : 'transparent')
          .on('mousemove',(event,d) => {
            const total = NodeSource(d,SetDstAddresses[i])
              ? ` <strong>${NodeSource(d,SetDstAddresses[i])}</strong> total packets from ${d} to ${SetDstAddresses[i]}`
              : `0 packets from <strong> ${d} to ${SetDstAddresses[i]}`;
            const factor = normalised 
              ? ` <strong>${NodeSourceNormalised(listSrcAddresses.indexOf(d),i).toFixed(2)}<strong>x more packets per second than average `
              : ' '
            d3.select('#tooltip')
              .style('display','block')
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY + 10) + 'px')
              .html(`
                <div>${total + "  " + factor}</div>
                `);
          })
          .on('mouseleave',() => {
            d3.select('#tooltip').style('display','none');
          })
          .on('click', (event,d) => {onSourceSelected(event,d); onDestinationSelected(SetDstAddresses[i]) }) 

      j+=1
      }}
    
      chartRectEnter
      .enter()
      .append("rect")
      .attr('class', 'SourceRect')
      .attr("transform", "translate(0,0)")
      .attr("x", function(d) { return x(d) })
      .attr("y", y(SetDstAddresses[0]) + y.bandwidth() )
      .attr("width", x.bandwidth() )
      .attr("height", 12.5 )
      .attr('fill', d => d == selectedSource ? 'blue':'black')
      .attr('stroke','white')
      .on('mousemove',(event,d) => {
        /*const total = NodeSource(d,SetDstAddresses[i])
          ? ` <strong>${NodeSource(d,SetDstAddresses[i])}</strong> total packets from ${d} to ${SetDstAddresses[i]}`
          : `0 packets from <strong> ${d} to ${SetDstAddresses[i]}`;*/
        d3.select('#tooltip')
          .style('display','block')
          .style('left', (event.pageX + 30) + 'px')
          .style('top', (event.pageY + 20) + 'px')
          .html(`
            <div>Address: ${d}</div>
            `);
      })
      .on('mouseleave',() => {
        d3.select('#tooltip').style('display','none');
      })
      .on('click', (event,d) => {onSourceSelected(event,d); })

      chartEnter.selectAll().data(SetDstAddresses)
      .enter()
      .append("rect")
      .attr('class', 'DestinationRect')
      .attr("transform", "translate(0,0)")
      .attr("x", x(SetSrcAddresses[0])- 25)//function(d) { return x(d) })
      .attr("y", function(d) {return y(d)})//y(SetDstAddresses[0]) + y.bandwidth() )
      .attr("width", 25 )
      .attr("height", y.bandwidth() )
      .attr('fill',d => d == selectedDestination ? 'yellow':'black')
      .attr('stroke','white')
      .on('mousemove',(event,d) => {
        /*const total = NodeSource(d,SetDstAddresses[i])
          ? ` <strong>${NodeSource(d,SetDstAddresses[i])}</strong> total packets from ${d} to ${SetDstAddresses[i]}`
          : `0 packets from <strong> ${d} to ${SetDstAddresses[i]}`;*/
        d3.select('#tooltip')
          .style('display','block')
          .style('left', (event.pageX + 30) + 'px')
          .style('top', (event.pageY + 20) + 'px')
          .html(`
            <div>Address: ${d}</div>
            `);
      })
      .on('mouseleave',() => {
        d3.select('#tooltip').style('display','none');
      })
      .on('click', (event,d) => { onDestinationSelected(d)})
    }
    }
    dataEnter()   

    const dataEnterWeight = () => {
      //wholeVulnerability
      const scaleWidth = (d) => (totalWidth - 100) * (getRisk(d) / wholeRisk)
      const scaleHeight = (d) => (totalHeight - 110) * (getVulnerability(d) / wholeVulnerability)
      //let currentWidth = 0
      //let currentHeight = 0
      if (risk || vulnerability){
      let currentWidth = 50
      for (let i = 0; i < SetSrcAddresses.length; i++) {
        let currentHeight = totalHeight - 50
        for (let j = 0; j < SetDstAddresses.length; j++) {
            if (i==0){
              chartEnter
              .append("rect")
              .attr('class', 'DestinationRect')
              .attr("transform", "translate(0,0)")
              .attr("x", x(SetSrcAddresses[0])- 25)//function(d) { return x(d) })
              .attr("y", vulnerability ? currentHeight - scaleHeight(SetDstAddresses[j]): y(SetDstAddresses[j]))//y(SetDstAddresses[0]) + y.bandwidth() )
              .attr("width", 25 )
              .attr("height", () => {if (vulnerability){return scaleHeight(SetDstAddresses[j])} else{ return y.bandwidth()}})
              .attr('fill', SetDstAddresses[j] == selectedDestination ? 'yellow' : 'black')
              .attr('stroke','white')
              .on('mousemove',(event,d) => {
                const total = NodeSource(SetSrcAddresses[i],SetDstAddresses[j])
                  ? ` <strong>${NodeSource(SetSrcAddresses[i],SetDstAddresses[j])}</strong> total packets from ${SetSrcAddresses[i]} to ${SetDstAddresses[j]}`
                  : `0 packets from <strong> ${SetSrcAddresses[i]} to ${SetDstAddresses[j]}`;
                d3.select('#tooltip')
                  .style('display','block')
                  .style('left', (event.pageX + 30) + 'px')
                  .style('top', (event.pageY + 20) + 'px')
                  .html(`
                    <div>Address: ${SetDstAddresses[j]}</div>
                    `);
              })
              .on('mouseleave',() => {
                d3.select('#tooltip').style('display','none');
              })
              .on('click', (event,d) => { onDestinationSelected(SetDstAddresses[j])})
            }
            //console.log(j + "j" + i + "i"
            if(!littleUpdate){
            chartEnter
            .append("rect")
            .attr('class', 'matrixRect')
            .attr("transform", "translate(0,0)")
            .attr("x", risk ? currentWidth : x(SetSrcAddresses[i]))
            .attr("y", vulnerability ? currentHeight - scaleHeight(SetDstAddresses[j]): y(SetDstAddresses[j]) )
            .attr("width", () => {if (risk) {if(j===SetDstAddresses.length-1){currentWidth += scaleWidth(SetSrcAddresses[i])}; return scaleWidth(SetSrcAddresses[i])} else { return x.bandwidth()}})
            .attr("height", () => {if (vulnerability){currentHeight -= scaleHeight(SetDstAddresses[j]); return scaleHeight(SetDstAddresses[j])} else{ return y.bandwidth()}})
            .style("fill", function(d) {return normalised ?  myColorNormalised(NodeSourceNormalised(i,j)): myColor(NodeSource(SetSrcAddresses[i],SetDstAddresses[j])) })
            //.style('stroke','black')
            .on('mousemove',(event,d) => {
              const total = NodeSource(SetSrcAddresses[i],SetDstAddresses[j])
                ? ` <strong>${NodeSource(SetSrcAddresses[i],SetDstAddresses[j])}</strong> total packets from ${SetSrcAddresses[i]} to ${SetDstAddresses[i]}`
                : `0 packets from <strong> ${SetSrcAddresses[i]} to ${SetDstAddresses[j]}`;
              const factor = normalised 
                ? ` <strong>${NodeSourceNormalised(i,j).toFixed(2)}<strong>x more packets per second than average`
                : ' '
              d3.select('#tooltip')
                .style('display','block')
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY + 10) + 'px')
                .html(`
                  <div>${total + "  " + factor}</div>
                  `);
            })
            .on('mouseleave',() => {
              d3.select('#tooltip').style('display','none');
            })
            .on('click', (event,d) => {onSourceSelected(event,SetSrcAddresses[i]); onDestinationSelected(SetDstAddresses[i]) }) 
            }
            if (j == 0) {
              chartEnter
              .append("rect")
              .attr('class', 'SourceRect')
              .attr("transform", "translate(0,0)")
              .attr("x",  risk ? currentWidth : x(SetSrcAddresses[i]))
              .attr("y", y(SetDstAddresses[0]) + y.bandwidth() )
              .attr("width", () => {if (risk) {return scaleWidth(SetSrcAddresses[i])} else { return x.bandwidth()}})
              .attr("height", 12.5 )
              .attr('fill', SetSrcAddresses[i] == selectedSource ? 'blue' : 'black')
              .attr('stroke','white')
              .on('mousemove',(event,d) => {
                /*const total = NodeSource(d,SetDstAddresses[i])
                  ? ` <strong>${NodeSource(d,SetDstAddresses[i])}</strong> total packets from ${d} to ${SetDstAddresses[i]}`
                  : `0 packets from <strong> ${d} to ${SetDstAddresses[i]}`;*/
                d3.select('#tooltip')
                  .style('display','block')
                  .style('left', (event.pageX + 30) + 'px')
                  .style('top', (event.pageY + 20) + 'px')
                  .html(`
                    <div>Address: ${SetSrcAddresses[i] + " Risk: "  + getRisk(SetSrcAddresses[i])}</div>
                    `);
              })
              .on('mouseleave',() => {
                d3.select('#tooltip').style('display','none');
              })
              .on('click', (event,d) => {onSourceSelected(event,SetSrcAddresses[i]); })
            }
    
            }
        
      }
    }}
    dataEnterWeight()
    

} 