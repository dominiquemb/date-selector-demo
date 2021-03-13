import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import moment from 'moment';
import { getByDisplayValue } from '@testing-library/react';

function App() {

  let daysOfWeek;
  //let dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  let todaysDate;
  const [daysToDisplay, setDaysToDisplay] = React.useState([]);

  const getDays = async () => {
    const { data: daysWithAvailability } = await getAvailability();
    todaysDate = moment(new Date());
    let newDaysToDisplay = [];
    
    //let todaysDayNumber = todaysDate.getDay();
    let maxDaysInTheFuture = 30;
    //let dayNumberIndex = todaysDayNumber;
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
      };

      if (daysWithAvailability) {
        daysWithAvailability.map((availableDay) => {
          if (availableDay.date === dateObj.formattedDate) {
            dateObj.available = true;
          }
        })
      }

      console.log(daysWithAvailability)

      newDaysToDisplay.push(dateObj);

      dateIterated = moment(todaysDate).add(iterations+1, 'days');
    }

    console.log(newDaysToDisplay);
    setDaysToDisplay(newDaysToDisplay);
  }

  const getAvailability = async() => {
    return await axios.get(`http://localhost:3000/availability`);
  }

  const displaySlots = (date) => {
    if (!date.available) {
      return;
    }
  }

  React.useEffect(() => {
    if (!daysToDisplay.length) {
      getDays();
    }
  }, [daysToDisplay])

  return (
    <div className="App">
      <div className="daysContainer">
        {daysToDisplay && daysToDisplay.map((date) => (
          <div className={`dateBox ${date.available ? 'available' : ''}`} onClick={() => displaySlots(date)}>
            <div className="monthDay">
              {date.showMonth && <span className="month">{date.monthName}</span>}
              {' '}
              <span className="day">{date.dayNumber}</span>
            </div>
            <div className="dayOfWeek">{date.dayName}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
