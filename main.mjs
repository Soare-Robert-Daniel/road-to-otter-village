// Read more about Van.js at https://vanjs.org
import van from "./van-1.2.8.min.js";
const { div, option, select, input, label, p, sub } = van.tags;

/**
 * Romanian national holidays list.
 */
const romanianNationalHolidays = [
  "01-01", // Anul Nou
  "01-02", // A doua zi de Anul Nou
  "01-06", // Boboteaza
  "01-07", // Sf. Ioan
  "01-24", // Unirea Principatelor Române
  "05-01", // Ziua Muncii
  "06-01", // Ziua Copilului
  "08-15", // Adormirea Maicii Domnului
  "11-30", // Sf. Andrei
  "12-01", // Ziua Națională a României
  "12-25", // Crăciunul
  "12-26", // A doua zi de Crăciun
];

/**
 * Non-fixed holidays list. It must be updated every year.
 */
const nonFixedHolidays = [
  "05-03", // Vinerea Mare
  "05-05", // Paștele
  "05-06", // A doua zi de Paște
  "06-23", // Rusaliile
  "06-24", // A doua zi de Rusalii
];

/**
 * The bus schedule data used to display the hours.
 */
const busScheduleData = {
  bus: {
    420: {
      tur: {
        station: "Vidra",
        workingHours: [
          "4:50",
          "5:35",
          "6:00",
          "6:30",
          "7:00",
          "7:20",
          "8:00",
          "8:30",
          "9:35",
          "10:25",
          "11:15",
          "11:50",
          "12:30",
          "13:45",
          "15:00",
          "16:50",
          "17:50",
          "18:15",
          "18:50",
          "19:45",
          "20:40",
          "21:35",
          "22:25",
        ],
        holidayHours: [
          "5:35",
          "6:50",
          "8:10",
          "9:35",
          "10:50",
          "12:25",
          "13:20",
          "16:00",
          "17:30",
          "18:55",
          "20:15",
          "21:35",
        ],
      },
      retur: {
        station: "Eroi Revolutiei",
        workingHours: [
          "5:15",
          "5:45",
          "6:00",
          "6:45",
          "7:10",
          "7:45",
          "8:35",
          "9:15",
          "9:45",
          "10:50",
          "12:30",
          "13:45",
          "14:30",
          "15:00",
          "16:15",
          "17:00",
          "17:25",
          "18:05",
          "19:05",
          "20:05",
          "21:00",
          "21:55",
          "22:45",
        ],
        holidayHours: [
          "5:30",
          "6:45",
          "8:05",
          "9:25",
          "10:50",
          "12:05",
          "14:35",
          "16:05",
          "17:15",
          "18:45",
          "20:10",
          "21:25",
          "22:40",
        ],
      },
    },
    438: {}, // TODO: Add the 438 bus schedule
  },
};

/**
 * Check if the given date is a holiday or a weekend.
 *
 * @param {Date} date The date to check.
 * @returns {boolean} True if the date is a holiday or a weekend, false otherwise.
 */
const isHolidayProgram = (date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  const dateStr = `${month}-${day}`;

  if (romanianNationalHolidays.includes(dateStr)) {
    return true;
  }

  if (nonFixedHolidays.includes(dateStr)) {
    return true;
  }

  // Saturday and Sunday have the same program.
  if (date.getDay() === 0 || date.getDay() === 6) {
    return true;
  }

  return false;
};

// Pull the saved settings from the local storage
const savedBusOption = localStorage.getItem("busOption") ?? "420";
const savedDisplayNextDay = localStorage.getItem("displayNextDay") === "true";

// Initialize the state
const busOption = van.state(savedBusOption);
const displayNextDay = van.state(savedDisplayNextDay);
const todayDate = van.state(new Date());
const showHolidayProgram = van.state(isHolidayProgram(todayDate.val));

// Save the persisted settings to the local storage
van.derive(() => {
  localStorage.setItem("busOption", busOption.val);
  localStorage.setItem("displayNextDay", displayNextDay.val);
});

// Update the remaining time at a fixed interval.
setInterval(() => {
  const currentDate = new Date();

  // Skip if the hour and minute are the same
  if (
    currentDate.getHours() === todayDate.val.getHours() &&
    currentDate.getMinutes() === todayDate.val.getMinutes()
  ) {
    return;
  }

  todayDate.val = new Date();
}, 450);

/**
 * @typedef {Object} ComputedHour
 * @property {string} hour The hour in the format "HH:MM" (24h format).
 * @property {string} remainingTime The remaining time in format "HH:MM" or "SS".
 * @property {boolean} isNextDay True if the hour is for the next day, false otherwise.
 */

/**
 * For a given hour from the bus schedule, compute the remaining time until that hour and if it's for the next day.
 *
 * @param {string} hour The hour to compute.
 * @returns {ComputedHour} The computed hour.
 */
