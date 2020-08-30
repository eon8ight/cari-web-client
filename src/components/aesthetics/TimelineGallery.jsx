import React, { useEffect } from 'react';

import {
  max,
  min,
} from 'd3-array';

import {
  axisBottom,
  axisLeft,
} from 'd3-axis';

import { scaleLinear } from 'd3-scale';
import { event, select } from 'd3-selection';
import { zoom } from 'd3-zoom';

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

    if(subdivisions > 1) {
      select('#galleryCanvasContainer')
        .insert('span', ':first-child')
        .text('Scroll to zoom in. Click and drag to pan.');
    }

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
       *
       * Note that `xPosition` and `yPosition` are not X/Y-coordinates - they are
       * instead values that correspond to specific ticks along the X/Y axis.
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

    const xMin = min(data, d => d.year);
    const xMax = max(data, d => d.year) + 1;

    const x = scaleLinear()
      .domain([ xMin, xMax ])
      .range([ MARGIN.left, WIDTH - MARGIN.right ]);

    const xAxis = g => g.attr('transform', `translate(0, ${HEIGHT - MARGIN.bottom})`)
      .call(axisBottom(x)
        .tickSizeOuter(0)
        .ticks(xMax - xMin)
        .tickFormat(d => d) // This prevents commas from being inserted in years
      );

    const y = scaleLinear()
      .domain([ 0, yMax ])
      .range([HEIGHT - MARGIN.bottom, MARGIN.top ]);

    const yAxis = g => g.attr('transform', `translate(${MARGIN.left}, 0)`)
      .call(axisLeft(y).ticks(0))
      .call(g => g.select('.domain').remove());

    const scrollZoom = (canvas) => {
      const extent = [
        [ MARGIN.left, MARGIN.top ],
        [ WIDTH - MARGIN.right, HEIGHT - MARGIN.top ],
      ];

      const zoomed = () => {
        x.range([ MARGIN.left, WIDTH - MARGIN.right ].map(d => event.transform.applyX(d)));

        canvas.selectAll('image, rect')
          .attr('width', d => (x(d.xPosition + 1) - x(d.xPosition)) / subdivisions)
          .attr('x', d => x(d.xPosition));

        canvas.selectAll('#xAxis').call(xAxis);
      };

      canvas.call(zoom()
        .scaleExtent([1, subdivisions])
        .translateExtent(extent)
        .extent(extent)
        .on('zoom', zoomed));
    };

    const svg = select('#galleryCanvas')
      .call(scrollZoom);

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
      .attr('id', 'xAxis')
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
      <div id="galleryCanvasContainer">
        <svg id="galleryCanvas" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}></svg>
      </div>
      <div id="viewer">
        <h2 style={{ textAlign: 'center' }}>Select an image for more information.</h2>
      </div>
    </>
  );
};
