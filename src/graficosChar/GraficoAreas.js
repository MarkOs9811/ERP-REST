import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState, useMemo, useCallback } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  "#489ee7",
  "#ee5252",
  "#5a7a98",
  "#7ab0e0",
  "#d4f4ff",
  "#1d2530",
  "#00bcd4",
];

export function GraficoAreas({
  labels,
  data,
  centerTextDescription = "empleados",
}) {
  const [selectedItems, setSelectedItems] = useState([]);

  const total = useMemo(() => data.reduce((acc, val) => acc + val, 0), [data]);

  const toggleItem = useCallback((index) => {
    setSelectedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  }, []);

  const backgroundColors = useMemo(() => {
    return labels.map((_, i) => {
      const base = COLORS[i % COLORS.length];
      return selectedItems.length && !selectedItems.includes(i)
        ? `${base}80`
        : base;
    });
  }, [labels, selectedItems]);

  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderWidth: 2,
          borderColor: "#fff",
          cutout: "75%",
          offset: labels.map((_, i) => (selectedItems.includes(i) ? 15 : 0)),
          hoverBorderWidth: 3,
          hoverOffset: 8,
        },
      ],
    }),
    [labels, data, backgroundColors, selectedItems]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      onClick: (_, elements) => {
        if (elements.length > 0) toggleItem(elements[0].index);
      },
      plugins: {
        legend: {
          position: "right",
          onClick: (_, item) => toggleItem(item.index),
          labels: {
            boxWidth: 14,
            padding: 15,
            font: { size: 12 },
            generateLabels: (chart) =>
              chart.data.labels.map((label, i) => {
                const value = chart.data.datasets[0].data[i];
                const isSelected = selectedItems.includes(i);
                return {
                  text: `${label}`, // SIN porcentaje
                  fillStyle: chart.data.datasets[0].backgroundColor[i],
                  strokeStyle: COLORS[i % COLORS.length],
                  lineWidth: isSelected ? 2 : 1,
                  hidden: false,
                  index: i,
                };
              }),
          },
        },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.85)",
          titleColor: "#fff",
          bodyColor: "#fff",
          borderColor: "rgba(255,255,255,0.2)",
          borderWidth: 1,
          padding: 12,
          cornerRadius: 4,
          displayColors: true,
          callbacks: {
            label: ({ label, raw }) => ` ${label}: ${raw}`, // SIN porcentaje
          },
        },
      },
      animation: {
        duration: 700,
        easing: "easeOutQuart",
        animateScale: true,
        animateRotate: true,
      },
    }),
    [toggleItem, selectedItems]
  );

  const centerTextPlugin = useMemo(
    () => [
      {
        id: "centerText",
        beforeDraw: ({ ctx, chartArea: { width, height }, data }) => {
          ctx.save();
          const x = width / 2;
          const y = height / 2;
          const fontSize = Math.min(width, height) / 22;

          let title = "Total";
          let value = total.toString();
          let desc = centerTextDescription;

          if (selectedItems.length === 1) {
            const i = selectedItems[0];
            title = data.labels[i];
            value = data.datasets[0].data[i];
            desc = centerTextDescription;
          } else if (selectedItems.length > 1) {
            const sum = selectedItems.reduce(
              (sum, i) => sum + data.datasets[0].data[i],
              0
            );
            title = `${selectedItems.length} seleccionados`;
            value = sum;
            desc = centerTextDescription;
          }

          ctx.textAlign = "center";
          ctx.fillStyle = "#6b7280";
          ctx.font = `bold ${Math.max(12, fontSize * 0.9)}px sans-serif`;
          ctx.fillText(title, x, y - fontSize * 1.9);

          ctx.fillStyle = "#1d2530";
          ctx.font = `bold ${Math.max(20, fontSize * 1.6)}px sans-serif`;
          ctx.fillText(value, x, y - fontSize * 0.2);

          ctx.fillStyle = "#6b7280";
          ctx.font = `${Math.max(10, fontSize * 0.8)}px sans-serif`;
          ctx.fillText(desc, x, y + fontSize * 1.3);

          ctx.restore();
        },
      },
    ],
    [selectedItems, total, centerTextDescription]
  );

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "600px",
        height: "400px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <Doughnut data={chartData} options={options} plugins={centerTextPlugin} />
    </div>
  );
}
