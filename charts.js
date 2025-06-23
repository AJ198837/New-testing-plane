// Chart management and rendering
class ChartManager {
    constructor() {
        this.pullRequestsChart = null;
        this.copilotChart = null;
    }

    createPullRequestsChart(canvasId, data, dateRange) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.pullRequestsChart) {
            this.pullRequestsChart.destroy();
        }

        // Process pull requests data by day
        const dailyData = this.processPullRequestsByDay(data, dateRange);
        
        this.pullRequestsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dailyData.labels,
                datasets: [{
                    label: 'Pull Requests Created',
                    data: dailyData.counts,
                    borderColor: '#0969da',
                    backgroundColor: 'rgba(9, 105, 218, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: '#0969da',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
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
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#0969da',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Number of PRs'
                        },
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });

        return dailyData;
    }

    createCopilotChart(canvasId, data) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.copilotChart) {
            this.copilotChart.destroy();
        }

        const chartData = this.processCopilotData(data);
        
        this.copilotChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: 'Suggestions',
                        data: chartData.suggestions,
                        backgroundColor: 'rgba(123, 104, 238, 0.7)',
                        borderColor: '#7b68ee',
                        borderWidth: 1
                    },
                    {
                        label: 'Acceptances',
                        data: chartData.acceptances,
                        backgroundColor: 'rgba(34, 197, 94, 0.7)',
                        borderColor: '#22c55e',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff'
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Count'
                        },
                        beginAtZero: true
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });

        return chartData;
    }

    processPullRequestsByDay(pullRequests, dateRange) {
        const dailyCounts = {};
        const labels = [];
        
        // Initialize all dates in range with 0
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateKey = d.toISOString().split('T')[0];
            dailyCounts[dateKey] = 0;
            labels.push(this.formatDateForChart(dateKey));
        }
        
        // Count PRs by creation date
        pullRequests.forEach(pr => {
            const createdDate = new Date(pr.created_at).toISOString().split('T')[0];
            if (dailyCounts.hasOwnProperty(createdDate)) {
                dailyCounts[createdDate]++;
            }
        });
        
        const counts = Object.values(dailyCounts);
        
        return {
            labels: labels,
            counts: counts,
            total: pullRequests.length,
            average: Math.round((pullRequests.length / labels.length) * 10) / 10
        };
    }

    processCopilotData(copilotData) {
        if (!copilotData.breakdown || copilotData.breakdown.length === 0) {
            return {
                labels: [],
                suggestions: [],
                acceptances: [],
                totalSuggestions: 0,
                totalAcceptances: 0,
                acceptanceRate: 0
            };
        }

        const labels = copilotData.breakdown.map(day => this.formatDateForChart(day.date));
        const suggestions = copilotData.breakdown.map(day => day.suggestions_count);
        const acceptances = copilotData.breakdown.map(day => day.acceptances_count);
        
        const totalSuggestions = copilotData.total_suggestions || 0;
        const totalAcceptances = copilotData.total_acceptances || 0;
        const acceptanceRate = totalSuggestions > 0 ? Math.round((totalAcceptances / totalSuggestions) * 100) : 0;

        return {
            labels: labels,
            suggestions: suggestions,
            acceptances: acceptances,
            totalSuggestions: totalSuggestions,
            totalAcceptances: totalAcceptances,
            acceptanceRate: acceptanceRate
        };
    }

    formatDateForChart(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }

    updateMetrics(prData, copilotData) {
        // Update PR metrics
        document.getElementById('prTotal').textContent = `Total: ${prData.total}`;
        document.getElementById('prAverage').textContent = `Daily Avg: ${prData.average}`;
        
        // Update Copilot metrics
        document.getElementById('copilotTotal').textContent = `Total Actions: ${copilotData.totalSuggestions}`;
        document.getElementById('copilotAcceptance').textContent = `Acceptance Rate: ${copilotData.acceptanceRate}%`;
    }

    destroy() {
        if (this.pullRequestsChart) {
            this.pullRequestsChart.destroy();
            this.pullRequestsChart = null;
        }
        if (this.copilotChart) {
            this.copilotChart.destroy();
            this.copilotChart = null;
        }
    }
}

// Export for use in other files
window.ChartManager = ChartManager;