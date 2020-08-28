import React, { useEffect } from 'react';

import * as d3 from 'd3';

const WIDTH = 300;
const HEIGHT = 100;

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

    const data = props.aestheticData.media.map(m => Object.create({
      ...m,
      date: new Date(m.date),
    }));

    const countPerYear = {};

    data.forEach(d => {
      const year = d.date.getFullYear();

      if(!(year in countPerYear)) {
        countPerYear[year] = 0;
      }

      countPerYear[year] += 1;
      d.yPosition = countPerYear[year];
    });

    let yMax = 1;

    Object.keys(countPerYear).forEach(year => {
      const yearCount = countPerYear[year];

      if(yearCount > yMax) {
        yMax = yearCount;
      }
    });

    const xDomain = d3.extent(data, d => d.date);

    /*
     * xDomain are pointers to dates in `data`, so modifying them will modify the data we're
     * working with, hence the need to clone them
     */

    xDomain[1] = new Date(xDomain[1].getTime());
    xDomain[1].setFullYear(xDomain[1].getFullYear() + 1);

    const x = d3.scaleTime()
      .domain(xDomain)
      .range([ MARGIN.left, WIDTH - MARGIN.right ]);

    const xAxis = g => g.attr('transform', `translate(0, ${HEIGHT - MARGIN.bottom})`)
      .call(d3.axisBottom(x)
        .ticks(d3.timeYear.every(1))
        .tickSizeOuter(0)
      );

    const y = d3.scaleLinear()
      .domain([ 0, yMax ])
      .range([HEIGHT - MARGIN.bottom, MARGIN.top ]);

    const yAxis = g => g.attr('transform', `translate(${MARGIN.left}, 0)`)
      .call(d3.axisLeft(y)
        .ticks(0)
      )
      .call(g => g.select('.domain').remove());

    const svg = d3.select('#galleryCanvas');

    const image = svg.selectAll('.images')
      .data(data)
      .enter()
      .insert('image')
      .attr('href', d => d.preview)
      .attr('width', '8%')
      .attr('x', d => x(d.date))
      .attr('y', d => y(d.yPosition));

    svg.append('g')
      .call(xAxis);

    svg.append('g')
      .call(yAxis);

    const viewer = d3.select('#viewer')

    image.on('mousedown', d => {
      const galleryItemDiv = viewer.text('')
        .insert('div')
        .classed('viewerSelection', true);

      galleryItemDiv.append('img')
        .attr('src', d.url);

      const galleryItemText = galleryItemDiv.append('div');

      galleryItemText.append('p')
        .text(`Title: ${d.label}`);

      galleryItemText.append('p')
        .text(`Creator: ${d.creator}`);

      galleryItemText.append('p')
        .text(`Date: ${d.date}`);

      galleryItemText.append('p')
        .text(`Description: ${d.description}`);
    });
  }, [ props.aestheticData ]);

  return (
    <>
      <svg id="galleryCanvas" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}></svg>
      <div id="viewer">
        Select an image for more information.
      </div>
    </>
  );
};
