"use strict";
define(["d3"], function (d3) {
    const MAP_DIMENSION = 250;
    const HALF_MAP_DIMENSION = MAP_DIMENSION / 2;
    const MIN_LINE_LENGTH = 20;
    const MAX_LINE_LENGTH = 60;
    const MIN_LINES_COUNT = 15;
    const MAX_LINES_COUNT = 30;
    const D_DELAY = 500;
    const DELAY_BASE = 1000;
    const MAX_STRENGTH = 30;
    const OPACITY = 0.5;
    const STROKE_WIDTH = 4;
    const BORDER_THICKNESS = 18;

    const COLORS_PALETTE = [
        "#00fffb",
        "#00ffc5",
        "#00ff8e",
        "#00ff58",
        "#00ff22",
        "#15ff00",
        "#4bff00",
        "#82ff00",
        "#b8ff00",
        "#eeff00",
        "#ffd900",
        "#ffa300",
        "#ff6d00",
        "#ff3600",
        "#ff0000"];

    function mapStrengthToColor(strength) {
        if (strength >= MAX_STRENGTH) {
            return COLORS_PALETTE[COLORS_PALETTE.length - 1];
        } else {
            return COLORS_PALETTE[Math.floor(strength * COLORS_PALETTE.length / MAX_STRENGTH)];
        }
    }

    function lineAnimate(selection, color, strength) {
        selection
            .each(function (d) {
                var elem = this;
                elem.setAttribute('x1', d.x - d.dx / 2);
                elem.setAttribute('x2', d.x - d.dx / 2);
                elem.setAttribute('y1', d.y - d.dy / 2);
                elem.setAttribute('y2', d.y - d.dy / 2);
            })
            .style('opacity', OPACITY)
            .style('stroke', color)
            .transition()
            .ease('linear')
            .duration(function (d) {
                return d.duration
            })
            .delay(function (d) {
                return d.duration
            })
            .attr('x2', function (d) {
                return d.x + d.dx
            })
            .attr('y2', function (d) {
                return d.y + d.dy;
            })
            .transition()
            .duration(function (d) {
                return d.duration
            })
            .style('opacity', 0)
            .each('end', function (d) {
                const data = getRandomCoords(strength, d.dx, d.dy);
                const element = d3.select(this);
                element[0][0].__data__ = data;
                element.call(lineAnimate, color, strength);
            });
    }

    function paint(linesPlaceholder, coords, strength, dx, dy) {

        const color = mapStrengthToColor(strength);

        linesPlaceholder.selectAll('line')
            .data(coords)
            .enter()
            .append('line')
            .style({'stroke-width': STROKE_WIDTH + 'px'})
            .call(lineAnimate, color, strength);
    }

    function calcLinesCount(strength) {
        return MIN_LINES_COUNT + Math.round(strength * MAX_LINES_COUNT / MAX_STRENGTH);
    }

    function getRandomDuration() {
        return Math.round(Math.random() * D_DELAY + DELAY_BASE);
    }

    function normalizeStrength(strength) {
        if (strength > MAX_STRENGTH) {
            strength = MAX_STRENGTH
        }
        if (strength <= 1) {
            strength = 1;
        }
        return strength;
    }

    function getRandomCoords(strength, dx, dy) {

        const alpha = Math.random() * 2 * Math.PI;
        const radius = Math.random() * (MAP_DIMENSION / 2 - BORDER_THICKNESS);

        const x = radius * Math.cos(alpha) + MAP_DIMENSION / 2;
        const y = radius * Math.sin(alpha) + MAP_DIMENSION / 2;
        return {
            x: x,
            dx: dx,
            y: y,
            dy: dy,
            duration: getRandomDuration()
        }
    }

    function calculateVector(direction, strength) {
        const lineLength = (MAX_LINE_LENGTH - MIN_LINE_LENGTH) * ( strength / MAX_STRENGTH);
        return {
            x: Math.sin(direction) * (MIN_LINE_LENGTH + lineLength),
            y: -Math.cos(direction) * (MIN_LINE_LENGTH + lineLength)
        }
    }

    function generateDataFromWind(direction, strength) {
        strength = normalizeStrength(strength);
        direction = direction * Math.PI / 180.0;
        const linesCount = calcLinesCount(strength);
        const vector = calculateVector(direction, strength);

        const coordinates = [];

        for (var i = 0; i < linesCount; i++) {
            coordinates.push(getRandomCoords(strength, vector.x, vector.y));
        }

        return coordinates;
    }

    function createSvg(parent) {
        const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        parent.appendChild(svgElement);

        const svg = d3.select(svgElement);

        const defs = svg.append("defs");


        defs.append("clipPath")
            .attr("id", "cut-off-gauge")
            .append("circle")
            .attr("cx", HALF_MAP_DIMENSION)
            .attr("cy", HALF_MAP_DIMENSION)
            .attr("r", HALF_MAP_DIMENSION - BORDER_THICKNESS);

        defs.append("clipPath")
            .attr("id", "cut-off-hole")
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", MAP_DIMENSION)
            .attr("height", MAP_DIMENSION)
            .attr("clip-path", "url(#cut-off-gauge)");


        svg.append("image")
            .attr("width", 250)
            .attr("height", 250)
            .attr("xlink:href", "images/kadyny_map.png");

        return svg.append("g")
            .attr("clip-path", "url(#cut-off-hole)");
    }

    function showWind(windrosePlaceholder, direction, strength) {
        while (windrosePlaceholder.firstChild) {
            windrosePlaceholder.removeChild(windrosePlaceholder.firstChild);
        }
        const linesPlaceholder = createSvg(windrosePlaceholder);

        const coordinates = generateDataFromWind(direction, strength);
        paint(linesPlaceholder, coordinates, strength);
    }

    return {
        showWind: showWind,
        MAX_STRENGTH: MAX_STRENGTH
    };
});
