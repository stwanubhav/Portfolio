(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- split headings into word masks ---------- */
  document.querySelectorAll("[data-split]").forEach(function (el) {
    var text = el.textContent.trim();
    el.textContent = "";
    text.split(/\s+/).forEach(function (word, i) {
      var mask = document.createElement("span");
      mask.className = "word";
      var inner = document.createElement("span");
      inner.textContent = word;
      inner.style.setProperty("--wd", i * 55 + "ms");
      mask.appendChild(inner);
      el.appendChild(mask);
      el.appendChild(document.createTextNode(" "));
    });
  });

  /* ---------- staggered reveals ---------- */
  var revealables = Array.prototype.slice.call(
    document.querySelectorAll(".reveal, [data-split]")
  );

  function showNow(el) {
    if (el.classList.contains("is-in")) return;
    var group = el.parentElement;
    var siblings = group ? Array.prototype.filter.call(group.children, function (c) {
      return c.classList.contains("reveal");
    }) : [];
    var index = Math.max(0, siblings.indexOf(el));
    el.style.setProperty("--d", Math.min(index, 5) * 70 + "ms");
    el.classList.add("is-in");
  }

  function checkReveals() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var hits = [];
    revealables.forEach(function (el) {
      if (el.classList.contains("is-in")) return;
      /* reveal once the element has entered the viewport, or has already
         been scrolled past (so anchor jumps never leave content invisible) */
      if (el.getBoundingClientRect().top < vh * 0.92) hits.push(el);
    });
    hits.forEach(showNow);
  }

  /* ---------- scroll progress + sticky header ---------- */
  var head = document.getElementById("siteHead");
  var bar = document.getElementById("scrollProgress");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    if (head) head.classList.toggle("is-stuck", y > 20);
    if (!reduceMotion) checkReveals();
  }

  var queued = false;
  function queueScroll() {
    if (queued) return;
    queued = true;
    var run = function () {
      if (!queued) return;
      queued = false;
      onScroll();
    };
    window.requestAnimationFrame(run);
    setTimeout(run, 70);
  }

  if (reduceMotion) {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  }

  window.addEventListener("scroll", queueScroll, { passive: true });
  window.addEventListener("resize", queueScroll);
  window.addEventListener("load", queueScroll);
  onScroll();
  queueScroll();
  if (!reduceMotion) setTimeout(queueScroll, 500);

  /* ---------- full-screen menu ---------- */
  var menuBtn = document.getElementById("menuBtn");
  var menu = document.getElementById("menuOverlay");

  function setMenu(open) {
    if (!menu || !menuBtn) return;
    menu.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.querySelector("span").textContent = open ? "Close" : "Menu";
    document.body.style.overflow = open ? "hidden" : "";
    if (head) head.classList.toggle("is-menu-open", open);
    if (open) {
      var first = menu.querySelector("a");
      if (first) first.focus({ preventScroll: true });
    }
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      setMenu(menu.hidden);
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) {
        setMenu(false);
        menuBtn.focus();
      }
    });
  }

  /* ---------- repo filtering ---------- */
  var filters = document.querySelectorAll(".filter");
  var repos = document.querySelectorAll(".repo-card");

  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-filter");
      filters.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      repos.forEach(function (card) {
        var tags = (card.getAttribute("data-tags") || "").split(/\s+/);
        var show = key === "all" || tags.indexOf(key) !== -1;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* ---------- copy email ---------- */
  var copyBtn = document.getElementById("copyEmail");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.getAttribute("data-email");
      var done = function (ok) {
        copyBtn.textContent = ok ? "Copied" : email;
        copyBtn.classList.toggle("is-done", ok);
        setTimeout(function () {
          copyBtn.textContent = "Copy email";
          copyBtn.classList.remove("is-done");
        }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () { done(true); }, function () { done(false); });
      } else {
        var tmp = document.createElement("textarea");
        tmp.value = email;
        tmp.setAttribute("readonly", "");
        tmp.style.position = "fixed";
        tmp.style.opacity = "0";
        document.body.appendChild(tmp);
        tmp.select();
        var ok = false;
        try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
        document.body.removeChild(tmp);
        done(ok);
      }
    });
  }

  /* ---------- marquee seam ---------- */
  var track = document.getElementById("marqueeTrack");
  if (track) {
    track.innerHTML += track.innerHTML;
  }

  /* ---------- custom cursor ---------- */
  var cursor = document.getElementById("cursor");
  var precise = window.matchMedia("(pointer: fine)").matches;
  if (cursor && precise && !reduceMotion) {
    var cx = window.innerWidth / 2;
    var cy = window.innerHeight / 2;
    var tx = cx;
    var ty = cy;

    var running = false;

    window.addEventListener("pointermove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
      cursor.classList.add("is-on");
      if (!running) {
        running = true;
        window.requestAnimationFrame(loop);
      }
    }, { passive: true });

    document.addEventListener("pointerover", function (e) {
      var hot = e.target.closest("a, button, .card");
      cursor.classList.toggle("is-hot", Boolean(hot));
    });

    window.addEventListener("pointerleave", function () {
      cursor.classList.remove("is-on");
    });

    function loop() {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      cursor.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
      if (Math.abs(tx - cx) < 0.1 && Math.abs(ty - cy) < 0.1) {
        cx = tx;
        cy = ty;
        running = false;
        return;
      }
      window.requestAnimationFrame(loop);
    }
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
