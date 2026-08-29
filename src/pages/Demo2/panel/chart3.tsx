import Chart from "@/components/chart";
import useRafInterval from "@/hooks/useRafInterval";
import { BarChart, type BarSeriesOption } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  type GridComponentOption,
  type TooltipComponentOption,
} from "echarts/components";
import type { ComposeOption, EChartsType } from "echarts/core";
import { useRef } from "react";

type BarOption = ComposeOption<
  BarSeriesOption | TooltipComponentOption | GridComponentOption
>;

const xData = ["贵阳市", "遵义市", "六盘水市", "安顺市", "毕节市", "铜仁市", "黔南州", "黔东南州", "黔西南州"];
const data = [1200, 980, 750, 620, 890, 540, 680, 720, 580];
const colors = ["#3061DB", "#BDCFFF"];

export default function Chart3() {
  const chartRef = useRef<EChartsType>(null);
  const tipIndex = useRef(0);

  useRafInterval(
    () => {
      if (chartRef.current) {
        chartRef.current?.dispatchAction({
          type: "showTip",
          seriesIndex: 0,
          dataIndex: tipIndex.current,
        });
        tipIndex.current = (tipIndex.current + 1) % data.length;
      }
    },
    3_000,
    true
  );

  return (
    <Chart<BarOption>
      ref={chartRef}
      use={[BarChart, TooltipComponent, GridComponent]}
      option={{
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(0, 0, 0,0.8)",
          borderColor: colors[1],
          borderWidth: 1,
          borderRadius: 8,
          textStyle: {
            color: "rgba(255, 255, 255,0.8)",
            fontSize: 13,
            align: "left",
          },
          axisPointer: {
            type: "line",
            lineStyle: {
              width: 1,
              type: "dotted",
              color: colors[0],
            },
          },
        },
        grid: {
          top: "15%",
          bottom: "15%",
          left: 40,
          right: 10,
          outerBoundsMode: "same",
        },
        xAxis: {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
          axisLabel: {
            interval: 0,
            color: "rgba(255, 255, 255, 0.6)",
            rotate: 30,
            fontSize: 10,
          },
          axisTick: {
            show: false,
          },
          data: xData,
        },
        yAxis: {
          type: "value",
          min: 0,
          max: 1400,
          interval: 200,
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(255, 255, 255, 0.05)",
            },
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: "rgba(255, 255, 255, 0.6)",
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            name: "播发数量",
            type: "bar",
            barWidth: 20,
            label: {
              show: true,
              position: "top",
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: 10,
            },
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: colors.map((color, index) => ({
                  offset: index,
                  color: color,
                })),
                global: false,
              },
            },
            data: data,
          },
        ],
      }}
    />
  );
}
