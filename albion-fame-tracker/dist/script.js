// --- Global Variables ---
let startTime = null;
let timerInterval = null;
let currentActivity = {}; // Stores data for the currently running timer-based activity

// --- DOM Element References ---
const activityTypeSelect = document.getElementById("activityType");
const partyMembersInput = document.getElementById("partyMembers");
const initialFameInput = document.getElementById("initialFame");
const startTimerBtn = document.getElementById("startTimerBtn");
const stopTimerBtn = document.getElementById("stopTimerBtn");
const timerDisplay = document.getElementById("timerDisplay");
const finishActivitySection = document.getElementById("finishActivitySection");
const finalFameInput = document.getElementById("finalFame");
const silverValueInput = document.getElementById("silverValue");
const finishForm = document.getElementById("finishForm");
const logTableBody = document.querySelector("#logTable tbody");
const exportBtn = document.getElementById("exportBtn");

// Manual Input Specifics // <--- ENSURE THIS SECTION IS CORRECT
const manualModeToggle = document.getElementById("manualModeToggle");
const manualInputSection = document.getElementById("manualInputSection");
const manualDurationMinutesInput = document.getElementById(
  "manualDurationMinutes"
); // THIS LINE IS CRUCIAL

let fameChartInstance;
let silverChartInstance;

// --- Data Management (Using localStorage!) ---
const getActivities = () => {
  const activities = localStorage.getItem("albionFameLog");
  const parsedActivities = activities ? JSON.parse(activities) : [];
  console.log("DEBUG: Loaded activities from localStorage:", parsedActivities);
  return parsedActivities;
};

const saveActivities = (activities) => {
  localStorage.setItem("albionFameLog", JSON.stringify(activities));
  console.log("DEBUG: Saved activities to localStorage:", activities);
};

// --- Timer Functions ---
const updateTimerDisplay = () => {
  if (startTime) {
    const elapsed = Date.now() - startTime;
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

    timerDisplay.textContent =
      `${String(hours).padStart(2, "0")}:` +
      `${String(minutes).padStart(2, "0")}:` +
      `${String(seconds).padStart(2, "0")}`;
  }
};

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);

  // Store only timer-specific data in currentActivity
  currentActivity = {
    startTime: Date.now()
  };

  startTime = currentActivity.startTime;
  timerInterval = setInterval(updateTimerDisplay, 1000);

  startTimerBtn.disabled = true;
  stopTimerBtn.disabled = false;
  finishActivitySection.style.display = "none";
  timerDisplay.textContent = "00:00:00";

  // Disable inputs during timer-based activity
  activityTypeSelect.disabled = true;
  partyMembersInput.disabled = true;
  initialFameInput.disabled = true;
  console.log("DEBUG: Timer started.");
};

const stopTimer = () => {
  clearInterval(timerInterval);
  timerInterval = null;
  currentActivity.endTime = Date.now(); // Mark end time for timer-based

  startTimerBtn.disabled = false;
  stopTimerBtn.disabled = true;
  finishActivitySection.style.display = "block";

  // Re-enable inputs
  activityTypeSelect.disabled = false;
  partyMembersInput.disabled = false;
  initialFameInput.disabled = false;

  // Prefill for convenience
  finalFameInput.value = parseInt(initialFameInput.value) + 100000;
  silverValueInput.value = 0;
  console.log("DEBUG: Timer stopped.");
};

