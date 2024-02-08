import van from "./van-1.2.8.min.js";

const { thead, th, table, div, option, select, tbody, tr, td, input, label } =
  van.tags;

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

const nonFixedHolidays = [
  "05-03", // Vinerea Mare
  "05-05", // Paștele
  "05-06", // A doua zi de Paște
  "06-23", // Rusaliile
  "06-24", // A doua zi de Rusalii
];

const data = {
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
    438: {},
  },
};

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

const busOption = van.state("420");
const displayNextDay = van.state(false);
const todayDate = van.state(new Date());
const showHolidayProgram = van.state(isHolidayProgram(todayDate.val));

setInterval(() => {
  const currentDate = new Date();

  // Check if the hour and minute are the same
  if (
    currentDate.getHours() === todayDate.val.getHours() &&
    currentDate.getMinutes() === todayDate.val.getMinutes()
  ) {
    return;
  }

  todayDate.val = new Date();
}, 450);

// +------------- Components -------------+

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
        option({ value: "420" }, "Linia 420")
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

const diffHour = (hour) => {
  const [hourStr, minuteStr] = hour.split(":");

  const hourDate = new Date();
  hourDate.setHours(hourStr);
  hourDate.setMinutes(minuteStr);
  hourDate.setSeconds(0);

  const diff = hourDate - todayDate.val;
  if (diff < 0) {
    hourDate.setDate(todayDate.val.getDate() + 1);
  }

  const diffDate = new Date(hourDate - todayDate.val);

  let remainingTime = `${diffDate
    .getUTCHours()
    .toString()
    .padStart(2, "0")}:${diffDate.getUTCMinutes().toString().padStart(2, "0")}`;

  if (diffDate.getUTCHours() == 0 && diffDate.getUTCMinutes() == 0) {
    remainingTime = `${diffDate.getUTCSeconds().toString().padStart(2, "0")}`;
  }

  return {
    remainingTime,
    isNextDay: diff < 0,
  };
};

const HoursTable = () => {
  return div(
    {
      className: "hours-table",
    },
    table(
      thead(
        tr(
          th({ colSpan: "2" }, "Tur (Spre București)"),
          th({ colSpan: "2" }, "Retur (Spre Vidra)")
        ),
        tr(th("Oră"), th("Timp Rămas"), th("Oră"), th("Timp Rămas"))
      ),
      () => {
        // Create two column (hour, remaning time) for each tur and retur
        const turHours = showHolidayProgram.val
          ? data.bus[busOption.val].tur.holidayHours
          : data.bus[busOption.val].tur.workingHours;
        const returHours = showHolidayProgram.val
          ? data.bus[busOption.val].retur.holidayHours
          : data.bus[busOption.val].retur.workingHours;

        const maxLength = Math.max(turHours.length, returHours.length);
        const hours = Array.from({ length: maxLength }, (_, i) => [
          turHours[i],
          returHours[i],
        ]);

        return tbody(
          hours.map((hourPair) => {
            const row = tr();

            if (hourPair[0]) {
              const timeTur = diffHour(hourPair[0]);

              if (timeTur.isNextDay && !displayNextDay.val) {
                return "";
              }

              van.add(
                row,
                td(hourPair[0]),
                td(
                  { className: timeTur.isNextDay ? "next-day" : "" },
                  timeTur.remainingTime
                )
              );
            } else {
              van.add(row, td(), td());
            }

            if (hourPair[1]) {
              const timeRetur = diffHour(hourPair[1]);

              if (timeRetur.isNextDay && !displayNextDay.val) {
                return "";
              }

              van.add(
                row,
                td(hourPair[1]),
                td(
                  { className: timeRetur.isNextDay ? "next-day" : "" },
                  timeRetur.remainingTime
                )
              );
            } else {
              van.add(row, td(), td());
            }

            return row;
          })
        );
      }
    )
  );
};

const App = () => {
  return div(Settings(), HoursTable());
};

van.add(document.querySelector("#app"), App());