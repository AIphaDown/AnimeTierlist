body {
  background: #000;
  color: white;
  font-family: 'Poppins', sans-serif;
  padding: 20px;
}

/* Tier layout */
.tier-row {
  display: flex;
  align-items: stretch;
  margin-bottom: 25px;
}

.tier-label {
  min-width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 300%;
  color: #fff;
  border-radius: 10px 0 0 10px;
  padding: 0 10px;
}

/* Tier colors */
.tier-label.S { background: #ff2f43; }
.tier-label.A { background: #fca475; }
.tier-label.B { background: #d5d460; }
.tier-label.C { background: #7b9749; }
.tier-label.D { background: #6bd5da; }
.tier-label.E { background: #e0aad5; }
.tier-label.PlanonWatching { background: #ad8ee1; } /* Plan on Watching */
.tier-label.CurrentlyWatching { background: #b65cff; } /* Currently Watching */
.tier-label.Upcoming { background: #a32f86; }


/* Gray background for shows */
.gray-box {
  background: #1e1e1e;
  flex: 1;
  border-radius: 0 10px 10px 0;
  padding: 15px;
  overflow-x: auto;
}

.cover-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.anime-card img {
  width: 8rem;            /* 120px/10.5 = 8rem */
  height: 11.33rem;           /* 170px/10.5 = 11.33rem  */
  object-fit: cover;       /* Ensures image fills box nicely */
  border-radius: 10px;
  transition: transform 0.2s ease;
  background-color: #111;  /* Prevents gaps if image loads slowly */
}

.anime-card img:hover {
  transform: scale(1.07);
}

/* Popup improvements */
.anime-popup {
  position: absolute;
  background: rgba(25, 25, 25, 0.97);
  border: 1px solid #888;
  border-radius: 15px;
  padding: 15px;
  width: 400px;
  /*max-height: 300px;*/
  overflow-y: auto;
  /*transform-origin: top left;*/
  opacity: 0;
  transform: scale(0.6);
  transition: all 0.2s ease;
  z-index: 1000;
}

.anime-popup div {
  vertical-align: middle;
}

.anime-popup.open {
  opacity: 1;
  transform: scale(1);
}

.anime-popup img {
  width: 230px;
  border-radius: 10px;
  float:left;
  margin-right: 15px;
  margin-top:-10px;
  vertical-align: middle;
}

.anime-popup h3 {
  margin-top: 8px;
  font-size: 1.1rem;
}

.anime-popup p {
  margin: 4px 0;
}

.anime-popup .avg {
  font-weight: bold;
}

.anime-popup a {
  color: #5aaaff;
  text-decoration: none;
}



/* Make the "Plan on Watching" tier label vertical */
.tier-label.PlanonWatching, .tier-label.CurrentlyWatching,.tier-label.Upcoming{
  writing-mode: vertical-rl;     /* Rotates text vertically (top to bottom) */
  text-orientation: mixed;
  font-size: 100%;              /* Slightly smaller font for compactness */
  line-height: 1.1;
  padding: 10px 0;
  min-width: unset;              /* Remove forced wide label box */
  width: 60px;                   /* Fixed narrow width */
  justify-content: center;
  align-items: center;
  border-radius: 10px 0 0 10px;
}
.tier-label.CurrentlyWatching {
  writing-mode: vertical-rl;     /* Rotates text vertically (top to bottom) */
  text-orientation: mixed;
  font-size: 100%;              /* Slightly smaller font for compactness */
  line-height: 1.1;
  padding: 10px 0;
  min-width: unset;              /* Remove forced wide label box */
  width: 60px;                   /* Fixed narrow width */
  justify-content: center;
  align-items: center;
  border-radius: 10px 0 0 10px;
}

/* Tier loading progress bar */
.progress-wrapper {
  width: 100%;
  height: 8px;
  background: #333;
  border-radius: 5px;
  margin-bottom: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #4ec9b0, #007acc);
  transition: width 0.3s ease;
  border-radius: 5px;
}