// --- Calculation and Save ---
const saveActivity = (event) => {
  event.preventDefault();

  // Always get these directly from the inputs at the time of save
  const activityType = activityTypeSelect.value;
  const partyMembers = parseInt(partyMembersInput.value);
  const initialFame = parseInt(initialFameInput.value);
  const finalFame = parseInt(finalFameInput.value);
  const silverValue = parseInt(silverValueInput.value);

  // QOL: Warning for decreased fame
  if (finalFame < initialFame) {
    const confirmDeductFame = confirm(
      "Warning: Final Fame (" +
        finalFame.toLocaleString() +
        ") is lower than Initial Fame (" +
        initialFame.toLocaleString() +
        ").\n" +
        "Fame cannot decrease in Albion Online. Are you sure you want to log this activity with less fame?"
    );
    if (!confirmDeductFame) {
      console.log("DEBUG: Fame deduction cancelled by user.");
      return; // Stop the save process if user cancels
    }
    console.warn("WARN: User confirmed logging activity with decreased fame.");
  }

  let durationMs;
  let activityDate;

  // Determine duration and start date based on manual mode or timer
  if (manualModeToggle.checked) {
    const manualMinutes = parseInt(manualDurationMinutesInput.value);
    if (isNaN(manualMinutes) || manualMinutes <= 0) {
      alert(
        "For manual entry, 'Duration (Minutes)' must be a positive number."
      );
      console.error("ERROR: Manual duration invalid.");
      return;
    }
    durationMs = manualMinutes * 60 * 1000;
    activityDate = new Date().toLocaleString(); // For manual, date is "now"
    console.log("DEBUG: Saving in Manual Mode. Duration (ms):", durationMs);
  } else {
    // Timer mode: duration is calculated from recorded start/end times
    if (!currentActivity.startTime || !currentActivity.endTime) {
      alert(
        "Timer data missing. Please start and stop the timer, or use manual entry."
      );
      console.error("ERROR: Timer data missing for save.");
      return;
    }
    durationMs = currentActivity.endTime - currentActivity.startTime;
    activityDate = new Date(currentActivity.startTime).toLocaleString(); // Use timer's start date
    console.log("DEBUG: Saving in Timer Mode. Duration (ms):", durationMs);
  }

  // Ensure duration is positive to avoid division by zero or negative values
  if (durationMs <= 0) {
    alert(
      "Duration must be greater than zero to calculate fame/silver per hour."
    );
    console.error("ERROR: Duration is zero or negative.");
    return;
  }

  const totalFameGained = finalFame - initialFame; // Use initialFame from input for calculation
  const durationHours = durationMs / (1000 * 60 * 60);

  const famePerHour = durationHours > 0 ? totalFameGained / durationHours : 0;
  const silverPerHour = silverValue / durationHours;

  const newActivity = {
    id: Date.now(), // Unique ID for deletion
    date: activityDate,
    activityType: activityType,
    partyMembers: partyMembers,
    initialFame: initialFame,
    finalFame: finalFame,
    totalFameGained: totalFameGained,
    durationMs: durationMs,
    famePerHour: famePerHour,
    silverValue: silverValue,
    silverPerHour: silverPerHour
  };

  console.log("DEBUG: New activity object to save:", newActivity);
  const activities = getActivities(); // This will load current state from localStorage
  activities.push(newActivity); // Add the new activity
  saveActivities(activities); // Save the updated array back to localStorage

  // --- UI Reset after saving ---
  initialFameInput.value = finalFame;
  partyMembersInput.value = 1;
  activityTypeSelect.value = "Solo Dungeon";

  renderActivityLog(); // Re-render the log table with new data
  renderCharts(); // Re-render charts with new data
  updateInitialFameField();
  updateUIModeDisplay();
  console.log("DEBUG: Activity saved and UI updated.");
};

// --- Render Log Table ---
const renderActivityLog = () => {
  const activities = getActivities(); // Get the latest activities from localStorage
  logTableBody.innerHTML = ""; // Clear existing rows

  activities.forEach((activity) => {
    console.log("DEBUG: Activity object being rendered into table:", activity);
    const row = logTableBody.insertRow();
    const durationMin = (activity.durationMs / (1000 * 60)).toFixed(1);

    row.insertCell().textContent = activity.date;
    row.insertCell().textContent = activity.activityType;
    row.insertCell().textContent = activity.partyMembers;
    // Safely access properties and format, provide empty string if undefined
    row.insertCell().textContent =
      activity.totalFameGained !== undefined &&
      activity.totalFameGained !== null
        ? activity.totalFameGained.toLocaleString()
        : "";
    row.insertCell().textContent = `${durationMin} min`;
    row.insertCell().textContent =
      activity.famePerHour !== undefined && activity.famePerHour !== null
        ? activity.famePerHour.toLocaleString(undefined, {
            maximumFractionDigits: 0
          })
        : "";
    row.insertCell().textContent =
      activity.silverValue !== undefined && activity.silverValue !== null
        ? activity.silverValue.toLocaleString()
        : "";
    row.insertCell().textContent =
      activity.silverPerHour !== undefined && activity.silverPerHour !== null
        ? activity.silverPerHour.toLocaleString(undefined, {
            maximumFractionDigits: 0
          })
        : "";

    const actionsCell = row.insertCell();
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("secondary"); // Pico.css style
    deleteBtn.style.padding = "5px 10px";
    deleteBtn.style.fontSize = "0.8em";
    // Ensure activity.id exists before attaching listener
    if (activity.id) {
      deleteBtn.onclick = () => deleteActivity(activity.id);
    } else {
      console.warn(
        "WARN: Activity without ID found, delete button might not work for this entry."
      );
      deleteBtn.disabled = true; // Disable if no ID
    }
    actionsCell.appendChild(deleteBtn);
  });
};

// --- Delete Activity ---
const deleteActivity = (idToDelete) => {
  console.log("DEBUG: Attempting to delete activity with ID:", idToDelete);
  let activities = getActivities();
  activities = activities.filter((activity) => activity.id !== idToDelete);
  saveActivities(activities);
  renderActivityLog();
  renderCharts();
  updateInitialFameField();
  console.log("DEBUG: Activity deleted. Log and charts re-rendered.");
};

