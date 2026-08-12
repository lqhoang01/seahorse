Skip to content
lqhoang01
seahorse
Repository navigation
Code
Issues
Pull requests
Actions
Projects
Wiki
Security and quality
Insights
Settings
Files
Go to file
t
T
images
index.html
script.js
style.css
vercel.json
seahorse
/
script.js
in
main

Edit

Preview
Indent mode

Spaces
Indent size

2
Line wrap mode

No wrap
Editing script.js file contents
  1
  2
  3
  4
  5
  6
  7
  8
  9
 10
 11
 12
 13
 14
 15
 16
 17
 18
 19
 20
 21
 22
 23
 24
 25
 26
 27
 28
 29
 30
 31
 32
 33
 34
 35
 36
 37
 38
 39
 40
 41
 42
 43
 44
 45
 46
 47
 48
 49
 50
 51
 52
 53
 54
 55
 56
 57
 58
 59
 60
 61
 62
 63
 64
 65
 66
 67
 68
(() => {
  "use strict";

  document.documentElement.classList.add("js");

  const body = document.body;
  const intro = document.querySelector("[data-intro]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const youtubeFrames = document.querySelectorAll("iframe[data-youtube-id]");
  const hasWebOrigin = window.location.protocol === "http:" || window.location.protocol === "https:";

  document.querySelectorAll("[data-poster-src]").forEach((poster) => {
    const image = poster.querySelector("img");
    if (image && poster.dataset.posterSrc) image.src = poster.dataset.posterSrc;
  });

  const buildYoutubeSource = (videoId, autoplay = false) => {
    const params = new URLSearchParams({
      rel: "0",
      playsinline: "1",
      enablejsapi: "1",
      origin: window.location.origin,
      hl: "vi"
    });
    if (autoplay) params.set("autoplay", "1");
    return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?${params.toString()}`;
  };

  youtubeFrames.forEach((frame) => {
    const videoId = frame.dataset.youtubeId;
    if (!videoId) return;

    if (!hasWebOrigin) {
      const note = document.createElement("div");
      note.className = "video-local-note";
      note.innerHTML = "<div><strong>Video cần chạy qua website</strong>Hãy mở trang bằng Live Server hoặc triển khai lên GitHub Pages / Vercel để YouTube nhận đúng domain.</div>";
      frame.parentElement?.appendChild(note);
      return;
    }

    frame.src = buildYoutubeSource(videoId);
  });

  document.querySelectorAll("[data-youtube-play]").forEach((poster) => {
    poster.addEventListener("click", () => {
      const videoId = poster.dataset.youtubeId;
      if (!videoId) return;

      if (!hasWebOrigin) {
        window.open(`https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`, "_blank", "noopener,noreferrer");
        return;
      }

      const frame = document.createElement("iframe");
      frame.src = buildYoutubeSource(videoId, true);
      frame.title = poster.dataset.videoTitle || "Video Seahorse Crew";
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      frame.allowFullscreen = true;
      poster.replaceWith(frame);
    }, { once: true });
  });

  const revealItems = document.querySelectorAll(".reveal");

  if (!reduceMotion.matches && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
Use Control + Shift + m to toggle the tab key moving focus. Alternatively, use esc then tab to move to the next interactive element on the page.
 
