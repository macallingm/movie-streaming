/** SVG icons so + / check sit dead-center (text glyphs are often off-center). */
export function MyListCircleIcon({ added }) {
  if (added) {
    return (
      <svg
        className="btn-icon-mylist__svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    )
  }
  return (
    <svg
      className="btn-icon-mylist__svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}
