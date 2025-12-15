# Portfolio Dashboard

A dynamic, real-time portfolio tracking application built with Next.js, TypeScript, Tailwind CSS, and Node.js. This application fetches live stock data from Yahoo Finance and Google Finance to provide comprehensive portfolio insights.

## Features

- **Real-time Market Data**: Fetches Current Market Price (CMP) from Yahoo Finance
- **Financial Metrics**: Retrieves P/E Ratio and Latest Earnings from Google Finance
- **Auto-refresh**: Updates portfolio data every 15 seconds
- **Sector Analysis**: Groups stocks by sector with detailed summaries
- **Visual Indicators**: Color-coded gains (green) and losses (red)
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Performance Optimized**: Implements caching to reduce API calls and improve speed

## Project Structure

```
portfolio-dashboard/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── stocks.ts          # API route handlers
│   │   ├── services/
│   │   │   ├── yahoo.service.ts   # Yahoo Finance scraper
│   │   │   ├── google.service.ts  # Google Finance scraper
│   │   │   └── cache.service.ts   # Caching service
│   │   ├── utils/
│   │   │   └── scraper.ts         # Web scraping utilities
│   │   └── index.ts               # Express server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── app/
│   │   ├── page.tsx               # Main dashboard page
│   │   ├── layout.tsx             # Root layout
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── PortfolioTable.tsx     # Holdings table component
│   │   ├── SectorSummary.tsx      # Sector analysis component
│   │   └── GainLoss.tsx           # Gain/Loss display component
│   ├── hooks/
│   │   └── usePortfolio.ts        # Custom hook for portfolio data
│   ├── types/
│   │   └── stock.ts               # TypeScript type definitions
│   ├── data/
│   │   └── portfolio.json         # Portfolio holdings data
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web application framework
- **TypeScript**: Type-safe backend development
- **Cheerio**: HTML parsing for web scraping
- **Axios**: HTTP client for fetching web pages
- **Node-Cache**: In-memory caching

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd portfolio-dashboard
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
copy .env.example .env

# Build TypeScript
npm run build

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:3001`

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install

# Create .env.local file
copy .env.local.example .env.local

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to `http://localhost:3000`

## Portfolio Data Configuration

Edit `frontend/data/portfolio.json` to add your own stocks:

```json
[
  {
    "id": "1",
    "particulars": "Stock Name",
    "purchasePrice": 1000.00,
    "quantity": 10,
    "sector": "Technology",
    "exchange": "NSE",
    "symbol": "STOCKNAME.NS"
  }
]
```

**Symbol Format:**
- NSE stocks: `SYMBOL.NS` (e.g., `RELIANCE.NS`)
- BSE stocks: `SYMBOL.BO` (e.g., `RELIANCE.BO`)

## API Endpoints

### Backend API

#### Health Check
```
GET /api/health
```

#### Get Single Stock Data
```
GET /api/stock/:symbol
```

#### Batch Fetch Multiple Stocks
```
POST /api/stocks/batch
Body: { "symbols": ["RELIANCE.NS", "INFY.NS"] }
```

## Key Features Explained

### 1. Real-time Data Fetching

The application uses web scraping to fetch data from Yahoo Finance and Google Finance since they don't provide official public APIs. The scraping logic is implemented with fallback mechanisms to handle HTML structure changes.

### 2. Caching Strategy

- **Cache Duration**: 60 seconds (configurable)
- **Purpose**: Reduces API calls and prevents rate limiting
- **Implementation**: In-memory caching using node-cache

### 3. Auto-refresh Mechanism

- **Interval**: 15 seconds (configurable in `frontend/hooks/usePortfolio.ts`)
- **Method**: Uses `setInterval` to periodically fetch updated data
- **User Control**: Manual refresh button available

### 4. Portfolio Calculations

- **Investment**: Purchase Price × Quantity
- **Present Value**: Current Market Price × Quantity
- **Gain/Loss**: Present Value - Investment
- **Gain/Loss %**: (Gain/Loss / Investment) × 100
- **Portfolio %**: (Investment / Total Investment) × 100

### 5. Sector Grouping

Stocks are automatically grouped by sector with aggregated metrics:
- Total Investment per sector
- Total Present Value per sector
- Sector-wise Gain/Loss

## UI Components

### PortfolioTable
Displays all holdings with columns:
- Particulars (Stock Name & Sector)
- Purchase Price
- Quantity
- Investment
- Portfolio %
- Exchange (NSE/BSE)
- CMP (Current Market Price)
- Present Value
- Gain/Loss (with percentage)
- P/E Ratio
- Latest Earnings

### SectorSummary
Shows sector-wise breakdown with:
- Sector name
- Total investment
- Present value
- Gain/Loss
- List of holdings

### GainLoss
Reusable component for displaying profit/loss with:
- Color coding (green for profit, red for loss)
- Currency formatting
- Percentage display

## Important Notes

### API Limitations

1. **Unofficial APIs**: Both Yahoo Finance and Google Finance require web scraping as they don't provide official public APIs.

2. **Rate Limiting**: Excessive requests may result in temporary blocks. The caching mechanism helps mitigate this.

3. **HTML Structure Changes**: Scraping logic may break if the websites change their HTML structure. Mock data is provided as fallback.

4. **Data Accuracy**: Scraped data may have slight delays or inaccuracies compared to official sources.

### Recommendations for Production

1. **Use Official APIs**: Consider paid services like Alpha Vantage, IEX Cloud, or Polygon.io
2. **Implement Rate Limiting**: Add request throttling on the backend
3. **Error Monitoring**: Integrate services like Sentry for error tracking
4. **Database**: Store historical data in a database
5. **Authentication**: Add user authentication for multi-user support
6. **WebSockets**: Implement WebSocket connections for true real-time updates

## Security Considerations

- API keys should be stored in environment variables
- Never expose backend API keys in frontend code
- Implement CORS properly for production
- Add rate limiting to prevent abuse
- Validate and sanitize all user inputs

## Deployment

### Backend Deployment (Heroku/Railway/Render)

```bash
cd backend
npm run build
# Deploy dist folder
```

### Frontend Deployment (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy .next folder
```

Update `NEXT_PUBLIC_API_URL` in frontend `.env.local` to point to your deployed backend URL.

##  Testing the Application

1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Verify that stock data is loading
4. Check browser console for any errors
5. Wait 15 seconds to see auto-refresh in action
6. Click the "Refresh" button to manually update data

##  Troubleshooting

### Backend Issues

**Problem**: Server won't start
```bash
# Check if port 3001 is already in use
netstat -ano | findstr :3001
# Kill the process or change PORT in .env
```

**Problem**: Scraping fails
- Check internet connection
- Verify the websites are accessible
- Review console logs for specific errors
- Mock data will be used as fallback

### Frontend Issues

**Problem**: Can't connect to backend
- Verify backend is running on port 3001
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure CORS is properly configured

**Problem**: Data not updating
- Check browser console for errors
- Verify network requests in DevTools
- Check backend logs for API errors

##  Technical Challenges Addressed

1. **Unofficial API Access**: Implemented robust web scraping with fallback mechanisms
2. **Rate Limiting**: Added caching layer to reduce API calls
3. **Data Transformation**: Clean data processing pipeline from raw HTML to structured JSON
4. **Performance**: Optimized with React hooks, memoization, and efficient re-renders
5. **Error Handling**: Comprehensive error handling at all levels
6. **Responsive Design**: Mobile-first approach with Tailwind CSS
7. **Type Safety**: Full TypeScript implementation for both frontend and backend
