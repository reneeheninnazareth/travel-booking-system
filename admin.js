const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");

menuButton.addEventListener("click", () => {
    sidebar.classList.toggle("active");
});
const chartCanvas = document.getElementById("bookingChart");

new Chart(chartCanvas, {

    type: "bar",

    data: {

        labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun"
        ],

        datasets: [{

            label: "Bookings",

            data: [
                45,
                62,
                78,
                91,
                84,
                110
            ],

            backgroundColor: [
                "#f59e0b",
                "#3b82f6",
                "#10b981",
                "#8b5cf6",
                "#ef4444",
                "#06b6d4"
            ],

            borderRadius: 8,
            borderSkipped: false

        }]

    },

    options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {
                display: false
            },

            tooltip: {
                enabled: true
            }

        },

        scales: {

            y: {

                beginAtZero: true,

                ticks: {
                    stepSize: 20
                },

                grid: {
                    color: "#e5e7eb"
                }

            },

            x: {

                grid: {
                    display: false
                }

            }

        }

    }

});