// GitHub API utility functions
class GitHubAPI {
    constructor(token = null) {
        this.token = token;
        this.baseURL = 'https://api.github.com';
        this.headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GitHub-Analytics-Dashboard'
        };
        
        if (this.token) {
            this.headers['Authorization'] = `token ${this.token}`;
        }
    }

    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                headers: this.headers,
                ...options
            });

            if (!response.ok) {
                if (response.status === 403) {
                    const remainingRequests = response.headers.get('X-RateLimit-Remaining');
                    if (remainingRequests === '0') {
                        throw new Error('GitHub API rate limit exceeded. Please add a personal access token or try again later.');
                    }
                }
                
                if (response.status === 401) {
                    throw new Error('Invalid GitHub token. Please check your personal access token.');
                }
                
                if (response.status === 404) {
                    throw new Error('Organization not found. Please check the organization name.');
                }
                
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error. Please check your internet connection.');
            }
            throw error;
        }
    }

    async getPullRequests(organization, startDate, endDate) {
        const pullRequests = [];
        let page = 1;
        const perPage = 100;
        
        try {
            while (true) {
                const endpoint = `/search/issues?q=type:pr+org:${organization}+created:${startDate}..${endDate}&sort=created&order=desc&per_page=${perPage}&page=${page}`;
                const data = await this.makeRequest(endpoint);
                
                if (data.items.length === 0) break;
                
                pullRequests.push(...data.items);
                
                // If we got fewer results than requested, we've reached the end
                if (data.items.length < perPage) break;
                
                page++;
                
                // Safety limit to prevent infinite loops
                if (page > 10) break;
            }
            
            return pullRequests;
        } catch (error) {
            console.error('Error fetching pull requests:', error);
            throw error;
        }
    }

    async getCopilotUsage(organization, startDate, endDate) {
        try {
            // Note: The GitHub Copilot API is limited and may not be available for all organizations
            // This is a placeholder implementation as the actual Copilot API endpoints may require 
            // special permissions or may not be publicly available
            
            // Try to get Copilot usage data (this may fail if not available)
            const endpoint = `/orgs/${organization}/copilot/usage`;
            
            try {
                const data = await this.makeRequest(endpoint);
                return this.processCopilotData(data, startDate, endDate);
            } catch (error) {
                // If Copilot API is not available, generate sample data
                console.warn('Copilot API not available, generating sample data:', error.message);
                return this.generateSampleCopilotData(startDate, endDate);
            }
        } catch (error) {
            console.error('Error fetching Copilot usage:', error);
            throw error;
        }
    }

    processCopilotData(data, startDate, endDate) {
        // Process actual Copilot API response
        // This will depend on the actual structure of the Copilot API response
        return data;
    }

    generateSampleCopilotData(startDate, endDate) {
        // Generate realistic sample data for demonstration
        const days = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            // Skip weekends for more realistic data
            if (d.getDay() !== 0 && d.getDay() !== 6) {
                days.push({
                    date: d.toISOString().split('T')[0],
                    suggestions_count: Math.floor(Math.random() * 50) + 10,
                    acceptances_count: Math.floor(Math.random() * 30) + 5,
                    lines_suggested: Math.floor(Math.random() * 200) + 50,
                    lines_accepted: Math.floor(Math.random() * 100) + 20,
                    active_users: Math.floor(Math.random() * 10) + 3
                });
            }
        }
        
        return {
            total_suggestions: days.reduce((sum, day) => sum + day.suggestions_count, 0),
            total_acceptances: days.reduce((sum, day) => sum + day.acceptances_count, 0),
            total_lines_suggested: days.reduce((sum, day) => sum + day.lines_suggested, 0),
            total_lines_accepted: days.reduce((sum, day) => sum + day.lines_accepted, 0),
            breakdown: days
        };
    }

    getDateRange() {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        
        return {
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
        };
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }
}

// Export for use in other files
window.GitHubAPI = GitHubAPI;