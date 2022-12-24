import React from 'react';
import { select, event } from 'd3-selection';
import { transition } from 'd3-transition';

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
    colorScale() {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
    };
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
            .attr('height', d => height - yScale(d.value));
    }
    init() {
        const {
            xScale, yScale, data, height,
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


        // add rect to svg
        bar
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.name))
            .attr('y', height)
            .attr('width', xScale.bandwidth())

        this.barTransition();
    }
    render() {
        return (
            <g
                className="bar-group"
                ref={this.ref}
            />
        );
    }
}

export default Bar;
