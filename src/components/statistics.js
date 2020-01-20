import AbstractSmartComponent from './abstract-smart-component.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {TYPES_TRANSPORT} from '../const.js';
import moment from 'moment';
import {sortEventsInOrder} from '../utils/common.js';

const EMPTY_NUMBER = 0;
const ELEMENTS_MIN_LENGTH = 2;

const ChartSettings = {
  BAR_MIN: 130,
  BAR_HEIGHT: 65,
  BAR_THICKNESS: 40,
  BAR_MIN_LENGTH: 50,
  PADDING: 0,
  PADDING_LEFT: 100,
  BAR_PERCENTAGE: 0.9,
  FONT_SIZE: 12,
  FONT_SIZE_TITLE: 19,
  FONT_SIZE_LABELS: 12,
  FONT_COLOR: `#000000`,
  BACKGROUND_COLOR: `#ffffff`
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart--money" width="900" height="300"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time">
        <canvas class="statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const setChartHeight = (ctx, elements, container) => {
  ctx.height = elements.length < ELEMENTS_MIN_LENGTH ? ChartSettings.BAR_MIN : ChartSettings.BAR_HEIGHT * elements.length;
  const ID_PREFIX = `statistics__chart--`;
  const typeName = ctx.className.substring(ID_PREFIX.length);
  const wrapperClass = `.statistics__item--${typeName}`;
  container.querySelector(wrapperClass).height = ctx.height;
};

const getPrice = (events, type) => {
  return events.filter((event) => event.type === type).
    reduce((accumulator, point) => {
      accumulator += point.price;
      return accumulator;
    }, EMPTY_NUMBER);
};

const getTypes = (events) => {
  return events
    .map((event) => event.type)
    .filter(getUniqItems);
};

const getTime = (events, type) => {
  const eventsByType = events.filter((event) => event.type === type);
  const result = eventsByType.reduce((accumulator, event) => {
    const startDateMoment = moment(event.startDate);
    const endDateMoment = moment(event.endDate);
    const duration = moment.duration(endDateMoment.diff(startDateMoment));
    accumulator += duration.asDays();
    return accumulator;
  }, EMPTY_NUMBER);
  return result;
};

const renderMoneyChart = (moneyCtx, events, container) => {
  const types = getTypes(events);

  const getEventsModify = () => {
    const eventsWithPrice = types.map((name) => {
      return {
        type: name,
        price: getPrice(events, name)
      };
    });
    return eventsWithPrice.sort((leftType, rightType) => rightType.price - leftType.price);
  };

  const labelNames = getEventsModify().map((point) => point.type.toUpperCase());
  const priceValues = getEventsModify().map((point) => point.price);

  setChartHeight(moneyCtx, types, container);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,

    data: {
      labels: labelNames,
      datasets: [{
        data: priceValues,
        backgroundColor: ChartSettings.BACKGROUND_COLOR,
        hoverBackgroundColor: ChartSettings.BACKGROUND_COLOR,
        minBarLength: ChartSettings.BAR_MIN_LENGTH,
        barThickness: ChartSettings.BAR_THICKNESS
      }]
    },
    options: {
      plugins: {
        datalabels: {
          labels: {
            title: {
              color: ChartSettings.FONT_COLOR,
              anchor: `end`,
              align: `start`
            }
          },
          font: {
            size: ChartSettings.FONT_SIZE_LABELS
          },
          formatter(value) {
            return `€ ${value}`;
          },
          color: ChartSettings.FONT_COLOR
        }
      },
      scales: {
        offset: false,
        yAxes: [{
          gridLines: {
            display: false,
          },
        }],
        xAxes: [{
          gridLines: {
            display: false,
          },
          ticks: {
            display: false
          }
        }]
      },
      title: {
        text: `MONEY`,
        fontSize: ChartSettings.FONT_SIZE_TITLE,
        fontColor: ChartSettings.FONT_COLOR
      },
      tooltips: {
        callbacks: {
          title() {},
          label() {}
        }
      }
    }
  });
};

const getCount = (events, type) => {
  return events.filter((event) => event.type === type).length;
};

