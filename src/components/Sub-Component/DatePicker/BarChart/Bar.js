import React from 'react';
import { select } from 'd3-selection';
class Bar extends React.Component {
    constructor() {
        super();
        this.ref = React.createRef();
    }
    componentDidMount() {
        this.init();
    }
    componentDidUpdate() {
        this.barTransition();
    }
    onMouseOver(event, data) {
        var tooltipDiv = select(".tooltip_");
        tooltipDiv.transition()
            .duration(200)
            .style("display", 'inline-block');
        let left_ = (event.clientX + 10);
        if ((window.innerWidth - event.clientX) < 200)
            left_ = window.innerWidth - 210;
        tooltipDiv
            .html(data.toolTip || `<span>${data['name']}</span> - <span>${data['value']}</span><br />`)
            .style('left', left_ + 'px')
            .style("top", (event.clientY - window.innerHeight + 10) + "px")
    }

    onMouseOut(d) {
        var tooltipDiv = select(".tooltip_")
        tooltipDiv.transition()
            .duration(500)
            .style("display", 'none');
    }
    barTransition() {
        const node = this.ref.current;
        const { yScale, height, data, t } = this.props;

        select(node)
            .selectAll('.bar')
            .data(data)
            .transition(t)
            .attr("fill", function (d) {
                if (d['value'] >= 8)
                    return 'rgb(29,169,77)';
                else if (d['value'] >= 4)
                    return 'rgb(80,83,239)';
                return 'rgb(148,52,50)';
            })
            .attr('y', d => yScale(d.value))
            .attr('height', (d) => { return height - yScale(d.value) });

        select(node)
            .selectAll('text')
            .data(data)
            .attr('y', (d) => { return (parseFloat(height) - parseFloat(height - yScale(d.value)) - 5) })
            .html(d => d.value !== 0 ? d.value : null)

        select("body").append("div")
            .attr("class", "tooltip_")
            .style('display', 'none')
    }

    init() {
        const {
            xScale, data, height,
        } = this.props;
        const node = this.ref.current;

        // prepare initial data from where transition starts.
        const initialData = data.map(obj => ({
            name: obj.name,
            value: 0
        }));

        // prepare the field
        const bar = select(node)
            .selectAll('.bar')
            .data(initialData)

        bar
            .enter()
            .append('text')
            .attr('x', (d) => { return parseFloat(xScale(d.name)) + (parseFloat(xScale.bandwidth()) / 2) - 10 })

        // add rect to svg
        bar
            .enter()
            .append('rect')
            .on("mouseover", this.onMouseOver)
            .on("mousemove", this.onMouseOver)
            .on("mouseout", this.onMouseOut)
            .attr('class', 'bar')
            .attr('x', d => xScale(d.name))
            .attr('y', height)
            .attr('width', 30)//xScale.bandwidth()

        this.barTransition();
    }
    render() {
        return (
            <g className="bar-group" ref={this.ref} />
        );
    }
}

export default Bar;
