import React, { useEffect } from 'react';

import { extent } from 'd3-array';

import {
  axisBottom,
  axisLeft,
} from 'd3-axis';

import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';

const WIDTH = 300;
const HEIGHT = 100;

const MAX_PER_YEAR_BEFORE_SUBDIVIDING = 5;

const MARGIN = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 30,
};

export default (props) => {
  useEffect(() => {
    if(!props.aestheticData) {
      return;
    }

    /*
     * First, calculate the Y axis' range's max value. This number is the year that
     * contains the greatest number of media.
     */

    let yMax = 1;

    props.aestheticData.media.reduce((counts, d) => {
      if(!(d.year in counts)) {
        counts[d.year] = 0;
      }

      counts[d.year]++;

      if(counts[d.year] > yMax) {
        yMax = counts[d.year];
      }

      return counts;
    }, {});

    /*
     * Next, subdivide each year into a grid depending on how many media are in the
     * year with the greatest amount of media, as determined by `yMax`. This prevents
     * the graph from looking weird if there are too many previews to draw for
     * a one-dimensional vertical row.
     */

    const subdivisions = Math.ceil(yMax / MAX_PER_YEAR_BEFORE_SUBDIVIDING);
    yMax = Math.ceil(yMax / subdivisions);

    let subdivisionCounterByYear = {};
    let yPositionByYear = {};

    const data = props.aestheticData.media.map(m => {
      if(!(m.year in subdivisionCounterByYear)) {
        subdivisionCounterByYear[m.year] = 0;
      }

      if(!(m.year in yPositionByYear)) {
        yPositionByYear[m.year] = 0;
      }

      /*
       * The X-position of the preview is determined by taking its value in X's
       * range - i.e., its year - and nudging it to the right slightly. i.e.,
       * if `subdivisions` is 4, then for any given row, the first preview
       * will have an X position of "year", the second preview will have an X
       * position of "year + 0.25", the third preview will have an X position of
       * "year + 0.5", and so forth.
       */

      const rval = Object.create({
        ...m,
        xPosition: m.year + ((1 / subdivisions) * subdivisionCounterByYear[m.year]),
        yPosition: yPositionByYear[m.year] + 1,
      });

      subdivisionCounterByYear[m.year]++;

      /*
       * When we reach the end of a row, reset the X-position counter and
       * increment the Y-position by 1.
       */

      if(subdivisionCounterByYear[m.year] > subdivisions - 1) {
        subdivisionCounterByYear[m.year] = 0;
        yPositionByYear[m.year]++;
      }

      return rval;
    });

    const xDomain = extent(data, d => d.year);
    xDomain[1] += 1;

    const x = scaleLinear()
      .domain(xDomain)
      .range([ MARGIN.left, WIDTH - MARGIN.right ]);

    const xAxis = g => g.attr('transform', `translate(0, ${HEIGHT - MARGIN.bottom})`)
      .call(axisBottom(x)
        .tickSizeOuter(0)
        .tickFormat(d => d) // This prevents commas from being inserted in years
      );

    const y = scaleLinear()
      .domain([ 0, yMax ])
      .range([HEIGHT - MARGIN.bottom, MARGIN.top ]);

    const yAxis = g => g.attr('transform', `translate(${MARGIN.left}, 0)`)
      .call(axisLeft(y).ticks(0))
      .call(g => g.select('.domain').remove());

    const svg = select('#galleryCanvas');

    const image = svg.selectAll('.images')
      .data(data)
      .enter()
      .insert('image')
      .attr('href', d => d.preview)
      .attr('width', d => (x(d.xPosition + 1) - x(d.xPosition)) / subdivisions)
      .attr('height', d => y(d.yPosition) - y(d.yPosition + 1))
      .attr('x', d => x(d.xPosition))
      .attr('y', d => y(d.yPosition))
      .attr('preserveAspectRatio', 'xMidYMid slice');

    svg.selectAll('.images')
      .data(data)
      .enter()
      .insert('rect')
      .attr('width', d => x(d.xPosition + 1) - x(d.xPosition))
      .attr('height', d => y(d.yPosition) - y(d.yPosition + 1))
      .attr('x', d => x(d.xPosition))
      .attr('y', d => y(d.yPosition))
      .attr('fill', 'none')
      .attr('stroke', 'white');

    svg.append('g')
      .call(xAxis);

    svg.append('g')
      .call(yAxis);

    const viewer = select('#viewer')

    image.on('mousedown', d => {
      viewer.text('');

      viewer.append('div')
        .attr('id', 'galleryImageContainer')
        .append('img')
        .attr('id', 'galleryImage')
        .attr('src', d.url);

      const galleryItemText = viewer.append('div')
        .attr('id', 'galleryImageMetadataContainer')
        .append('dl')
        .attr('id', 'galleryImageMetadata');

      galleryItemText.append('dt')
        .append('h3')
        .text('Title');

      galleryItemText.append('dd')
        .text(d.label);

      galleryItemText.append('dt')
        .append('h3')
        .text('Creator');

      galleryItemText.append('dd')
        .text(d.creator);

      galleryItemText.append('dt')
        .append('h3')
        .text('Year');

      galleryItemText.append('dd')
        .text(d.year);

      galleryItemText.append('dt')
        .append('h3')
        .text('Description');

      galleryItemText.append('dd')
        .text(d.description);
    });
  }, [ props.aestheticData ]);

  return (
    <>
      <svg id="galleryCanvas" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}></svg>
      <div id="viewer">
        <h2 style={{ textAlign: 'center' }}>Select an image for more information.</h2>
      </div>
    </>
  );
};
