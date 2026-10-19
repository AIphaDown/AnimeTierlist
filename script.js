// ============================
// CONFIGURATION
// ============================

// CSV data source (public Google Sheet link)
const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGHHRPzixDH37ulr593BMG8Rkf0otz-M6ePnGWtvNI4DFotojR7ujtwrMgzph_xwieZmGTyiHONqpA/pub?gid=440467140&single=true&output=csv";

/*
const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGHHRPzixDH37ulr593BMG8Rkf0otz-M6ePnGWtvNI4DFotojR7ujtwrMgzph_xwieZmGTyiHONqpA/pub?gid=440467140&single=true&output=csv";
  
const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTlX-LyWDnMlGKNnvjEE_E_rpgeJRQ4DR-oPFrcNOdP8gRixipe85JNlTJb4q-TO8wT1j71DzG6u3W/pub?gid=440467140&single=true&output=csv";
*/
const tierContainer = document.getElementById("tierlist");

// Cache to store previously loaded covers
const coverCache = {};

// Request queue to avoid exceeding API rate limits
let activeRequests = 0;
const MAX_CONCURRENT_REQUESTS = 10;
const REQUEST_DELAY = 350; // milliseconds between requests


// ============================
// CSV PARSING
// ============================

/**
 * Takes CSV text and converts it to an array of objects.
 * Each object = one anime with its corresponding data.
 */
function parseCSV(csvText) {
  const lines = csvText.trim().split("\n");
  const entries = [];

  for (let i = 1; i < lines.length; i++) {
    // trim() removes whitespace — including the trailing "\r"
    const [MAL, Name, Erik, Jaden, Average, TierRaw] =
      lines[i].split(",").map(col => col.trim());

    // Some people add extra spaces or tabs, normalize tier fully
    const Tier = TierRaw.replace(/\r/g,"").trim();

    entries.push({ MAL, Name, Erik, Jaden, Average, Tier });
  }

  return entries;
}


// ============================
// MAL ID EXTRACTION
// ============================

/**
 * Extracts the numeric MAL ID from a MyAnimeList link.
 * Example: https://myanimelist.net/anime/5114/... → 5114
 */
function getMalId(link) {
  const match = link.match(/anime\/(\d+)/);
  return match ? match[1] : null;
}


// ============================
// CHAINING EXPLANATION
// ============================
/**
 * In JavaScript, "chaining" means calling multiple properties or methods in a row.
 * Example: data.data.images.jpg.large_image_url
 * Each dot (.) accesses a nested object or property.
 *
 * Optional chaining (?.) safely checks if something exists before continuing.
 * data.data?.images?.jpg?.large_image_url
 * If one part is undefined, it stops and returns undefined (instead of crashing).
 *]
 */


// ============================
// FETCH WRAPPER WITH QUEUE + RETRY
// ============================

/**
 * Limits concurrent requests to avoid 429 (Too Many Requests) errors.
 * Keeps retrying up to 5 times if no image is found.
 */
async function getCover(malLink, name, retries = 0) {
  const id = getMalId(malLink);
  if (!id) return "https://via.placeholder.com/150x220?text=Invalid+Link";

  // Use cached result if available
  if (coverCache[id]) return coverCache[id];

  // Limit concurrent requests
  while (activeRequests >= MAX_CONCURRENT_REQUESTS) {
    await new Promise((r) => setTimeout(r, 200));
  }

  activeRequests++;
  let img = "";

  try {
        // Fetch from Jikan Edge API using MAL ID
    const res = await fetch(`https://jikan.lucashdo.com/v1/anime/${id}`);
    if (!res.ok) throw new Error("Main fetch failed");
    const data = await res.json();

    //updated for jikan edge
    if (data && data.data && data.data.images && data.data.images.medium)
    {
      img = data.data.images.medium;
    }

    
    // Cache result
    if (img) {
      coverCache[id] = img;
      return img;
    }

    throw new Error("No image found via ID");
  } catch (err) {
    console.warn(`Retrying ${name}: ${err.message}`);
  } finally {
    activeRequests--;
    await new Promise((r) => setTimeout(r, REQUEST_DELAY));
  }

  
  // Retry logic: Try again after a short delay, up to 5 times
  if (retries < 8) {
    console.log(`Retrying fetch for ${name} (Attempt ${retries + 2})`);
    await new Promise((r) => setTimeout(r, 1000));
    return getCover(malLink, name, retries + 1);
  }

  // Fallback placeholder
  return "https://via.placeholder.com/150x220?text=No+Image";
}


// ============================
// POPUP HANDLING
// ============================

/**
 * Creates and displays a popup near the clicked anime cover.
 * Popups open smoothly from the image position.
 */