// --- Charting with Chart.js ---
const renderCharts = () => {
  const activities = getActivities();

  const fameData = {};
  const silverData = {};

  activities.forEach((activity) => {
    // Ensure famePerHour and silverPerHour exist and are numbers before aggregating
    if (
      typeof activity.famePerHour === "number" &&
      typeof activity.silverPerHour === "number"
    ) {
      if (!fameData[activity.activityType]) {
        fameData[activity.activityType] = { totalFame: 0, count: 0 };
        silverData[activity.activityType] = { totalSilver: 0, count: 0 };
      }
      fameData[activity.activityType].totalFame += activity.famePerHour;
      fameData[activity.activityType].count++;
      silverData[activity.activityType].totalSilver += activity.silverPerHour;
      silverData[activity.activityType].count++;
    } else {
      console.warn(
        "WARN: Skipping activity in charts due to missing/invalid fame/silver per hour:",
        activity
      );
    }
  });

  const avgFamePerActivity = Object.keys(fameData)
    .map((type) => ({
      type: type,
      averageFame: fameData[type].totalFame / fameData[type].count
    }))
    .sort((a, b) => b.averageFame - a.averageFame);

  const avgSilverPerActivity = Object.keys(silverData)
    .map((type) => ({
      type: type,
      averageSilver: silverData[type].totalSilver / silverData[type].count
    }))
    .sort((a, b) => b.averageSilver - a.averageSilver);

  const fameLabels = avgFamePerActivity.map((item) => item.type);
  const fameValues = avgFamePerActivity.map((item) => item.averageFame);

  const silverLabels = avgSilverPerActivity.map((item) => item.type);
  const silverValues = avgSilverPerActivity.map((item) => item.averageSilver);

  if (fameChartInstance) fameChartInstance.destroy();
  if (silverChartInstance) silverChartInstance.destroy();

  const fameCtx = document.getElementById("fameChart").getContext("2d");
  fameChartInstance = new Chart(fameCtx, {
    type: "bar",
    data: {
      labels: fameLabels,
      datasets: [
        {
          label: "Average Fame Per Hour",
          data: fameValues,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Fame/Hour" }
        }
      }
    }
  });

  const silverCtx = document.getElementById("silverChart").getContext("2d");
  silverChartInstance = new Chart(silverCtx, {
    type: "bar",
    data: {
      labels: silverLabels,
      datasets: [
        {
          label: "Average Silver Per Hour",
          data: silverValues,
          backgroundColor: "rgba(255, 159, 64, 0.6)",
          borderColor: "rgba(255, 159, 64, 1)",
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Silver/Hour" }
        }
      }
    }
  });
  console.log("DEBUG: Charts rendered.");
};

// --- Export Function ---
const exportLog = () => {
  console.log("DEBUG: Exporting log...");
  const activities = getActivities();
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(activities, null, 2));
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute(
    "download",
    `albion_fame_log_${new Date().toISOString().slice(0, 10)}.json`
  );
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
  console.log("DEBUG: Log export initiated.");
};

// --- UI Mode Display Control ---
const updateUIModeDisplay = () => {
  console.log(
    "DEBUG: Updating UI mode display. Toggle checked state:",
    manualModeToggle.checked
  );
  if (manualModeToggle.checked) {
    // Manual mode is ON
    startTimerBtn.style.display = "none";
    stopTimerBtn.style.display = "none";
    timerDisplay.style.display = "none";
    manualInputSection.style.display = "block";
    finishActivitySection.style.display = "block"; // Always show finish section in manual mode
    console.log(
      "DEBUG: UI set to Manual Mode: Timer elements hidden, manual input shown."
    );
  } else {
    // Manual mode is OFF (Timer Mode)
    startTimerBtn.style.display = "block";
    stopTimerBtn.style.display = "block";
    timerDisplay.style.display = "block";
    manualInputSection.style.display = "none";
    // Finish section hidden by default in timer mode, shown only after stopTimer
    finishActivitySection.style.display = "none";
    console.log(
      "DEBUG: UI set to Timer Mode: Timer elements shown, manual input hidden."
    );
  }
};

// --- Event Listeners ---
startTimerBtn.addEventListener("click", startTimer);
stopTimerBtn.addEventListener("click", stopTimer);
finishForm.addEventListener("submit", saveActivity);
exportBtn.addEventListener("click", exportLog);

// Manual Mode Toggle Listener
manualModeToggle.addEventListener("change", () => {
  console.log("DEBUG: Manual mode toggle event fired!");
  updateUIModeDisplay();
});

// --- QOL: Auto-Set Initial Fame Field ---
const updateInitialFameField = () => {
  const activities = getActivities();
  let maxFame = 0; // Default if no activities

  if (activities.length > 0) {
    // Find the maximum finalFame among all logged activities
    maxFame = Math.max(...activities.map((activity) => activity.finalFame));
  }
  initialFameInput.value = maxFame;
  console.log("DEBUG: Initial Fame field updated to:", maxFame);
};

// --- Initial Load ---
document.addEventListener("DOMContentLoaded", () => {
  console.log(
    "DEBUG: DOM Content Loaded. Initializing UI and rendering existing data..."
  );
  renderActivityLog();
  renderCharts();
  updateInitialFameField();
  updateUIModeDisplay();
  console.log("DEBUG: Initial load complete.");
});