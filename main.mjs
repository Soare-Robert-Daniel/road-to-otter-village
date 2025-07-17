// Read more about Van.js at https://vanjs.org
import van from "./van.min.js";
const {
  div,
  option,
  select,
  input,
  label,
  p,
  table,
  thead,
  tbody,
  tr,
  th,
  td,
  span,
} = van.tags;

/**
 * Romanian national holidays list.
 */
const romanianNationalHolidays = [
  { date: "01-01", name: "Anul Nou" },
  { date: "01-02", name: "A doua zi de Anul Nou" },
  { date: "01-06", name: "Boboteaza" },
  { date: "01-07", name: "Sf. Ioan" },
  { date: "01-24", name: "Unirea Principatelor Române" },
  { date: "05-01", name: "Ziua Muncii" },
  { date: "06-01", name: "Ziua Copilului" },
  { date: "08-15", name: "Adormirea Maicii Domnului" },
  { date: "11-30", name: "Sf. Andrei" },
  { date: "12-01", name: "Ziua Națională a României" },
  { date: "12-25", name: "Crăciunul" },
  { date: "12-26", name: "A doua zi de Crăciun" },
];

/**
 * Non-fixed holidays list. It must be updated every year.
 */
const nonFixedHolidays = [
  { date: "04-18", name: "Vinerea Mare" },
  { date: "04-20", name: "Paștele" },
  { date: "04-21", name: "A doua zi de Paște" },
  { date: "06-08", name: "Rusaliile" },
  { date: "06-09", name: "A doua zi de Rusalii" },
];

const appSettings = {
  style: {
    secondaryColor: {
      420: {
        light: "oklch(1 0 0)",
        dark: "oklch(0 0 0)",
      },
      438: {
        light: "oklch(0.96 0.06 195.03)",
        dark: "oklch(0.28 0.06 193.34)",
      },
    },
  },
};

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
          "5:25",
          "5:55",
          "6:25",
          "7:10",
          "7:55",
          "8:35",
          "9:15",
          "9:55",
          "10:35",
          "11:55",
          "13:15",
          "14:35",
          "15:20",
          "16:00",
          "16:40",
          "17:25",
          "18:10",
          "19:00",
          "19:45",
          "20:25",
          "21:05",
          "21:45",
          "22:25",
        ],
        weekendHours: [
          "5:35",
          "6:50",
          "8:10",
          "9:30",
          "10:50",
          "12:15",
          "13:25",
          "16:05",
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
          "6:00",
          "6:40",
          "7:15",
          "7:50",
          "8:40",
          "9:20",
          "9:55",
          "10:35",
          "11:55",
          "13:15",
          "14:30",
          "15:15",
          "15:55",
          "16:40",
          "17:25",
          "18:05",
          "18:45",
          "19:30",
          "20:15",
          "21:00",
          "22:00",
          "22:50",
        ],
        weekendHours: [
          "5:30",
          "6:40",
          "7:55",
          "9:20",
          "10:45",
          "12:05",
          "14:40",
          "16:00",
          "17:15",
          "18:40",
          "20:05",
          "21:25",
          "22:40",
        ],
      },
    },
    438: {
      tur: {
        workingHours: [
          "4:50",
          "5:20",
          "5:45",
          "6:15",
          "6:45",
          "7:20",
          "7:55",
          "8:30",
          "9:10",
          "9:45",
          "10:20",
          "11:00",
          "11:40",
          "12:25",
          "13:10",
          "13:57",
          "14:37",
          "15:10",
          "15:42",
          "16:10",
          "16:37",
          "17:09",
          "17:44",
          "18:14",
          "18:47",
          "19:25",
          "20:02",
          "20:42",
          "21:18",
          "21:51",
          "22:30",
        ],
        weekendHours: [
          "5:00",
          "6:10",
          "7:30",
          "8:50",
          "10:15",
          "11:40",
          "14:14",
          "17:14",
          "18:37",
          "20:02",
          "21:24",
          "22:15",
          "23:10",
        ],
      },
      retur: {
        workingHours: [
          "5:10",
          "5:40",
          "6:14",
          "6:53",
          "7:27",
          "8:03",
          "8:38",
          "9:11",
          "9:40",
          "10:16",
          "10:48",
          "11:23",
          "12:03",
          "12:45",
          "13:30",
          "14:15",
          "15:00",
          "15:40",
          "16:14",
          "16:50",
          "17:20",
          "17:50",
          "18:20",
          "18:52",
          "19:20",
          "19:50",
          "20:25",
          "21:00",
          "21:35",
          "22:10",
          "22:40",
        ],
        weekendHours: [
          "4:50",
          "5:50",
          "7:00",
          "8:20",
          "9:48",
          "12:55",
          "15:20",
          "16:50",
          "18:15",
          "19:35",
          "20:55",
          "22:15",
        ],
      },
    },
  },
};

