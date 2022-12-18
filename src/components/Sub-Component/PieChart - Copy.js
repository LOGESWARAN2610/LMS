import React, { useEffect } from 'react';
import * as d3 from 'd3';

function PieChart(props) {
    const { data, outerRadius, innerRadius, title, id } = props;
    const margin = { top: 20, right: 50, bottom: 50, left: 50 };
    const width = 2 * outerRadius + margin.left + margin.right;
    const height = 2 * outerRadius + margin.top + margin.bottom;

    // const colorScale = d3
    //     .scaleSequential()
    //     .interpolator(d3.interpolateCool)
    //     .domain([0, data.length]);
    const colorScale = function () {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
    };
    useEffect(() => {
        drawChart();
    });

    function drawChart() {
        // Remove the old svg
        d3.select('#' + id)
            .select('svg')
            .remove();

        // Create new svg
        const svg = d3
            .select('#' + id)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        const arcGenerator = d3
            .arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        const pieGenerator = d3
            .pie()
            .padAngle(0)
            .value((d) => d.value);

        const arc = svg
            .selectAll()
            .data(pieGenerator(data))
            .enter()

        // Append arcs
        arc
            .append('path')
            .attr('d', arcGenerator)
            .style('fill', (_, i) => colorScale(i))
            .style('stroke', '#ffffff')
            .style('stroke-width', 0);

        // Append text labels
        arc
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .text((d) => d.data.label)
            .style('fill', (_, i) => colorScale(data.length - i))
            .attr('transform', (d) => {
                const [x, y] = arcGenerator.centroid(d);
                return `translate(${x}, ${y})`;
            });

        const tooltip = d3.select('#' + id)
            .append('div')
            .attr('class', 'tooltip');
        const path = svg.selectAll('path')

        path.on('mouseover', (e, d) => {
            var total = d3.sum(data.map((d) => {
                return d.value;
            }));
            var percent = Math.round(1000 * d.value / total) / 10;
            d3.select('#' + id).select('.tooltip').html(`<span>${d.data.label}</span><br /><span>${percent}</span>`)
                .style('display', 'inline-block')
                .style('color', e.target.style.fill)
                .style('top', (e.offsetY + 10) + 'px')
                .style('left', (e.offsetX + 80) + 'px');
        });

        path.on('mouseout', () => {
            tooltip.style('display', 'none');
        });

    }

    return <>
        <div style={{ 'display': 'inline-block', width: '40%', margin: '0 50px', 'textAlign': 'center' }}>
            <div className='pie-label'>{title}</div>
            <div id={id} ></div>
        </div>
    </>;
}

export default PieChart;