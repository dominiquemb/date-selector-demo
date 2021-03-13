import React from 'react';
import './Calendar.css';
import axios from 'axios';
import moment from 'moment';

function Calendar() {
    let todaysDate;
    const [daysToDisplay, setDaysToDisplay] = React.useState([]);
    const [timesToDisplay, setTimesToDisplay] = React.useState([]);
    const [selectedDay, setSelectedDay] = React.useState({});
  
    const getHours = (startTime, endTime) => {
      let hours = [];
      let i = startTime;
      let max = endTime <= 24 && endTime > startTime ? endTime : 24;
  
      for (i; i <= max; i++) {
          hours.push({
            time: `${i}:00`,
            available: false,
          });
      }
  
      return hours;
    }
  
    const getDays = async () => {
      const openingHour = 8;
      const closingHour = 21;

      todaysDate = moment(new Date());
      const { data: daysWithAvailability } = await getAvailability({
          startDate: todaysDate.format('YYYY-MM-DD') + 'T00:00:00',
          endDate: moment(todaysDate).add(30, 'days').format('YYYY-MM-DD' + 'T00:00:00'),
          startTime: openingHour + ':00',
          endTime: closingHour + ':00',
      });

      let newDaysToDisplay = [];
      let maxDaysInTheFuture = 30;
      let iterations = 0;
      let dateIterated = moment(todaysDate);
  
      for (iterations = 0; iterations < maxDaysInTheFuture; iterations++) {
        let dateObj = {
          dayName: dateIterated.format('ddd'),
          dayNumber: dateIterated.format('Do'),
          monthName: dateIterated.format('MMM'),
          showMonth: todaysDate.month() !== dateIterated.month(),
          formattedDate: dateIterated.format('DD/MM/YYYY'),
          available: false,
          hours: getHours(openingHour, closingHour),
        };
  
        if (daysWithAvailability) {
          daysWithAvailability.map((availableDay) => {
            if (availableDay.date === dateObj.formattedDate) {
              dateObj.available = true;
  
              availableDay.availableSlots.map((slot) => {
                dateObj.hours.forEach((timeObj, i) => {
                  if (slot.startTime === timeObj.time) {
                    dateObj.hours[i].available = true;
                  }
                });
              });
            }
          })
        }
    
        newDaysToDisplay.push(dateObj);
  
        dateIterated = moment(todaysDate).add(iterations+1, 'days');
      }
  
      setDaysToDisplay(newDaysToDisplay);
    }
  
    const getAvailability = async({startDate, endDate, startTime, endTime}) => {
      return await axios.get(`http://localhost:3000/availability`, {
          params: {
              startDate,
              endDate,
              startTime,
              endTime
          }
      });
    }
  
    const displaySlots = (date) => {
      if (!date.available) {
        return;
      }
      setSelectedDay(date);
      setTimesToDisplay(date.hours);
    }
  
    React.useEffect(() => {
      if (!daysToDisplay.length) {
        getDays();
      }
    }, [daysToDisplay, timesToDisplay]);

    return (
        <div className="App">
          <div className="daysContainer">
            {daysToDisplay && daysToDisplay.map((date) => (
              <div className={`dateBox ${date.available ? 'available' : ''} ${selectedDay.formattedDate === date.formattedDate ? 'selected' : ''}`} onClick={() => displaySlots(date)}>
                <div className="monthDay">
                  {date.showMonth && <span className="month">{date.monthName}</span>}
                  {' '}
                  <span className="day">{date.dayNumber}</span>
                </div>
                <div className="dayOfWeek">{date.dayName}</div>
              </div>
            ))}
          </div>
          <div className="timeContainer">
            {timesToDisplay && timesToDisplay.map((timeObj) => (
              <div className={`timeBox ${timeObj.available ? 'available' : ''}`}>
                {timeObj.time}
              </div>
            ))}
          </div>
        </div>
      );
}
    
export default Calendar;