function showPopup(anime, cover, target) {
  //if already doesnt exist
  if(!document.querySelector(".anime-popup"))
    {
      let popup = document.createElement("div");
      popup.className = "anime-popup";

      popup.innerHTML = `
        <div>
        <img src="${cover}" alt="${anime.Name}"></img>
        <h3>${anime.Name}</h3>
        <p class="avg">Average: ${anime.Average}</p>
        <p>Erik: ${anime.Erik}</p>
        <p>Jaden: ${anime.Jaden}</p>
        <a href="${anime.MAL}" target="_blank">View on MyAnimeList</a>
        </div>
      `;

      document.body.appendChild(popup);

      // Calculate popup position relative to the clicked image
      const rect = target.getBoundingClientRect();
      const popupSize = popup.getBoundingClientRect();
       console.log("left: " + popupSize.width*1.7  + " Width: "+ window.innerWidth);
      let left = rect.left;
      let top = rect.top +  window.scrollY + rect.height + 10;
      const bottomSpace = window.innerHeight - rect.bottom;
      if (bottomSpace < 250) top = rect.top + window.scrollY - 260;
      if(left + popupSize.width*1.7 > window.innerWidth) left -= ((rect.right+popupSize.width*1.7)-window.innerWidth);
     
      popup.style.left = left + "px";
      console.log("left: " + left);
      popup.style.top = top + "px";
/*
      const rect = target.getBoundingClientRect();
      console.log(rect.right);
      let top = rect.top + rect.height + 10;
      const bottomSpace = window.innerHeight - rect.bottom;
      if (bottomSpace < 250) top = rect.top + window.scrollY - 260;
      popup.style.left = rect.left + "px";
      popup.style.top = top + "px";
*/
      // Animate opening
      requestAnimationFrame(() => popup.classList.add("open"));
    
    // Close popup when clicking outside
    const close = () => {
      popup.classList.remove("open");
      setTimeout(() => popup.remove(), 200);
      document.removeEventListener("click", clickAway);
    };

    const clickAway = (e) => {
      if (!popup.contains(e.target)) close();
    };

    document.addEventListener("click", clickAway);
  }
  else
    {
      let popup = document.querySelector(".anime-popup");
      let difShow = false;
      //if clicking on different cover
      if(anime.Name != document.querySelector(".anime-popup img").alt)
      {
        console.log(document.querySelector(".anime-popup img").alt);
        console.log(anime.Name);
        difShow = true;
      }
      
      popup.classList.remove("open");
      setTimeout(() => popup.remove(), 200);
      if(difShow){setTimeout(() => showPopup(anime, cover, target), 202);}
    }
}


// ============================
// RENDERING TIERS
// ============================

/**
 * Loops through each tier in order and generates DOM elements.
 * Loads covers dynamically using getCover().
 */
// ============================
// RENDERING TIERS (with progress bars)
// ============================

/**
 * Renders each tier in order.
 * Displays a progress bar while images load for that tier.
 */
async function renderTiers(data) {
  const order = [
    "S",
    "A",
    "B",
    "C",
    "D",
    "E",
    "Plan on Watching",
    "Currently Watching",
    "Upcoming",
  ];

  for (const tier of order) {
    // Filter and sort by average score
    const tierData = data
      .filter((a) => a.Tier.toUpperCase() === tier.toUpperCase())
      .sort((a, b) => b.Average - a.Average);
    if (!tierData.length) continue;

    // === Create tier container ===
    const tierRow = document.createElement("div");
    tierRow.className = "tier-row";

    // Tier label (left side)
    const label = document.createElement("div");
    // Sanitize tier name for CSS classes (remove spaces)
    const safeTierName = tier.replace(/\s+/g, "");
    label.className = `tier-label ${safeTierName}`;
    label.textContent = tier;
    tierRow.appendChild(label);

    // Gray box (background for covers)
    const grayBox = document.createElement("div");
    grayBox.className = "gray-box";

    // Cover row (where all images go)
    const coverRow = document.createElement("div");
    coverRow.className = "cover-row";

    //Add progress bar
    const progressWrapper = document.createElement("div");
    progressWrapper.className = "progress-wrapper";

    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";

    progressWrapper.appendChild(progressBar);
    grayBox.appendChild(progressWrapper);
    grayBox.appendChild(coverRow);
    tierRow.appendChild(grayBox);
    tierContainer.appendChild(tierRow);

    //Track loading
    let loadedCount = 0;
    const total = tierData.length;

    // Updates visual bar width as covers finish loading
    const updateProgress = () => {
      const percent = Math.round((loadedCount / total) * 100);
      progressBar.style.width = `${percent}%`;

      // Fade out when done
      if (percent >= 100) {
        setTimeout(() => {
          progressWrapper.style.opacity = 0;
          progressWrapper.style.transition = "opacity 0.5s ease";
          setTimeout(() => progressWrapper.remove(), 600);
        }, 400);
      }
    };

    // === Load each anime cover ===
    for (const anime of tierData) {
      const card = document.createElement("div");
      card.className = "anime-card";

      // Fetch cover and attach once ready
      const cover = await getCover(anime.MAL, anime.Name);
      card.innerHTML = `<img src="${cover}" alt="${anime.Name}">`;

      card.addEventListener("click", (e) => {
        e.stopPropagation();
        showPopup(anime, cover, card);
      });

      coverRow.appendChild(card);

      // Increment and update progress
      loadedCount++;
      updateProgress();
    }
  }
}



// ============================
// MAIN LOADING FUNCTION
// ============================

async function loadData() {
  const res = await fetch(CSV_URL);
  const text = await res.text();
  const data = parseCSV(text);
  await renderTiers(data);
}

loadData();
