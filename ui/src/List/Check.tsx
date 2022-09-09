import { Color } from "../Color";
import { unitFor } from "../unit";

const Mark = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.5rem"
      height="1.5rem"
      viewBox="0 0 512 512"
    >
      <polyline
        points="416 128 192 384 96 288"
        style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"
      />
    </svg>
  );
  
  export const Check = ({
    visible,
    checked,
    checkedColor = Color.blue,
    borderColor = Color.gray
  }: {
    visible: boolean;
    checked: boolean;
    checkedColor?:Color,
    borderColor?:Color
  }) => (
    <span
      class='$Check'
      style={{
        position: 'relative',
        height: '2rem',
        overflow: 'hidden',
        display: 'inline-block',
        width: '2.1rem',
        maxWidth: visible ? '2rem' : 0,
        marginRight: visible ? unitFor(10) : 0,
        transition: 'left, margin, max-width .4s ease-in-out',
      }}
    >
      <span
        class='$Check$Inner'
        style={{
          borderRadius: '200%',
          height: '2rem',
          width: '2rem',
          backgroundColor: checked ? checkedColor + '' : 'unset',
          border: `${unitFor(2)} solid ${checked ? checkedColor : borderColor}`,
          display: 'inline-block',
          position: 'absolute',
          left: visible ? '0' : unitFor(-5),
          transition: 'left .4s ease-in-out',
        }}
      >
        <Mark />
      </span>
    </span>
  );