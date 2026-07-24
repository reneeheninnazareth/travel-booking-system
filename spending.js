// Spending Over Time
const spendCtx = document.getElementById('spendingChart').getContext('2d');

new Chart(spendCtx, {
  type: 'line',
  data: {
    labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Amount Spent (₹)',
      data: [1200, 1800, 900, 2400, 1600, 8450],
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245,158,11,0.15)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#f59e0b'
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  }
});

// Reward Points Growth
const rewardsCtx = document.getElementById('rewardsChart').getContext('2d');

new Chart(rewardsCtx, {
  type: 'line',
  data: {
    labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Reward Points',
      data: [40, 85, 110, 150, 190, 240],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,0.15)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#10b981'
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  }
});