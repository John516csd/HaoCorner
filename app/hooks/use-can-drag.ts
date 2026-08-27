"use client";

import { useSyncExternalStore } from "react";

// Dragging is a desktop enhancement. Enabling Motion drag on a coarse pointer
// adds `touch-action: none`, which prevents the browser from starting a native
// vertical scroll when a gesture begins on the card.
const dragMediaQuery =
  "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

const subscribers = new Set<() => void>();
let mediaQueryList: MediaQueryList | null = null;

function notifySubscribers() {
  subscribers.forEach((subscriber) => subscriber());
}

function getMediaQueryList() {
  if (typeof window === "undefined") return null;

  if (!mediaQueryList) {
    mediaQueryList = window.matchMedia(dragMediaQuery);
  }

  return mediaQueryList;
}

function subscribe(subscriber: () => void) {
  const shouldStartListening = subscribers.size === 0;
  subscribers.add(subscriber);
  const query = getMediaQueryList();

  if (shouldStartListening) {
    query?.addEventListener("change", notifySubscribers);
  }

  return () => {
    subscribers.delete(subscriber);

    if (subscribers.size === 0 && mediaQueryList) {
      mediaQueryList.removeEventListener("change", notifySubscribers);
    }
  };
}

function getSnapshot() {
  return getMediaQueryList()?.matches ?? false;
}

function getServerSnapshot() {
  return false;
}

export function useCanDrag() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
