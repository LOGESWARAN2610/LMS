import React, { useEffect } from 'react';
import * as d3 from 'd3';

function PieChart(props) {
    const { data, outerRadius, innerRadius, title, id, value = 'value', label = 'label' } = props;
    //console.log(id, data);
    const margin = { top: 50, right: 50, bottom: 150, left: 50 };
    const width = 4 * outerRadius + margin.left + margin.right;
    const height = 2 * outerRadius + margin.top + (margin.bottom - 50);
    // console.log(width, height)
    const textOffset = 24;
    const tweenDuration = 1050;
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
            .attr('height', height);
        svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        const arcGenerator = d3
            .arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        const pieGenerator = d3
            .pie()
            .padAngle(0)
            .value((d) => d.value);

        // const arc = svg
        //     .selectAll()
        //     .data(pieGenerator(data))
        //     .enter()

        // // Append arcs
        // arc
        //     .append('path')
        //     .attr('d', arcGenerator)
        //     .style('fill', (_, i) => colorScale(i))
        //     .style('stroke', '#ffffff')
        //     .style('stroke-width', 0);

        // // Append text labels
        // arc
        //     .append('text')
        //     .attr('text-anchor', 'middle')
        //     .attr('alignment-baseline', 'middle')
        //     .text((d) => d.data.label)
        //     .style('fill', (_, i) => colorScale(data.length - i))
        //     .attr('transform', (d) => {
        //         const [x, y] = arcGenerator.centroid(d);
        //         return `translate(${x}, ${y})`;
        //     });

        /////////////////////////////////////////////////////
        // var vis = d3.select("#" + id).append("svg:svg")
        //     .attr("width", width)
        //     .attr("height", height);

        //GROUP FOR ARCS/PATHS
        var arc_group = svg.append("svg:g")
            .attr("class", "arc")
            .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

        //GROUP FOR LABELS
        var label_group = svg.append("svg:g")
            .attr("class", "label_group")
            .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

        //GROUP FOR CENTER TEXT  
        var center_group = svg.append("svg:g")
            .attr("class", "center_group")
            .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

        // var whiteCircle = 
        center_group.append("svg:circle")
            .attr("fill", "white")
            .attr("r", innerRadius);


        const pieData = pieGenerator(data);
        var sliceProportion = 0; //size of this slice
        const filteredPieData = pieData.filter(filterData);
        function filterData(element, index, array) {
            element.name = data[index][label];
            element.value = data[index][value];
            sliceProportion += element.value;
            return (element.value > 0);
        }

        var paths = arc_group.selectAll("path").data(filteredPieData);
        paths.enter().append("svg:path")
            .attr("stroke", "white")
            .attr("stroke-width", 0.5)
            .attr("fill", function (d, i) { return colorScale(i); })
            .transition()
            .duration(tweenDuration)
            .attrTween("d", pieTween);
        paths
            .transition()
            .duration(tweenDuration)
            .attrTween("d", pieTween);
        paths.exit()
            .transition()
            .duration(tweenDuration)
            .attrTween("d", removePieTween)
            .remove();


        // const tooltip = 
        d3.select('#' + id)
            .append('div')
            .attr('class', 'tooltip');
        const toolTipPath = svg.selectAll('path')

        toolTipPath.on('mouseover', (e, d) => {

            var total = d3.sum(data.map((d) => {
                return d.value;
            }));
            let percent = Math.round(1000 * d.value / total) / 10;
            d3.select('#' + id).select('.tooltip')
                .style('display', 'inline-block')
                .style('color', e.target.style.fill)
                .style('top', (e.offsetY + 10) + 'px')
                .style('left', (e.offsetY + 80) + 'px')
                .html(d.data.toolTip || `<span>${d.data[label]}</span> - <span>${d.data[value]}</span><br /><span>${percent}%</span>`)
        });

        toolTipPath.on('mouseout', () => {
            d3.select('#' + id).select('.tooltip').style('display', 'none');
        });

        //DRAW TICK MARK LINES FOR LABELS
        var lines = label_group.selectAll("line").data(filteredPieData);
        lines.enter().append("svg:line")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", -outerRadius - 3)
            .attr("y2", -outerRadius - 15)
            .attr("stroke", "gray")
            .attr("transform", function (d) {
                return "rotate(" + (d.startAngle + d.endAngle) / 2 * (180 / Math.PI) + ")";
            });
        lines.transition()
            .duration(tweenDuration)
            .attr("transform", function (d) {
                return "rotate(" + (d.startAngle + d.endAngle) / 2 * (180 / Math.PI) + ")";
            });
        lines.exit().remove();
        //DRAW LABELS WITH ENTITY NAMES
        var nameLabels = label_group.selectAll("text.units").data(filteredPieData)
            .attr("dy", function (d) {
                if ((d.startAngle + d.endAngle) / 2 > Math.PI / 2 && (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5) {
                    return 17;
                } else {
                    return 5;
                }
            })
            .attr("text-anchor", function (d) {
                if ((d.startAngle + d.endAngle) / 2 < Math.PI) {
                    return "beginning";
                } else {
                    return "end";
                }
            }).text(function (d) {
                return d.name;
            });

        nameLabels.enter().append("svg:text")
            .attr("class", "units")
            .attr("transform", function (d) {
                return "translate(" + Math.cos(((d.startAngle + d.endAngle - Math.PI) / 2)) * (outerRadius + textOffset) + "," + Math.sin((d.startAngle + d.endAngle - Math.PI) / 2) * (outerRadius + textOffset) + ")";
            })
            .attr("dy", function (d) {
                if ((d.startAngle + d.endAngle) / 2 > Math.PI / 2 && (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5) {
                    return 17;
                } else {
                    return 5;
                }
            })
            .attr("text-anchor", function (d) {
                if ((d.startAngle + d.endAngle) / 2 < Math.PI) {
                    return "beginning";
                } else {
                    return "end";
                }
            }).text(function (d) {
                return d.name;
            });

        nameLabels.transition().duration(tweenDuration).attrTween("transform", textTween);

        nameLabels.exit().remove();

        //DRAW LABELS WITH PERCENTAGE VALUES
        var valueLabels = label_group.selectAll("text.value").data(filteredPieData)
            .attr("dy", function (d) {
                if ((d.startAngle + d.endAngle) / 2 > Math.PI / 2 && (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5) {
                    return 5;
                } else {
                    return -7;
                }
            })
            .attr("text-anchor", function (d) {
                if ((d.startAngle + d.endAngle) / 2 < Math.PI) {
                    return "beginning";
                } else {
                    return "end";
                }
            })
            .text(function (d) {
                var percentage = (d.value / sliceProportion) * 100;
                return percentage.toFixed(1) + "%";
            });

        valueLabels.enter().append("svg:text")
            .attr("class", "value")
            .attr("transform", function (d) {
                return "translate(" + Math.cos(((d.startAngle + d.endAngle - Math.PI) / 2)) * (outerRadius + textOffset) + "," + Math.sin((d.startAngle + d.endAngle - Math.PI) / 2) * (outerRadius + textOffset) + ")";
            })
            .attr("dy", function (d) {
                if ((d.startAngle + d.endAngle) / 2 > Math.PI / 2 && (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5) {
                    return 5;
                } else {
                    return -7;
                }
            })
            .attr("text-anchor", function (d) {
                if ((d.startAngle + d.endAngle) / 2 < Math.PI) {
                    return "beginning";
                } else {
                    return "end";
                }
            }).text(function (d) {
                var percentage = (d.value / sliceProportion) * 100;
                return percentage.toFixed(1) + "%";
            });

        valueLabels.transition().duration(tweenDuration).attrTween("transform", textTween);

        valueLabels.exit().remove();




        // Interpolate the arcs in data space.
        var oldPieData = [];
        function pieTween(d, i) {
            var s0;
            var e0;
            if (oldPieData[i]) {
                s0 = oldPieData[i].startAngle;
                e0 = oldPieData[i].endAngle;
            } else if (!(oldPieData[i]) && oldPieData[i - 1]) {
                s0 = oldPieData[i - 1].endAngle;
                e0 = oldPieData[i - 1].endAngle;
            } else if (!(oldPieData[i - 1]) && oldPieData.length > 0) {
                s0 = oldPieData[oldPieData.length - 1].endAngle;
                e0 = oldPieData[oldPieData.length - 1].endAngle;
            } else {
                s0 = 0;
                e0 = 0;
            }
            i = d3.interpolate({ startAngle: s0, endAngle: e0 }, { startAngle: d.startAngle, endAngle: d.endAngle });
            return function (t) {
                var b = i(t);
                return arcGenerator(b);
            };
        }

        function removePieTween(d, i) {
            var s0 = 2 * Math.PI;
            var e0 = 2 * Math.PI;
            i = d3.interpolate({ startAngle: d.startAngle, endAngle: d.endAngle }, { startAngle: s0, endAngle: e0 });
            return function (t) {
                var b = i(t);
                return arcGenerator(b);
            };
        }

        function textTween(d, i) {
            var a;
            if (oldPieData[i]) {
                a = (oldPieData[i].startAngle + oldPieData[i].endAngle - Math.PI) / 2;
            } else if (!(oldPieData[i]) && oldPieData[i - 1]) {
                a = (oldPieData[i - 1].startAngle + oldPieData[i - 1].endAngle - Math.PI) / 2;
            } else if (!(oldPieData[i - 1]) && oldPieData.length > 0) {
                a = (oldPieData[oldPieData.length - 1].startAngle + oldPieData[oldPieData.length - 1].endAngle - Math.PI) / 2;
            } else {
                a = 0;
            }
            var b = (d.startAngle + d.endAngle - Math.PI) / 2;

            var fn = d3.interpolateNumber(a, b);
            return function (t) {
                var val = fn(t);
                return "translate(" + Math.cos(val) * (outerRadius + textOffset) + "," + Math.sin(val) * (outerRadius + textOffset) + ")";
            };
        }
        ////////////////////////////

        // const path = svg.selectAll('path')

        // path.on('mouseover', (e, d) => {
        //     var total = d3.sum(data.map((d) => {
        //         return d.value;
        //     }));
        //     var percent = Math.round(1000 * d.value / total) / 10;
        //     d3.select('#' + id).select('.tooltip').html(`<span>${d.data.label}</span><br /><span>${percent}</span>`)
        //         .style('display', 'inline-block')
        //         .style('color', e.target.style.fill)
        //         .style('top', (e.offsetY + 10) + 'px')
        //         .style('left', (e.offsetX + 80) + 'px');
        // });

        // path.on('mouseout', () => {
        //     tooltip.style('display', 'none');
        // });

    }

    return <>
        <div style={{ 'display': 'inline-block', width: 'auto', 'textAlign': 'center' }}>
            <div className='pie-label'>{title}</div>
            <div id={id} ></div>
        </div>
    </>;
}

export default PieChart;