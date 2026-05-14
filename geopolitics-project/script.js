// --- 1. D3.js Network Setup ---
const nodes = [
    { id: "権力 (Authority)", group: "A", color: "#58a6ff", info: "アメリカ：国際秩序の支配と外交的圧力。" },
    { id: "力 (Force)", group: "B", color: "#f85149", info: "イラン：ホルムズ海峡封鎖という物理的阻止力。" },
    { id: "資源 (Resources)", group: "C", color: "#d299ff", info: "石油：エネルギー安全保障の中核となる戦略資源。" }
];

const links = [
    { source: "権力 (Authority)", target: "資源 (Resources)" },
    { source: "力 (Force)", target: "資源 (Resources)" },
    { source: "権力 (Authority)", target: "力 (Force)" }
];

const svg = d3.select("#viz-canvas");
const width = document.getElementById('canvas-wrapper').clientWidth;
const height = 450;

const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(180))
    .force("charge", d3.forceManyBody().strength(-800))
    .force("center", d3.forceCenter(width / 2, height / 2));

const link = svg.append("g")
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("stroke", "#484f58")
    .attr("stroke-width", 2);

const node = svg.append("g")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("r", 45)
    .attr("fill", d => d.color)
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .style("cursor", "pointer")
    .call(d3.drag()
        .on("start", (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on("end", (e, d) => { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; }))
    .on("mouseover", (e, d) => { document.getElementById('node-info').innerText = d.info; })
    .on("mouseout", () => { document.getElementById('node-info').innerText = "ノードをドラッグ、またはホバーして詳細を確認"; });

const label = svg.append("g")
    .selectAll("text")
    .data(nodes)
    .enter().append("text")
    .attr("class", "node-label")
    .text(d => d.id.split(' ')[0]); // 最初の単語だけ表示

simulation.on("tick", () => {
    link.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
    node.attr("cx", d => d.x).attr("cy", d => d.y);
    label.attr("x", d => d.x).attr("y", d => d.y + 5);
});

// --- 2. Chart.js & Simulation Logic ---
const ctx = document.getElementById('impactChart').getContext('2d');
let impactChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['原油価格 ($)', 'リスク (%)', 'ガソリン指数'],
        datasets: [{
            data: [80, 10, 100],
            backgroundColor: ['#58a6ff', '#f85149', '#3fb950'],
            borderRadius: 5
        }]
    },
    options: {
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true, grid: { color: '#30363d' }, ticks: { color: '#8b949e' } } }
    }
});

const slider = document.getElementById('risk-slider');
slider.addEventListener('input', (e) => {
    const risk = parseInt(e.target.value);
    document.getElementById('risk-display').innerText = risk;
    
    // 計算ロジック
    const basePrice = 80;
    const projectedPrice = (basePrice + (risk * 1.2)).toFixed(2);
    const gasIndex = 100 + (risk * 0.7);

    document.getElementById('oil-price').innerText = `$${projectedPrice}`;
    
    // グラフ更新
    impactChart.data.datasets[0].data = [projectedPrice, risk, gasIndex];
    impactChart.update();
});
