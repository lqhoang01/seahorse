(() => {
  "use strict";

  document.documentElement.classList.add("js");

  const body = document.body;
  const intro = document.querySelector("[data-intro]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const orientationTip = document.querySelector("[data-orientation-tip]");
  const orientationTipClose = document.querySelector("[data-orientation-tip-close]");
  const portraitMobile = window.matchMedia("(max-width: 760px) and (orientation: portrait)");
  let orientationTipTimer;
  let orientationTipCleanupTimer;
  let orientationTipHasShown = false;

  const hideOrientationTip = () => {
    if (!orientationTip || orientationTip.hidden) return;

    window.clearTimeout(orientationTipTimer);
    window.clearTimeout(orientationTipCleanupTimer);
    orientationTip.classList.remove("is-visible");
    orientationTip.classList.add("is-hiding");
    orientationTip.setAttribute("aria-hidden", "true");

    orientationTipCleanupTimer = window.setTimeout(() => {
      orientationTip.hidden = true;
      orientationTip.classList.remove("is-hiding");
      body.classList.remove("orientation-tip-open");
    }, reduceMotion.matches ? 20 : 720);
  };

  const showOrientationTip = () => {
    if (!orientationTip || orientationTipHasShown || !portraitMobile.matches) return;

    orientationTipHasShown = true;
    orientationTip.hidden = false;
    orientationTip.setAttribute("aria-hidden", "false");
    body.classList.add("orientation-tip-open");
    orientationTip.classList.remove("is-hiding");
    void orientationTip.offsetWidth;
    orientationTip.classList.add("is-visible");
    orientationTipTimer = window.setTimeout(hideOrientationTip, 7200);
  };

  orientationTipClose?.addEventListener("click", hideOrientationTip);
  portraitMobile.addEventListener?.("change", (event) => {
    if (!event.matches) {
      hideOrientationTip();
    } else if (!body.classList.contains("intro-active")) {
      showOrientationTip();
    }
  });

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
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const item = entry.target;
        item.classList.add("is-entering");
        window.setTimeout(() => item.classList.remove("is-entering"), 900);
        observer.unobserve(item);
      });
    }, { rootMargin: "0px 0px -20%", threshold: 0.08 });

    revealItems.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${(index % 4) * 55}ms`);
      revealObserver.observe(item);
    });
  }

  if (intro) {
    const introCore = intro.querySelector("[data-intro-core]");
    const introLogo = intro.querySelector("[data-intro-logo]");
    const siteLogo = document.querySelector(".brand-logo");
    const particles = intro.querySelector("[data-intro-particles]");
    let finishTimer;
    let removeTimer;
    let safetyTimer;
    let pointerFrame;
    let isClosing = false;
    let isRemoved = false;

    body.classList.add("intro-active");

    if (introLogo && siteLogo) {
      introLogo.src ||= siteLogo.currentSrc || siteLogo.src;
    }

    if (particles && !reduceMotion.matches) {
      const fragment = document.createDocumentFragment();

      for (let index = 0; index < 24; index += 1) {
        const particle = document.createElement("i");
        const size = 3 + Math.random() * 10;
        particle.style.setProperty("--x", `${Math.random() * 100}%`);
        particle.style.setProperty("--z", `${-220 + Math.random() * 440}px`);
        particle.style.setProperty("--size", `${size.toFixed(1)}px`);
        particle.style.setProperty("--delay", `${(-Math.random() * 7).toFixed(2)}s`);
        particle.style.setProperty("--duration", `${(5 + Math.random() * 5).toFixed(2)}s`);
        fragment.appendChild(particle);
      }

      particles.appendChild(fragment);
    }

    const resetTilt = () => {
      if (!introCore) return;
      introCore.style.setProperty("--intro-rx", "0deg");
      introCore.style.setProperty("--intro-ry", "0deg");
    };

    const tiltIntro = (event) => {
      if (!introCore || reduceMotion.matches || isClosing) return;

      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      window.cancelAnimationFrame(pointerFrame);
      pointerFrame = window.requestAnimationFrame(() => {
        introCore.style.setProperty("--intro-rx", `${(-y * 8).toFixed(2)}deg`);
        introCore.style.setProperty("--intro-ry", `${(x * 10).toFixed(2)}deg`);
      });
    };

    const removeIntro = (moveFocus) => {
      if (isRemoved) return;
      isRemoved = true;
      window.clearTimeout(finishTimer);
      window.clearTimeout(removeTimer);
      window.clearTimeout(safetyTimer);
      intro.hidden = true;
      intro.remove();
      body.classList.remove("intro-active", "intro-leaving");
      document.removeEventListener("keydown", handleIntroKeydown);
      window.cancelAnimationFrame(pointerFrame);
      window.setTimeout(showOrientationTip, reduceMotion.matches ? 40 : 260);

      if (moveFocus) {
        document.querySelector(".brand")?.focus({ preventScroll: true });
      }
    };

    const closeIntro = (moveFocus = false) => {
      if (isClosing) return;
      isClosing = true;
      window.clearTimeout(finishTimer);
      resetTilt();
      intro.setAttribute("aria-hidden", "true");
      intro.classList.add("is-leaving");
      body.classList.add("intro-leaving");
      removeTimer = window.setTimeout(() => removeIntro(moveFocus), reduceMotion.matches ? 30 : 950);
    };

    function handleIntroKeydown(event) {
      if (event.key === "Escape") closeIntro(true);
    }

    intro.addEventListener("pointermove", tiltIntro);
    intro.addEventListener("pointerleave", resetTilt);
    document.addEventListener("keydown", handleIntroKeydown);

    finishTimer = window.setTimeout(
      () => closeIntro(false),
      reduceMotion.matches ? 120 : 3900
    );

    // Last-resort cleanup for throttled tabs or interrupted CSS animations.
    safetyTimer = window.setTimeout(
      () => removeIntro(false),
      reduceMotion.matches ? 300 : 5200
    );

    window.addEventListener("pagehide", () => {
      window.clearTimeout(finishTimer);
      window.clearTimeout(removeTimer);
      if (intro.isConnected) removeIntro(false);
    }, { once: true });
  } else {
    window.setTimeout(showOrientationTip, reduceMotion.matches ? 40 : 500);
  }

  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#main-nav");

  if (menuButton && navigation) {
    const menuLabel = menuButton.querySelector(".sr-only");

    const closeMenu = () => {
      body.classList.remove("nav-open");
      menuButton.setAttribute("aria-expanded", "false");
      if (menuLabel) menuLabel.textContent = "Mở menu";
    };

    menuButton.addEventListener("click", () => {
      const isOpen = body.classList.toggle("nav-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      if (menuLabel) menuLabel.textContent = isOpen ? "Đóng menu" : "Mở menu";
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && body.classList.contains("nav-open")) {
        closeMenu();
        menuButton.focus({ preventScroll: true });
      }
    });
  }

  const coachesDialog = document.querySelector("#coaches-dialog");
  const coachesOpenButton = document.querySelector("[data-coaches-open]");
  const coachesCloseButton = document.querySelector("[data-coaches-close]");

  if (coachesDialog && coachesOpenButton && coachesCloseButton) {
    let closeDialogTimer;
    let isDialogClosing = false;

    if (coachesDialog.open && typeof coachesDialog.close === "function") {
      coachesDialog.close();
    }

    const finishClosingCoachesDialog = () => {
      window.clearTimeout(closeDialogTimer);
      isDialogClosing = false;
      coachesDialog.classList.remove("is-opening", "is-closing");

      if (typeof coachesDialog.close === "function" && coachesDialog.open) {
        coachesDialog.close();
      } else {
        coachesDialog.removeAttribute("open");
      }

      body.classList.remove("coaches-dialog-open");
    };

    const closeCoachesDialog = () => {
      if (!coachesDialog.open || isDialogClosing) return;

      coachesDialog.classList.remove("is-opening");

      if (reduceMotion.matches) {
        finishClosingCoachesDialog();
        return;
      }

      isDialogClosing = true;
      coachesDialog.classList.add("is-closing");
      closeDialogTimer = window.setTimeout(finishClosingCoachesDialog, 240);
    };

    coachesOpenButton.addEventListener("click", () => {
      coachesOpenButton.classList.remove("is-pressed");
      void coachesOpenButton.offsetWidth;
      coachesOpenButton.classList.add("is-pressed");

      if (typeof coachesDialog.showModal === "function") {
        coachesDialog.showModal();
      } else {
        coachesDialog.setAttribute("open", "");
      }

      coachesDialog.classList.remove("is-closing");
      coachesDialog.classList.add("is-opening");
      body.classList.add("coaches-dialog-open");
      coachesCloseButton.focus({ preventScroll: true });
    });

    coachesCloseButton.addEventListener("click", closeCoachesDialog);
    coachesDialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeCoachesDialog();
    });
    coachesDialog.addEventListener("close", () => {
      window.clearTimeout(closeDialogTimer);
      isDialogClosing = false;
      coachesDialog.classList.remove("is-opening", "is-closing");
      body.classList.remove("coaches-dialog-open");
      coachesOpenButton.focus({ preventScroll: true });
    });
    coachesDialog.addEventListener("click", (event) => {
      if (event.target === coachesDialog) closeCoachesDialog();
    });
  }
})();
