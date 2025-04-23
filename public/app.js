let timer;
let seconds = 0, minutes = 0, hours = 0; //Menyimpan waktu
let isRunning = false; //Memastikan timer tidak berjalan
let lapCount = 1; //Angka akan bertambah jika menekan tombol lap
let countdownMode = false;

function setCountdown(minutesInput) {
    countdownMode = true;

    // Tambahkan waktu secara kumulatif
    let totalMinutes = hours * 60 + minutes + minutesInput;
    hours = Math.floor(totalMinutes / 60);
    minutes = totalMinutes % 60;

    stopStopwatch(); // Pastikan stopwatch dihentikan sebelum mulai countdown
    updateDisplay();
}

document.getElementById("startStopButton").innerHTML = "▶ Mulai";
document.getElementById("startStopButton").classList.replace("stop", "start");


function fetchLocalTime(offset) {
    let now = new Date();
    let utc = now.getTime() + now.getTimezoneOffset() * 60000;
    let newTime = new Date(utc + (offset * 3600000));
    return newTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

function updateWorldClocks() {
    document.getElementById("clock-jakarta").textContent = `Jakarta: ${fetchLocalTime(7)}`;
    document.getElementById("clock-kyoto").textContent = `Kyoto: ${fetchLocalTime(10)}`;
    document.getElementById("clock-hongkong").textContent = `Hong Kong: ${fetchLocalTime(8)}`;
}

document.addEventListener("DOMContentLoaded", () => {
    updateWorldClocks();
    setInterval(updateWorldClocks, 1000); // Perbarui setiap 1 detik
});



function toggleStopwatch() {
    let button = document.getElementById("startStopButton");
    if (!isRunning) {
        startStopwatch();
        button.innerHTML = "⏸ Stop";
        button.classList.replace("start", "stop");
    } else {
        stopStopwatch();
        button.innerHTML = "▶ Mulai";
        button.classList.replace("stop", "start");
    }
}

function updateDisplay() {
    let display = document.getElementById("display");
    display.textContent =
        (hours < 10 ? "0" + hours : hours) + ":" +
        (minutes < 10 ? "0" + minutes : minutes) + ":" +
        (seconds < 10 ? "0" + seconds : seconds);
}

function stopStopwatch() {
    clearInterval(timer);
    isRunning = false;

    const totalDuration =
        hours * 3600000 + minutes * 60000 + seconds * 1000;

    if (totalDuration > 0) {
        const endTime = new Date();
        const startTime = new Date(endTime - totalDuration);
        saveTimeToDB(countdownMode ? "countdown" : "stopwatch", startTime, endTime);
    }
}

function resetStopwatch() {
    clearInterval(timer);
    isRunning = false;
    seconds = 0; minutes = 0; hours = 0; lapCount = 1;
    updateDisplay();
    document.getElementById("laps").innerHTML = "";

    // Pastikan tombol kembali ke "Mulai"
    let button = document.getElementById("startStopButton");
    button.innerHTML = "▶ Mulai";
    button.classList.replace("stop", "start");
}

function startBlinking() {
    let display = document.getElementById("display");
    let count = 0;

    function blink() {
        display.style.opacity = display.style.opacity === "1" ? "0.3" : "1";
        if (count < 20) {
            count++;
            setTimeout(blink, 500);
        } else {
            display.style.opacity = "1";
        }
    }
    blink();
}

function addLap() {
    if (isRunning) {
        let lapTime = document.getElementById("display").textContent;
        let lapContainer = document.getElementById("laps");
        let lapItem = document.createElement("div");
        lapItem.textContent = `Lap ${lapCount}: ${lapTime}`;
        lapContainer.prepend(lapItem);
        lapCount++;
    }
}

function startCountdown() {
    let userInput = prompt("Masukkan waktu countdown (hh:mm:ss):", "00:01:00");
    if (userInput) {
        let [newHours, newMinutes, newSeconds] = userInput.split(":").map(Number);
        hours = newHours; minutes = newMinutes; seconds = newSeconds;
        countdownMode = true;
        stopStopwatch();
        updateDisplay();
    }
}

document.getElementById("startStopButton").innerHTML = "▶ Mulai";
document.getElementById("startStopButton").classList.replace("stop", "start");



function toggleStopwatch() {
    let button = document.getElementById("startStopButton");
    if (!isRunning) {
        startStopwatch();
        button.innerHTML = "⏸ Stop";
        button.classList.replace("start", "stop");
    } else {
        stopStopwatch();
        button.innerHTML = "▶ Mulai";
        button.classList.replace("stop", "start");
    }
}

function updateTime() {
    if (countdownMode) {
        if (hours === 0 && minutes === 0 && seconds === 0) {
            const endTime = new Date();
            const totalDuration = hours * 3600000 + minutes * 60000 + seconds * 1000;
            const startTime = new Date(endTime - totalDuration);
            saveTimeToDB("countdown", startTime, endTime);

            stopStopwatch();
            alert("Waktu habis!");
            document.getElementById("startStopButton").innerHTML = "▶ Mulai";
            document.getElementById("startStopButton").classList.replace("stop", "start");
            return;
        }

        if (countdownMode && hours === 0 && minutes === 0 && seconds === 10) {
            startBlinking();
        }

        if (seconds === 0) {
            if (minutes > 0) {
                minutes--;
                seconds = 59;
            } else if (hours > 0) {
                hours--;
                minutes = 59;
                seconds = 59;
            }
        } else {
            seconds--;
        }
    } else {
        seconds++;
        if (seconds === 60) { seconds = 0; minutes++; }
        if (minutes === 60) { minutes = 0; hours++; }
    }
    updateDisplay();
}

function updateDisplay() {
    let display = document.getElementById("display");
    display.textContent =
        (hours < 10 ? "0" + hours : hours) + ":" +
        (minutes < 10 ? "0" + minutes : minutes) + ":" +
        (seconds < 10 ? "0" + seconds : seconds);
}

function startStopwatch() {
    if (!isRunning) {
        timer = setInterval(updateTime, 1000);
        isRunning = true;
    }
}

function startBlinking() {
    let display = document.getElementById("display");
    let count = 0;

    function blink() {
        display.style.opacity = display.style.opacity === "1" ? "0.3" : "1";
        if (count < 20) {
            count++;
            setTimeout(blink, 500);
        } else {
            display.style.opacity = "1";
        }
    }
    blink();
}

function addLap() {
    if (isRunning) {
        let lapTime = document.getElementById("display").textContent;
        let lapContainer = document.getElementById("laps");
        let lapItem = document.createElement("div");
        lapItem.textContent = `Lap ${lapCount}: ${lapTime}`;
        lapContainer.prepend(lapItem);
        lapCount++;
    }
}

function startCountdown() {
    let userInput = prompt("Masukkan waktu countdown (hh:mm:ss):", "00:01:00");
    if (userInput) {
        let [newHours, newMinutes, newSeconds] = userInput.split(":").map(Number);
        hours = newHours; minutes = newMinutes; seconds = newSeconds;
        countdownMode = true;
        stopStopwatch();
        updateDisplay();
    }
}

// Panggil saat halaman dimuat
// document.addEventListener("DOMContentLoaded", fetchHistory);


// Hilangkan inline onclick, dan tambahkan event listener:
document.getElementById("startStopButton").addEventListener("click", toggleStopwatch);
document.getElementById("lapButton").addEventListener("click", addLap);
document.getElementById("resetButton").addEventListener("click", resetStopwatch);
document.getElementById("countdownButton").addEventListener("click", startCountdown);

// Untuk tombol durasi countdown
document.querySelectorAll('.countdown-option').forEach(button => {
    button.addEventListener("click", function () {
        let minutesInput = parseInt(this.dataset.minutes);
        setCountdown(minutesInput);
    });
});
// History ---------
async function saveTimeToDB(type, startTime, endTime) {
    const duration = endTime - startTime;

    try {
        const response = await fetch("/api/records", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type, startTime, endTime, duration }),
            credentials: "include"
        });

        if (!response.ok) {
            const error = await response.json();
            if (response.status === 401) {
                // Token expired or invalid, redirect to login
                window.location.href = "/login";
                return;
            }
            throw new Error(error.message || "Failed to save time");
        }
    } catch (error) {
        console.error("Error saving time:", error);
        alert("Failed to save time. Please try again.");
    }
}

