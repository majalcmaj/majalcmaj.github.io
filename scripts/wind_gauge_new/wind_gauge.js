"use strict";
define(["d3"], function(d3) {
    const MAP_DIMENSION = 250;
    const BASE_LINE_LENGTH = 20;
    const MIN_LINES_COUNT = 20;
    const MAX_LINES_COUNT = 40;
    const D_DELAY = 300;
    const DELAY_BASE = 1000;
    const MAX_STRENGTH = 30;


    var colors = [
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
            return colors[colors.length - 1];
        } else {
            return colors[Math.floor(strength * colors.length / MAX_STRENGTH)];
        }
    }

    function lineAnimate(selection) {
        selection
            .attr('x1', function (d) {
                return d.x1;
            })
            .attr('x2', function (d) {
                return d.x1;
            })
            .attr('y1', function (d) {
                return d.y1;
            })
            .attr('y2', function (d) {
                return d.y1;
            })
            .style('opacity', 0.25)
            .style('stroke', function (d) {
                return mapStrengthToColor(d.strength)
            })
            .transition()
            .ease('linear')
            .duration(function (d) {
                return d.delay;
            })
            .delay(30)
            .attr('x2', function (d) {
                return d.x2;
            })
            .attr('y2', function (d) {
                return d.y2;
            })
            .transition()
            .duration(function (d) {
                return d.delay;
            })
            .style('opacity', 0)
            .each('end', function () {
                d3.select(this).call(lineAnimate)
            });
    }

    function paint(data) {
        const svg = d3.select('svg');

        svg.append("image")
            .attr("width", MAP_DIMENSION + "px")
            .attr("height", MAP_DIMENSION + "px")
            .attr("xlink:href", "images/kadyny_map.png");

        svg.selectAll('line')
            .data(data)
            .enter()
            .append('line')
            .style({'stroke-width': '3px'})
            .call(lineAnimate);
    }

    function calcLinesCount(strength) {
        return MIN_LINES_COUNT + Math.round(strength * MAX_LINES_COUNT / MAX_STRENGTH);
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
        const x1 = Math.floor(Math.random() * MAP_DIMENSION) - dx / 2;
        const y1 = Math.floor(Math.random() * MAP_DIMENSION) - dy / 2;
        return {
            x1: x1,
            x2: x1 + dx,
            y1: y1,
            y2: y1 + dy,
            delay: Math.round(Math.random() * D_DELAY + DELAY_BASE),
            strength: strength
        }
    }

    function calculateDX(direction, strength) {
        return Math.sin(direction) * BASE_LINE_LENGTH * strength;
    }

    function calculateDY(direction, strength) {
        return -Math.cos(direction) * BASE_LINE_LENGTH * strength;
    }

    function generateDataFromWind(direction, strength) {
        strength = normalizeStrength(strength);
        direction = direction * Math.PI / 180.0;
        const linesCount = calcLinesCount(strength);
        const dx = calculateDX(direction, strength);
        const dy = calculateDY(direction, strength);

        const coordinates = [];

        for (var i = 0; i < linesCount; i++) {
            coordinates.push(getRandomCoords(strength, dx, dy));
        }

        return coordinates;
    }

    function showWind(direction, strength) {
        var svgElem = document.querySelector("#wind-container > svg");
        if (svgElem) {
            svgElem.remove();
        }
        svgElem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        document.getElementById("wind-container").appendChild(svgElem);
        const coordinates = generateDataFromWind(direction, strength);
        paint(coordinates);
    }

    return {
        showWind: showWind,
        MAX_STRENGTH: MAX_STRENGTH
    };
});
