# DATE TIME PICKER

This is my new project based on my old [PDatePicker-jQuery](https://github.com/poetrasapoetra/PDatePicker-jQuery) project with some modification. This is pure Vanilla JS, additional library isn't needed.

## Installation

Add js and stylesheet to html file

```html
<link rel="stylesheet" href="path/to/date-time-picker.css" />
<script src="path/to/date-time-picker.js"></script>
```

## Usage

```js
const dt = new DateTimePicker(
  /**@type HTMLInputElement*/ element,
  /**@type DateTimePickerOption */ option
);
```

Add `HTMLInputElement` to html for `date-time-picker-js` initialization

```html
<input type="datetime-local" class="date_time" value="2023-10-01T12:10" />
<input type="date" class="date_time" />
<input type="month" name="" class="date_time" value="2023-10" />
<!-- year is not valid type, but date-time-picker will look for input type if not specified in object parameter -->
<input type="year" name="" class="date_time" value="2023" />
```

Initialize all input element

```js
let dp = []; // this is bucket for all date-time-picker instance
document.addEventListener("DOMContentLoaded", () => {
  // get all input element by classname `date_time`
  const dateTimeInput = document.querySelectorAll(".date_time");
  // initialize date-time-picker for all element
  dateTimeInput.forEach((dti, i) => {
    dp.push(new DateTimePicker(dti));
  });
});
```

## Options

All options are available in [docs](https://htmlpreview.github.io/?https://github.com/poetrasapoetra/date-time-picker-js/main/docs/index.html#DateTimePickerOption)

Here some example

```js
new DateTimePicker(dti, {
  show: false, // no show after initialization
  first_day: 1, // Monday is first day
  close_on_select: false, // Add select button
  show_today_button: true,
  start_date: new Date(2019, 8, 12), // date before this cannot be selected
  end_date: new Date(2023, 11, 12), // date after this cannot be selected
  theme_class: "dark", // using dark from theme class as base theme
  theme: {
    // with some tweak in some properties
    primary_color: "#3498db",
    primary_color_dark: "#16a085",
    border_line_color: "red",
  },
  locale: {
    // Bahasa indonesia
    locale_name: "id",
    lang: {
      days: "Minggu,Senin,Selasa,Rabu,Kamis,Jumat,Sabtu".split(","),
      months:
        "Januari,Februari,Maret,April,Mei,Juni,Juli,Agustus,September,Oktober,November,Desember".split(
          ","
        ),
      day_short: "Min,Sen,Sel,Rab,Kam,Jum,Sab".split(","),
      month_short: "Jan,Feb,Mar,Apr,Mei,Jun,Jul,Agu,Sep,Okt,Nov,Des".split(","),
      today: "Hari ini",
      select: "Pilih",
      cancel: "Batal",
    },
  },
});
```
