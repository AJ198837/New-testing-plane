# GitHub Analytics Dashboard Demo

## Quick Start Guide

1. **Open the Dashboard**: Open `index.html` in your web browser
2. **Configure Organization**: Enter a GitHub organization name (default: "microsoft")
3. **Optional Token**: Add a GitHub Personal Access Token for higher rate limits
4. **Load Data**: Click "Load Dashboard" to fetch and display charts

## What You'll See

### Pull Requests Chart
- **Type**: Line chart showing daily PR creation
- **Data Source**: GitHub Search API
- **Time Range**: Last 30 days
- **Metrics**: Total PRs and daily average

### Copilot Engagement Chart  
- **Type**: Bar chart comparing suggestions vs acceptances
- **Data Source**: GitHub Copilot API (with sample data fallback)
- **Time Range**: Last 30 days
- **Metrics**: Total actions and acceptance rate

## Sample Organizations to Try
- `microsoft` - Large organization with many repositories
- `google` - Another large tech organization
- `facebook` - Social media company repositories
- `vercel` - Smaller but active organization

## API Rate Limits
- **Without Token**: 10 requests/minute (60/hour)
- **With Token**: 30 requests/minute (5000/hour)

## Error Scenarios Handled
1. **Rate Limit Exceeded**: Clear message with token suggestion
2. **Invalid Organization**: 404 error with helpful message
3. **Network Issues**: Connection error handling
4. **Invalid Token**: Authentication error guidance
5. **Copilot API Unavailable**: Graceful fallback to sample data

## Browser Compatibility
- Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- Responsive design for mobile and tablet

## Features Demonstrated
✅ Real-time GitHub API integration  
✅ Interactive charts with Chart.js  
✅ Responsive design across devices  
✅ Comprehensive error handling  
✅ Configurable organization input  
✅ Optional authentication support  
✅ Loading states and user feedback