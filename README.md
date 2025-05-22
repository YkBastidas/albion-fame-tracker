# Albion Online Fame Tracker

A simple web application to track fame and silver per hour in Albion Online, saving activity logs and providing visual analysis.

## Features

* **Timer-based and Manual activity logging:** Choose between real-time tracking or manual input for past activities.
* **Fame/Silver per Hour Calculation:** Automatically calculates your efficiency.
* **Local Data Persistence:** All your activity logs are saved directly in your browser's local storage, so your data is there when you return.
* **Comprehensive Activity Log:** Displays detailed records of each session in a sortable table.
* **Visual Analysis:** Bar charts show average Fame/Hour and Silver/Hour across different activity types.
* **Data Export:** Download your entire log as a JSON file for backup or external analysis.
* **Intelligent Initial Fame:** Automatically pre-fills the "Initial Fame" with your highest recorded fame (since fame cannot decrease in Albion).
* **Fame Deduction Warning:** Provides a confirmation prompt if you try to log an activity with less fame than your initial, preventing accidental data errors.

## How It's Made

This application was developed with significant assistance from **Gemini AI** (specifically, the Gemini 2.5 Flash model). Gemini AI provided step-by-step code generation, debugging assistance, and brainstorming for features and improvements.

## Setup and Usage

1.  **Clone this repository:**
    `git clone https://github.com/YOUR_USERNAME/albion-fame-tracker.git`
    (Replace `YOUR_USERNAME` and `albion-fame-tracker` with your actual GitHub username and repository name).
2.  **Open `index.html`:** Navigate to the cloned folder on your computer and open the `index.html` file in your preferred web browser.
3.  **Start Tracking!**

## Technologies Used

* HTML5
* CSS3 (with [Pico.css](https://picocss.com/) for base styling)
* JavaScript
* [Chart.js](https://www.chartjs.org/) for data visualization

## License

This project is licensed under the [MIT License](LICENSE.txt) - see the [LICENSE.txt](LICENSE.txt) file for details.
