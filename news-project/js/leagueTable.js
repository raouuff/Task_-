// // League standings data
// const standingsData = [
//   {
//     rank: 1,
//     team: "Team A",
//     mp: 12,
//     wdl: "8/3/1",
//     goals: "25/10/15",
//     points: 27,
//     logo: "A",
//     logoClass: "logo-a",
//   },
//   {
//     rank: 2,
//     team: "Team B",
//     mp: 12,
//     wdl: "7/4/1",
//     goals: "23/8/12",
//     points: 25,
//     logo: "B",
//     logoClass: "logo-b",
//   },
//   {
//     rank: 3,
//     team: "Team C",
//     mp: 12,
//     wdl: "6/5/1",
//     goals: "18/9/9",
//     points: 23,
//     logo: "C",
//     logoClass: "logo-c",
//   },
//   {
//     rank: 4,
//     team: "Team D",
//     mp: 12,
//     wdl: "5/4/3",
//     goals: "15/12/3",
//     points: 19,
//     logo: "D",
//     logoClass: "logo-d",
//     highlighted: true,
//   },
//   {
//     rank: 5,
//     team: "Team E",
//     mp: 12,
//     wdl: "4/5/3",
//     goals: "14/13/1",
//     points: 17,
//     logo: "E",
//     logoClass: "logo-e",
//   },
//   {
//     rank: 6,
//     team: "Team F",
//     mp: 12,
//     wdl: "3/6/3",
//     goals: "12/12/0",
//     points: 15,
//     logo: "F",
//     logoClass: "logo-f",
//   },
//   {
//     rank: 7,
//     team: "Team G",
//     mp: 12,
//     wdl: "2/8/5",
//     goals: "10/18/-8",
//     points: 11,
//     logo: "G",
//     logoClass: "logo-g",
//   },
//   {
//     rank: 8,
//     team: "Team H",
//     mp: 12,
//     wdl: "1/6/5",
//     goals: "8/16/-8",
//     points: 9,
//     logo: "H",
//     logoClass: "logo-h",
//   },
//   {
//     rank: 9,
//     team: "Team I",
//     mp: 12,
//     wdl: "0/7/5",
//     goals: "7/18/-11",
//     points: 7,
//     logo: "I",
//     logoClass: "logo-i",
//   },
//   {
//     rank: 10,
//     team: "Team J",
//     mp: 12,
//     wdl: "0/6/6",
//     goals: "6/20/-14",
//     points: 6,
//     logo: "J",
//     logoClass: "logo-j",
//   },
// ];

// // Populate table with data
// function populateTable() {
//   const tbody = document.getElementById("standingsBody");
//   tbody.innerHTML = "";

//   standingsData.forEach((team) => {
//     const row = document.createElement("tr");
//     if (team.highlighted) {
//       row.classList.add("highlighted-row");
//     }

//     row.innerHTML = `
//                     <td class="rank">${team.rank}</td>
//                     <td>
//                         <div class="team-info">
//                             <div class="team-logo ${team.logoClass}">${team.logo}</div>
//                             <span class="team-name">${team.team}</span>
//                         </div>
//                     </td>
//                     <td>${team.mp}</td>
//                     <td>${team.wdl}</td>
//                     <td>${team.goals}</td>
//                     <td><strong>${team.points}</strong></td>
//                 `;

//     tbody.appendChild(row);
//   });
// }

// // Initialize table when page loads
// document.addEventListener("DOMContentLoaded", function () {
//   populateTable();
// });

// // Add search functionality
// document.querySelector(".search-box").addEventListener("input", function (e) {
//   const searchTerm = e.target.value.toLowerCase();
//   const rows = document.querySelectorAll("#standingsBody tr");

//   rows.forEach((row) => {
//     const teamName = row.querySelector(".team-name").textContent.toLowerCase();
//     if (teamName.includes(searchTerm)) {
//       row.style.display = "";
//     } else {
//       row.style.display = "none";
//     }
//   });
// });

// // Add click handlers for navigation
// document.querySelectorAll(".nav-link").forEach((link) => {
//   link.addEventListener("click", function (e) {
//     e.preventDefault();
//     document
//       .querySelectorAll(".nav-link")
//       .forEach((l) => l.classList.remove("active"));
//     this.classList.add("active");
//   });
// });

// // ضع مفتاحك هنا
// const API_KEY =
//   "94c5de035b904507afcfb530e748ed2bd550421783550b0351ec27da978e742c";
// const LEAGUE_ID = 207;

// // رابط الـ API
// const url = `https://apiv2.allsportsapi.com/football/?&met=Standings&leagueId=${LEAGUE_ID}&APIkey=${API_KEY}`;

// // جلب البيانات باستخدام fetch
// fetch(url)
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     return response.json();
//   })
//   .then((data) => {
//     // تحقق أولاً من نجاح العملية
//     if (data.success === 1) {
//       const standings = data.result.total; // جدول الترتيب العام
//       console.log("ترتيب الدوري:");
//       standings.forEach((team) => {
//         console.log(
//           `${team.standing_place}. ${team.standing_team} - ${team.standing_PTS} نقطة`
//         );
//       });
//     } else {
//       console.log("لم يتم جلب البيانات:", data);
//     }
//   })
//   .catch((error) => {
//     console.error("حدث خطأ:", error);
//   });

