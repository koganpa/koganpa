fetch("data.json")
  .then(res => res.json())
  .then(data => {
    const page = location.pathname.includes("live") ? "live" : "home";

    if (page === "home") {
      const h = data.home;
      const iframe = document.getElementById("home-iframe");
      iframe.src = h.iframe.url;
      iframe.height = h.iframe.height;

      document.getElementById("home-img").src = h.img;
    }

    if (page === "live") {
      const l = data.live;
      const iframe = document.getElementById("live-iframe");
      iframe.src = l.iframe.url;
      iframe.height = l.iframe.height;

      document.querySelector(".title").textContent = l.title;

      const box = document.getElementById("explanations");
      box.innerHTML = "";
      l.explanations.forEach(text => {
        const p = document.createElement("p");
        p.className = "explanation";
        p.textContent = text;
        box.appendChild(p);
      });
    }
  });
