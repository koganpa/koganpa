function displayTime() {
    const now = new Date();

    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');

    const currentTime = `${hour}:${minute}:${second}`;
    document.querySelector('.clock').textContent = currentTime;

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const day = ['日', '月', '火', '水', '木', '金', '土'][now.getDay()];

    const dateString = `${year}年${month}月${date}日 (${day})`;
    document.querySelector('.date').textContent = dateString;
}

const API_KEY = "41e372cb8e05445189fab899479b919a";
const lat = "35.77928";
const lon = "139.63200";

const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ja`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

    let today = {weather:"", temp:"", pop:""};
    let tomorrow = {weather:"", temp:"", pop:""};

    data.list.forEach(item => {
      const date = item.dt_txt.slice(0,10);
      const temp = Math.round(item.main.temp);
      const pop  = Math.round((item.pop ?? 0)*100);
      const w = item.weather[0].main;

      const emoji = w.includes("Rain") ? "☔" :
                    w.includes("Cloud") ? "☁" :
                    w.includes("Snow") ? "⛄" : "☀️";

      if(date === todayStr) {
        today.weather = emoji;
        today.temp = `<font color="#ff0000">${Math.round(item.main.temp_max)}℃</font> / <font color="#0000ff">${Math.round(item.main.temp_min)}℃</font>`;
        today.pop  = `${pop}%`;
      }
      if(date === tomorrowStr) {
        tomorrow.weather = emoji;
        tomorrow.temp = `${Math.round(item.main.temp_max)}℃ / ${Math.round(item.main.temp_min)}℃`;
        tomorrow.pop  = `${pop}%`;
      }
    });

    // 今日・明日のテーブル
    document.getElementById("daily-weather").innerHTML = `<td>${today.weather}</td><td>${tomorrow.weather}</td>`;
    document.getElementById("daily-temp").innerHTML    = `<td>${today.temp}</td><td>${tomorrow.temp}</td>`;
    document.getElementById("daily-pop").innerHTML     = `<td>${today.pop}</td><td>${tomorrow.pop}</td>`;


    // 3時間ごとのテーブル（例：直近6件）
    const nowSec = Math.floor(Date.now()/1000);
    const hourlyItems = data.list.filter(item => item.dt >= nowSec).slice(0,6);

    const timeRow = document.getElementById("hourly-time");
    const weatherRow = document.getElementById("hourly-weather");
    const tempRow = document.getElementById("hourly-temp");
    const popRow = document.getElementById("hourly-pop");

    hourlyItems.forEach(item => {
      let time = item.dt_txt.slice(11,16);
      if (time.endsWith(':00')) time = time.slice(0,2);
      const temp = Math.round(item.main.temp);
      const pop  = Math.round((item.pop ?? 0)*100);
      const w = item.weather[0].main;
      const emoji = w.includes("Rain") ? "☔" :
                    w.includes("Cloud") ? "☁" :
                    w.includes("Snow") ? "⛄" : "☀️";

      timeRow.innerHTML    += `<th>${time}</th>`;
      weatherRow.innerHTML += `<td>${emoji}</td>`;
      tempRow.innerHTML    += `<td>${temp}℃</td>`;
      popRow.innerHTML     += `<td>${pop}%</td>`;
    });
  })
  .catch(err => console.error(err));




displayTime();
setInterval(displayTime, 1000);