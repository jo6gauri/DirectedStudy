'use strict';

/* globals d3 */

var calendarHeatmap = {

  settings: {
    gutter: 5,
    item_gutter: 1,
    width: 1000,
    height: 1000,
    item_size: 10,
    label_padding: 40,
    max_block_height: 20,
    transition_duration: 500,
    tooltip_width: 250,
    tooltip_padding: 15,
    top: 0
  },
  
  /**
   * Initialize
   */
  init: function(data, color, overview, handler) {

    // Set calendar data
    calendarHeatmap.data = data;

    // Set calendar color
    calendarHeatmap.color = color || '#00ccbc';

    // Initialize current overview type and history
    calendarHeatmap.overview = overview || 'global';
    calendarHeatmap.history = ['global'];
    calendarHeatmap.selected = {};

    // Set handler function
    calendarHeatmap.handler = handler;

    // No transition to start with
    calendarHeatmap.in_transition = false;

    // Create html elementsfor the calendar
    calendarHeatmap.createElements();

    // Parse data for summary details
    calendarHeatmap.parseData();

    // Draw the chart
    calendarHeatmap.drawChart();
  },


  /**
   * Create html elements for the calendar
   */
  createElements: function() {
    // Create main html container for the calendar
    var container = document.createElement('div');
    container.className = 'calendar-heatmap';
    document.body.appendChild(container);
    
    // Create svg element
    var svg = d3.select(container).append('svg')
      .attr('class', 'svgTop');

    console.log('top is : ' + calendarHeatmap.settings.top + ' and overview is : ' +
    calendarHeatmap.overview);
    // svg repositioning
   // $("svg").css({top: 0, position:'absolute'});

    // Create other svg elements
    calendarHeatmap.items = svg.append('g');
    calendarHeatmap.labels = svg.append('g');
    calendarHeatmap.buttons = svg.append('g');
    calendarHeatmap.toggleButtons = svg.append('g');

    // Add tooltip to the same element as main svg
    calendarHeatmap.tooltip = d3.select(container).append('div')
      .attr('class', 'heatmap-tooltip')
      .style('opacity', 0);

    // Calculate dimensions based on available width
    var calcDimensions = function() {

      var dayIndex = Math.round((moment() - moment().subtract(1, 'year').startOf('week')) / 86400000);
      var colIndex = Math.trunc(dayIndex / 7);
      var numWeeks = colIndex + 1;

      calendarHeatmap.settings.width = container.offsetWidth < 1000 ? 1000 : container.offsetWidth;
      calendarHeatmap.settings.item_size = ((calendarHeatmap.settings.width - calendarHeatmap.settings.label_padding) / numWeeks - calendarHeatmap.settings.gutter);
      calendarHeatmap.settings.height = calendarHeatmap.settings.label_padding + 7 * (calendarHeatmap.settings.item_size + calendarHeatmap.settings.gutter);
      svg.attr('width', calendarHeatmap.settings.width)
        .attr('height', calendarHeatmap.settings.height);

      if (!!calendarHeatmap.data && !!calendarHeatmap.data[0].summary) {
        calendarHeatmap.drawChart();
      }
    };
    calcDimensions();

    window.onresize = function(event) {
      calcDimensions();
    };

  },

  /**
   * Create html elements for the calendar
   */
  createElementsBottom: function() {
    // Create main html container for the calendar
    var container = document.createElement('div');
    container.className = 'calendar-heatmap1';
    document.body.appendChild(container);

    // Create svg element
    var svg1 = d3.select(container).append('svg')
      .attr('class', 'svgBottom');

    console.log('bottom function top is : ' + calendarHeatmap.settings.top + ' and overview is : ' +
    calendarHeatmap.overview);
    // svg repositioning
   // $("svg1").css({top: 300, position:'absolute'});

    // Create other svg elements
    calendarHeatmap.items = svg1.append('g');
    calendarHeatmap.labels = svg1.append('g');
    calendarHeatmap.buttons = svg1.append('g');
    calendarHeatmap.toggleButtons = svg1.append('g');

    // Add tooltip to the same element as main svg
    calendarHeatmap.tooltip = d3.select(container).append('div')
      .attr('class', 'heatmap-tooltip')
      .style('opacity', 0);

    // Calculate dimensions based on available width
    var calcDimensions = function() {

      var dayIndex = Math.round((moment() - moment().subtract(1, 'year').startOf('week')) / 86400000);
      var colIndex = Math.trunc(dayIndex / 7);
      var numWeeks = colIndex + 1;

      calendarHeatmap.settings.width = container.offsetWidth < 1000 ? 1000 : container.offsetWidth;
      calendarHeatmap.settings.item_size = ((calendarHeatmap.settings.width - calendarHeatmap.settings.label_padding) / numWeeks - calendarHeatmap.settings.gutter);
      calendarHeatmap.settings.height = calendarHeatmap.settings.label_padding + 7 * (calendarHeatmap.settings.item_size + calendarHeatmap.settings.gutter);
      svg1.attr('width', calendarHeatmap.settings.width)
        .attr('height', calendarHeatmap.settings.height);

      if (!!calendarHeatmap.data && !!calendarHeatmap.data[0].summary) {
        calendarHeatmap.drawChart();
      }
    };
    calcDimensions();

    window.onresize = function(event) {
      calcDimensions();
    };
  },

  /**
   * Create html elements for the calendar
   */
  createElementsMiddleView: function() {
    // Create main html container for the calendar
    var container = document.createElement('div');
    container.className = 'calendar-heatmap-middle-view';
    document.body.appendChild(container);

    // Create svg element
    var svgMiddleView = d3.select(container).append('svg')
      .attr('class', 'svgMiddleView');

    console.log('Middle function is : ' + calendarHeatmap.settings.top + ' and overview is : ' + calendarHeatmap.overview);
    // svg repositioning
   // $("svg1").css({top: 300, position:'absolute'});

    // Create other svg elements
    calendarHeatmap.items = svgMiddleView.append('g');
    calendarHeatmap.labels = svgMiddleView.append('g');
    calendarHeatmap.buttons = svgMiddleView.append('g');

    // Add tooltip to the same element as main svg
    calendarHeatmap.tooltip = d3.select(container).append('div')
      .attr('class', 'heatmap-tooltip')
      .style('opacity', 0);

    // Calculate dimensions based on available width
    var calcDimensions = function() {

      var dayIndex = Math.round((moment() - moment().subtract(1, 'year').startOf('week')) / 86400000);
      var colIndex = Math.trunc(dayIndex / 7);
      var numWeeks = colIndex + 1;

      calendarHeatmap.settings.width = container.offsetWidth < 1000 ? 1000 : container.offsetWidth;
      calendarHeatmap.settings.item_size = ((calendarHeatmap.settings.width - calendarHeatmap.settings.label_padding) / numWeeks - calendarHeatmap.settings.gutter);
      calendarHeatmap.settings.height = calendarHeatmap.settings.label_padding + 7 * (calendarHeatmap.settings.item_size + calendarHeatmap.settings.gutter);
      svgMiddleView.attr('width', calendarHeatmap.settings.width)
        .attr('height', calendarHeatmap.settings.height);

      if (!!calendarHeatmap.data && !!calendarHeatmap.data[0].summary) {
        calendarHeatmap.drawChart();
      }
    };
    calcDimensions();

    window.onresize = function(event) {
      calcDimensions();
    };
  },

  /**
   * Create html elements for the calendar
   */
  createElementsEndView: function() {
    // Create main html container for the calendar
    var container = document.createElement('div');
    container.className = 'calendar-heatmap-end-view';
    document.body.appendChild(container);

    // Create svg element
    var svgEndView = d3.select(container).append('svg')
      .attr('class', 'svgEndView');

    console.log('End View is : ' + calendarHeatmap.settings.top + ' and overview is : ' + calendarHeatmap.overview);
    // svg repositioning
   // $("svg1").css({top: 300, position:'absolute'});

    // Create other svg elements
    calendarHeatmap.items = svgEndView.append('g');
    calendarHeatmap.labels = svgEndView.append('g');
    calendarHeatmap.buttons = svgEndView.append('g');

    // Add tooltip to the same element as main svg
    calendarHeatmap.tooltip = d3.select(container).append('div')
      .attr('class', 'heatmap-tooltip')
      .style('opacity', 0);

    // Calculate dimensions based on available width
    var calcDimensions = function() {

      var dayIndex = Math.round((moment() - moment().subtract(1, 'year').startOf('week')) / 86400000);
      var colIndex = Math.trunc(dayIndex / 7);
      var numWeeks = colIndex + 1;

      calendarHeatmap.settings.width = container.offsetWidth < 1000 ? 1000 : container.offsetWidth;
      calendarHeatmap.settings.item_size = ((calendarHeatmap.settings.width - calendarHeatmap.settings.label_padding) / numWeeks - calendarHeatmap.settings.gutter);
      calendarHeatmap.settings.height = calendarHeatmap.settings.label_padding + 7 * (calendarHeatmap.settings.item_size + calendarHeatmap.settings.gutter);
      svgEndView.attr('width', calendarHeatmap.settings.width)
        .attr('height', calendarHeatmap.settings.height);

      if (!!calendarHeatmap.data && !!calendarHeatmap.data[0].summary) {
        calendarHeatmap.drawChart();
      }
    };
    calcDimensions();

    window.onresize = function(event) {
      calcDimensions();
    };
  },

  /**
   * Parse data for summary in case it was not provided
   */
  parseData: function() {
    if (!calendarHeatmap.data) { return; }

    // Get daily summary if that was not provided
    if (!calendarHeatmap.data[0].summary) {
      calendarHeatmap.data.map(function(d) {
        var summary = d.details.reduce(function(uniques, project) {
          if (!uniques[project.name]) {
            uniques[project.name] = {
              'value': project.value
            };
          } else {
            uniques[project.name].value += project.value;
          }
          return uniques;
        }, {});
        var unsorted_summary = Object.keys(summary).map(function(key) {
          return {
            'name': key,
            'value': summary[key].value
          };
        });
        d.summary = unsorted_summary.sort(function(a, b) {
          return b.value - a.value;
        });
        return d;
      });
    }
  },


  /**
   * Draw the chart based on the current overview type
   */
  drawChart: function() {
    if (calendarHeatmap.overview === 'global') {
      calendarHeatmap.drawGlobalOverview();
    } else if (calendarHeatmap.overview === 'year') {
      calendarHeatmap.drawYearOverview();
    } else if (calendarHeatmap.overview === 'day') {
      calendarHeatmap.drawDayOverview();
    }
  },


  /**
   * Draw global overview (multiple years)
   */
  drawGlobalOverview: function() {

    // Add current overview to the history
    if (calendarHeatmap.history[calendarHeatmap.history.length - 1] !== calendarHeatmap.overview) {
      calendarHeatmap.history.push(calendarHeatmap.overview);
    }

    // Define start and end of the dataset
    var start = moment(calendarHeatmap.data[0].date).startOf('year');
    var end = moment(calendarHeatmap.data[calendarHeatmap.data.length - 1].date).endOf('year');

    // Define array of years and total values
    var year_data = d3.timeYears(start, end).map(function(d) {
      var date = moment(d);
      return {
        'date': date,
        'total': calendarHeatmap.data.reduce(function(prev, current) {
          if (moment(current.date).year() === date.year()) {
            prev += current.total;
          }
          return prev;
        }, 0),
        'summary': function() {
          var summary = calendarHeatmap.data.reduce(function(summary, d) {
            if (moment(d.date).year() === date.year()) {
              for (var i = 0; i < d.summary.length; i++) {
                if (!summary[d.summary[i].name]) {
                  summary[d.summary[i].name] = {
                    'value': d.summary[i].value,
                  };
                } else {
                  summary[d.summary[i].name].value += d.summary[i].value;
                }
              }
            }
            return summary;
          }, {});
          var unsorted_summary = Object.keys(summary).map(function(key) {
            return {
              'name': key,
              'value': summary[key].value
            };
          });
          return unsorted_summary.sort(function(a, b) {
            return b.value - a.value;
          });
        }(),
      };
    });

    // Calculate max value of all the years in the dataset
    var max_value = d3.max(year_data, function(d) {
      return d.total;
    });

    // Define year labels and axis
    var year_labels = d3.timeYears(start, end).map(function(d) {
      return moment(d);
    });
    var yearScale = d3.scaleBand()
      .rangeRound([0, calendarHeatmap.settings.width])
      .padding([0.05])
      .domain(year_labels.map(function(d) {
        return d.year();
      }));

    // Add month data items to the overview
    calendarHeatmap.items.selectAll('.item-block-year').remove();
    var item_block = calendarHeatmap.items.selectAll('.item-block-year')
      .data(year_data)
      .enter()
      .append('rect')
      .attr('class', 'item item-block-year')
      .attr('width', function() {
        return (calendarHeatmap.settings.width - calendarHeatmap.settings.label_padding) / year_labels.length - calendarHeatmap.settings.gutter * 5;
      })
      .attr('height', function() {
        return calendarHeatmap.settings.height - calendarHeatmap.settings.label_padding * 3;
      })
      .attr('transform', function(d) {
        return 'translate(' + yearScale(d.date.year()) + ',' + calendarHeatmap.settings.tooltip_padding * 2 + ')';
      })
      .attr('fill', function(d) {
        var color = d3.scaleLinear()
          .range(['#ffffff', calendarHeatmap.color || '#ff4500'])
          .domain([-0.15 * max_value, max_value]);
        return color(d.total) || '#ff4500';
      })
      .on('click', function(d) {
        if (calendarHeatmap.in_transition) { return; }

        // Set in_transition flag
        calendarHeatmap.in_transition = true;

        // Set selected date to the one clicked on
        calendarHeatmap.selected = d;
        console.log("Date set as" + calendarHeatmap.selected);

        // Hide tooltip
        calendarHeatmap.hideTooltip();

        $(".calendar-heatmap").remove();
        $(".calendar-heatmap1").remove();
        $(".calendar-heatmap-middle-view").remove();
        $(".calendar-heatmap-end-view").remove();
        
        calendarHeatmap.overview = 'year';
        calendarHeatmap.createElements();

        calendarHeatmap.overview = 'global';        
        calendarHeatmap.createElementsBottom();
      })
      .style('opacity', 0)
      .on('mouseover', function(d) {
        if (calendarHeatmap.in_transition) { return; }

        // Construct tooltip
        var tooltip_html = '';
        tooltip_html += '<div><span><strong>Total Time Tracked: </strong></span>';

        var sec = parseInt(d.total, 10);
        var days = Math.floor(sec / 86400);
        if (days > 0) {
          tooltip_html += '<span>' + (days === 1 ? '1 day' : days + ' days') + '</span></div>';
        }
        var hours = Math.floor((sec - (days * 86400)) / 3600);
        if (hours > 0) {
          if (days > 0) {
            tooltip_html += '<div><span></span><span>' + (hours === 1 ? '1 hour' : hours + ' hours') + '</span></div>';
          } else {
            tooltip_html += '<span>' + (hours === 1 ? '1 hour' : hours + ' hours') + '</span></div>';
          }
        }
        var minutes = Math.floor((sec - (days * 86400) - (hours * 3600)) / 60);
        if (minutes > 0) {
          if (days > 0 || hours > 0) {
            tooltip_html += '<div><span></span><span>' + (minutes === 1 ? '1 minute' : minutes + ' minutes') + '</span></div>';
          } else {
            tooltip_html += '<span>' + (minutes === 1 ? '1 minute' : minutes + ' minutes') + '</span></div>';
          }
        }
        tooltip_html += '<br />';

        // Add summary to the tooltip
        var avgTemp = parseFloat(d.summary[0].value / (12 * 365)).toFixed(2);
        tooltip_html += '<div><span><strong> Avg. ' + d.summary[0].name + ': </strong></span>';
        tooltip_html += '<span>' + avgTemp + ' °F </span></div>';

        // Calculate tooltip position
        var x = yearScale(d.date.year()) + calendarHeatmap.settings.tooltip_padding * 2;
        while (calendarHeatmap.settings.width - x < (calendarHeatmap.settings.tooltip_width + calendarHeatmap.settings.tooltip_padding * 5)) {
          x -= 10;
        }
        var y = calendarHeatmap.settings.tooltip_padding * 3;

        // Show tooltip
        calendarHeatmap.tooltip.html(tooltip_html)
          .style('left', x + 'px')
          .style('top', y + 'px')
          .transition()
          .duration(calendarHeatmap.settings.transition_duration / 2)
          .ease(d3.easeLinear)
          .style('opacity', 1);
      })
      .on('mouseout', function() {
        if (calendarHeatmap.in_transition) { return; }
        calendarHeatmap.hideTooltip();
      })
      .transition()
      .delay(function(d, i) {
        return calendarHeatmap.settings.transition_duration * (i + 1) / 10;
      })
      .duration(function() {
        return calendarHeatmap.settings.transition_duration;
      })
      .ease(d3.easeLinear)
      .style('opacity', 1)
      .call(function(transition, callback) {
        if (transition.empty()) {
          callback();
        }
        var n = 0;
        transition
          .each(function() {++n; })
          .on('end', function() {
            if (!--n) {
              callback.apply(this, arguments);
            }
          });
      }, function() {
        calendarHeatmap.in_transition = false;
      });

    // Add year labels
    calendarHeatmap.labels.selectAll('.label-year').remove();
    calendarHeatmap.labels.selectAll('.label-year')
      .data(year_labels)
      .enter()
      .append('text')
      .attr('class', 'label label-year')
      .attr('font-size', function() {
        return Math.floor(calendarHeatmap.settings.label_padding / 3) + 'px';
      })
      .text(function(d) {
        return d.year();
      })
      .attr('x', function(d) {
        return yearScale(d.year()) + calendarHeatmap.settings.label_padding / 2.1;
      })
      .attr('y', calendarHeatmap.settings.label_padding / 2)
      .on('mouseenter', function(year_label) {
        if (calendarHeatmap.in_transition) { return; }

        calendarHeatmap.items.selectAll('.item-block-year')
          .transition()
          .duration(calendarHeatmap.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', function(d) {
            return (moment(d.date).year() === year_label.year()) ? 1 : 0.1;
          });
      })
      .on('mouseout', function() {
        if (calendarHeatmap.in_transition) { return; }

        calendarHeatmap.items.selectAll('.item-block-year')
          .transition()
          .duration(calendarHeatmap.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', 1);
      })
  },


  /**
   * Draw year overview
   */
  drawYearOverview: function() {
    // Add current overview to the history
    if (calendarHeatmap.history[calendarHeatmap.history.length - 1] !== calendarHeatmap.overview) {
      calendarHeatmap.history.push(calendarHeatmap.overview);
    }

    // Define start and end date of the selected year
    var start_of_year = moment(calendarHeatmap.selected.date).startOf('year');
    var end_of_year = moment(calendarHeatmap.selected.date).endOf('year');
    console.log("Start of the year" + start_of_year + "End of Year" + end_of_year);

    // Filter data down to the selected year
    var year_data = calendarHeatmap.data.filter(function(d) {
      return start_of_year <= moment(d.date) && moment(d.date) < end_of_year;
    });

    // Calculate max value of the year data
    var max_value = d3.max(year_data, function(d) {
      return d.total;
    });

    var color = d3.scaleLinear()
      .range(['#ffffff', calendarHeatmap.color || '#ff4500'])
      .domain([-0.15 * max_value, max_value]);

    var calcItemX = function(d) {
      var date = moment(d.date);
      var dayIndex = Math.round((date - moment(start_of_year).startOf('week')) / 86400000);
      var colIndex = Math.trunc(dayIndex / 7);
      return colIndex * (calendarHeatmap.settings.item_size + calendarHeatmap.settings.gutter) + calendarHeatmap.settings.label_padding;
    };
    var calcItemY = function(d) {
      return calendarHeatmap.settings.label_padding + moment(d.date).weekday() * (calendarHeatmap.settings.item_size + calendarHeatmap.settings.gutter);
    };
    var calcItemSize = function(d) {
      if (max_value <= 0) { return calendarHeatmap.settings.item_size; }
      return calendarHeatmap.settings.item_size * 0.75 + (calendarHeatmap.settings.item_size * d.total / max_value) * 0.25;
    };

    calendarHeatmap.items.selectAll('.item-circle').remove();
    calendarHeatmap.items.selectAll('.item-circle')
      .data(year_data)
      .enter()
      .append('rect')
      .attr('class', 'item item-circle')
      .style('opacity', 0)
      .style("stroke", "grey")
      .attr('x', function(d) {
        return calcItemX(d) + (calendarHeatmap.settings.item_size - calcItemSize(d)) / 2;
      })
      .attr('y', function(d) {
        return calcItemY(d) + (calendarHeatmap.settings.item_size - calcItemSize(d)) / 2;
      })
      .attr('rx', function(d) {
        return calcItemSize(d);
      })
      .attr('ry', function(d) {
        return calcItemSize(d);
      })
      .attr('width', function(d) {
        return calcItemSize(d);
      })
      .attr('height', function(d) {
        return calcItemSize(d);
      })
      .attr('fill', function(d) {
        return (d.total > 0) ? color(d.total) : 'transparent';
      })
      .on('click', function(d) {
        if (calendarHeatmap.in_transition) { return; }

        // Don't transition if there is no data to show
        if (d.total === 0) { return; }

        calendarHeatmap.in_transition = true;

        // Set selected date to the one clicked on
        calendarHeatmap.selected = d;

        // Hide tooltip
        calendarHeatmap.hideTooltip();

        $(".calendar-heatmap").remove();
        $(".calendar-heatmap1").remove();
        
        calendarHeatmap.overview = 'day';
        calendarHeatmap.createElements();

        calendarHeatmap.overview = 'year';        
        calendarHeatmap.createElementsMiddleView();
        calendarHeatmap.hideBackButton();
        
        calendarHeatmap.overview = 'global';        
        calendarHeatmap.createElementsEndView();
        calendarHeatmap.hideBackButton();
      })
      .on('mouseover', function(d) {
        if (calendarHeatmap.in_transition) { return; }

        // Pulsating animation
        var circle = d3.select(this);
        (function repeat() {
          circle = circle.transition()
            .duration(calendarHeatmap.settings.transition_duration)
            .ease(d3.easeLinear)
            .attr('x', function(d) {
              return calcItemX(d) - (calendarHeatmap.settings.item_size * 1.1 - calendarHeatmap.settings.item_size) / 2;
            })
            .attr('y', function(d) {
              return calcItemY(d) - (calendarHeatmap.settings.item_size * 1.1 - calendarHeatmap.settings.item_size) / 2;
            })
            .attr('width', calendarHeatmap.settings.item_size * 1.1)
            .attr('height', calendarHeatmap.settings.item_size * 1.1)
            .transition()
            .duration(calendarHeatmap.settings.transition_duration)
            .ease(d3.easeLinear)
            .attr('x', function(d) {
              return calcItemX(d) + (calendarHeatmap.settings.item_size - calcItemSize(d)) / 2;
            })
            .attr('y', function(d) {
              return calcItemY(d) + (calendarHeatmap.settings.item_size - calcItemSize(d)) / 2;
            })
            .attr('width', function(d) {
              return calcItemSize(d);
            })
            .attr('height', function(d) {
              return calcItemSize(d);
            })
            .on('end', repeat);
        })();

        // Calculate Avg. Temp
        var temp = d.total;
        var avgDayTemp = parseFloat(temp / 24).toFixed(2);        
        
        // Construct tooltip
        var tooltip_html = '';
        tooltip_html += '<div class="header"><strong>' + (d.total ? avgDayTemp : 'No temp') + ' °F tracked</strong></div>';
        tooltip_html += '<div>on ' + moment(d.date).format('dddd, MMM Do YYYY') + '</div><br>';

        // Add summary to the tooltip
        for (var i = 0; i < d.summary.length; i++) {
          tooltip_html += '<div><span><strong> Avg. ' + d.summary[i].name +  ': </strong></span>';
          tooltip_html += '<span>' + avgDayTemp + ' °F </span></div>';
        };

        // Calculate tooltip position
        var x = calcItemX(d) + calendarHeatmap.settings.item_size;
        if (calendarHeatmap.settings.width - x < (calendarHeatmap.settings.tooltip_width + calendarHeatmap.settings.tooltip_padding * 3)) {
          x -= calendarHeatmap.settings.tooltip_width + calendarHeatmap.settings.tooltip_padding * 2;
        }
        var y = calcItemY(d) + calendarHeatmap.settings.item_size;

        // Show tooltip
        calendarHeatmap.tooltip.html(tooltip_html)
          .style('left', x + 'px')
          .style('top', y + 'px')
          .transition()
          .duration(calendarHeatmap.settings.transition_duration / 2)
          .ease(d3.easeLinear)
          .style('opacity', 1);
      })
      .on('mouseout', function() {
        if (calendarHeatmap.in_transition) { return; }

        // Set circle radius back to what it's supposed to be
        d3.select(this).transition()
          .duration(calendarHeatmap.settings.transition_duration / 2)
          .ease(d3.easeLinear)
          .attr('x', function(d) {
            return calcItemX(d) + (calendarHeatmap.settings.item_size - calcItemSize(d)) / 2;
          })
          .attr('y', function(d) {
            return calcItemY(d) + (calendarHeatmap.settings.item_size - calcItemSize(d)) / 2;
          })
          .attr('width', function(d) {
            return calcItemSize(d);
          })
          .attr('height', function(d) {
            return calcItemSize(d);
          });

        // Hide tooltip
        calendarHeatmap.hideTooltip();
      })
      .transition()
      .delay(function() {
        return (Math.cos(Math.PI * Math.random()) + 1) * calendarHeatmap.settings.transition_duration;
      })
      .duration(function() {
        return calendarHeatmap.settings.transition_duration;
      })
      .ease(d3.easeLinear)
      .style('opacity', 1)
      .call(function(transition, callback) {
        if (transition.empty()) {
          callback();
        }
        var n = 0;
        transition
          .each(function() {++n; })
          .on('end', function() {
            if (!--n) {
              callback.apply(this, arguments);
            }
          });
      }, function() {
        calendarHeatmap.in_transition = false;
      });

    // Add month labels
    var month_labels = d3.timeMonths(start_of_year, end_of_year);
    var monthScale = d3.scaleLinear()
      .range([0, calendarHeatmap.settings.width])
      .domain([0, month_labels.length]);
    calendarHeatmap.labels.selectAll('.label-month').remove();
    calendarHeatmap.labels.selectAll('.label-month')
      .data(month_labels)
      .enter()
      .append('text')
      .attr('class', 'label label-month')
      .attr('font-size', function() {
        return Math.floor(calendarHeatmap.settings.label_padding / 3) + 'px';
      })
      .text(function(d) {
        return d.toLocaleDateString('en-us', { month: 'short' });
      })
      .attr('x', function(d, i) {
        return monthScale(i) + (monthScale(i) - monthScale(i - 1)) / 2;
      })
      .attr('y', calendarHeatmap.settings.label_padding / 2)
      .on('mouseenter', function(d) {
        if (calendarHeatmap.in_transition) { return; }

        var selected_month = moment(d);
        calendarHeatmap.items.selectAll('.item-circle')
          .transition()
          .duration(calendarHeatmap.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', function(d) {
            return moment(d.date).isSame(selected_month, 'month') ? 1 : 0.1;
          });
      })
      .on('mouseout', function() {
        if (calendarHeatmap.in_transition) { return; }

        calendarHeatmap.items.selectAll('.item-circle')
          .transition()
          .duration(calendarHeatmap.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', 1);
      })

    // Add day labels
    var day_labels = d3.timeDays(moment().startOf('week'), moment().endOf('week'));
    var dayScale = d3.scaleBand()
      .rangeRound([calendarHeatmap.settings.label_padding, calendarHeatmap.settings.height])
      .domain(day_labels.map(function(d) {
        return moment(d).weekday();
      }));
    calendarHeatmap.labels.selectAll('.label-day').remove();
    calendarHeatmap.labels.selectAll('.label-day')
      .data(day_labels)
      .enter()
      .append('text')
      .attr('class', 'label label-day')
      .attr('x', calendarHeatmap.settings.label_padding / 3)
      .attr('y', function(d, i) {
        return dayScale(i) + dayScale.bandwidth() / 1.75;
      })
      .style('text-anchor', 'left')
      .attr('font-size', function() {
        return Math.floor(calendarHeatmap.settings.label_padding / 3) + 'px';
      })
      .text(function(d) {
        return moment(d).format('dddd')[0];
      })
      .on('mouseenter', function(d) {
        if (calendarHeatmap.in_transition) { return; }

        var selected_day = moment(d);
        calendarHeatmap.items.selectAll('.item-circle')
          .transition()
          .duration(calendarHeatmap.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', function(d) {
            return (moment(d.date).day() === selected_day.day()) ? 1 : 0.1;
          });
      })
      .on('mouseout', function() {
        if (calendarHeatmap.in_transition) { return; }

        calendarHeatmap.items.selectAll('.item-circle')
          .transition()
          .duration(calendarHeatmap.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', 1);
      });
  },

  /**
   * Draw day overview
   */
  drawDayOverview: function() {
    // Add current overview to the history
    if (calendarHeatmap.history[calendarHeatmap.history.length - 1] !== calendarHeatmap.overview) {
      calendarHeatmap.history.push(calendarHeatmap.overview);
    }
 
     // Initialize selected date to today if it was not set
    if (!Object.keys(calendarHeatmap.selected).length) {
      calendarHeatmap.selected = calendarHeatmap.data[calendarHeatmap.data.length - 1];
    }

    calendarHeatmap.selected.details.sort(function(a,b) { 
      return new Date(a.date).getTime() - new Date(b.date).getTime() 
    });
     
    var project_labels = calendarHeatmap.selected.details.map(function(project) {
        return project.value;
    });
  
    var y = d3.scaleLinear()
            .domain([0, d3.max(project_labels, function(d) { return d; })]) // input 
            .range([calendarHeatmap.settings.height, calendarHeatmap.settings.label_padding]); // output 

    var x = d3.scaleTime()
        .range([calendarHeatmap.settings.label_padding * 2, calendarHeatmap.settings.width])
        .domain([moment(calendarHeatmap.selected.date).startOf('day'), moment(calendarHeatmap.selected.date).endOf('day')]);

    // define the line
    var valueline = d3.line()
                    .x(function(d) {return x(moment(d.date));})
                    .y(function(d) {return (y(d.value)); });
    
    calendarHeatmap.items.selectAll('.item-line').remove();                
    
    var svg = calendarHeatmap.items.append('g');

    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(50,5)")
      .call(d3.axisLeft(y));
      
    // Add the valueline path.
    svg.append("path")
        .attr('class', 'item-line')
        .data([calendarHeatmap.selected.details])
        .attr("d", valueline)
        .on('mouseover', function(d) {
          if (calendarHeatmap.in_transition) { return; }
  
        // Construct tooltip
          var tooltip_html = '';
        //  tooltip_html += '<div class="header"><strong>' + d.name + ': </strong><div><br>';
          tooltip_html += '<div> class="header" <strong>' + (calendarHeatmap.selected.details.value ? calendarHeatmap.selected.details.value : 'No temp') + ' °F tracked</strong></div>';
          tooltip_html += '<div>on ' + moment(d.date).format('dddd, MMM Do YYYY HH:mm') + '</div>';
  
          // Calculate tooltip position
          var xpos = d.value * 100 / (60 * 60 * 24) + x(moment(d.date));
          while (calendarHeatmap.settings.width - xpos < (calendarHeatmap.settings.tooltip_width + calendarHeatmap.settings.tooltip_padding * 3)) {
            xpos -= 10;
          }
          var ypos = y(d.name) + calendarHeatmap.settings.width / 2 + calendarHeatmap.settings.tooltip_padding / 2;
  
          // Show tooltip
          calendarHeatmap.tooltip.html(tooltip_html)
            .style('left', xpos + 'px')
            .style('top', ypos + 'px')
            .transition()
            .duration(calendarHeatmap.settings.transition_duration / 2)
            .ease(d3.easeLinear)
            .style('opacity', 1);
        })
        .on('mouseout', function() {
          if (calendarHeatmap.in_transition) { return; }
          calendarHeatmap.hideTooltip();
        });

    // Add time labels
    var timeLabels = d3.timeHours(
      moment(calendarHeatmap.selected.date).startOf('day'),
      moment(calendarHeatmap.selected.date).endOf('day')
    );
    
    var timeScale = d3.scaleTime()
      .range([calendarHeatmap.settings.label_padding * 2, calendarHeatmap.settings.width])
      .domain([0, timeLabels.length]);
    calendarHeatmap.labels.selectAll('.label-time').remove();
    calendarHeatmap.labels.selectAll('.label-time')
      .data(timeLabels)
      .enter()
      .append('text')
      .attr('class', 'label label-time')
      .attr('font-size', function() {
        return Math.floor(calendarHeatmap.settings.label_padding / 3) + 'px';
      })
      .text(function(d) {
        return moment(d).format('HH:mm');
      })
      .attr('x', function(d, i) {
        return timeScale(i);
      })
      .attr('y', calendarHeatmap.settings.label_padding / 2)
      .on('mouseenter', function(d) {
        if (calendarHeatmap.in_transition) { return; }
        var selected = x(moment(d));
        calendarHeatmap.items.selectAll('.item-line')
          .transition()
          .duration(calendarHeatmap.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', function(d) {
            var start = x(moment(d.date));
            var end = x(moment(d.date).add(d.value, 'seconds'));
            return (selected >= start && selected <= end) ? 1 : 0.1;
          });
      })
      .on('mouseout', function() {
        if (calendarHeatmap.in_transition) { return; }

        calendarHeatmap.items.selectAll('.item-line')
          .transition()
          .duration(calendarHeatmap.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', 0.5);
      });

    // Add project labels
    calendarHeatmap.labels.selectAll('.label-project').remove();
    calendarHeatmap.labels.selectAll('.label-project')
      .data(project_labels)
      .enter()
      .append('text')
      .attr('class', 'label label-project')
      .attr('x', calendarHeatmap.settings.gutter * 9)
      .style('text-anchor', 'left')
      .attr('font-size', function() {
        return Math.floor(calendarHeatmap.settings.label_padding / 3) + 'px';
      })
      .text(function(d) {
        return d;
      })
      .each(function() {
        var obj = d3.select(this),
          text_length = obj.node().getComputedTextLength(),
          text = obj.text();
        while (text_length > (calendarHeatmap.settings.label_padding * 1.5) && text.length > 0) {
          text = text.slice(0, -1);
          obj.text(text + '...');
          text_length = obj.node().getComputedTextLength();
        }
      })
      .on('mouseenter', function(project) {
        if (calendarHeatmap.in_transition) { return; }

        calendarHeatmap.items.selectAll('.item-line')
          .transition()
          .duration(calendarHeatmap.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', function(d) {
            return (d.name === project) ? 1 : 0.1;
          });
      })
      .on('mouseout', function() {
        if (calendarHeatmap.in_transition) { return; }

        calendarHeatmap.items.selectAll('.item-line')
          .transition()
          .duration(calendarHeatmap.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', 0.5);
      });
   },

  /**
   * Transition and remove items and labels related to global overview
   */
  removeGlobalOverview: function() {
    calendarHeatmap.items.selectAll('.item-block-year')
      .transition()
      .duration(calendarHeatmap.settings.transition_duration)
      .ease(d3.easeLinear)
      .style('opacity', 0)
      .remove();
    calendarHeatmap.labels.selectAll('.label-year').remove();
  },

  /**
   * Transition and remove items and labels related to year overview
   */
  removeYearOverview: function() {
    calendarHeatmap.items.selectAll('.item-circle')
      .transition()
      .duration(calendarHeatmap.settings.transition_duration)
      .ease(d3.easeLinear)
      .style('opacity', 0)
      .remove();
    calendarHeatmap.labels.selectAll('.label-day').remove();
    calendarHeatmap.labels.selectAll('.label-month').remove();
    calendarHeatmap.hideBackButton();
  },

  /**
   * Helper function to hide the tooltip
   */
  hideTooltip: function() {
    calendarHeatmap.tooltip.transition()
      .duration(calendarHeatmap.settings.transition_duration / 2)
      .ease(d3.easeLinear)
      .style('opacity', 0);
  },

  /**
   * Helper function to hide the back button
   */
  hideBackButton: function() {
    calendarHeatmap.buttons.selectAll('.button')
      .transition()
      .duration(calendarHeatmap.settings.transition_duration)
      .ease(d3.easeLinear)
      .style('opacity', 0)
      .remove();
  },

  /**
   * Helper function to convert seconds to a human readable format
   * @param seconds Integer
   */
  formatTime: function(seconds) {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    var time = '';
    if (hours > 0) {
      time += hours === 1 ? '1 hour ' : hours + ' hours ';
    }
    if (minutes > 0) {
      time += minutes === 1 ? '1 minute' : minutes + ' minutes';
    }
    if (hours === 0 && minutes === 0) {
      time = Math.round(seconds) + ' seconds';
    }
    return time;
  }
};