// ========================================================================

// // ضع مفتاحك هنا
// const API_KEY =
//   "94c5de035b904507afcfb530e748ed2bd550421783550b0351ec27da978e742c";
// const LEAGUE_ID = 207;

// // رابط الـ API
// const url = `https://apiv2.allsportsapi.com/football/?&met=Standings&leagueId=${LEAGUE_ID}&APIkey=${API_KEY}`;

// // Populate table with API data
// function populateTable() {
//   const tbody = document.getElementById("standingsBody");
//   tbody.innerHTML = "";

//   fetch(url)
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.success === 1) {
//         // استبدال standingsData بالبيانات من API
//         const standingsData = data.result.total.map((team) => ({
//           rank: team.standing_place,
//           team: team.standing_team,
//           mp: team.standing_P,
//           wdl: `${team.standing_W}/${team.standing_D}/${team.standing_L}`,
//           goals: `${team.standing_F}/${team.standing_A}/${team.standing_GD}`,
//           points: team.standing_PTS,
//           logo: team.standing_team.charAt(0),
//           logoClass: "", // ممكن تسيبيها فاضية
//         }));

//         // إنشاء الصفوف
//         standingsData.forEach((team) => {
//           const row = document.createElement("tr");

//           if (team.highlighted) {
//             row.classList.add("highlighted-row");
//           }

//           row.innerHTML = `
//             <td class="rank">${team.rank}</td>
//             <td>
//               <div class="team-info">
//                 <div class="team-logo ${team.logoClass}">${team.logo}</div>
//                 <span class="team-name">${team.team}</span>
//               </div>
//             </td>
//             <td>${team.mp}</td>
//             <td>${team.wdl}</td>
//             <td>${team.goals}</td>
//             <td><strong>${team.points}</strong></td>
//           `;

//           tbody.appendChild(row);
//         });
//       } else {
//         console.log("لم يتم جلب البيانات:", data);
//       }
//     })
//     .catch((error) => console.error("حدث خطأ:", error));
// }

// // Initialize table when page loads
// document.addEventListener("DOMContentLoaded", populateTable);

// // البحث
// document.querySelector(".search-box").addEventListener("input", function (e) {
//   const searchTerm = e.target.value.toLowerCase();
//   const rows = document.querySelectorAll("#standingsBody tr");

//   rows.forEach((row) => {
//     const teamName = row.querySelector(".team-name").textContent.toLowerCase();
//     row.style.display = teamName.includes(searchTerm) ? "" : "none";
//   });
// });

// // Navigation links
// document.querySelectorAll(".nav-link").forEach((link) => {
//   link.addEventListener("click", function (e) {
//     e.preventDefault();
//     document
//       .querySelectorAll(".nav-link")
//       .forEach((l) => l.classList.remove("active"));
//     this.classList.add("active");
//   });
// });

// ===============================================================

const API_KEY =
  "94c5de035b904507afcfb530e748ed2bd550421783550b0351ec27da978e742c";
const LEAGUE_ID = 207;

const url = `https://apiv2.allsportsapi.com/football/?&met=Standings&leagueId=${LEAGUE_ID}&APIkey=${API_KEY}`;

function populateTable() {
  const $tbody = $("#standingsBody");
  $tbody.empty();

  $.getJSON(url)
    .done(function (data) {
      if (data.success === 1) {
        const standingsData = data.result.total.map(function (team) {
          return {
            rank: team.standing_place,
            team: team.standing_team,
            mp: team.standing_P,
            wdl: `${team.standing_W}/${team.standing_D}/${team.standing_L}`,
            goals: `${team.standing_F}/${team.standing_A}/${team.standing_GD}`,
            points: team.standing_PTS,
            logo: team.standing_team.charAt(0),
            logoClass: "",
          };
        });

        $.each(standingsData, function (i, team) {
          const $row = $("<tr></tr>");
          if (team.highlighted) {
            $row.addClass("highlighted-row");
          }

          $row.html(`
            <td class="rank">${team.rank}</td>
            <td>
              <div class="team-info">
                <div class="team-logo ${team.logoClass}">${team.logo}</div>
                <span class="team-name">${team.team}</span>
              </div>
            </td>
            <td>${team.mp}</td>
            <td>${team.wdl}</td>
            <td>${team.goals}</td>
            <td><strong>${team.points}</strong></td>
          `);

          $tbody.append($row);
        });
      } else {
        console.log("لم يتم جلب البيانات:", data);
      }
    })
    .fail(function (error) {
      console.error("حدث خطأ:", error);
    });
}

// عند تحميل الصفحة
$(document).ready(function () {
  populateTable();

  // البحث
  $(".search-box").on("input", function () {
    const searchTerm = $(this).val().toLowerCase();
    $("#standingsBody tr").each(function () {
      const teamName = $(this).find(".team-name").text().toLowerCase();
      $(this).toggle(teamName.includes(searchTerm));
    });
  });

  // navigation links
  $(".nav-link").on("click", function (e) {
    e.preventDefault();
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
  });
});
