export const sliders = (parent, props) => {
    const {
        margin,
        startedSlideLeft,
        draggingSlideLeft,
        endedSlideLeft,
        startedSlideRight,
        draggingSlideRight,
        endedSlideRight,
        slideLx,
        slideRx,
    } = props;

    console.log(`translate(${margin.left},${margin.top})`)

    parent.selectAll('g.sliders').remove()

    const chart = parent.selectAll('g.sliders').data([null]);
    const chartEnter = chart
    .enter().append('g')
      .attr('class','sliders')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const slideLeft = chartEnter
        .append('circle')
        .attr('class', 'sliderL')
        .attr('cx', slideLx ? slideLx - margin.left : '50')
        .attr('cy', 740 - margin.top)
        .attr('r',3)
        .attr('fill','red');

    const slideRight = chartEnter
        .append('circle')
        .attr('class', 'sliderR')
        .attr('cx', slideRx ? slideRx - margin.left : '690')
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
    //slideLeft;
    //slideRight;
  
}