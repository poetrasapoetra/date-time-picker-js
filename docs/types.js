/**
 * @typedef DateTimeCustomTheme
 * @property {string} [background_color] Picker container background color
 * @property {string} [text_color] Picker global text color
 * @property {string} [btn_tile_bg_color] Tile background color for year, month, and date
 * @property {string} [btn_tile_bg_hover] Background color when mouse is over the tile
 * @property {string} [primary_color] Background color for selected, select button and today border color
 * @property {string} [primary_color_dark]  Background color for selected, select button when mouse over
 * @property {string} [color_on_primary] Text color on  Background color for selected, select button
 * @property {string} [border_line_color] Color for section separator and container border color
 *
 */

/**
 * @typedef DateTimePickerLang
 * @type {object}
 * @property {string[]} days Array of days  e.g. `Sunday`, `Monday`.
 * @property {string[]} months Array of months e.g. `January`, `February`.
 * @property {string[]} day_short Array of days short version  e.g. `Sun`, `Mon`.
 * @property {string[]} month_short Array of months e.g. `Jan`, `Feb`.
 * @property {string} today Today button text
 * @property {string} select Select button text
 * @property {string} cancel Cancel button text
 */

/**
 * @typedef DateTimePickerLocale
 * @type {object}
 * @property {string} locale_name Custom name of locale
 * @property {DateTimePickerLang} lang Language
 */

/**
 * @typedef DateTimePickerOption
 * @type {object}
 * @property {Date} [start_date] Start of picker date available. Default `new Date('0001-01-01')`
 * @property {Date} [end_date] End of picker date available. Default Infinity
 * @property {Date} [selected_date] Selected date
 * @property {string} [theme_class] Class of picker theme. Default "" light theme, date-time-picker also has dark theme that can be activate by set this to "dark"
 * @property {DateTimePickerLocale} [locale] Your custom locale
 * @property {boolean} [show] If true then picker will showed after initialization
 * @property {boolean} [show_today_button] Should today button showed?. This button will select today. Default false
 * @property {boolean} [close_on_select] Picker will close after value selected, otherwise select and cancel button will show. Default true
 * @property {("date"|"month"|"year"|"datetime-local")} [type] Picker type, default "date"
 * @property {number} [first_day] Day name to show in first column. Only available if type is "date" or "datetime-local". 0: Subday, 1: Monday, 6: Saturday
 * @property {DateTimeCustomTheme} [theme] Your custom theme, set inline style means all style in theme_class thet overlap to this value will not be respected 
 */
