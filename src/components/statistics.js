import AbstractSmartComponent from "./abstract-smart-component.js";
import {eventTypeIcons} from "../const.js";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

const BAR_HEIGHT = 55;

const calculateCtxHeight = (dataQuantity) => {
  return BAR_HEIGHT * dataQuantity;
};

const getUniqueItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const renderMoneyChart = (moneyCtx, events) => {
  const moneySpendByEventType = {};
  events.forEach((event) => {
    if (!moneySpendByEventType[event.type]) {
      moneySpendByEventType[event.type] = event.price;
    } else {
      moneySpendByEventType[event.type] += event.price;
    }
  });

  const moneySpendAndEventType = [];
  for (let [type, moneyTotal] of Object.entries(moneySpendByEventType)) {
    moneySpendAndEventType.push({type, moneyTotal});
  }

  const sortedMoneySpendAndEventType = moneySpendAndEventType.slice().sort((a, b) => {
    return b.moneyTotal - a.moneyTotal;
  });

  const types = sortedMoneySpendAndEventType.map((it) => it.type);
  const totalMoneySpendByType = sortedMoneySpendAndEventType.map((it) => it.moneyTotal);

  moneyCtx.height = calculateCtxHeight(types.length);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      datasets: [{
        data: totalMoneySpendByType,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        barThickness: 44,
        minBarLength: 50
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
            callback: (type) => {
              return `${eventTypeIcons[type]} ${type.toUpperCase()}`;
            }
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTransportChart = () => {};
const renderTimeSpendChart = () => {};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(pointsModel) {
    super();
    this._pointsModel = pointsModel;
    this._moneyChart = null;

    this._onEventsChange = this._onEventsChange.bind(this);
    this._pointsModel.setEventsChangeHandler(this._onEventsChange);

    this._renderAllCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  _rerender() {
    super.rerender();
    this._renderAllCharts();
  }

  _renderAllCharts() {
    const events = this._pointsModel.getAllEvents();
    this._renderMoneyChart(events);
  }

  _renderMoneyChart(events) {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }
    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    this._moneyChart = renderMoneyChart(moneyCtx, events);
  }

  _onEventsChange() {
    this._rerender();
  }

  recoveryListeners() {}

}
