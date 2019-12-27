import AbstractSmartComponent from './abstract-smart-component.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

/*const ChartSettings = {
  MIN: 100,
  MIDDLE: 60,
  MAX_THICKNESS: 50,
  MIN_LENGTH: 40,
  PADDING: 0,
  PADDING_LEFT: 100,
  PERCENTAGE: 0.9
};*/

const ChartSettings = {
  BAR_MIN: 100,
  BAR_MIDDLE: 60,
  BAR_MAX_THICKNESS: 50,
  BAR_MIN_LENGTH: 50,
  PADDING: 0,
  PADDING_LEFT: 100,
  BAR_PERCENTAGE: 0.9,
  FONT_SIZE: 14,
  FONT_SIZE_TITLE: 20,
  FONT_SIZE_LABELS: 12,
  FONT_COLOR: `#000000`,
  BACKGROUND_COLOR: `#ffffff`
};

const START_PRICE = 0;

const ELEMENTS_MIN_LENGTH = 2;

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
}

Chart.defaults.global.defaultFontSize = ChartSettings.FONT_SIZE;
Chart.defaults.global.defaultFontColor = ChartSettings.FONT_COLOR;

const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const setChartHeight = (ctx, elements, container) => {
  ctx.height = elements.length < ELEMENTS_MIN_LENGTH ? ChartSettings.BAR_MIN : ChartSettings.BAR_MIDDLE * elements.length;
  const ID_PREFIX = `statistics__chart--`;
  const typeName = ctx.className.substring(ID_PREFIX.length);
  const wrapperClass = `.statistics__item--${typeName}`;
  container.querySelector(wrapperClass).height = ctx.height;
};

const getPrice = (events, type) => {
  return events.filter((event) => event.type === type).
    reduce((accumulator, item) => accumulator += item.price
  , START_PRICE)
};

const renderMoneyChart = (moneyCtx, events, container) => {
  const types = events
    .map((event) => event.type)
    .filter(getUniqItems);

  const arrayEvents = () => {
    const eventsWithPrice = types.map((name) => {
      return {
        type: name,
        price: getPrice(events, name)
      }
    });
    return eventsWithPrice.sort((leftType, rightType) => rightType.price - leftType.price)
  };

  const labelNames = arrayEvents().map((item) => item.type.toUpperCase());
  const priceValues = arrayEvents().map((item) => item.price);

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
        barPercentage: ChartSettings.BAR_PERCENTAGE,
        maxBarThickness: ChartSettings.BAR_MAX_THICKNESS,
        minBarLength: ChartSettings.BAR_MIN_LENGTH
      }]
    },
    options: {
      layout: {
        padding: {
          left: ChartSettings.PADDING_LEFT,
          right: ChartSettings.PADDING,
          top: ChartSettings.PADDING,
          bottom: ChartSettings.PADDING
        }
      },
      plugins: {
        datalabels: {
          labels: {
            value: null,
            title: {
              color: ChartSettings.FONT_COLOR,
              anchor: `end`,
              align: `start`
            }
          },
          font: {
            size: ChartSettings.FONT_SIZE_LABELS
          },
          formatter: function(value, context) {
            return `€ ${value}`
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
        display: true,
        text: `MONEY`,
        position: `left`,
        fontSize: ChartSettings.FONT_SIZE_TITLE,
        fontColor: ChartSettings.FONT_COLOR
      },
      legend: {
        display: false,
      },
      tooltips: {
        mode: false,
        callbacks: {
          title: function() {},
          label: function() {}
        }
      }
    }
  });
};

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

  _renderCharts() {
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, this._events.getEvents(), this._element);
    //this._moneyChart.canvas.parentNode.style.height = '128px';
    //this._moneyChart.canvas.parentNode.style.width = '300px';
    //this._moneyChart.canvas.height = `100`

    //this._transportChart = renderColorsChart(transportCtx, this._events.getEvents());
    //this._transportChart = renderTransportChart(transportCtx, this._events.getEvents());
    //this._timeChart = renderIimeChart(colorsCtx, this._events.getEvents());
  }

  recoveryListeners() {}

  rerender() {
    super.rerender();

    this._renderCharts();
  }

  show() {
    super.show();

    this.rerender();
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
