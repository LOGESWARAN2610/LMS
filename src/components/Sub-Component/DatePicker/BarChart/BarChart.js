import React from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import XYAxis from './xy-axis.js';
import Grid from './Grid.js';
import Bar from './Bar.js';
import { transition } from 'd3-transition';

export default function BarChart(props) {
    const { data_, title, value = 'value', label = 'label' } = props;
    var data = [];
    for (let index = 1; index <= (new Date().getDate()); index++) {
        let obj = data_.filter((obj) => { return new Date(obj[label]).getDate() === index });
        if (obj.length > 0)
            data.push({ name: index.toString(), value: obj[0][value] })
        else
            data.push({ name: index.toString(), value: 0 })

    }

    const parentWidth = 1300;
    const margin = { top: 50, right: 70, bottom: 60, left: 70 };
    const ticks = 6;
    const t = transition().duration(1000);

    const width = parentWidth - margin.left - margin.right;
    const height = parentWidth * 0.5 - margin.top - margin.bottom - 200;

    const xScale = scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width])
        .padding(0.26);

    const yScale = scaleLinear()
        .domain([0, Math.max(...data.map(d => d.value))])
        .range([height, 0])
        .nice();

    return (<>
        <div style={{ 'display': 'inline-block', width: 'auto', 'textAlign': 'center' }}>
            <div className='pie-label'>{title}</div>
            <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
                <g transform={`translate(${margin.left}, ${margin.top - 10})`}>
                    <XYAxis {...{ xScale, yScale, height, ticks, t }} />
                    <Grid {...{ xScale, yScale, width, ticks, t }} />
                    <Bar {...{ xScale, yScale, data, height, t }} />
                </g>
            </svg>
            {/* <div id={id} ></div> */}
        </div>
    </>
    );
}

