export const network = (parent,props) => {
    const{
        data,
        margin,
        filterWidth,
        updated,
        floorplan,
        selectedSource,
        selectedDestination,
        onSourceSelected,
        onDestinationSelected,
        resetAddresses
    } = props;

    const height = +parent.attr('height') - margin.top - margin.bottom; //change to totalWidth
    //console.log(height)
    const width = +parent.attr('width') - margin.left - margin.right - filterWidth;
    let isSourceChosen = false
    let isDestinationChosen = false

    let widthFactor = width / 750
    let heightFactor = height / 400

    parent.selectAll('g.network').remove()
    // parent.selectAll('g.node').remove()

    const chart = parent.selectAll('network').data([null]);

    const chartEnter = chart
    .enter().append('g')
      .attr('class','network')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const setFormat = () => {
      chartEnter
        .append('rect')
        .attr('class', 'background')
        .attr("x", "0")
        .attr("y", "0")
        .attr("rx", "50")
        .attr("ry", "50")
        .attr('width', width)
        .attr('height', height)
        .attr('fill', " #cce6ff");
      
      chartEnter
        .append('rect')
        .attr('class', 'background')
        .attr("x", "0")
        .attr("y", "0")
        .attr('width', width)
        .attr('height', height-100)
        .attr('fill', " #cce6ff");
      
      chartEnter
        .append('rect')
        .attr('class', 'background')
        .attr("x", "0")
        .attr("y", "0")
        .attr('width', width-100)
        .attr('height', height)
        .attr('fill', " #cce6ff");
      
      chartEnter
        .append('text')
        .attr('class','chart-title')
        .attr('text-anchor', 'middle')
        .attr('x', width/2)
        .attr('y', '30')
        .text('Known Network')

      
      
      chartEnter
        .append('rect')
        .attr('x', width - 120)
        .attr('y', '20')
        .attr('width', '10')
        .attr('height', '10')
        .attr('fill', widthFactor <= 3/4 ? 'transparent' : 'red')
        .attr('stroke', widthFactor <= 3/4 ? 'transparent' : 'black')
 
      chartEnter
        .append('text')
        .attr('class','key-title')
        .attr('text-anchor', 'left')
        .attr('x', width - 105)
        .attr('y', '27.5')
        .text('Medical Device')
        .attr('font-size', '9')
        .attr('fill', widthFactor <= 3/4 ? 'transparent' : 'black')

      chartEnter
        .append('rect')
        .attr('x', width - 120)
        .attr('y', '40')
        .attr('width', '10')
        .attr('height', '10')
        .attr('fill', widthFactor <= 3/4 ? 'transparent' :'black')
        .attr('stroke',  widthFactor <= 3/4 ? 'transparent' : 'grey')

      chartEnter
        .append('text')
        .attr('class','key-title')
        .attr('text-anchor', 'left')
        .attr('x', width - 105)
        .attr('y', '47.5')
        .text('Intermediate Device')
        .attr('font-size', '9')
        .attr('fill', widthFactor <= 3/4 ? 'transparent' : 'black')
      
      chartEnter
        .append('rect')
        .attr('x', width - 120)
        .attr('y', '60')
        .attr('width', '10')
        .attr('height', '10')
        .attr('fill', widthFactor <= 3/4 ? 'transparent' : 'blue')
        .attr('stroke', widthFactor <= 3/4 ? 'transparent' : 'grey')


      chartEnter
        .append('text')
        .attr('class','key-title')
        .attr('text-anchor', 'left')
        .attr('x', width - 105)
        .attr('y', '67.5')
        .text('Selected Source')
        .attr('font-size', '9')
        .attr('fill', widthFactor <= 3/4 ? 'transparent' : 'black')
      
      chartEnter
        .append('rect')
        .attr('x', width - 120)
        .attr('y', '80')
        .attr('width', '10')
        .attr('height', '10')
        .attr('fill', widthFactor <= 3/4 ? 'transparent' : 'rgb(255, 200, 0)')
        .attr('stroke',widthFactor <= 3/4 ? 'transparent' : 'grey')

      chartEnter
        .append('text')
        .attr('class','key-title')
        .attr('text-anchor', 'left')
        .attr('x', width - 105)
        .attr('y', '87.5')
        .text('Selected Destination')
        .attr('font-size', '9')
        .attr('fill', widthFactor <= 3/4 ? 'transparent' : 'black')

      chartEnter
        .append('rect')
        .attr('class', 'reset')
        .attr("x", width - 120)
        .attr("y", 110)
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('width', 'Select Source'.length*5 + 30)
        .attr('height', "15")
        .attr('fill', widthFactor <= 3/4 ? 'transparent' :'rgb(0, 8, 255)')
        //.attr('stroke', 'rgb(0,0,0)')
        .on("click", function(d) {isSourceChosen = true; isDestinationChosen = false;})
        
      chartEnter
        .append('text')
        .attr("x", width - 120 + 'Select Source'.length*5/2 + 15)
        .attr("y", 120)
        .attr('text-anchor', 'middle')
        .attr("font-size", '9')
        .attr('fill', widthFactor <= 3/4 ? 'transparent' : 'rgb(255, 255, 255)')
        .text('Select Source');

      chartEnter
        .append('rect')
        .attr('class', 'reset')
        .attr("x", width - 120)
        .attr("y",  130)
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('width', 'Select Destination'.length*5 + 15)
        .attr('height', '15')
        .attr('fill', widthFactor <= 3/4 ? 'transparent' :'rgb(255, 200, 0)')
        //.attr('stroke', 'rgb(0,0,0)')
        .on("click", function(d) {isSourceChosen = false; isDestinationChosen = true;})
        
      chartEnter
        .append('text')
        .attr("x", width - 120 + 'Select Destination'.length*5/2 + 7.5)
        .attr("y", 140)
        .attr('text-anchor', 'middle')
        .attr("font-size", '9')
        .attr('fill', widthFactor <= 3/4 ? 'transparent' : 'rgb(0,0,0)')
        .text('Select Destination');
      
    
      chartEnter
        .append('rect')
        .attr('class', 'reset')
        .attr("x", width - 120)
        .attr("y",  150)
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('width', 'Reset'.length*5 + 15)
        .attr('height', "15")
        .attr('fill', widthFactor <= 3/4 ? 'transparent' : 'rgb(255, 255, 255)')
        //.attr('stroke', 'rgb(0,0,0)')
        .on("click", function(d) {resetAddresses()})
        
      chartEnter
        .append('text')
        .attr("x", width - 120 + 'Reset'.length*5/2 + 7.5)
        .attr("y", 160)
        .attr('text-anchor', 'middle')
        .attr("font-size", '9')
        .attr('fill', widthFactor <= 3/4 ? 'transparent' :'rgb(0,0,0)')
        .text('Reset');
    }
    setFormat()

    const setFloorPlan = () => {
      for (let j = 0; j < 4 ; j++){
        for (let i = 0; i < 4; i++){
          chartEnter
            .append('rect')
            .attr('class', 'room')
            .attr('x', (50 + (i*60))*widthFactor)
            .attr('y', j == 2 ? (100 +(j*50))*heightFactor : j == 3 ? (150 +(j*50))*heightFactor : (50 + (j* 100))*heightFactor)
            .attr('width', 60*widthFactor)
            .attr('height', 50*heightFactor)
            .attr('fill', 'transparent')
            .attr('stroke', 'black')
          //console.log(i)
        }
      }
      chartEnter
        .append('rect')
        .attr('class', 'room')
        .attr('x', 320*widthFactor)
        .attr('y', 50*heightFactor)
        .attr('width', 200*widthFactor)
        .attr('height', 150*heightFactor)
        .attr('fill', 'transparent')
        .attr('stroke', 'black')

      chartEnter
        .append('rect')
        .attr('class', 'room')
        .attr('x', 470*widthFactor)
        .attr('y', 50*heightFactor)
        .attr('width', 50*widthFactor)
        .attr('height', 75*heightFactor)
        .attr('fill', 'transparent')
        .attr('stroke', 'black')

      for (let i = 0; i < 4; i++){
        chartEnter
        .append('rect')
        .attr('class', 'room')
        .attr('x', (320 + 75*i)*widthFactor)
        .attr('y', 250*heightFactor)
        .attr('width', 75*widthFactor)
        .attr('height', 100*heightFactor)
        .attr('fill', 'transparent')
        .attr('stroke', 'black')
      }
    }
    if (floorplan){
      setFloorPlan()
    }
    //setFormat()
    const chartMerged = chartEnter //chart.merge(chartEnter);

    const nodeById = new Map(data.nodes.map(node => [node.id, node]));

    
    if (!updated){
      data.links.forEach(link => { //GPT
          link.source = nodeById.get(link.source);
          //console.log(link.source)
          link.target = nodeById.get(link.target);
          //console.log(link.target)
          if (!link.source || !link.target) {
              console.error("Invalid link:", link);
          }
      });
    }

    if (updated){
      data.nodes.forEach(node => { 
          node.x = 375;
          node.y = 200;
          })
    };
    
    
    const simulation = d3.forceSimulation()
        .force('link', d3.forceLink(data.links).id(d => d.id).strength(0.3))
        .force('charge', d3.forceManyBody().strength(-5))
        .force('center', d3.forceCenter(width/2, height/2));
    
    //simulation.alpha(0.5).restart()
    
    //console.log(data)
    //console.log(data.nodes)
    //console.log(data.links)
    
    simulation.nodes(data.nodes);
    simulation.force('link').links(data.links);

    const links = chartMerged.selectAll('line').data(data.links)
        .join('line')
        .attr("stroke", "gray");
    
    const nodes = chartMerged.selectAll('circle').data(data.nodes)
        .join('circle')
        .attr('r', d =>  d.Address == selectedDestination ? 5 : 5)
        .attr('fill', d => d.Address && d.Address == selectedDestination ? 'rgb(255, 200, 0)' : d.Address && d.Address == selectedSource ? 'rgb(0, 30, 255)' : d.medical_device_flag ? 'red' : 'rgb(0, 0, 0)' )
        //.attr('stroke', d => d.Address == selectedDestination ? 'rgb(0, 255, 4)' : 'transparent')
        //.attr('stroke-width', '3')
        .attr('class','node')
        .on('mousemove',(event,d) => {
            const total = d
              ? `${d.id} , Address: ${d.Address ? d.Address : 'null'}`
              : `0 packets from`;
            d3.select('#tooltip')
              .style('display','block')
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY + 10) + 'px')
              .html(`
                <div>${total}</div>
                `);
            //console.log('listening')
            //console.log(d)
          })
          .on('mouseleave',() => {
            d3.select('#tooltip').style('display','none');
          }) 
          .on('click',(event,d) => {
            if (isSourceChosen) { onSourceSelected(event, d.Address) }
            if (isDestinationChosen) { onDestinationSelected(d.Address) }

          });
          
    
    //console.log(data.nodes + " source")
    
    //simulation.alpha(0.5).restart()
    simulation.on('tick', () => {
        //console.log(nodes.data()); 
        //console.log("Tick update:", nodes.data().map(d => ({ id: d.id, x: d.x, y: d.y }))); //GPT
        links
            .attr('x1', d => floorplan ? (20 + d.source.xpos)*widthFactor :  d.source.x || 0)
            .attr('y1', d => floorplan ? d.source.ypos*heightFactor : d.source.y || 0)
            .attr('x2', d => floorplan ? (20 + d.target.xpos)*widthFactor : d.target.x || 0)
            .attr('y2', d => floorplan ? d.target.ypos*heightFactor : d.target.y || 0);
        nodes
          .attr("cx", function(d) {return floorplan ? (20 + d.xpos)*widthFactor :  Math.max(50, Math.min(width - 50, d.x)) ; })
          .attr("cy", function(d) {return floorplan ? d.ypos*heightFactor :  Math.max(50, Math.min(height - 50, d.y)); }) //https://stackoverflow.com/questions/69471719/force-network-to-fit-bounding-box-with-d3
            //.attr('cx', d => d.x || 0)
            //.attr('cy', d => d.y || 0)
    });

    //d3_force.stop()

}
