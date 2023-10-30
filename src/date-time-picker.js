"use strict";

/**
 * @typedef DateTimeCustomTheme
 * @property {string} [background_color]
 * @property {string} [text_color]
 * @property {string} [btn_tile_bg_color]
 * @property {string} [btn_tile_bg_hover]
 * @property {string} [primary_color]
 * @property {string} [primary_color_dark]
 * @property {string} [color_on_primary]
 * @property {string} [border_line_color]
 *
 */

/**
 * @typedef DateTimePickerLang
 * @type {object}
 * @property {string[]} days
 * @property {string[]} months
 * @property {string[]} day_short
 * @property {string[]} month_short
 * @property {string} today
 * @property {string} select
 * @property {string} cancel
 */

/**
 * @typedef DateTimePickerLocale
 * @type {object}
 * @property {string} locale_name
 * @property {DateTimePickerLang} lang
 */

/**
 * @typedef DateTimePickerOption
 * @type {object}
 * @property {Date} [start_date]
 * @property {Date} [end_date]
 * @property {Date} [selected_date]
 * @property {string} [theme_class]
 * @property {DateTimePickerLocale} [locale]
 * @property {boolean} [show]
 * @property {boolean} [show_today_button]
 * @property {boolean} [close_on_select]
 * @property {("date"|"month"|"year"|"datetime-local")} [type]
 * @property {number} [first_day]
 * @property {DateTimeCustomTheme} theme
 */

