import AbstractSmartComponent from './abstract-smart-component.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const ChartBarHeight = {
  MIN: 80,
  MIDDLE: 60
}

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

Chart.defaults.global.defaultFontSize = 18;
Chart.defaults.global.defaultFontColor = '#000000';

const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const setChartHeight = (ctx, elements, container) => {
  ctx.height = elements.length < 2 ? ChartBarHeight.MIN : ChartBarHeight.MIDDLE * elements.length;
  const ID_PREFIX = `statistics__chart--`;
  const typeName = ctx.className.substring(ID_PREFIX.length);
  const wrapperClass = `.statistics__item--${typeName}`;
  container.querySelector(wrapperClass).height = ctx.height;
  console.log(ctx.height)
  console.log(container.querySelector(wrapperClass).height)

};

const getPrice = (events, type) => {
  return events.filter((event) => event.type === type).
    reduce((accumulator, item) => accumulator += item.price
  , 0)
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

  const labelNames = arrayEvents().map((item) => item.type);
  const priceValues = arrayEvents().map((item) => item.price);

  setChartHeight(moneyCtx, types, container);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,

    data: {
      labels: labelNames,
      datasets: [{
        data: priceValues,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        barPercentage: 0.9
      }]
    },
    options: {
      layout: {
        padding: {
          left: 100,
          right: 0,
          top: 0,
          bottom: 0
        }
      },
      plugins: {
        datalabels: {
          labels: {
            value: null,
            title: {
              color: `#000000`,
              anchor: `end`,
              align: `leftTupe`
            }
          },
          font: {
            size: 12
          },
          color: `#000000`
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
        fontSize: 18,
        fontColor: `#000000`
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
