export const toggle = (parent, props) => {
    const {
        started,
        dragging,
        ended
    } = props;

    const chart = parent.selectAll('.toggle').data([null]);
    const chartEnter = chart
    .enter().append('g')
      .attr('class','togglegroup');

    const tog = chartEnter
        .append('circle')
        .attr('class', 'toggle')
        .attr('cx','750')
        .attr('cy','400')
        .attr('r',20)
        .attr('fill','#cce6ff');

    const drag = d3.drag()
        .on('start', started)
        .on('drag', dragging)
        .on('end', ended);


    tog.call(drag);
  
}