const DateTimePicker = (function () {
  const dateLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  function leapYear(year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
  }

  /**
   *
   * @param {number} year
   * @param {number} month
   * @returns {number}
   */
  function getDatelength(year, month) {
    month = ((month % 12) + 12) % 12;
    if (leapYear(year) && month == 1) {
      return 29;
    }
    return dateLength[month];
  }

  /**
   * @type {DateTimePickerLocale}
   */
  const defaultLocaleEn = {
    locale_name: "default",
    lang: {
      days: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(
        ","
      ),
      day_short: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","),
      months:
        "January,February,March,April,May,June,July,August,September,October,November,December".split(
          ","
        ),
      month_short: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
      today: "Today",
      select: "Select",
      cancel: "Cancel",
    },
  };

  /**
   *
   * @param {string} tag
   * @param {string} classes
   * @returns {HTMLElement}
   */
  function c_ele(tag, classes = "") {
    const ele = document.createElement(tag);
    if (classes && typeof classes === "string") {
      classes = classes.split(/\s/).filter((s) => s != "");
      ele.classList.add(...classes);
    }
    return ele;
  }

  /**
   *
   * @param {string} classes
   * @returns {HTMLDivElement}
   */
  function c_div(classes = "") {
    return c_ele("div", classes);
  }

  /**
   *
   * @param {string} classes
   * @returns {HTMLButtonElement}
   */
  function c_button(classes = "") {
    return c_ele("button", classes);
  }
  /**
   *
   * @param {string} type
   * @param {string} classes
   * @returns {HTMLInputElement}
   */
  function c_input(type, classes) {
    const ele = c_ele("input", classes);
    ele.setAttribute("type", type);
    return ele;
  }

  function generateButtons(/**@type DateTimePicker */ picker) {
    if (!picker.view_type) {
      switch (picker.options.type) {
        case "date":
        case "datetime-local":
          picker.view_type = "date";
          break;
        default:
          picker.view_type = picker.options.type;
          break;
      }
    }

    switch (picker.view_type) {
      case "date":
        generateDateButtons(picker);
        break;
      case "month":
        generateMonthButtons(picker);
        break;
      case "year":
        generateYearButtons(picker);
        break;
    }
  }

  function generateYearButtons(/**@type DateTimePicker */ picker) {
    const viewDate = picker.view_date;
    const today = new Date();
    const thisyear = today.getFullYear();
    let startYear = viewDate.getFullYear() - (viewDate.getFullYear() % 20) + 1;
    if (
      startYear < 0 ||
      (startYear + 19 < picker.options.start_date?.getFullYear() ?? -1)
    ) {
      viewDate.setFullYear(viewDate.getFullYear() + 20);
      return;
    } else if (
      startYear + 1 > picker.options.end_date?.getFullYear() ??
      Infinity
    ) {
      viewDate.setFullYear(viewDate.getFullYear() - 20);
      return;
    }
    picker.nodes.body.classList.remove("date", "month");
    picker.nodes.body.classList.add("year");
    if (picker.nodes.buttonSelect) {
      if (picker.options.type != "year") {
        [picker.nodes.buttonSelect, picker.nodes.buttonCancel].forEach(
          (btn) => {
            btn.classList.add("hidden");
          }
        );
      } else if (picker.options.type == "year") {
        [picker.nodes.buttonSelect, picker.nodes.buttonCancel].forEach(
          (btn) => {
            btn.classList.remove("hidden");
          }
        );
      }
    }

    const buttons = [];
    for (let i = 0; i < 20; i++) {
      const button = c_button(
        `dtp-btn-year ${thisyear == startYear + i ? "today" : ""} ${
          picker.selected_date.getFullYear() == startYear + i ? "selected" : ""
        }`
      );
      if (startYear + i < 0) {
        button.classList.add("hidden");
      }
      if (
        (startYear + i < picker.options.start_date?.getFullYear() ?? -1) ||
        (startYear + i > picker.options.end_date?.getFullYear() ?? Infinity)
      ) {
        button.classList.add("disabled");
      } else {
        button.addEventListener("click", function (evt) {
          evt.stopPropagation();
          const prevSelect = picker.nodes.bodyTable.querySelector(".selected");
          if (prevSelect) prevSelect.classList.remove("selected");
          this.classList.add("selected");
          if (picker.options.type == "year") {
            const psd = picker.selected_date;
            psd.setFullYear(startYear + i);
            picker.setSelectedDate(psd);
            if (picker.options.close_on_select) picker.hide();
          } else {
            picker.view_date.setFullYear(startYear + i);
            picker.view_type = "month";
            generateButtons(picker);
          }
        });
      }
      button.innerHTML = `${startYear + i}`;
      buttons.push(button);
    }
    picker.nodes.bodyTable.innerHTML = "";
    picker.nodes.bodyTable.append(...buttons);
    picker.nodes.infoBtn.innerHTML = `${startYear} - ${startYear + 19}`;
  }

  function generateMonthButtons(/**@type DateTimePicker */ picker) {
    const viewDate = picker.view_date;
    const selectedDate = picker.selected_date;
    const pStartDate = picker.options.start_date;
    const pEndDate = picker.options.end_date;
    const today = new Date();
    if (viewDate.getFullYear() < pStartDate?.getFullYear() ?? 0) {
      viewDate.setFullYear(viewDate.getFullYear() + 1);
      return;
    }
    if (viewDate.getFullYear() > pEndDate?.getFullYear() ?? Infinity) {
      viewDate.setFullYear(viewDate.getFullYear() - 1);
      return;
    }

    picker.nodes.body.classList.remove("date", "year");
    picker.nodes.body.classList.add("month");

    if (picker.nodes.buttonSelect) {
      if (picker.options.type != "month") {
        [picker.nodes.buttonSelect, picker.nodes.buttonCancel].forEach(
          (btn) => {
            btn.classList.add("hidden");
          }
        );
      } else if (picker.options.type == "month") {
        [picker.nodes.buttonSelect, picker.nodes.buttonCancel].forEach(
          (btn) => {
            btn.classList.remove("hidden");
          }
        );
      }
    }

    const buttons = [];
    const thisIsCurrentYear = today.getFullYear() === viewDate.getFullYear();
    const thisIsSelectedYear =
      selectedDate.getFullYear() === viewDate.getFullYear();
    for (let i = 0; i < picker.selected_locale.lang.months.length; i++) {
      const button = c_button(
        `dtp-btn-month ${
          thisIsCurrentYear && i == today.getMonth() ? "today" : ""
        } ${
          thisIsSelectedYear && selectedDate?.getMonth() == i ? "selected" : ""
        }`
      );
      button.innerHTML = picker.selected_locale.lang.months[i];

      if (
        ((viewDate.getFullYear() == pStartDate.getFullYear() ?? 0) &&
          i < (pStartDate?.getMonth() ?? 0)) ||
        ((viewDate.getFullYear() == pEndDate?.getFullYear() ?? Infinity) &&
          (i > pEndDate?.getMonth ?? 12))
      ) {
        button.classList.add("disabled");
      } else {
        button.addEventListener("click", function (evt) {
          evt.stopPropagation();
          const prevSelect = picker.nodes.bodyTable.querySelector(".selected");
          if (prevSelect) prevSelect.classList.remove("selected");
          this.classList.add("selected");

          if (picker.options.type == "month") {
            const psd = picker.selected_date;
            psd.setFullYear(viewDate.getFullYear());
            psd.setMonth(i);
            picker.setSelectedDate(psd);
            if (picker.options.close_on_select) picker.hide();
          } else {
            viewDate.setFullYear(viewDate.getFullYear());
            viewDate.setMonth(i);
            picker.view_type = "date";
            generateButtons(picker);
          }
        });
      }
      buttons.push(button);
    }
    picker.nodes.timePicker.classList.add("hidden");
    picker.nodes.bodyTable.innerHTML = "";
    picker.nodes.bodyTable.append(...buttons);
    picker.nodes.infoBtn.innerHTML = `${viewDate.getFullYear()}`;
  }

  function generateDateButtons /**@type DateTimePicker */(picker) {
    picker.nodes.body.classList.remove("month", "year");
    picker.nodes.body.classList.add("date");

    const viewDate = picker.view_date;
    const today = new Date();
    const pStartDate = picker.options.start_date;
    const pEndDate = picker.options.end_date;
    if (
      (viewDate.getFullYear() < pStartDate?.getFullYear() ?? 0) ||
      ((viewDate.getFullYear() == pStartDate?.getFullYear() ?? 0) &&
        (viewDate.getMonth() < pStartDate?.getMonth() ?? -1))
    ) {
      viewDate.setMonth(viewDate.getMonth() + 1);
      return;
    }
    if (
      (viewDate.getFullYear() > pEndDate?.getFullYear() ?? Infinity) ||
      ((viewDate.getFullYear() == pEndDate?.getFullYear() ?? Infinity) &&
        (viewDate.getMonth() > pEndDate?.getMonth() ?? 12))
    ) {
      viewDate.setMonth(viewDate.getMonth() - 1);
      return;
    }

    if (picker.nodes.buttonSelect) {
      [picker.nodes.buttonSelect, picker.nodes.buttonCancel].forEach((btn) => {
        btn.classList.remove("hidden");
      });
    }
    const firstDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);

    const buttons = [];
    // dummy buttons
    if (firstDate.getDay() != picker.options.first_day ?? 0) {
      let lastDatePrev = getDatelength(
        viewDate.getFullYear(),
        viewDate.getMonth() - 1
      );
      for (
        let i = ((firstDate.getDay() - picker.options.first_day ?? 0) + 7) % 7,
          j = 0;
        i > 0;
        i--
      ) {
        const isSun = (j++ + picker.options.first_day ?? 0) % 7 == 0;
        const button = c_button(`dtp-btn-date disabled ${isSun ? "sun" : ""}`);
        button.innerHTML = `${lastDatePrev - i + 1}`;
        button.setAttribute("disabled", "disabled");
        buttons.push(button);
      }
    }
    const fy = firstDate.getFullYear(),
      fm = firstDate.getMonth();
    const thisIsCurrentMonth =
      fy == today.getFullYear() && fm == today.getMonth();
    const thisIsSelectedMonth =
      fy == picker.selected_date?.getFullYear() &&
      fm == picker.selected_date?.getMonth();
    for (
      let i = 1;
      i <= getDatelength(firstDate.getFullYear(), firstDate.getMonth());
      i++
    ) {
      const isSun = (firstDate.getDay() + i - 1) % 7 == 0;
      const button = c_button(
        `dtp-btn-date ${isSun ? "sun" : ""} ${
          thisIsCurrentMonth && today.getDate() == i ? "today" : ""
        } ${
          thisIsSelectedMonth && picker.selected_date?.getDate() == i
            ? "selected"
            : ""
        }`
      );
      button.innerHTML = `${i}`;
      if (
        ((viewDate.getFullYear() == pStartDate?.getFullYear() ?? 0) &&
          (viewDate.getMonth() == pStartDate?.getMonth() ?? 0) &&
          (i < pStartDate?.getDate() ?? 0)) ||
        ((viewDate.getFullYear() == pEndDate?.getFullYear() ?? Infinity) &&
          (viewDate.getMonth() == pEndDate?.getMonth() ?? 12) &&
          (i > pEndDate?.getDate() ?? 32))
      ) {
        button.classList.add("disabled");
      } else {
        button.addEventListener("click", function (evt) {
          evt.preventDefault();
          const prevSelect = picker.nodes.bodyTable.querySelector(".selected");
          if (prevSelect) prevSelect.classList.remove("selected");
          this.classList.add("selected");
          const psd = picker.selected_date;
          psd.setFullYear(fy);
          psd.setMonth(fm);
          picker.setSelectedDate(
            new Date(
              fy,
              fm,
              i,
              psd.getHours(),
              psd.getMinutes(),
              psd.getSeconds(),
              psd.getMilliseconds()
            )
          );
          if (picker.options.close_on_select) picker.hide();
        });
      }
      buttons.push(button);
    }
    for (let i = buttons.length, j = 1; i % 7 != 0; i++) {
      const isSun = (i + picker.options.first_day ?? 0) % 7 == 0;
      const button = c_button(`dtp-btn-date disabled ${isSun ? "sun" : ""}`);
      button.setAttribute("disabled", "disabled");
      button.innerHTML = `${j++}`;
      buttons.push(button);
    }
    picker.nodes.timePicker.classList.remove("hidden");
    picker.nodes.bodyTable.innerHTML = "";
    picker.nodes.bodyTable.append(...buttons);

    picker.nodes.infoBtn.innerHTML = `${
      picker.selected_locale.lang.months[viewDate.getMonth()]
    } ${viewDate.getFullYear()}`;
  }

  /**
   * Date helper
   * @description Help me to format date
   * @author poetrasapoetra
   * @link http://github.com/poetrasapoetra
   */

  class DateHelper {
    /**
     *
     * @param {Date} date
     * @param {DateTimePickerLang} lang
     */
    constructor(date, lang) {
      this.date = date;
      this.lang = lang;
    }
    Y = () => {
      return `${"0".repeat(
        4 - this.date.getFullYear().toString().length
      )}${this.date.getFullYear()}`;
    };
    M = (length) => {
      if (length > 1) {
        return this.lang.months[this.date.getMonth()];
      }
      return this.lang.month_short[this.date.getMonth()];
    };
    m = (length) => {
      const a = this.date.getMonth() + 1;
      return (length > 1 && a >= 10) || length == 1 ? `${a}` : `0${a}`;
    };
    D = (length) => {
      if (length > 1) {
        return this.lang.days[this.date.getDay()];
      }
      return this.lang.day_short[this.date.getDay()];
    };
    d = (length) => {
      const a = this.date.getDate();
      return (length > 1 && a >= 10) || length == 1 ? `${a}` : `0${a}`;
    };
    H = (length) => {
      const a = this.date.getHours();
      return (length > 1 && a >= 10) || length == 1 ? `${a}` : `0${a}`;
    };
    h = (length) => {
      const a = this.date.getHours() % 12;
      return (length > 1 && a >= 10) || length == 1 ? `${a}` : `0${a}`;
    };
    i = (length) => {
      const a = this.date.getMinutes();
      return (length > 1 && a >= 10) || length == 1 ? `${a}` : `0${a}`;
    };
    s = (length) => {
      const a = this.date.getSeconds();
      return (length > 1 && a >= 10) || length == 1 ? `${a}` : `0${a}`;
    };
    n = () => {
      return `${"0".repeat(
        3 - this.date.getMilliseconds().toString().length
      )}${this.date.getMilliseconds()}`;
    };
    a = () => {
      return this.date.getHours() < 12 ? "am" : "pm";
    };
    A = () => {
      return this.a().toUpperCase();
    };
    z = () => {
      const off = this.date.getTimezoneOffset();
      return `UTC${off <= 0 ? "+" : ""}${(off / 60) * -1}`;
    };
    Z = () => {
      return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    };
    sep = (length, char) => {
      return char.repeat(length);
    };
    #checkFormat = (format) => {
      const regex = /Y|M|m|D|d|H|h|i|s|n|a|A|z|Z/;
      const formater = [];
      let lastIndex = -1;
      for (const char of format) {
        const match = char.match(regex);
        let fn = this.sep;
        if (match) {
          fn = this[char];
        }
        if (formater[lastIndex] && char == formater[lastIndex].char) {
          formater[lastIndex].count++;
        } else {
          formater.push({
            char,
            count: 1,
            fn: fn,
          });
          lastIndex++;
        }
      }
      return formater;
    };

    /**
     *
     * @param {string} format
     */
    format = function (format) {
      const formater = this.#checkFormat(format);
      let str = "";
      for (const f of formater) {
        str = str + f.fn(f.count, f.char);
      }
      return str;
    };
  }

  class DateTimePicker {
    constructor(
      /**@type HTMLInputElement*/ element,
      /**@type DateTimePickerOption */ option
    ) {
      /**@type HTMLInputElement */
      this.element = element;

      /**@type DateTimePickerOption */
      this.options = Object.assign(
        {},
        {
          lang: defaultLocaleEn,
          show: false,
          first_day: 0,
          close_on_select: true,
          theme: {},
        },
        option
      );
      if (!(this.options.selected_date instanceof Date)) {
        if (this.element.value != "") {
          this.options.selected_date = new Date(this.element.value);
        } else {
          this.options.selected_date = new Date();
        }
      }
      if (!(this.options.start_date instanceof Date)) {
        this.options.start_date = new Date("0001-01-01T00:00:00");
      }
      if (!this.options.type) {
        const types = ["year", "month", "date", "datetime-local"];
        if (types.find((v) => v == this.element.getAttribute("type"))) {
          this.options.type = this.element.getAttribute("type");
        } else {
          this.options.type = "date";
        }
      }

      this.prev_selected_date = new Date(this.options.selected_date);
      this.selected_date = new Date(this.options.selected_date);
      this.selected_locale = this.options.locale ?? defaultLocaleEn;
      this.#init();
    }
    #init() {
      const _this = this;
      const wrapper = c_div("dtp-wrapper");
      const locale = this.selected_locale;
      if (this.options.theme && typeof this.options.theme == "object") {
        let csstext = "";
        for (var key in this.options.theme) {
          csstext += `--dtp-${key.replace(/[_]/g, "-")}:${
            this.options.theme[key]
          };`;
        }
        wrapper.style.cssText = csstext;
      }

      if (
        this.options.theme_class &&
        typeof this.options.theme_class == "string"
      ) {
        wrapper.classList.add(this.options.theme_class);
      }

      this.element.insertAdjacentElement("afterend", wrapper);
      wrapper.append(this.element);

      const container = c_div(
        `dtp-container ${this.options.show ? "show" : ""}`
      );
      const header = c_div(`dtp-header`);
      const body = c_div("dtp-body");
      const footer = c_div("dtp-footer");

      const prev = c_button("dtp-prev");
      const next = c_button("dtp-next");

      const prevIcon = c_div("dtp-nav-icon");
      prevIcon.innerHTML = `<svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7071 4.29289C16.0976 4.68342 16.0976 5.31658 15.7071 5.70711L9.41421 12L15.7071 18.2929C16.0976 18.6834 16.0976 19.3166 15.7071 19.7071C15.3166 20.0976 14.6834 20.0976 14.2929 19.7071L7.29289 12.7071C7.10536 12.5196 7 12.2652 7 12C7 11.7348 7.10536 11.4804 7.29289 11.2929L14.2929 4.29289C14.6834 3.90237 15.3166 3.90237 15.7071 4.29289Z" fill="currentColor"/>
      </svg>`;
      const nextIcon = c_div("dtp-nav-icon");
      nextIcon.innerHTML = `<svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M8.29289 4.29289C8.68342 3.90237 9.31658 3.90237 9.70711 4.29289L16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L9.70711 19.7071C9.31658 20.0976 8.68342 20.0976 8.29289 19.7071C7.90237 19.3166 7.90237 18.6834 8.29289 18.2929L14.5858 12L8.29289 5.70711C7.90237 5.31658 7.90237 4.68342 8.29289 4.29289Z" fill="currentColor"/>
      </svg>`;

      prev.append(prevIcon);
      next.append(nextIcon);

      const info = c_button("dtp-header-info");

      const body_header = c_div("dtp-body-table-header");
      const body_body = c_div("dtp-body-table-body");

      const timePicker = c_div("dtp-time-picker");
      const buttons = c_div("dtp-buttons");

      header.append(prev, info, next);
      body.append(body_header, body_body);
      container.append(header, body);
      this.nodes = {
        wrapper,
        container,
        prevBtn: prev,
        nextBtn: next,
        infoBtn: info,
        body,
        bodyTable: body_body,
        timePicker,
        buttons,
      };

      if (this.options.type == "datetime-local") {
        container.append(timePicker);
        const hourInput = c_input("text", "dtp-hour-input");
        const minuteInput = c_input("text", "dtp-minute-input");
        const secondInput = c_input("text", "dtp-second-input");
        const millisecondInput = c_input("text", "dtp-millisecond-input");

        const dh = new DateHelper(
          this.selected_date,
          this.selected_locale.lang
        );
        hourInput.value = `${dh.format("HH")}`;
        minuteInput.value = `${dh.format("ii")}`;
        secondInput.value = `${dh.format("ss")}`;
        millisecondInput.value = `${dh.format("n")}`;

        function onFocus(
          /**@type FocusEvent */ evt,
          /**@type HTMLInputElement */ ele
        ) {
          evt.preventDefault();
          ele.setSelectionRange(0, ele.value.length);
        }

        function onInput(
          evt,
          /**@type HTMLInputElement */ ele,
          /**@type  Number */ max
        ) {
          evt.preventDefault();
          let value = parseInt(`00${ele.value.replace(/[^0-9]+/, "")}`);
          if (value > max) {
            value = Math.floor(value / 10);
          }
          value = value.toString();
          if (value.length < 2) {
            value = "0".repeat(2 - value.length) + value;
          } else if (parseInt(value) > max) {
            value = value.substring(0, max.toString().length);
          }
          ele.value = value;
        }
        function onKeyDown(
          /**@type KeyboardEvent*/ evt,
          /**@type HTMLInputElement */ ele,
          /**@type Number */ max,
          /**@type Number */ step
        ) {
          // evt.preventDefault();
          const code = evt.code;
          const prevVal = ele.value;
          switch (code) {
            case "ArrowUp":
              ele.value = Math.min(parseInt(`00${ele.value}`) + step, max);
              break;
            case "ArrowDown":
              ele.value = Math.max(parseInt(`00${ele.value}`) - step, 0);
              break;
          }
          if (ele.value != prevVal) {
            ele.dispatchEvent(new Event("input", { bubbles: true }));
            ele.setSelectionRange(0, ele.value.length);
          }
        }
        [
          [hourInput, 23, 1, "setHours"],
          [minuteInput, 59, 1, "setMinutes"],
          [secondInput, 59, 1, "setSeconds"],
          [millisecondInput, 999, 100, "setMilliseconds"],
        ].forEach(([inp, max, step, setFn]) => {
          // inp.setAttribute("maxlength", "3");
          inp.addEventListener("focus", function (ev) {
            onFocus(ev, this);
          });
          inp.addEventListener("input", function (ev) {
            onInput(ev, this, max);
            _this.selected_date[setFn](this.value);
            _this.setSelectedDate(_this.selected_date);
          });
          inp.addEventListener("keydown", function (ev) {
            onKeyDown(ev, this, max, step);
          });
        });

        const icon = c_div("dtp-time-icon");
        icon.innerHTML = `<svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12ZM12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V12C11 12.2652 11.1054 12.5196 11.2929 12.7071L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L13 11.5858V6Z" fill="currentColor"/>
        </svg>`;

        timePicker.append(
          icon,
          hourInput,
          ":",
          minuteInput,
          ":",
          secondInput,
          ".",
          millisecondInput
        );
      }
      container.append(footer);

      if (this.options.show_today_button) {
        const todayBtn = c_button("dtp-today-btn");
        todayBtn.innerHTML = locale.lang.today;
        todayBtn.addEventListener("click", function (evt) {
          evt.preventDefault();
          const today = new Date();
          _this.selected_date.setDate(today.getDate());
          _this.selected_date.setMonth(today.getMonth());
          _this.selected_date.setFullYear(today.getFullYear());
          _this.setSelectedDate(_this.selected_date);
          _this.view_date = _this.selected_date;
          if (
            _this.options.close_on_select &&
            _this.options.type != "datetime-local"
          ) {
            _this.hide();
          }
          generateDateButtons(_this);
        });
        buttons.append(todayBtn);
      }

      if (
        !this.options.close_on_select ||
        this.options.type == "datetime-local"
      ) {
        const selectButton = c_button("dtp-select");
        const cancelButton = c_button("dtp-cancel");
        selectButton.innerHTML = locale.lang.select;
        cancelButton.innerHTML = locale.lang.cancel;

        cancelButton.addEventListener("click", function (evt) {
          evt.preventDefault();
          _this.selected_date = new Date(_this.options.selected_date);
          _this.view_date = _this.selected_date;
          _this.reset().hide();
        });

        selectButton.addEventListener("click", function (evt) {
          evt.preventDefault();
          if (_this.selected_date) {
            _this.hide();
          }
        });

        buttons.append(cancelButton, selectButton);
        this.nodes.buttonSelect = selectButton;
        this.nodes.buttonCancel = cancelButton;
        this.options.close_on_select = false;
      }

      footer.append(buttons);

      this.view_date = this.options.selected_date ?? new Date();

      const nextClickEvent = function (/**@param MouseEvent*/ ev) {
        switch (_this.view_type) {
          case "date":
            _this.view_date.setMonth(_this.view_date.getMonth() + 1);
            break;
          case "month":
            _this.view_date.setFullYear(_this.view_date.getFullYear() + 1);
            break;
          case "year":
            _this.view_date.setFullYear(_this.view_date.getFullYear() + 20);
            break;
        }
        generateButtons(_this);
        ev.stopPropagation();
      };
      const prevClickEvent = function (/**@param MouseEvent*/ ev) {
        switch (_this.view_type) {
          case "date":
            _this.view_date.setMonth(_this.view_date.getMonth() - 1);
            break;
          case "month":
            _this.view_date.setFullYear(_this.view_date.getFullYear() - 1);
            break;
          case "year":
            _this.view_date.setFullYear(_this.view_date.getFullYear() - 20);
            break;
        }
        generateButtons(_this);
        ev.stopPropagation();
      };
      next.addEventListener("click", nextClickEvent);
      prev.addEventListener("click", prevClickEvent);

      info.addEventListener("click", function (evt) {
        evt.stopPropagation();
        const types = ["date", "month", "year"];
        let type_index = types.findIndex((v) => v == _this.view_type);
        if (type_index < 2) {
          type_index += 1;
        }
        _this.view_type = types[type_index];
        generateButtons(_this);
      });

      body_header.append(
        ...Array.from({ length: 7 }).map((_, i) => {
          const d = c_div(
            `dtp-body-table-header-item ${
              (i + _this.options.first_day ?? 0) % 7 == 0 ? "sun" : ""
            }`
          );
          d.innerHTML =
            locale.lang.day_short[(i + _this.options.first_day ?? 0) % 7];
          return d;
        })
      );
      this.element.insertAdjacentElement("afterend", container);
      //   show on click
      this.element.addEventListener("click", function (ev) {
        _this.show(ev);
        return true;
      });
      //   prevent close on click
      this.nodes.container.addEventListener("click", function (ev) {
        ev.stopPropagation();
      });
      //   close on click
      document.addEventListener("click", function (ev) {
        _this.hide(ev);
      });
    }
    show(ev) {
      if (ev) {
        // ev.stopPropagation();
        ev.preventDefault();
      }
      this.element.blur();
      generateButtons(this);
      this.prev_selected_date = this.selected_date;
      if (!ev || ev.target == this.element) {
        this.nodes.container.classList.add("show");
      }
      return this;
    }
    hide(ev) {
      if (ev) {
        if (ev.target == this.nodes.container || ev.target == this.element) {
          return;
        }
        // reset when click outside container
        this.reset();
      }
      this.nodes.container.classList.remove("show");
      this.view_type = null;
    }
    reset() {
      this.selected_date = new Date(this.options.selected_date);
      this.view_date = new Date(this.selected_date) ?? new Date();
      // this.setSelectedDate(this.selected_date);
      return this;
    }

    setTheme(/**@type string */ theme_class) {
      this.nodes.wrapper.className = `dtp-wrapper ${theme_class}`;
      return this;
    }

    setSelectedDate(/**Date */ date) {
      this.selected_date = date;
      if (this.element && this.element instanceof HTMLInputElement) {
        const type = this.options.type;
        let format = "";
        switch (type) {
          case "datetime-local":
            format = "THH:ii:ss.n";
          case "date":
            format = "-dd" + format;
          case "month":
            format = "-mm" + format;
          case "year":
            format = "Y" + format;
        }
        this.element.value = this.getSelectedDateFormat(format);
      }
      return this;
    }
    getSelectedDate() {
      return this.selected_date;
    }
    getSelectedDateFormat(format) {
      const d = new DateHelper(this.selected_date, this.selected_locale.lang);
      return d.format(format);
    }
    destroy() {}
  }
  return DateTimePicker;
})();
