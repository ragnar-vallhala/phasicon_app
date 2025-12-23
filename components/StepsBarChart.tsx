import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';

interface StepsBarChartProps {
  data: number[];
  goal: number;
  height?: number;
}

export default function StepsBarChart({
  data,
  goal,
  height = 120,
}: StepsBarChartProps) {
  const theme = useTheme();

  const width = Dimensions.get('window').width - 48;
  const paddingBottom = 20;
  const barWidth = 14;
  const gap = 10;

  const maxValue = Math.max(...data, goal);
  const scale = (height - paddingBottom) / maxValue;
  const totalBarsWidth =
    data.length * barWidth + (data.length - 1) * gap;

  const startX = (width - totalBarsWidth) / 2;


  return (
    <View>
      <Svg width={width} height={height}>
        {/* Goal line */}
        <Line
          x1={0}
          y1={height - goal * scale}
          x2={width}
          y2={height - goal * scale}
          stroke={theme.colors.textMuted}
          strokeDasharray="4,4"
          strokeOpacity={0.4}
        />

        {/* Bars */}
        {data.map((value, index) => {
          const barHeight = value * scale;
          const x = startX + index * (barWidth + gap);
          const y = height - barHeight;

          const isToday = index === data.length - 1;
          const reachedGoal = value >= goal;

          return (
            <Rect
              key={index}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={4}
              fill={
                isToday
                  ? theme.colors.primary
                  : reachedGoal
                    ? '#3DDC97'
                    : theme.colors.card
              }
            />
          );
        })}


        {/* Goal label */}
        <SvgText
          x={width - 22}
          y={height - goal * scale - 6}
          textAnchor="end"
          fontSize="10"
          fill={theme.colors.textMuted}
        >
          Goal
        </SvgText>
      </Svg>
    </View>
  );
}
