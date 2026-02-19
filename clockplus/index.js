function displayTime() {
    const now = new Date();

    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');

    const currentTime = `${hour}:${minute}:${second}`;
    const clockElement = document.querySelector('.clock');
    if (clockElement) clockElement.textContent = currentTime;

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const day = ['日', '月', '火', '水', '木', '金', '土'][now.getDay()];

    const dateString = `${year}年${month}月${date}日 (${day})`;
    const dateElement = document.querySelector('.date');
    if (dateElement) dateElement.textContent = dateString;
}

const API_KEY = "41e372cb8e05445189fab899479b919a";
const lat = "35.77928";
const lon = "139.63200";

const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ja`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    const nowTs = Math.floor(Date.now() / 1000); // 現在のUnixタイムスタンプ

    // 1. 今日・明日の判定用（日付文字列）
    const getLocalDateStr = (offsetDays = 0) => {
        const d = new Date();
        d.setDate(d.getDate() + offsetDays);
        return d.toLocaleDateString('sv-SE'); // YYYY-MM-DD形式
    };
    const todayStr = getLocalDateStr(0);
    const tomorrowStr = getLocalDateStr(1);

    let todayData = null;
    let tomorrowData = null;

    // --- 3時間ごとの予報（現在時刻以降のものを6件取得） ---
    const hourlyItems = data.list.filter(item => item.dt >= nowTs).slice(0, 6);

    const timeRow = document.getElementById("hourly-time");
    const weatherRow = document.getElementById("hourly-weather");
    const tempRow = document.getElementById("hourly-temp");
    const popRow = document.getElementById("hourly-pop");

    // 初期化（追記型にする場合は空にする）
    timeRow.innerHTML = "";
    weatherRow.innerHTML = "";
    tempRow.innerHTML = "";
    popRow.innerHTML = "";

    hourlyItems.forEach(item => {
      const itemDate = new Date(item.dt * 1000);
      const hour = itemDate.getHours();
      
      const temp = Math.round(item.main.temp);
      const pop = Math.round((item.pop ?? 0) * 100);
      const w = item.weather[0].main;
      const emoji = w.includes("Rain") ? "☔" :
                    w.includes("Cloud") ? "☁" :
                    w.includes("Snow") ? "⛄" : "☀️";

      timeRow.innerHTML    += `<th>${hour}時</th>`;
      weatherRow.innerHTML += `<td>${emoji}</td>`;
      tempRow.innerHTML    += `<td>${temp}℃</td>`;
      popRow.innerHTML     += `<td>${pop}%</td>`;
    });

    // --- 今日・明日の代表天気（お昼12時頃のデータを優先的に抽出） ---
    // data.listから今日・明日のデータを検索
    data.list.forEach(item => {
        const date = item.dt_txt.slice(0, 10);
        if (date === todayStr && !todayData) todayData = item; // 今日の直近予報
        if (date === tomorrowStr && !tomorrowData && item.dt_txt.includes("12:00:00")) {
            tomorrowData = item; // 明日の昼
        }
    });
    // 明日の昼データがなければ、明日の最初のデータを使う
    if (!tomorrowData) tomorrowData = data.list.find(item => item.dt_txt.startsWith(tomorrowStr));

    const setDailyRow = (target, dataItem) => {
        if (!dataItem) return "<td>-</td>";
        const w = dataItem.weather[0].main;
        const emoji = w.includes("Rain") ? "☔" : w.includes("Cloud") ? "☁" : w.includes("Snow") ? "⛄" : "☀️";
        const temp = `<font color="#ff0000">${Math.round(dataItem.main.temp_max)}℃</font> / <font color="#00ffff">${Math.round(dataItem.main.temp_min)}℃</font>`;
        const pop = `${Math.round((dataItem.pop ?? 0) * 100)}%`;
        
        if (target === 'weather') return `<td>${emoji}</td>`;
        if (target === 'temp') return `<td>${temp}</td>`;
        if (target === 'pop') return `<td>${pop}</td>`;
    };

    document.getElementById("daily-weather").innerHTML = setDailyRow('weather', todayData) + setDailyRow('weather', tomorrowData);
    document.getElementById("daily-temp").innerHTML    = setDailyRow('temp', todayData) + setDailyRow('temp', tomorrowData);
    document.getElementById("daily-pop").innerHTML     = setDailyRow('pop', todayData) + setDailyRow('pop', tomorrowData);
  })
  .catch(err => console.error(err));

displayTime();
setInterval(displayTime, 1000);