async function fetchHistory() {
    const selectedType = document.getElementById("filter")?.value;

    let url = "/history";
    if (selectedType && selectedType !== "all") {
        url += `?type=${selectedType}`;
    }

    try {
        const response = await fetch(url, {
            credentials: "include" 
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid, redirect to login
                window.location.href = "/login";
                return;
            }
            throw new Error("Failed to fetch history");
        }
        
        const records = await response.json();
        console.log("Fetched records:", records); // DEBUG

        const historyList = document.getElementById("history-list");
        historyList.innerHTML = "";

        if (records.length === 0) {
            historyList.innerHTML = "<li>Tidak ada riwayat ditemukan.</li>";
            return;
        }

        records.forEach(record => {
            const durasiDetik = Math.floor(record.duration / 1000);
            const waktu = new Date(record.endTime).toLocaleString("id-ID");

            const listItem = document.createElement("li");
            listItem.innerHTML = `
                ${record.type.toUpperCase()} | ${waktu} | Durasi: ${durasiDetik} detik
                <button onclick="deleteHistory('${record._id}')" class="delete-btn">Hapus</button>
            `;
            historyList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching history:", error);
        const historyList = document.getElementById("history-list");
        historyList.innerHTML = "<li>Gagal memuat riwayat. Silakan coba lagi.</li>";
    }
}

function toggleLabelEdit(id) {
    const display = document.getElementById(`label-display-${id}`);
    const form = document.getElementById(`label-form-${id}`);
    if (form.style.display === "none") {
      form.style.display = "inline";
      display.style.display = "none";
    } else {
      form.style.display = "none";
      display.style.display = "inline";
    }
  }

async function deleteHistory(id) {
    const konfirmasi = confirm("Yakin ingin menghapus riwayat ini?");
    if (!konfirmasi) return;

    try {
        const response = await fetch(`/api/records/${id}`, { 
            method: "DELETE", 
            credentials: "include" 
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid, redirect to login
                window.location.href = "/login";
                return;
            }
            throw new Error("Failed to delete history");
        }
        
        const result = await response.json();

        if (result.success) {
            fetchHistory(); // refresh
        } else {
            alert("Gagal menghapus riwayat: " + (result.error || "Unknown error"));
        }
    } catch (error) {
        console.error("Error deleting history:", error);
        alert("Gagal menghapus riwayat. Silakan coba lagi.");
    }
}



// Function to handle logout
async function logout() {
    try {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });
        
        if (response.ok) {
            window.location.href = "/login";
        } else {
            alert("Logout failed. Please try again.");
        }
    } catch (error) {
        console.error("Logout error:", error);
    }
}

// Add logout button event listener if it exists
document.addEventListener("DOMContentLoaded", () => {
    fetchHistory();
    
    // Add logout functionality if logout button exists
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }
});