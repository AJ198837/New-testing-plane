// Main application logic
class GitHubDashboard {
    constructor() {
        this.api = null;
        this.chartManager = new ChartManager();
        this.isLoading = false;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('loadData').addEventListener('click', () => this.loadDashboard());
        
        // Allow loading on Enter key press in input fields
        document.getElementById('organization').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.loadDashboard();
        });
        
        document.getElementById('token').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.loadDashboard();
        });
    }

    async loadDashboard() {
        if (this.isLoading) return;
        
        const organization = document.getElementById('organization').value.trim();
        const token = document.getElementById('token').value.trim();
        
        if (!organization) {
            this.showError('Please enter an organization name.');
            return;
        }

        this.isLoading = true;
        this.showLoading();
        this.hideError();
        
        try {
            // Initialize API with token if provided
            this.api = new GitHubAPI(token || null);
            
            // Get date range for last 30 days
            const dateRange = this.api.getDateRange();
            
            // Load data concurrently
            const [pullRequestsData, copilotData] = await Promise.all([
                this.api.getPullRequests(organization, dateRange.start, dateRange.end),
                this.api.getCopilotUsage(organization, dateRange.start, dateRange.end)
            ]);
            
            // Create charts
            const prChartData = this.chartManager.createPullRequestsChart(
                'pullRequestsChart', 
                pullRequestsData, 
                dateRange
            );
            
            const copilotChartData = this.chartManager.createCopilotChart(
                'copilotChart', 
                copilotData
            );
            
            // Update metrics
            this.chartManager.updateMetrics(prChartData, copilotChartData);
            
            // Update last updated timestamp
            document.getElementById('lastUpdated').textContent = new Date().toLocaleString();
            
            // Show dashboard
            this.showDashboard();
            
        } catch (error) {
            console.error('Error loading dashboard:', error);
            this.showError(error.message);
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    showLoading() {
        document.getElementById('loading').style.display = 'flex';
        document.getElementById('loadData').disabled = true;
        document.getElementById('loadData').textContent = 'Loading...';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('loadData').disabled = false;
        document.getElementById('loadData').textContent = 'Load Dashboard';
    }

    showDashboard() {
        document.getElementById('dashboard').style.display = 'block';
        document.querySelector('.chart-container').style.display = 'grid';
    }

    showError(message) {
        document.getElementById('error').style.display = 'block';
        document.getElementById('errorMessage').textContent = message;
        document.querySelector('.chart-container').style.display = 'none';
    }

    hideError() {
        document.getElementById('error').style.display = 'none';
    }
}

// Global retry function for error handling
function retryLoad() {
    if (window.dashboard) {
        window.dashboard.loadDashboard();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new GitHubDashboard();
});

// Handle window resize for chart responsiveness
window.addEventListener('resize', () => {
    if (window.dashboard && window.dashboard.chartManager) {
        if (window.dashboard.chartManager.pullRequestsChart) {
            window.dashboard.chartManager.pullRequestsChart.resize();
        }
        if (window.dashboard.chartManager.copilotChart) {
            window.dashboard.chartManager.copilotChart.resize();
        }
    }
});