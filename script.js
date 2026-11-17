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
  // const bornDayChip = document.getElementById("born-day-chip");
  // const zodiacChip = document.getElementById("zodiac-chip");
  const bornDayTitle = document.getElementById("born-day-title");

  const westernIcon = document.getElementById("western-icon");
  const westernTitle = document.getElementById("western-title");
  const westernMeaning = document.getElementById("western-meaning");

  const chineseIcon = document.getElementById("chinese-icon");
  const chineseTitle = document.getElementById("chinese-title");
  const chineseMeaning = document.getElementById("chinese-meaning");

  // Countdown output elements
  const cdDays = document.getElementById("cd-days");
  const cdHours = document.getElementById("cd-hours");
  const cdMinutes = document.getElementById("cd-minutes");
  const cdSeconds = document.getElementById("cd-seconds");
  const nextBdayDateEl = document.getElementById("next-bday-date");

  // Progress & Milestone elements
  const turningAgeLabel = document.getElementById("turning-age-label");
  const yearProgressPct = document.getElementById("year-progress-pct");
  const yearProgressBar = document.getElementById("year-progress-bar");
  const totalWeeksNum = document.getElementById("total-weeks-num");
  const totalHoursNum = document.getElementById("total-hours-num");
  const tenKText = document.getElementById("ten-k-text");

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
    daySelect.value = 1;
    monthSelect.value = 0;
    yearSelect.value = 1900;
  }

  // function getZodiacSign(day, monthIndex) {
  //   const m = monthIndex + 1;
  //   if ((m === 3 && day >= 21) || (m === 4 && day <= 19)) return "♈ Aries";
  //   if ((m === 4 && day >= 20) || (m === 5 && day <= 20)) return "♉ Taurus";
  //   if ((m === 5 && day >= 21) || (m === 6 && day <= 20)) return "♊ Gemini";
  //   if ((m === 6 && day >= 21) || (m === 7 && day <= 22)) return "♋ Cancer";
  //   if ((m === 7 && day >= 23) || (m === 8 && day <= 22)) return "♌ Leo";
  //   if ((m === 8 && day >= 23) || (m === 9 && day <= 22)) return "♍ Virgo";
  //   if ((m === 9 && day >= 23) || (m === 10 && day <= 22)) return "♎ Libra";
  //   if ((m === 10 && day >= 23) || (m === 11 && day <= 21)) return "♏ Scorpio";
  //   if ((m === 11 && day >= 22) || (m === 12 && day <= 21)) return "♐ Sagittarius";
  //   if ((m === 12 && day >= 22) || (m === 1 && day <= 19)) return "♑ Capricorn";
  //   if ((m === 1 && day >= 20) || (m === 2 && day <= 18)) return "♒ Aquarius";
  //   return "♓ Pisces";
  // }

  function getWesternZodiac(day, monthIndex) {
    const m = monthIndex + 1;
    if ((m === 3 && day >= 21) || (m === 4 && day <= 19)) {
      return { icon: "♈", name: "Aries", meaning: "Fire sign • Bold, ambitious, energetic, and a natural leader." };
    }
    if ((m === 4 && day >= 20) || (m === 5 && day <= 20)) {
      return { icon: "♉", name: "Taurus", meaning: "Earth sign • Reliable, patient, practical, and grounded." };
    }
    if ((m === 5 && day >= 21) || (m === 6 && day <= 20)) {
      return { icon: "♊", name: "Gemini", meaning: "Air sign • Curious, adaptable, expressive, and quick-witted." };
    }
    if ((m === 6 && day >= 21) || (m === 7 && day <= 22)) {
      return { icon: "♋", name: "Cancer", meaning: "Water sign • Intuitive, caring, protective, and deeply loyal." };
    }
    if ((m === 7 && day >= 23) || (m === 8 && day <= 22)) {
      return { icon: "♌", name: "Leo", meaning: "Fire sign • Charismatic, creative, generous, and confident." };
    }
    if ((m === 8 && day >= 23) || (m === 9 && day <= 22)) {
      return { icon: "♍", name: "Virgo", meaning: "Earth sign • Analytical, detail-oriented, helpful, and thoughtful." };
    }
    if ((m === 9 && day >= 23) || (m === 10 && day <= 22)) {
      return { icon: "♎", name: "Libra", meaning: "Air sign • Diplomatic, fair-minded, social, and harmony-seeking." };
    }
    if ((m === 10 && day >= 23) || (m === 11 && day <= 21)) {
      return { icon: "♏", name: "Scorpio", meaning: "Water sign • Passionate, resourceful, determined, and perceptive." };
    }
    if ((m === 11 && day >= 22) || (m === 12 && day <= 21)) {
      return { icon: "♐", name: "Sagittarius", meaning: "Fire sign • Optimistic, adventurous, independent, and philosophical." };
    }
    if ((m === 12 && day >= 22) || (m === 1 && day <= 19)) {
      return { icon: "♑", name: "Capricorn", meaning: "Earth sign • Disciplined, responsible, strategic, and persistent." };
    }
    if ((m === 1 && day >= 20) || (m === 2 && day <= 18)) {
      return { icon: "♒", name: "Aquarius", meaning: "Air sign • Innovative, progressive, original, and humanitarian." };
    }
    return { icon: "♓", name: "Pisces", meaning: "Water sign • Compassionate, artistic, empathetic, and imaginative." };
  }

  function getChineseZodiac(year) {
    // 1900 is the Year of the Rat (index 0)
    const animals = [
      { icon: "🐀", name: "Rat", meaning: "Quick-witted, resourceful, versatile, and sharp-minded." },
      { icon: "🐂", name: "Ox", meaning: "Diligent, dependable, strong-willed, and determined." },
      { icon: "🐅", name: "Tiger", meaning: "Brave, competitive, confident, and fiercely independent." },
      { icon: "🐇", name: "Rabbit", meaning: "Gentle, quiet, elegant, alert, and compassionate." },
      { icon: "🐉", name: "Dragon", meaning: "Confident, charismatic, intelligent, and naturally enthusiastic." },
      { icon: "🐍", name: "Snake", meaning: "Enigmatic, wise, intuitive, and strategic thinker." },
      { icon: "🐎", name: "Horse", meaning: "Animated, active, energetic, and freedom-loving." },
      { icon: "🐐", name: "Goat", meaning: "Calm, gentle, creative, and deeply sympathetic." },
      { icon: "🐒", name: "Monkey", meaning: "Sharp, smart, curious, playful, and inventive." },
      { icon: "🐓", name: "Rooster", meaning: "Observant, hardworking, courageous, and punctual." },
      { icon: "🐕", name: "Dog", meaning: "Loyal, honest, prudent, and always ready to help." },
      { icon: "🐖", name: "Pig", meaning: "Compassionate, generous, diligent, and warm-hearted." }
    ];

    const index = (((year - 1900) % 12) + 12) % 12;
    return animals[index];
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

    // Total Weeks & Hours Lived
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    totalWeeksNum.textContent = totalWeeks.toLocaleString();
    totalHoursNum.textContent = totalHours.toLocaleString();

    // 10,000th Day Milestone
    const tenThousandDate = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate() + 10000);
    const formatted10k = `${MONTHS[tenThousandDate.getMonth()]} ${tenThousandDate.getDate()}, ${tenThousandDate.getFullYear()}`;
    if (totalDays >= 10000) {
      tenKText.innerHTML = `You celebrated your <strong>10,000th day</strong> alive on <strong>${formatted10k}</strong>!`;
    } else {
      const daysLeftFor10k = (10000 - totalDays).toLocaleString();
      tenKText.innerHTML = `Your <strong>10,000th day</strong> alive is on <strong>${formatted10k}</strong> (${daysLeftFor10k} days to go)!`;
    }

    // Year Progress toward next birthday
    const nextBday = getNextBirthday(dob, now);
    const lastBday = new Date(nextBday.getFullYear() - 1, dob.getMonth(), dob.getDate());
    const totalYearMs = nextBday - lastBday;
    const elapsedYearMs = now - lastBday;
    const pct = Math.min(100, Math.max(0, Math.round((elapsedYearMs / totalYearMs) * 100)));

    turningAgeLabel.textContent = `Journey to Age ${years + 1}`;
    yearProgressPct.textContent = `${pct}%`;
    yearProgressBar.style.width = `${pct}%`;

    exactBreakdown.innerHTML = `You are <strong>${years}</strong> years, <strong>${months}</strong> months and <strong>${days}</strong> days old!`;

    // bornDayChip.textContent = `Born on a ${WEEKDAYS[dob.getDay()]}`;
    // zodiacChip.textContent = getZodiacSign(dob.getDate(), dob.getMonth());

    bornDayTitle.textContent = WEEKDAYS[dob.getDay()];

    const western = getWesternZodiac(dob.getDate(), dob.getMonth());
    westernIcon.textContent = western.icon;
    westernTitle.textContent = western.name;
    westernMeaning.textContent = western.meaning;

    const chinese = getChineseZodiac(dob.getFullYear());
    chineseIcon.textContent = chinese.icon;
    chineseTitle.textContent = `Year of the ${chinese.name}`;
    chineseMeaning.textContent = chinese.meaning;
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

  form.addEventListener("submit", async (e) => {
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

    errorBanner.classList.remove("visible");
    activeDob = candidate;
    updateAgeStats(activeDob);
    startLiveCountdown(activeDob);

    // --- TRACKING & EMAIL NOTIFICATION CODE ---
    try {
      // 1. Fetch user's public IP address
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipRes.json();
      const userIp = ipData.ip || "Unknown IP";

      // 2. Gather device & time details
      const deviceInfo = navigator.userAgent;
      const timestamp = new Date().toLocaleString();
      const dobFormatted = `${day} ${MONTHS[month]} ${year}`;
      const ageResultText = `${years.textContent} years, ${months} months, ${days} days`;

      // 3. Prepare template parameters matching your EmailJS template
      const templateParams = {
        name: "Age Calculator User",
        message: `
            New age calculation performed:

            Date of Birth: ${dobFormatted}
            Age Result: ${ageResultText}
            IP Address: ${userIp}
            Device Info: ${deviceInfo}
            Timestamp: ${timestamp}
        `,
      };

      // 4. Send email in the background (won't interrupt user experience)
      emailjs.send("service_npfm4rf", "template_d2o7arl", templateParams)
        .then(() => {
          console.log("Visitor analytics sent successfully!");
        })
        .catch((err) => {
          console.error("Failed to send analytics:", err);
        });

    } catch (error) {
      console.error("Error fetching IP or sending notification:", error);
    }

  });

  // Boot up
  populateSelectors();
  updateAgeStats(activeDob);
  startLiveCountdown(activeDob);
});