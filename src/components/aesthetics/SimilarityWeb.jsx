import React, { useEffect, useState } from 'react';

import {
  event,
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  scaleOrdinal,
  schemeCategory10,
  select,
} from 'd3';

const color = scaleOrdinal(schemeCategory10);

export default (props) => {
  const [bboxX, setBboxX] = useState(0);
  const [bboxY, setBboxY] = useState(0);
  const [bboxWidth, setBboxWidth] = useState(0);
  const [bboxHeight, setBboxHeight] = useState(0);

  useEffect(() => {
    if(!props.aestheticData) {
      return;
    }

    const rootAesthetic = {
      id: props.aestheticData.name,
      group: 1,
      urlName: props.aestheticData.urlName,
      type: 'You are here',
    };

    const nodes = props.aestheticData.similarTo.reduce((accumulator, similarAesthetic) => {
      accumulator.push({
        id: similarAesthetic.name,
        group: 2,
        urlName: similarAesthetic.urlName,
        type: similarAesthetic.type,
      });

      return accumulator;
    }, [ rootAesthetic ]).map(n => Object.create(n));

    const links = props.aestheticData.similarTo.reduce((accumulator, similarAesthetic) => {
      accumulator.push({
        source: props.aestheticData.name,
        target: similarAesthetic.name,
      });

      return accumulator;
    }, []).map(l => Object.create(l));

    const simulation = forceSimulation(nodes)
      .force('link', forceLink(links).id(d => d.id))
      .force('charge', forceManyBody())
      .force('center', forceCenter(0, 0));

    const svg = select('#graphCanvas');

    const link = svg.selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2);

    let nodeGroup = svg.selectAll('.node')
      .data(nodes)
      .enter();

    const centerNode = nodeGroup.select(function(d) {
      return d.group === 1 ? this : null;
    })
      .insert('g');

    const relatedNode = nodeGroup.select(function(d) {
      return d.group !== 1 ? this : null;
    })
      .insert('a')
      .attr('href', d => `/aesthetics/${d.urlName}`);

    nodeGroup = centerNode.merge(relatedNode);

    const nodeCircle = nodeGroup.insert('circle')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .attr('r', 5)
      .attr('fill', d => color(d.group));

    const tooltip = select('body')
      .append('div')
      .classed('tooltip', true)
      .style('visibility', 'hidden');

    nodeCircle.on('mouseover', d => (
        tooltip.text(d.type)
          .style('visibility', 'visible')
      ))
      .on('mousemove', d => (
        tooltip.style('top', `${event.pageY - 16}px`)
          .style('left', `${event.pageX + 16}px`)
      ))
      .on('mouseout', d => (
        tooltip.style('visibility', 'hidden')
      ));

    nodeGroup.append('text')
      .attr('dx', 8)
      .attr('dy', '0.35em')
      .text(d => d.id);

    simulation.on('tick', () => {
      link.attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      nodeGroup.attr('transform', d => `translate(${d.x}, ${d.y})`);

      const graphCanvas = document.getElementById('graphCanvas');

      if(graphCanvas) {
        const bbox = graphCanvas.getBBox()

        setBboxX(bbox.x);
        setBboxY(bbox.y);
        setBboxWidth(bbox.width);
        setBboxHeight(bbox.height);
      }
    });
  }, [ props.aestheticData ]);

  return (
    <svg id="graphCanvas" viewBox={`${bboxX} ${bboxY} ${bboxWidth} ${bboxHeight}`}></svg>
  );
};
