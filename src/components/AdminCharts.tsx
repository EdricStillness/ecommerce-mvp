"use client";

import React from "react";

type RevenuePoint = { date: string; revenue: number };
type StatusPoint = { status: string; count: number };
type TopProductPoint = { name: string; qty: number };

export function AdminCharts({
  revenueByDay,
  ordersByStatus,
  topProducts,
}: {
  revenueByDay: RevenuePoint[];
  ordersByStatus: StatusPoint[];
  topProducts: TopProductPoint[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card title="Revenue (last 14 days)" className="lg:col-span-2">
        {revenueByDay.length ? (
          <LineChart data={revenueByDay} height={220} />
        ) : (
          <Empty text="No revenue yet" />
        )}
      </Card>
      <Card title="Orders by status">
        {ordersByStatus.length ? (
          <BarChart
            data={ordersByStatus.map((d) => ({ label: d.status, value: d.count }))}
            height={220}
          />
        ) : (
          <Empty text="No orders yet" />
        )}
      </Card>
      <Card title="Top products (by quantity)" className="lg:col-span-3">
        {topProducts.length ? (
          <BarChart
            data={topProducts.map((d) => ({ label: d.name, value: d.qty }))}
            height={260}
          />
        ) : (
          <Empty text="No sales yet" />
        )}
      </Card>
    </div>
  );
}

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`border rounded p-4 ${className}`}>
      <div className="mb-3 text-sm text-gray-600">{title}</div>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="text-sm text-gray-500">{text}</div>;
}

function LineChart({ data, height = 200 }: { data: { date: string; revenue: number }[]; height?: number }) {
  const padding = { top: 10, right: 12, bottom: 24, left: 36 };
  const width = 700; // container will scale via viewBox
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const maxY = Math.max(1, Math.max(...data.map((d) => d.revenue)));
  const x = (i: number) => (i / Math.max(1, data.length - 1)) * innerW;
  const y = (v: number) => innerH - (v / maxY) * innerH;
  const path = data
    .map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(d.revenue).toFixed(2)}`)
    .join(" ");

  const ticksY = 4;
  const yTicks = Array.from({ length: ticksY + 1 }, (_, i) => Math.round((i * maxY) / ticksY));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Revenue line chart" className="w-full h-auto">
      <g transform={`translate(${padding.left},${padding.top})`}>
        {/* Y grid */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line
              x1={0}
              x2={innerW}
              y1={y(t)}
              y2={y(t)}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
            <text x={-8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={10} fill="#6b7280">
              ${t}
            </text>
          </g>
        ))}

        {/* X labels */}
        {data.map((d, i) => (
          <text key={i} x={x(i)} y={innerH + 16} textAnchor="middle" fontSize={10} fill="#6b7280">
            {shortDate(d.date)}
          </text>
        ))}

        {/* Line */}
        <path d={path} fill="none" stroke="#111827" strokeWidth={2} />

        {/* Points */}
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d.revenue)} r={3} fill="#111827" />
        ))}
      </g>
    </svg>
  );
}

function BarChart({ data, height = 220 }: { data: { label: string; value: number }[]; height?: number }) {
  const padding = { top: 10, right: 10, bottom: 30, left: 40 };
  const width = 700;
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const maxV = Math.max(1, Math.max(...data.map((d) => d.value)));
  const barW = innerW / Math.max(1, data.length);

  const y = (v: number) => innerH - (v / maxV) * innerH;
  const ticksY = 4;
  const yTicks = Array.from({ length: ticksY + 1 }, (_, i) => Math.round((i * maxV) / ticksY));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Bar chart" className="w-full h-auto">
      <g transform={`translate(${padding.left},${padding.top})`}>
        {/* Y grid */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={0} x2={innerW} y1={y(t)} y2={y(t)} stroke="#e5e7eb" strokeWidth={1} />
            <text x={-8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={10} fill="#6b7280">
              {t}
            </text>
          </g>
        ))}

        {/* Bars */}
        {data.map((d, i) => (
          <g key={i}>
            <rect
              x={i * barW + barW * 0.15}
              y={y(d.value)}
              width={barW * 0.7}
              height={innerH - y(d.value)}
              fill="#111827"
              rx={4}
            />
            <text
              x={i * barW + barW / 2}
              y={innerH + 16}
              textAnchor="middle"
              fontSize={10}
              fill="#6b7280"
            >
              {truncate(d.label, 16)}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function shortDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