/**
 * Check if the given date is a holiday.
 *
 * @param {Date} date The date to check.
 * @returns {boolean} True if the date is a holiday, false otherwise.
 */
const isHoliday = (date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const dateStr = `${month}-${day}`;

  return (
    romanianNationalHolidays.some((h) => h.date === dateStr) ||
    nonFixedHolidays.some((h) => h.date === dateStr)
  );
};

/**
 * Get the holiday name for a given date if it exists.
 * @param {Date} date The date to check
 * @returns {string|null} The holiday name or null if not a holiday
 */
const getHolidayName = (date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const dateStr = `${month}-${day}`;

  const holiday =
    romanianNationalHolidays.find((h) => h.date === dateStr) ||
    nonFixedHolidays.find((h) => h.date === dateStr);

  return holiday ? holiday.name : null;
};

/**
 * Check if the given date is a weekend.
 *
 * @param {Date} date The date to check.
 * @returns {boolean} True if the date is a weekend, false otherwise.
 */
const isWeekend = (date) => {
  return date.getDay() === 0 || date.getDay() === 6;
};

/**
 * Check if the given date has a weekend program. Holidays have the same program as the weekend.
 *
 * @param {Date} date The date to check.
 * @returns {boolean} True if the date is a holiday or a weekend, false otherwise.
 */
const isWeekendProgram = (date) => {
  return isWeekend(date) || isHoliday(date);
};

// Pull the saved settings from the local storage
const savedBusOption = localStorage.getItem("busOption") ?? "420";
const savedDisplayNextDay = localStorage.getItem("displayNextDay") === "true";
const savedDarkMode = localStorage.getItem("darkMode") === "true";

// Initialize the state
const busOption = van.state(savedBusOption);
const displayNextDay = van.state(savedDisplayNextDay);
const todayDate = van.state(new Date());
const showWeekendProgram = van.state(isWeekendProgram(todayDate.val));
const darkMode = van.state(savedDarkMode);

