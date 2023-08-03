import { states } from '../states'
import { IScoreProps } from '../interfaces'

const Score: React.FC<IScoreProps> = ({ viewBoxWidth, viewBoxHeight, data }) => {
  // Constants for the position and dimensions of the score background rectangle
  const rectX = `-${viewBoxWidth / 8}`;
  const rectY = `-${viewBoxHeight / 6}`;
  const rectWidth = 200;
  const rectHeight = 10;

  // Constants for the text position and font size
  const textX = viewBoxWidth / 2;
  const textY = `-${viewBoxHeight / 10}`;
  const textSize = 5;

  return (
    <>
      {/* Score background rectangle */}
      <rect
        x={rectX}
        y={rectY}
        width={rectWidth}
        height={rectHeight}
        fill="black"
        opacity="0.7"
      />
      {/* Score text */}
      <text
        x={textX}
        y={textY}
        fontSize={textSize}
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {states[data.state]} / {data.score?.team1 || 0} - {data.score?.team2 || 0}
      </text>
    </>
  );
};

export default Score;