# GitHub Analytics Dashboard

A responsive web application that displays Copilot Engagement and Pull Request analytics for GitHub organizations over the last 30 days.

## Features

- **Pull Requests Chart**: Daily pull request creation statistics
- **Copilot Engagement Chart**: Daily Copilot suggestions and acceptance rates
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Error Handling**: Comprehensive error handling for API failures and rate limits
- **Configurable**: Support for different organizations and optional GitHub tokens

## Getting Started

### Prerequisites

- A modern web browser
- Internet connection for GitHub API access
- (Optional) GitHub Personal Access Token for higher API rate limits

### Usage

1. Open `index.html` in your web browser
2. Enter a GitHub organization name (e.g., "microsoft", "google", "facebook")
3. (Optional) Enter a GitHub Personal Access Token for higher rate limits
4. Click "Load Dashboard" to fetch and display the data

### GitHub API Requirements

#### Pull Requests Data
- **Endpoint**: GitHub Search API (`/search/issues`)
- **Authentication**: Optional (higher rate limits with token)
- **Rate Limits**: 
  - Without token: 10 requests/minute
  - With token: 30 requests/minute

#### Copilot Usage Data
- **Endpoint**: GitHub Copilot API (`/orgs/{org}/copilot/usage`)
- **Authentication**: Required (GitHub Personal Access Token)
- **Permissions**: Organization admin access may be required
- **Fallback**: Sample data generated when API is not available

### File Structure

```
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── api.js              # GitHub API interaction logic
├── charts.js           # Chart creation and data processing
├── app.js              # Main application logic and event handling
└── README.md           # Documentation
```

## API Endpoints Used

### Pull Requests
```
GET /search/issues?q=type:pr+org:{organization}+created:{start_date}..{end_date}
```

### Copilot Usage (with fallback)
```
GET /orgs/{organization}/copilot/usage
```

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Charts**: Chart.js
- **APIs**: GitHub REST API
- **Design**: Responsive CSS Grid and Flexbox

## Error Handling

The application handles various error scenarios:

- **Rate Limit Exceeded**: Clear message with suggestion to add token
- **Invalid Token**: Authentication error handling
- **Organization Not Found**: 404 error handling
- **Network Issues**: Connection error handling
- **API Unavailable**: Fallback to sample data for Copilot metrics

## Responsive Design

The dashboard is fully responsive and adapts to different screen sizes:

- **Desktop**: Two-column chart layout
- **Tablet**: Single-column layout with adjusted spacing
- **Mobile**: Optimized for touch interactions and small screens

## GitHub Token Setup

To get higher API rate limits:

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token with appropriate permissions
3. For public repositories: No specific scopes needed
4. For Copilot data: Organization permissions may be required

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Limitations

- GitHub Copilot API access is limited and may require special permissions
- Sample data is used for Copilot metrics when the API is not available
- API rate limits apply (especially without authentication tokens)

## Future Enhancements

- User authentication with OAuth
- Data caching and persistence
- Export functionality for charts
- Additional metrics and visualizations
- Real-time data updates