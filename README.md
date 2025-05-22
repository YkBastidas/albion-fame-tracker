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

## Roadmap & Future Improvements

Here are some ideas and potential features for the Albion Fame Tracker that could be explored in future versions:

### A. Enhanced Data Analysis & Display

1.  **Total Fame / Total Silver Earned Display:** Show your cumulative fame gained and total silver earned across all tracked activities.
2.  **Overall Averages Display:** Display your average Fame/Hour and Silver/Hour across all activities.
3.  **Fame/Silver Per Hour Trends (Line Graphs):** Add line graphs to visualize your Fame/Hour and Silver/Hour performance *over time*.
4.  **Comparison by Party Size:** Introduce charts or filters that specifically compare average FPH/SPH for different party sizes (e.g., Solo vs. 5-man).
5.  **Activity Comparison Tool:** Allow users to select specific activity types or individual past sessions and compare their detailed stats side-by-side.

### B. Data Management & Manipulation

6.  **Edit Log Entry:** Add an "Edit" button next to each activity to modify existing data.
7.  **Filter & Sort Activity Log:** Add controls to filter activities by type, members, date range, or sort by clickable table headers.
8.  **Clear All Data Button:** A prominent button (with confirmation) to completely wipe all `albionFameLog` data.
9.  **Import Log from JSON:** Allow users to upload a previously exported JSON file to restore their data.
10. **Notes Field for Activities:** Add an optional text area field for personal notes about each session.

### C. UI/UX Refinements

11. **Dark Mode Toggle:** Implement a simple switch to toggle between light and dark themes.
12. **Custom Activity Types:** Allow users to add, edit, or remove their own custom activity types from the dropdown list.
13. **Advanced Input Validation & Feedback:** More robust checks and better visual feedback for invalid input.
14. **Performance Optimization (for very large logs):** Explore techniques like virtual scrolling or pagination if the table becomes slow with many entries.

## License

This project is licensed under the [MIT License](LICENSE.txt) - see the [LICENSE.txt](LICENSE.txt) file for details.
