document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("dob-form");
  const daySelect = document.getElementById("day-select");
  const monthSelect = document.getElementById("month-select");
  const yearSelect = document.getElementById("year-select");
  const errorBanner = document.getElementById("error-banner");

  // Age output elements
  const yearsNum = document.getElementById("years-num");
  const totalMonthsNum = document.getElementById("total-months-num");
  const totalDaysNum = document.getElementById("total-days-num");
  const exactBreakdown = document.getElementById("exact-breakdown");
  const bornDayChip = document.getElementById("born-day-chip");
  const zodiacChip = document.getElementById("zodiac-chip");

  // Countdown output elements
  const cdDays = document.getElementById("cd-days");
  const cdHours = document.getElementById("cd-hours");
  const cdMinutes = document.getElementById("cd-minutes");
  const cdSeconds = document.getElementById("cd-seconds");
  const nextBdayDateEl = document.getElementById("next-bday-date");

  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const WEEKDAYS = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
  ];

  let activeDob = new Date(2000, 3, 15); // Default: April 15, 2000
  let countdownInterval = null;

  // Populate Day, Month, Year dropdowns
  function populateSelectors() {
    for (let d = 1; d <= 31; d++) {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = d;
      daySelect.appendChild(opt);
    }

    MONTHS.forEach((name, idx) => {
      const opt = document.createElement("option");
      opt.value = idx;
      opt.textContent = name;
      monthSelect.appendChild(opt);
    });

    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 1900; y--) {
      const opt = document.createElement("option");
      opt.value = y;
      opt.textContent = y;
      yearSelect.appendChild(opt);
    }

    // Set defaults to April 15, 2000
    daySelect.value = 15;
    monthSelect.value = 3;
    yearSelect.value = 2000;
  }

  function getZodiacSign(day, monthIndex) {
    const m = monthIndex + 1;
    if ((m === 3 && day >= 21) || (m === 4 && day <= 19)) return "♈ Aries";
    if ((m === 4 && day >= 20) || (m === 5 && day <= 20)) return "♉ Taurus";
    if ((m === 5 && day >= 21) || (m === 6 && day <= 20)) return "♊ Gemini";
    if ((m === 6 && day >= 21) || (m === 7 && day <= 22)) return "♋ Cancer";
    if ((m === 7 && day >= 23) || (m === 8 && day <= 22)) return "♌ Leo";
    if ((m === 8 && day >= 23) || (m === 9 && day <= 22)) return "♍ Virgo";
    if ((m === 9 && day >= 23) || (m === 10 && day <= 22)) return "♎ Libra";
    if ((m === 10 && day >= 23) || (m === 11 && day <= 21)) return "♏ Scorpio";
    if ((m === 11 && day >= 22) || (m === 12 && day <= 21)) return "♐ Sagittarius";
    if ((m === 12 && day >= 22) || (m === 1 && day <= 19)) return "♑ Capricorn";
    if ((m === 1 && day >= 20) || (m === 2 && day <= 18)) return "♒ Aquarius";
    return "♓ Pisces";
  }

  function getNextBirthday(dob, now) {
    const birthMonth = dob.getMonth();
    const birthDay = dob.getDate();

    let nextYear = now.getFullYear();
    // Handle Feb 29 birthdays cleanly on non-leap years
    let candidate = new Date(nextYear, birthMonth, birthDay, 0, 0, 0);
    if (birthMonth === 1 && birthDay === 29 && candidate.getMonth() !== 1) {
      candidate = new Date(nextYear, 2, 1, 0, 0, 0);
    }

    if (candidate <= now) {
      nextYear += 1;
      candidate = new Date(nextYear, birthMonth, birthDay, 0, 0, 0);
      if (birthMonth === 1 && birthDay === 29 && candidate.getMonth() !== 1) {
        candidate = new Date(nextYear, 2, 1, 0, 0, 0);
      }
    }

    return candidate;
  }

  function updateAgeStats(dob) {
    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let years = todayMidnight.getFullYear() - dob.getFullYear();
    let months = todayMidnight.getMonth() - dob.getMonth();
    let days = todayMidnight.getDate() - dob.getDate();

    if (days < 0) {
      months -= 1;
      const daysInPrevMonth = new Date(
        todayMidnight.getFullYear(),
        todayMidnight.getMonth(),
        0
      ).getDate();
      days += daysInPrevMonth;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalMonths = years * 12 + months;
    const msPerDay = 1000 * 60 * 60 * 24;
    const totalDays = Math.floor((todayMidnight - dob) / msPerDay);

    yearsNum.textContent = years;
    totalMonthsNum.textContent = totalMonths.toLocaleString();
    totalDaysNum.textContent = totalDays.toLocaleString();
    exactBreakdown.innerHTML = `You are <strong>${years}</strong> years, <strong>${months}</strong> months and <strong>${days}</strong> days old!`;

    bornDayChip.textContent = `Born on a ${WEEKDAYS[dob.getDay()]}`;
    zodiacChip.textContent = getZodiacSign(dob.getDate(), dob.getMonth());
  }

  function startLiveCountdown(dob) {
    if (countdownInterval) clearInterval(countdownInterval);

    function tick() {
      const now = new Date();
      const nextBday = getNextBirthday(dob, now);

      nextBdayDateEl.textContent = `${MONTHS[nextBday.getMonth()]} ${nextBday.getDate()}, ${nextBday.getFullYear()}`;

      const diffMs = Math.max(0, nextBday - now);
      const totalSeconds = Math.floor(diffMs / 1000);

      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      cdDays.textContent = days;
      cdHours.textContent = String(hours).padStart(2, "0");
      cdMinutes.textContent = String(minutes).padStart(2, "0");
      cdSeconds.textContent = String(seconds).padStart(2, "0");
    }

    tick();
    countdownInterval = setInterval(tick, 1000);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const day = parseInt(daySelect.value, 10);
    const month = parseInt(monthSelect.value, 10);
    const year = parseInt(yearSelect.value, 10);

    const candidate = new Date(year, month, day);
    const now = new Date();

    // Validate calendar existence (e.g. rejects April 31 or Feb 30)
    if (
      candidate.getFullYear() !== year ||
      candidate.getMonth() !== month ||
      candidate.getDate() !== day
    ) {
      errorBanner.textContent = `⚠️ ${MONTHS[month]} ${day}, ${year} is not a valid calendar date.`;
      errorBanner.classList.add("visible");
      return;
    }

    if (candidate > now) {
      errorBanner.textContent = "⚠️ Please choose a date of birth in the past.";
      errorBanner.classList.add("visible");
      return;
    }

    errorBanner.classList.remove("visible");
    activeDob = candidate;
    updateAgeStats(activeDob);
    startLiveCountdown(activeDob);
  });

  // Boot up
  populateSelectors();
  updateAgeStats(activeDob);
  startLiveCountdown(activeDob);
});