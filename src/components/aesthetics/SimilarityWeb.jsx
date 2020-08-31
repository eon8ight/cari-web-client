import React, { useEffect } from 'react';

import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force';

import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

import {
  event,
  select,
} from 'd3-selection';

import { zoom } from 'd3-zoom';

const WIDTH = 500;
const HEIGHT = 100;

const color = scaleOrdinal(schemeCategory10);

export default (props) => {
  const data = props.aestheticData;

  useEffect(() => {
    if(!data) {
      return;
    }

    const rootAesthetic = {
      id: data.name,
      group: 1,
      urlName: data.urlName,
      type: 'You are here',
    };

    const nodes = data.similarTo.reduce((accumulator, similarAesthetic) => {
      accumulator.push({
        id: similarAesthetic.name,
        group: 2,
        urlName: similarAesthetic.urlName,
        type: similarAesthetic.type,
      });

      return accumulator;
    }, [ rootAesthetic ]).map(n => Object.create(n));

    const links = data.similarTo.reduce((accumulator, similarAesthetic) => {
      accumulator.push({
        source: data.name,
        target: similarAesthetic.name,
      });

      return accumulator;
    }, []).map(l => Object.create(l));

    const svg = select('#similarityWebCanvas')

    const simulation = forceSimulation(nodes)
      .force('link', forceLink(links).id(d => d.id).distance(50))
      .force('charge', forceManyBody())
      .force('center', forceCenter(WIDTH / 2, HEIGHT / 2));

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
    });

    const scrollZoom = (canvas) => {
      const extent = [
        [ 0, 0 ],
        [ WIDTH, HEIGHT ],
      ];

      const zoomed = () => {
        simulation.stop();

        const transform = event.transform;

        nodeGroup.attr('transform', d => (
          `translate(${d.x + transform.x}, ${d.y + transform.y}) scale(${transform.k})`
        ));

        link.attr('x1', d => d.source.x + transform.x)
          .attr('y1', d => d.source.y + transform.y)
          .attr('x2', d => d.target.x + transform.x)
          .attr('y2', d => d.target.y + transform.y);
      };

      canvas.call(zoom()
        .scaleExtent([1, 2])
        .translateExtent(extent)
        .extent(extent)
        .on('zoom', zoomed));
    };

    svg.call(scrollZoom);
  }, [ data ]);

  return (
    <>
      <p id="similarityWebScrollMessage">Scroll to zoom in. Click and drag to pan.</p>
      <svg id="similarityWebCanvas" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}></svg>
    </>
  );
};
