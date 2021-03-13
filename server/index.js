var { generateOffice365Schedule, parseAvailableSlots } = require("./utils/schedule")
var { now } = require("./utils/dateHelper");

var express = require('express');
var app = express();
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.json());
var port = 8080;

app.get('/availability', function (req, res) {
    let data;
    let availableSlots;

    const { query } = req;
    const { startDate, endDate, startTime, endTime } = query;

    if (startDate && endDate) {
      data = generateOffice365Schedule(startDate, endDate);
    }

    if (data && data.value && data.value[0] && data.value[0].availabilityView) {
      availableSlots = data.value[0].availabilityView;
    }
    
    return res.send(parseAvailableSlots({
      startDateRaw: startDate,
      endDateRaw: endDate,
      availableSlots,
      startTime,
      endTime,
    }));
});

function generateMockUpResponse() {
    const d1 = now().set({ hour: 10 });
    const d2 = d1.plus({ hours: 1, days: 1 });

    return [
        {
          date: d1.toFormat("dd/MM/yyyy"),
          availableSlots: [
            { startTime: "9:00", endTime: "10:00" },
            { startTime: "10:00", endTime: "11:00" }
          ]
        },
        {
          date: d2.toFormat("dd/MM/yyyy"),
          availableSlots: [
            { startTime: "15:00", endTime: "16:00" },
            { startTime: "16:00", endTime: "17:00" }
          ]
        }
      ];
}
  
app.listen(port, () => console.log(`App listening on port ${port}!`))