// Save the persisted settings to the local storage
van.derive(() => {
  localStorage.setItem("busOption", busOption.val);
  localStorage.setItem("displayNextDay", displayNextDay.val);
  localStorage.setItem("darkMode", darkMode.val);
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
 * @typedef {Object} GeneralOptions
 * @property {string} remainingTimeClass The color of the remaining time.otherwise.
 */

/**
 * For a given ho-ur from the bus schedule, compute the remaining time until that hour and if it's for the next day.
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
    remainingTime = "<1min";
  }

  return {
    hour: hour.padStart(5, "0"),
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
  return select(
    {
      onchange: (e) => {
        showWeekendProgram.val = e.target.value === "holiday";
      },
    },
    option(
      {
        value: "work",
        selected: !showWeekendProgram.val,
      },
      "Zi de lucru"
    ),
    option({ value: "holiday", selected: showWeekendProgram.val }, "Weekend")
  );
};

/**
 * Render the full schedule checkbox component.
 *
 * @returns {HTMLElement} The full schedule component.
 */
const FullScheduleToggle = () => {
  return label(
    input({
      type: "checkbox",
      onchange: (e) => {
        displayNextDay.val = e.target.checked;
      },
      checked: displayNextDay.val,
    }),
    " Program Complet"
  );
};

/**
 * Render the hours section display component as a table.
 * @returns {HTMLElement} The hours section display component.
 */
const HoursSectionDisplay = () => {
  const turHours = showWeekendProgram.val
    ? busScheduleData.bus[busOption.val].tur.weekendHours
    : busScheduleData.bus[busOption.val].tur.workingHours;

  const returHours = showWeekendProgram.val
    ? busScheduleData.bus[busOption.val].retur.weekendHours
    : busScheduleData.bus[busOption.val].retur.workingHours;

  // Filter and compute hours
  const turComputed = turHours
    .map(computeHour)
    .filter((computedHour) => !computedHour.isNextDay || displayNextDay.val);

  const returComputed = returHours
    .map(computeHour)
    .filter((computedHour) => !computedHour.isNextDay || displayNextDay.val);

  if (turComputed.length === 0 && returComputed.length === 0) {
    return div(
      {
        className: "no-schedule",
      },
      "Nu sunt curse disponibile pentru ziua de azi."
    );
  }

  // Find first available hours (not next day)
  const firstAvailableTur = turComputed.find((hour) => !hour.isNextDay);
  const firstAvailableRetur = returComputed.find((hour) => !hour.isNextDay);

  // Create table rows - each row shows one tur and one retur hour
  const maxRows = Math.max(turComputed.length, returComputed.length);
  const rows = [];

  for (let i = 0; i < maxRows; i++) {
    const turHour = turComputed[i];
    const returHour = returComputed[i];

    // Check if this is the first available hour
    const isTurFirstAvailable =
      firstAvailableTur &&
      turHour &&
      turHour.hour === firstAvailableTur.hour &&
      !turHour.isNextDay;
    const isReturFirstAvailable =
      firstAvailableRetur &&
      returHour &&
      returHour.hour === firstAvailableRetur.hour &&
      !returHour.isNextDay;

    rows.push(
      tr(
        {
          className:
            isTurFirstAvailable || isReturFirstAvailable
              ? "first-available"
              : "",
        },
        // Tur (Spre București) columns
        turHour
          ? [
              td({ className: "time-cell" }, turHour.hour),
              td(
                span(
                  {
                    className: `remaining-time ${
                      turHour.isNextDay ? "next-day" : ""
                    }`,
                  },
                  turHour.remainingTime
                )
              ),
            ]
          : [td("--"), td("--")],

        // Retur (Spre Vidra) columns
        returHour
          ? [
              td({ className: "time-cell" }, returHour.hour),
              td(
                span(
                  {
                    className: `remaining-time ${
                      returHour.isNextDay ? "next-day" : ""
                    }`,
                  },
                  returHour.remainingTime
                )
              ),
            ]
          : [td("--"), td("--")]
      )
    );
  }

  return table(
    {
      className: "schedule-table",
    },
    thead(
      tr(
        th({ colspan: 2 }, "Spre București"),
        th({ colspan: 2 }, "Spre Vidra")
      ),
      tr(th("Ora"), th("Rămas"), th("Ora"), th("Rămas"))
    ),
    tbody(...rows)
  );
};

/**
 * Render the notice display component.
 *
 * @returns {HTMLElement} The notice display component.
 */
const NoticeDisplay = () => {
  const isHolidayToday = isHoliday(todayDate.val);
  const holidayName = isHolidayToday ? getHolidayName(todayDate.val) : null;

  if (!isHolidayToday && !showWeekendProgram.val) {
    return div();
  }

  return div(
    {
      className: "notice",
    },
    isHolidayToday ? `Astăzi este sărbătoare - ${holidayName}!` : "",
    showWeekendProgram.val || isHolidayToday
      ? " Este afișat programul de weekend."
      : ""
  );
};

/**
 * Render the line display component.
 *
 * @returns {HTMLElement} The line display component.
 */
const LineDisplay = () => {
  return select(
    {
      onchange: (e) => (busOption.val = e.target.value),
      value: busOption.val,
    },
    option({ value: "420", selected: "420" === busOption.val }, "Linia 420"),
    option({ value: "438", selected: "438" === busOption.val }, "Linia 438")
  );
};

// Add the components to the DOM to be rendered.
van.add(document.querySelector("#line"), LineDisplay);
van.add(document.querySelector("#settings"), Settings);
van.add(document.querySelector("#full-schedule"), FullScheduleToggle);
van.add(document.querySelector("#app"), HoursSectionDisplay);
van.add(document.querySelector("#notice"), NoticeDisplay);

/**
 * Initialize the application
 */
window.onload = () => {
  // Apply the dark mode if it was saved.
  if (savedDarkMode) {
    document.body.classList.add("dark-mode");
  }
};

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/service-worker.js").then(
      function (registration) {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function (err) {
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}
