// Motion initial states should remain visible-safe. Some embedded browsers can
// report hidden visibility while the user is looking at the page, which pauses
// entrance animations and would otherwise leave opacity: 0 content invisible.
export function initialWhenVisible<T>(initial: T): T {
  return initial;
}
