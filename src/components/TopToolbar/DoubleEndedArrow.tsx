export const DoubleEndedArrow = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="25" viewBox="0 0 100 50">
      <line
        x1="10"
        y1="25"
        x2="90"
        y2="25"
        stroke-width="3"
        marker-start="url(#endArrow)"
        marker-end="url(#startArrow)"
        stroke="currentColor"
      />
      <defs>
        <marker
          id="startArrow"
          markerWidth="10"
          markerHeight="10"
          refX="10"
          refY="5"
          orient="auto"
          markerUnits="strokeWidth"
          stroke="currentColor"
        >
          <path d="M0,0 L10,5 L0,10 " fill="none" stroke-width="2" />
        </marker>
        <marker
          id="endArrow"
          markerWidth="10"
          markerHeight="10"
          refX="0"
          refY="5"
          orient="auto"
          markerUnits="strokeWidth"
          stroke="currentColor"
        >
          <path d="M10,0 L0,5 L10,10" fill="none" stroke-width="2" />
        </marker>
      </defs>
    </svg>
  );
};