const computeHour = (hour) => {
  const [hourStr, minuteStr] = hour.split(":");

  const hourDate = new Date();
  hourDate.setHours(hourStr);
  hourDate.setMinutes(minuteStr);
  hourDate.setSeconds(0);

  const timeDiff = hourDate - todayDate.val;
  if (timeDiff < 0) {
    // Get the time remaining until the next day at the same hour.
    hourDate.setDate(todayDate.val.getDate() + 1);
  }

  const diffDate = new Date(hourDate - todayDate.val);

  // Create the remaining time string. Add a leading zero if the number is less than 10 to keep the format consistent.
  let remainingTime = `${diffDate
    .getUTCHours()
    .toString()
    .padStart(2, "0")}:${diffDate.getUTCMinutes().toString().padStart(2, "0")}`;

  // If the remaining time is less than minute, display only the seconds.
  if (diffDate.getUTCHours() == 0 && diffDate.getUTCMinutes() == 0) {
    remainingTime = `${diffDate.getUTCSeconds().toString().padStart(2, "0")}`;
  }

  return {
    hour,
    remainingTime,
    isNextDay: timeDiff < 0,
  };
};

/**
 * Render the settings component.
 *
 * @returns {HTMLElement} The settings component.
 */
const Settings = () => {
  return div(
    {
      className: "settings",
    },
    div(
      select(
        {
          onchange: (e) => (busOption = e.target.value),
          value: busOption.val,
        },
        option({ value: "420" }, "Linia🌿420")
        // option({ value: "438" }, "438")
      )
    ),
    div(
      select(
        {
          onchange: (e) => {
            showHolidayProgram.val = e.target.value === "holiday";
          },
          value: showHolidayProgram.val ? "holiday" : "work",
          className: "program-select",
        },
        option({ value: "work" }, "Zi de lucru"),
        option({ value: "holiday" }, "Sărbătoare/Weekend")
      )
    ),
    div(
      label(
        input({
          type: "checkbox",
          onchange: (e) => {
            displayNextDay.val = e.target.checked;
          },
          checked: displayNextDay.val,
        }),
        "Complet"
      )
    )
  );
};

/**
 * Render the hours display component.
 *
 * @param {Object} props The component props.
 * @param {ComputedHour[]} props.computedHours The computed hours list.
 * @returns {HTMLElement} The hours display component.
 */
const HoursDisplay = ({ computedHours }) => {
  return div(
    {
      className: "hours-display-container",
    },
    computedHours.map((computedHour) => {
      return div(
        {
          className: "hour",
        },
        p(
          {
            className: "hour-time",
          },
          computedHour.hour,
          sub(
            {
              className:
                "hour-remaning-time " +
                (computedHour?.isNextDay ? "next-day" : ""),
            },
            ` (${computedHour?.remainingTime})`
          )
        )
      );
    })
  );
};

/**
 * Render the hours column display component.
 * @param {Object} props The component props.
 * @param {string} props.title The column title.
 * @param {ComputedHour[]} props.computedHours The computed hours list.
 * @returns {HTMLElement} The hours column display component.
 */
const HoursColumnDisplay = ({ title, computedHours }) => {
  return div(
    {
      className: "hours-display-column",
    },
    div(
      {
        className: "hours-display-header",
      },
      p(title)
    ),
    HoursDisplay({ computedHours })
  );
};

/**
 * Render the hours section display component.
 * @returns {HTMLElement} The hours section display component.
 */
const HoursSectionDisplay = () => {
  const turComputedHours = (
    showHolidayProgram.val
      ? busScheduleData.bus[busOption.val].tur.holidayHours
      : busScheduleData.bus[busOption.val].tur.workingHours
  )
    .map(computeHour)
    .filter((computedHour) => !computedHour.isNextDay || displayNextDay.val);

  const returComputedHours = (
    showHolidayProgram.val
      ? busScheduleData.bus[busOption.val].retur.holidayHours
      : busScheduleData.bus[busOption.val].retur.workingHours
  )
    .map(computeHour)
    .filter((computedHour) => !computedHour.isNextDay || displayNextDay.val);

  if (turComputedHours.length === 0 && returComputedHours.length === 0) {
    return div(
      {
        className: "hours-display-section",
      },
      p(
        {
          className: "no-hours",
        },
        "Numai sunt curse disponibile pentru ziua de azi."
      )
    );
  }

  return div(
    {
      className: "hours-display-section",
    },
    HoursColumnDisplay({
      title: "Spre București",
      computedHours: turComputedHours,
    }),
    HoursColumnDisplay({
      title: "Spre Vidra",
      computedHours: returComputedHours,
    })
  );
};

// Add the components to the DOM to be rendered.
van.add(document.querySelector("#settings"), Settings());
van.add(document.querySelector("#app"), () => HoursSectionDisplay());
