console.log("lets write some javascript");

let Songs = [];
let currentSong = new Audio();

function formatTime(seconds) {
  const totalSeconds = Math.floor(seconds);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const paddedSecs = secs < 10 ? `0${secs}` : secs;
  return `${mins}:${paddedSecs}`;
}

async function getSongs(folder) {
  Songs = [];
  let a = await fetch(`${window.location.origin}/${folder}/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;

  let as = div.getElementsByTagName("a");

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      console.log(element);
      Songs.push(element.getAttribute("href"));
    }
  }
  return Songs;
}

async function load(params) {
  Songs = await getSongs(params);
  console.log("Loaded Songs:", Songs);
}

const trendingSongs = {
  "Saiyaara (From 'Saiyaara')": {
    cover: "Saiyaara.jpg",
    title: "Saiyaara (From Saiyaara).mp3",
    artist: "Tanishk Bagchi, Faheem Abdullah, Arslan Nizami",
    duration: "6:10"
  },
  "Tum Ho Toh (From 'Saiyaara')": {
    cover: "TumHoToh.jpg",
    title: "Tum Ho Toh (From Saiyaara).mp3",
    artist: "Vishal Mishra, Hansika Pareek, Raj Shekhar",
    duration: "4:45"
  },
  "Dhun (From 'Saiyaara')": {
    cover: "Dhun.jpg",
    title: "Dhun (From Saiyaara).mp3",
    artist: "Mithoon, Arijit Singh",
    duration: "5:20"
  },
  "Barbaad (From 'Saiyaara')": {
    cover: "Barbaad.jpg",
    title: "Barbaad (From Saiyaara).mp3",
    artist: "The Rish, Jubin Nautiyal",
    duration: "4:55"
  },
  "Humsafar (From 'Saiyaara')": {
    cover: "Humsafar.jpg",
    title: "Humsafar (From Saiyaara).mp3",
    artist: "Sachet-Parampara, Sachet Tandon",
    duration: "5:10"
  }
};

const playMusic = async (songKey) => {
  currentSong.pause();
  currentSong.currentTime = 0;
  currentSong.src = window.location.origin + Songs[songKey];

  try {
    await currentSong.play();
    play.src = "pause.png";
  } catch (error) {
    console.log("Playback failed:", error);
  }

  let song = Songs[songKey];
  let element = decodeURIComponent(song.split("\\").pop());
  element = element.replace(".mp3", "");
  document.getElementById("songDetails").innerHTML = element;
  document.getElementById("duration").innerHTML = `00:00/` + formatTime(currentSong.duration);

  currentSong.addEventListener("timeupdate", () => {
    document.getElementById("duration").innerHTML = `${formatTime(currentSong.currentTime)}/` + formatTime(currentSong.duration);
    const progress = (currentSong.currentTime / currentSong.duration) * 100;
    document.querySelector(".point").style.left = `${progress}%`;
  });

  document.querySelector(".seekbar").addEventListener("click", e => {
    let position = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".point").style.left = `${position}%`;
    currentSong.currentTime = ((currentSong.duration) * position) / 100;
  });

  currentSong.onended = () => {
    if (songKey + 1 < Songs.length) {
      playMusic(songKey + 1);
    } else {
      playMusic(0);
    }
  };
};

play.addEventListener("click", () => {
  if (currentSong.paused) {
    currentSong.play().then(() => {
      play.src = "pause.png";
    }).catch((err) => {
      console.error("Play error:", err);
    });
  } else {
    currentSong.pause();
    play.src = "youtube-stroke-rounded.svg";
  }
});

function showSongDetails(songName) {
  const song = trendingSongs[songName];
  console.log(song.title);
  document.querySelector(".all").style.display = "none";

  document.getElementById("new-song-detail-section").style.display = "block";
  document.getElementById("new-detail-cover").src = song.cover;
  document.getElementById("new-detail-title").innerText = songName;
  document.getElementById("new-detail-artist").innerText = song.artist;
  document.getElementById("new-detail-duration").innerText = song.duration;

  document.querySelector(".newplayButton").onclick = async () => {
  await load("songs");
  const songUrl = `\\songs\\${song.title}`;
  const songKey = Songs.indexOf(songUrl);
  if (songKey !== -1) {
    playMusic(songKey);
  } else {
    console.error("Song not found in Songs array:", songUrl);
    console.log("Available Songs:", Songs);
  }
};

}

function goBack() {
  document.querySelector(".artist-songs").style.display = "none";
  document.getElementById("new-song-detail-section").style.display = "none";
  document.querySelector(".all").style.display = "block";
}

document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".left").style.left = "0";
});
document.querySelector(".cross").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-100%";
});

document.getElementById("previous").addEventListener("click", () => {
  let index = Songs.indexOf(currentSong.src.replace(window.location.origin, ""));
  if (index > 0) {
    playMusic(index - 1);
  } else {
    playMusic(Songs.length - 1);
  }
});

document.getElementById("next").addEventListener("click", () => {
  let index = Songs.indexOf(currentSong.src.replace(window.location.origin, ""));
  if (index < Songs.length - 1) {
    playMusic(index + 1);
  } else {
    playMusic(0);
  }
});

document.querySelectorAll(".artist-card").forEach(card => {
  card.addEventListener("click", async () => {
    document.querySelector(".current-artist").innerHTML = "";
    let name = card.querySelector(".artist-name").textContent.trim();
    await load(name);
    for (let index = 0; index < Songs.length; index++) {
      let element = decodeURIComponent(Songs[index].split("\\").pop());
      element = element.replace(".mp3", "");
      const div1 = document.createElement("div");
      const div2 = document.createElement("div");
      div2.classList.add("song-title");
      const btn = document.createElement("button");
      div2.innerHTML = element;
      btn.innerHTML = "play";
      btn.addEventListener("click", () => {
        playMusic(index);
      });
      div1.appendChild(div2);
      div1.appendChild(btn);
      document.querySelector(".current-artist").appendChild(div1);
    }
    document.querySelector(".all").style.display = "none";
    document.querySelector(".artist-songs").style.display = "block";
  });
});

document.querySelector(".range").addEventListener("change", (e) => {
  currentSong.volume = parseInt(e.target.value) / 100;
});
