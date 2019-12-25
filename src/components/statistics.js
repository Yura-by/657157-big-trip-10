import AbstractSmartComponent from './abstract-smart-component.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart statistics__chart--money" width="400" height="400"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
}

//Chart.defaults.global.defaultFontSize = 18;

const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const renderMoneyChart = (moneyCtx, events) => {
  const types = events
    .map((event) => event.type)
    .filter(getUniqItems);


  return new Chart(moneyCtx, {
    //plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      datasets: [{
        data: [5, 12, 16],//colors.map((color) => calcUniqCountColor(tasks, color)),
        //backgroundColor: `#ffffff`
      }]
    },
    options: {
      /*scales: {
        yAxes: [{
          gridLines: {
            display: false,
          }
        }],
        xAxes: [{
          gridLines: {
            display: false,
          },
          ticks: {
            display: false
          }
        }]
      },*/
      title: {
        display: true,
        text: `MONEY`,
        //position: `left`,
        //fontSize: 20,
        fontColor: `#000000`
      },
      legend: {
        display: false,
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

    this._moneyChart = renderMoneyChart(moneyCtx, this._events.getEvents());

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

/*const renderColorsChart = (colorsCtx) => {
  return new Chart(colorsCtx, {
    plugins: [ChartDataLabels],
    type: `pie`,
    data: {
      labels: [`red`, `blue`],
      datasets: [{
        data: [10, 15],
        backgroundColor: [`#ff0000`, `#0000ff`]
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {

            return `${blue} TASKS — ${red}%`;
          }
        },
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15
      },
      title: {
        display: true,
        text: `DONE BY: COLORS`,
        fontSize: 16,
        fontColor: `#000000`
      },
      legend: {
        position: `left`,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 500,
          fontColor: `#000000`,
          fontSize: 13
        }
      }
    }
  });
};*/
