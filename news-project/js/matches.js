
// Simple WebSocket connection
const API_KEY = 'c81c3bb3b50a22b31fe760d41e431e6750d2eb1ac30980b96e317d766baff3d2';
const socket = new WebSocket(`wss://wss.allsportsapi.com/live_events?APIkey=${API_KEY}&timezone=+03:00`);

const liveMatchesContainer = document.getElementById('live-matches-container');

let allLiveMatches = new Map();


function showLoading() {

  const contentDiv = liveMatchesContainer.querySelector('.text-center') || liveMatchesContainer;
  if (contentDiv === liveMatchesContainer) {
    liveMatchesContainer.innerHTML = `
      <h5>Live</h5>
      <div class="text-center py-5">
        <div class="spinner-border text-danger" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3">Loading live matches...</p>
      </div>
    `;
  } else {
    contentDiv.innerHTML = `
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">Loading live matches...</p>
    `;
  }
}

function formatMatchTime(eventTime, eventStatus) {
  if (eventStatus === 'HT') return 'HT';
  if (eventStatus === 'FT') return 'FT';
  if (eventStatus && eventStatus !== '0') return `${eventStatus}'`;
  return eventTime || 'TBD';
}

function getMatchStatus(eventStatus) {
  if (eventStatus === 'HT') return 'Half Time';
  if (eventStatus === 'FT') return 'Full Time';
  if (eventStatus && eventStatus !== '0') return 'Live';
  return 'Starting Soon';
}

function createMatchCard(match) {
  const currentScore = match.event_halftime_result || match.event_final_result || '0 - 0';
  const matchTime = formatMatchTime(match.event_time, match.event_status);
  const matchStatus = getMatchStatus(match.event_status);
  
  return `
    <div class="card live mb-3 p-3 d-flex flex-row justify-content-between">
      <div class="d-flex align-items-center">
        <img src="${match.home_team_logo}" alt="${match.event_home_team}" 
             class="team-logo me-2" onerror="this.style.display='none'">
        <span class="fw-bold me-2">${match.event_home_team}</span>
        <span class="text-muted">vs</span>
        <span class="fw-bold ms-2">${match.event_away_team}</span>
        <img src="${match.away_team_logo}" alt="${match.event_away_team}" 
             class="team-logo ms-2" onerror="this.style.display='none'">
      </div>
      <div class="text-end">
        <div class="d-flex flex-column align-items-end">
          <span class="badge bg-danger mb-2">${matchStatus}</span>
          <span class="score mb-1">${currentScore}</span>
          <small class="text-muted">${matchTime}</small>
        </div>
      </div>
    </div>
  `;
}

function updateLiveMatches(matches) {
  console.log('Received matches:', matches.length);
  
  matches.forEach(match => {
    if (match.event_live === '1') {
     
      allLiveMatches.set(match.event_key, match);
      console.log('Added/updated live match:', match.event_home_team, 'vs', match.event_away_team);
    } else {
    
      allLiveMatches.delete(match.event_key);
      console.log('Removed non-live match:', match.event_home_team, 'vs', match.event_away_team);
    }
  });
  
  const liveMatchesArray = Array.from(allLiveMatches.values());
  console.log('Total live matches stored:', liveMatchesArray.length);
  
  if (liveMatchesArray.length === 0) {
    liveMatchesContainer.innerHTML = `
      <h5>Live</h5>
      <div class="text-center py-5">
        <i class="fas fa-futbol fa-3x text-muted mb-3"></i>
        <p class="text-muted">No live matches at the moment</p>
      </div>
    `;
    return;
  }
  
  // Display all live matches
  liveMatchesContainer.innerHTML = `
    <h5>Live <span class="badge bg-danger">${liveMatchesArray.length}</span></h5>
    ${liveMatchesArray.map(match => createMatchCard(match)).join('')}
  `;
}
socket.onopen = function() {
  console.log('Connected to live matches');
  showLoading();
};

socket.onmessage = function(event) {
  console.log('Raw WebSocket data:', event.data);
  if (event.data) {
    try {
      const matchesData = JSON.parse(event.data);
      console.log('Parsed matches data:', matchesData);
      console.log('Number of matches:', matchesData.length);
      updateLiveMatches(matchesData);
    } catch (error) {
      console.error('Error parsing data:', error);
      liveMatchesContainer.innerHTML = `
        <h5>Live</h5>
        <div class="alert alert-danger">Error loading data: ${error.message}</div>
      `;
    }
  }
};

socket.onclose = function() {
  console.log('Connection closed');
  liveMatchesContainer.innerHTML = `
    <h5>Live</h5>
    <div class="alert alert-warning">Connection lost. Refresh to reconnect.</div>
  `;
};

socket.onerror = function() {
  console.log('Connection error');
  liveMatchesContainer.innerHTML = `
    <h5>Live</h5>
    <div class="alert alert-danger">Connection error. Check your internet.</div>
  `;
};
   


