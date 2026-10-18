import { useLayoutEffect, useRef } from "react";

const scenes = new Map();
let frameId = 0;
let needsMeasure = true;
let resizeObserver;
let preference;

function frames() {
  const travel = window.innerWidth <= 600 ? 10 : 16;
  return [
    {
      clipPath: "inset(0 0 100% 0)",
      ...(CSS.supports("translate", "0 1px") ? { translate: `0 -${travel}px` } : {}),
    },
    { clipPath: "inset(0 0 0 0)", ...(CSS.supports("translate", "0 1px") ? { translate: "0 0" } : {}) },
  ];
}

function prepare(scene) {
  scene.animation?.cancel();
  scene.animation = null;
  scene.revealed = false;
  if (preference.matches) return;
  scene.animation = scene.element.animate(frames(), {
    duration: 450,
    delay: Math.min(scene.delay, 100),
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    fill: "backwards",
  });
  scene.animation.pause();
}

function update() {
  frameId = 0;
  if (preference.matches) return;
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;

  if (needsMeasure) {
    scenes.forEach((scene) => {
      const top = scene.element.getBoundingClientRect().top + scrollY;
      // Trigger from the layout box, independently of the animated clipping.
      scene.top = top;
      scene.height = scene.element.offsetHeight;
    });
    needsMeasure = false;
  }

  scenes.forEach((scene) => {
    const top = scene.top - scrollY;
    const bottom = top + scene.height;
    const focused = scene.element.contains(document.activeElement);
    if (focused) {
      scene.revealed = true;
      scene.animation.finish();
    } else if (bottom < -100 || top > viewportHeight + 100) {
      if (scene.revealed) {
        scene.revealed = false;
        scene.animation.pause();
        scene.animation.currentTime = 0;
      }
    } else if (!scene.revealed && bottom > 0 && top < viewportHeight - 32) {
      scene.revealed = true;
      scene.animation.effect.setKeyframes(frames());
      scene.animation.currentTime = 0;
      scene.animation.play();
    }
  });
}

function scheduleUpdate() {
  if (!frameId && scenes.size) frameId = window.requestAnimationFrame(update);
}

function scheduleMeasure() {
  needsMeasure = true;
  scheduleUpdate();
}

function updatePreference() {
  scenes.forEach(prepare);
  scheduleMeasure();
}

function register(element, delay) {
  if (!scenes.size) {
    preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    preference.addEventListener("change", updatePreference);
    window.addEventListener("scroll", scheduleMeasure, { passive: true, capture: true });
    window.addEventListener("resize", scheduleMeasure, { passive: true });
    window.addEventListener("load", scheduleMeasure);
    document.addEventListener("focusin", scheduleUpdate);
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(scheduleMeasure);
      resizeObserver.observe(document.documentElement);
    }
  }

  const scene = { element, delay };
  scenes.set(element, scene);
  prepare(scene);
  resizeObserver?.observe(element);
  scheduleMeasure();

  return () => {
    scene.animation?.cancel();
    resizeObserver?.unobserve(element);
    scenes.delete(element);
    if (scenes.size) {
      scheduleMeasure();
      return;
    }
    window.cancelAnimationFrame(frameId);
    frameId = 0;
    resizeObserver?.disconnect();
    resizeObserver = undefined;
    preference.removeEventListener("change", updatePreference);
    window.removeEventListener("scroll", scheduleMeasure, { capture: true });
    window.removeEventListener("resize", scheduleMeasure);
    window.removeEventListener("load", scheduleMeasure);
    document.removeEventListener("focusin", scheduleUpdate);
  };
}

function ScrollScene({ as: Component = "div", delay = 0, children, ...props }) {
  const elementRef = useRef(null);
  useLayoutEffect(() => {
    if (Component === "img" || !elementRef.current.animate) return;
    return register(elementRef.current, delay);
  }, [Component, delay]);
  return <Component ref={elementRef} data-scroll-scene="" {...props}>{children}</Component>;
}

export default ScrollScene;
