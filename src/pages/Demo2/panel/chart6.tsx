import SeamVirtualScroll from "@/components/seamVirtualScroll";

const areas = ["贵阳市", "遵义市", "六盘水市", "安顺市", "毕节市", "铜仁市", "黔南州", "黔东南州", "黔西南州"];

const sourceEventMap: Record<string, string[]> = {
  "应急管理局": ["泥石流", "山洪"],
  "气象局": ["暴雨", "雷电", "大风", "大雾"],
  "水利局": ["泄洪预警"],
  "地震局": ["地震"],
};

const sources = Object.keys(sourceEventMap);
const statuses = [
  { text: "成功", color: "#52c41a" },
  { text: "失败", color: "#ff4d4f" },
];

const data = Array.from({ length: 50 }, (_, k) => {
  const source = sources[Math.floor(Math.random() * sources.length)];
  const events = sourceEventMap[source];
  const event = events[Math.floor(Math.random() * events.length)];
  const rand = Math.random();
  const status = rand < 0.9 ? statuses[0] : statuses[1];
  return {
    value1: ++k,
    value2: areas[Math.floor(Math.random() * areas.length)],
    value3: source,
    value4: event,
    value5: `2026-08-${String(Math.floor(Math.random() * 29) + 1).padStart(2, "0")} ${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
    value6: (
      <span style={{ color: status.color }}>
        {status.text}
      </span>
    ),
  };
});

export default function Chart6() {
  return (
    <SeamVirtualScroll
      rowHeight={50}
      styles={{
        header: { color: "rgba(255, 255, 255, 0.6)" },
        body: { color: "#3061DB" },
      }}
      column={[
        { title: "序号", dataIndex: "value1", noScroll: true, flex: 0.5 },
        {
          title: "消息区域",
          dataIndex: "value2",
          align: "center",
          noScroll: true,
          flex: 1,
        },
        {
          title: "消息来源",
          dataIndex: "value3",
          align: "center",
          noScroll: true,
          flex: 1,
        },
        {
          title: "事件类型",
          dataIndex: "value4",
          align: "center",
          noScroll: true,
          flex: 0.8,
        },
        {
          title: "时间",
          dataIndex: "value5",
          align: "center",
          noScroll: true,
          flex: 1.5,
        },
        {
          title: "状态",
          dataIndex: "value6",
          align: "center",
          noScroll: true,
          flex: 0.6,
        },
      ]}
      data={data}
    />
  );
}
