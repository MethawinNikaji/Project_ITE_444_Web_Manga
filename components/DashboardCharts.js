"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

export default function DashboardCharts({
  topMangas,
  statusData,
  categoryData,
  timelineData,
}) {
  // 1. กราฟแท่ง: 5 อันดับมังงะที่มีตอนมากที่สุด
  const barData = {
    labels: topMangas.map((m) => m.title),
    datasets: [
      {
        label: "จำนวนตอน (Chapters)",
        data: topMangas.map((m) => m.count),
        backgroundColor: "rgba(54, 162, 235, 0.75)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "📊 5 อันดับมังงะที่มีจำนวนตอนมากที่สุด",
        font: { size: 14, weight: "bold" },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  // 2. กราฟโดนัท: สัดส่วนสถานะมังงะ (Ongoing vs Completed)
  const doughnutData = {
    labels: ["กำลังดำเนินเรื่อง (Ongoing)", "จบแล้ว (Completed)"],
    datasets: [
      {
        data: [statusData.ongoing, statusData.completed],
        backgroundColor: [
          "rgba(255, 193, 7, 0.85)",
          "rgba(40, 167, 69, 0.85)",
        ],
        borderColor: ["#ffc107", "#28a745"],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: true,
        text: "🍩 สัดส่วนสถานะการ์ตูน",
        font: { size: 14, weight: "bold" },
      },
    },
  };

  // 3. กราฟวงกลม: สัดส่วนเนื้อหา (ทั่วไป vs NSFW)
  const pieData = {
    labels: ["มังงะทั่วไป (General)", "มังงะ NSFW (Member Only)"],
    datasets: [
      {
        data: [categoryData.general, categoryData.nsfw],
        backgroundColor: [
          "rgba(13, 110, 253, 0.85)",
          "rgba(220, 53, 69, 0.85)",
        ],
        borderColor: ["#0d6efd", "#dc3545"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: true,
        text: "🥧 สัดส่วนหมวดหมู่เนื้อหา (General vs NSFW)",
        font: { size: 14, weight: "bold" },
      },
    },
  };

  // 4. กราฟเส้น: สถิติจำนวนหน้าในแต่ละตอนล่าสุด
  const lineData = {
    labels: timelineData.labels,
    datasets: [
      {
        fill: true,
        label: "จำนวนหน้า (Pages)",
        data: timelineData.counts,
        borderColor: "rgba(111, 66, 193, 1)",
        backgroundColor: "rgba(111, 66, 193, 0.15)",
        tension: 0.35,
        pointBackgroundColor: "rgba(111, 66, 193, 1)",
        pointRadius: 4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "📈 สถิติจำนวนหน้าในแต่ละตอนล่าสุด",
        font: { size: 14, weight: "bold" },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className="row g-4">
      {/* กราฟ 1: Top 5 Mangas */}
      <div className="col-lg-6">
        <div className="card shadow-sm border-0 h-100 p-3">
          <div style={{ height: "300px" }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* กราฟ 2: Status Doughnut */}
      <div className="col-lg-6">
        <div className="card shadow-sm border-0 h-100 p-3">
          <div style={{ height: "300px" }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* กราฟ 3: Category Pie (General vs NSFW) */}
      <div className="col-lg-6">
        <div className="card shadow-sm border-0 h-100 p-3">
          <div style={{ height: "300px" }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>

      {/* กราฟ 4: Recent Timeline Line Chart */}
      <div className="col-lg-6">
        <div className="card shadow-sm border-0 h-100 p-3">
          <div style={{ height: "300px" }}>
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