const renderTransportChart = (transportCtx, events, container) => {
  const typesInEvents = TYPES_TRANSPORT.filter((type) => {
    return events.some((event) => event.type === type);
  });

  const getEventsModify = () => {
    const eventsWithCount = typesInEvents.map((name) => {
      return {
        type: name,
        count: getCount(events, name)
      };
    });
    return eventsWithCount.sort((leftType, rightType) => rightType.count - leftType.count);
  };

  const labelNames = getEventsModify().map((point) => point.type.toUpperCase());
  const countValues = getEventsModify().map((point) => point.count);
  setChartHeight(transportCtx, typesInEvents, container);

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: labelNames,
      datasets: [{
        data: countValues,
        backgroundColor: ChartSettings.BACKGROUND_COLOR,
        hoverBackgroundColor: ChartSettings.BACKGROUND_COLOR,
        minBarLength: ChartSettings.BAR_MIN_LENGTH,
        barThickness: ChartSettings.BAR_THICKNESS
      }]
    },
    options: {
      plugins: {
        datalabels: {
          labels: {
            title: {
              color: ChartSettings.FONT_COLOR,
              anchor: `end`,
              align: `start`
            }
          },
          font: {
            size: ChartSettings.FONT_SIZE_LABELS
          },
          formatter(value) {
            return `${value}x`;
          },
          color: ChartSettings.FONT_COLOR
        }
      },
      scales: {
        offset: false,
        yAxes: [{
          gridLines: {
            display: false,
          },
        }],
        xAxes: [{
          gridLines: {
            display: false,
          },
          ticks: {
            display: false
          }
        }]
      },
      title: {
        text: `TRANSPORT`,
        fontSize: ChartSettings.FONT_SIZE_TITLE,
        fontColor: ChartSettings.FONT_COLOR
      },
      tooltips: {
        callbacks: {
          title() {},
          label() {}
        }
      }
    }
  });
};

const renderTimeChart = (timeCtx, events, container) => {
  const types = getTypes(events);

  const getEventsModify = () => {
    const eventsWithTime = types.map((name) => {
      return {
        type: name,
        time: getTime(events, name)
      };
    });
    return eventsWithTime.sort((leftType, rightType) => rightType.time - leftType.time);
  };

  const eventsMoreDay = getEventsModify().filter((point) => point.time >= 1);

  const labelNames = eventsMoreDay.map((point) => point.type.toUpperCase());
  const timeValues = eventsMoreDay.map((point) => Math.floor(point.time));
  setChartHeight(timeCtx, eventsMoreDay, container);

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: labelNames,
      datasets: [{
        data: timeValues,
        backgroundColor: ChartSettings.BACKGROUND_COLOR,
        hoverBackgroundColor: ChartSettings.BACKGROUND_COLOR,
        minBarLength: ChartSettings.BAR_MIN_LENGTH,
        barThickness: ChartSettings.BAR_THICKNESS
      }]
    },
    options: {
      plugins: {
        datalabels: {
          labels: {
            title: {
              color: ChartSettings.FONT_COLOR,
              anchor: `end`,
              align: `start`
            }
          },
          font: {
            size: ChartSettings.FONT_SIZE_LABELS
          },
          formatter(value) {
            return `${value}D`;
          },
          color: ChartSettings.FONT_COLOR
        }
      },
      scales: {
        offset: false,
        yAxes: [{
          gridLines: {
            display: false,
          },
        }],
        xAxes: [{
          gridLines: {
            display: false,
          },
          ticks: {
            display: false
          }
        }]
      },
      title: {
        text: `TIME SPENT`,
        fontSize: ChartSettings.FONT_SIZE_TITLE,
        fontColor: ChartSettings.FONT_COLOR
      },
      tooltips: {
        callbacks: {
          title() {},
          label() {}
        }
      }
    }
  });
};

Chart.defaults.global.defaultFontSize = ChartSettings.FONT_SIZE;
Chart.defaults.global.defaultFontColor = ChartSettings.FONT_COLOR;
Chart.defaults.global.layout.padding = {
  left: ChartSettings.PADDING_LEFT,
  right: ChartSettings.PADDING,
  top: ChartSettings.PADDING,
  bottom: ChartSettings.PADDING
};
Chart.defaults.global.legend.display = false;
Chart.defaults.global.title.display = true;
Chart.defaults.global.title.position = `left`;
Chart.defaults.horizontalBar.tooltips.mode = false;
Chart.scaleService.updateScaleDefaults(`linear`, {
  ticks: {
    min: EMPTY_NUMBER
  }
});

export default class Statistics extends AbstractSmartComponent {
  constructor(events) {
    super();

    this._events = events;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  recoveryListeners() {}

  show() {
    super.show();
    this.rerender();
    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, sortEventsInOrder(this._events.getEventsAll()), this._element);
    this._transportChart = renderTransportChart(transportCtx, sortEventsInOrder(this._events.getEventsAll()), this._element);
    this._timeChart = renderTimeChart(timeCtx, sortEventsInOrder(this._events.getEventsAll()), this._element);
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeChart) {
      this._timeChart.destroy();
      this._timeChart = null;
    }
  }
}
