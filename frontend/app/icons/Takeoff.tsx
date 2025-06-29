import * as React from "react"
import { SVGProps } from "react"
const Takeoff = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" {...props}>
    <defs>
      <filter
        id="takeoff-b"
        width="400%"
        height="400%"
        x="-100%"
        y="-100%"
        colorInterpolationFilters="sRGB"
        filterUnits="objectBoundingBox"
        primitiveUnits="userSpaceOnUse"
      >
        <feGaussianBlur
          width="100%"
          height="100%"
          x="0%"
          y="0%"
          in="SourceGraphic"
          result="blur"
          stdDeviation="51 37"
        />
      </filter>
      <filter
        id="takeoff-c"
        width="400%"
        height="400%"
        x="-100%"
        y="-100%"
        colorInterpolationFilters="sRGB"
        filterUnits="objectBoundingBox"
        primitiveUnits="userSpaceOnUse"
      >
        <feGaussianBlur
          width="100%"
          height="100%"
          x="0%"
          y="0%"
          in="SourceGraphic"
          result="blur"
          stdDeviation="77 32"
        />
      </filter>
      <linearGradient id="takeoff-a" x1="50%" x2="50%" y1="0%" y2="100%">
        {/* <stop offset="0%" stopColor="hsl(205, 69%, 60%)" />
        <stop offset="100%" stopColor="hsl(205, 69%, 60%)" /> */}
		{/* white */}
		<stop offset="0%" stopColor="white" />
		<stop offset="100%" stopColor="white" />
      </linearGradient>
    </defs>
    <g
      fill="none"
      stroke="url(#takeoff-a)"
      strokeWidth={44}
      transform="rotate(18 400 400)"
    >
      <path
        d="M379.292 101.34a41.417 41.417 0 0 1 41.416.003l227.584 131.396A41.413 41.413 0 0 1 669 268.604v262.792a41.419 41.419 0 0 1-20.708 35.868L420.708 698.66a41.417 41.417 0 0 1-41.416-.003L151.708 567.262A41.413 41.413 0 0 1 131 531.396V268.604a41.419 41.419 0 0 1 20.708-35.868L379.292 101.34Z"
        filter="url(#takeoff-b)"
      />
      <path
        d="M416.292 101.34a41.417 41.417 0 0 1 41.416.003l227.584 131.396A41.413 41.413 0 0 1 706 268.604v262.792a41.419 41.419 0 0 1-20.708 35.868L457.708 698.66a41.417 41.417 0 0 1-41.416-.003L188.708 567.262A41.413 41.413 0 0 1 168 531.396V268.604a41.419 41.419 0 0 1 20.708-35.868L416.292 101.34Z"
        filter="url(#takeoff-c)"
        opacity={0.25}
      />
      <path
        d="M342.292 101.34a41.417 41.417 0 0 1 41.416.003l227.584 131.396A41.413 41.413 0 0 1 632 268.604v262.792a41.419 41.419 0 0 1-20.708 35.868L383.708 698.66a41.417 41.417 0 0 1-41.416-.003L114.708 567.262A41.413 41.413 0 0 1 94 531.396V268.604a41.419 41.419 0 0 1 20.708-35.868L342.292 101.34Z"
        filter="url(#takeoff-c)"
        opacity={0.25}
      />
      <path d="M379.292 101.34a41.417 41.417 0 0 1 41.416.003l227.584 131.396A41.413 41.413 0 0 1 669 268.604v262.792a41.419 41.419 0 0 1-20.708 35.868L420.708 698.66a41.417 41.417 0 0 1-41.416-.003L151.708 567.262A41.413 41.413 0 0 1 131 531.396V268.604a41.419 41.419 0 0 1 20.708-35.868L379.292 101.34Z" />
    </g>
  </svg>
)
export default Takeoff
