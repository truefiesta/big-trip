import AbstractSmartComponent from "./abstract-smart-component.js";
import {eventTypeIcons, transferTypes} from "../const.js";
import {getDuration, formatDurationString} from "../utils/common.js";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

const BAR_HEIGHT = 55;

const calculateCtxHeight = (dataQuantity) => {
  return BAR_HEIGHT * dataQuantity;
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
  for (const [type, moneyTotal] of Object.entries(moneySpendByEventType)) {
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

const renderTransportChart = (transportCtx, events) => {
  const timesTransportTypeUsed = {};
  events.forEach((event) => {
    const type = event.type;
    if (transferTypes.includes(type)) {
      if (!timesTransportTypeUsed[type]) {
        timesTransportTypeUsed[type] = 1;
      } else {
        ++timesTransportTypeUsed[type];
      }
    }
  });

  const totalTimesTransportTypeUsed = [];
  for (const [type, timesUsed] of Object.entries(timesTransportTypeUsed)) {
    totalTimesTransportTypeUsed.push({type, timesUsed});
  }

  const sortedTimesTransportTypeUsed = totalTimesTransportTypeUsed.slice().sort((a, b) => {
    return b.timesUsed - a.timesUsed;
  });

  const types = sortedTimesTransportTypeUsed.map((it) => it.type);
  const totalTimesByTransportType = sortedTimesTransportTypeUsed.map((it) => it.timesUsed);

  transportCtx.height = calculateCtxHeight(types.length);

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      datasets: [{
        data: totalTimesByTransportType,
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
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
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

const renderTimeSpendChart = (timeSpendCtx, events) => {
  const timeSpendByEventType = {};
  events.forEach((event) => {
    if (!timeSpendByEventType[event.type]) {
      timeSpendByEventType[event.type] = getDuration(event.time.startTime, event.time.endTime);
    } else {
      timeSpendByEventType[event.type] += getDuration(event.time.startTime, event.time.endTime);
    }
  });

  const timeSpendAndEventType = [];
  for (const [type, timeTotal] of Object.entries(timeSpendByEventType)) {
    timeSpendAndEventType.push({type, timeTotal});
  }

  const sortedTimeSpendAndEventType = timeSpendAndEventType.slice().sort((a, b) => {
    return b.timeTotal - a.timeTotal;
  });

  const types = sortedTimeSpendAndEventType.map((it) => it.type);
  const totalTimeSpendByType = sortedTimeSpendAndEventType.map((it) => it.timeTotal);

  timeSpendCtx.height = calculateCtxHeight(types.length);

  return new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      datasets: [{
        data: totalTimeSpendByType,
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
          formatter: (val) => {
            return formatDurationString(val);
          }
        }
      },
      title: {
        display: true,
        text: `TIME SPEND`,
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
    this._transportChart = null;
    this._timeSpendChart = null;

    this._isHidden = true;

    this._onEventsChange = this._onEventsChange.bind(this);
    this._pointsModel.setEventsChangeHandler(this._onEventsChange);

    this._renderAllCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  hide() {
    this._isHidden = true;
    super.hide();
  }

  show() {
    this._isHidden = false;
    super.show();
  }

  _rerender() {
    super.rerender();

    if (this._isHidden) {
      this.hide();
    }

    this._renderAllCharts();
  }

  _renderAllCharts() {
    const events = this._pointsModel.getAllEvents();
    this._renderMoneyChart(events);
    this._renderTransportChart(events);
    this._renderTimeSpendChart(events);
  }

  _renderMoneyChart(events) {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    const moneyCtxElement = this.getElement().querySelector(`.statistics__chart--money`);
    this._moneyChart = renderMoneyChart(moneyCtxElement, events);
  }

  _renderTransportChart(events) {
    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    const transportCtxElement = this.getElement().querySelector(`.statistics__chart--transport`);
    this._transportChart = renderTransportChart(transportCtxElement, events);
  }

  _renderTimeSpendChart(events) {
    if (this._timeSpendChart) {
      this._timeSpendChart.destroy();
      this._timeSpendChart = null;
    }

    const timeSpendCtxElement = this.getElement().querySelector(`.statistics__chart--time`);
    this._timeSpendChart = renderTimeSpendChart(timeSpendCtxElement, events);
  }

  _onEventsChange() {
    this._rerender();
  }

  recoverListeners() {}
}
