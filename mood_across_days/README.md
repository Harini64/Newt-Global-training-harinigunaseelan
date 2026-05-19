# Mood Across Days - Sentiment Analyzer

A Streamlit web application for tracking and analyzing your mood patterns over time using NLTK sentiment analysis.

## Features

- **Daily Mood Tracking**: Add daily mood entries with text descriptions
- **Sentiment Analysis**: Automatic sentiment analysis using NLTK VADER
- **Visual Analytics**: Interactive charts and graphs showing mood trends
- **Historical View**: Browse and filter your mood history
- **Trend Analysis**: Identify patterns in your mood over time
- **Day-of-Week Analysis**: See how your mood varies by day
- **Best/Worst Days**: Identify your emotional highs and lows

## Installation

1. Navigate to the mood_across_days directory:
```bash
cd "mood_across_days"
```

2. Install the required dependencies:
```bash
pip install -r requirements.txt
```

## Usage

1. Run the Streamlit app:
```bash
streamlit run app.py
```

2. Open your browser and go to the URL provided (usually `http://localhost:8501`)

3. Use the sidebar to add daily mood entries:
   - Select the date
   - Write about how you're feeling
   - Click "Add Mood Entry"

4. Explore different tabs:
   - **Overview**: Recent entries and sentiment distribution
   - **Trends**: Mood patterns over time
   - **History**: Browse and filter your mood entries
   - **Analysis**: Detailed statistics and insights

## How It Works

The app uses NLTK's VADER (Valence Aware Dictionary and sEntiment Reasoner) for sentiment analysis:
- **Positive sentiment** (compound score ≥ 0.05): 😊
- **Negative sentiment** (compound score ≤ -0.05): 😔  
- **Neutral sentiment** (-0.05 < compound score < 0.05): 😐

VADER is specifically tuned for social media text and provides more nuanced sentiment analysis. The compound score ranges from -1 (most negative) to +1 (most positive).

## Data Storage

All data is stored in the browser's session state. If you refresh the page, your data will be lost. For persistent storage, consider integrating with a database in future versions.

## Dependencies

- Streamlit: Web app framework
- Pandas: Data manipulation
- Plotly: Interactive visualizations
- TextBlob: Sentiment analysis
- NumPy: Numerical operations

## Future Enhancements

- Persistent data storage (SQLite/PostgreSQL)
- Export functionality (CSV, PDF reports)
- Mood prediction using machine learning
- Integration with calendar apps
- Mobile-responsive design improvements
- Multiple mood tracking categories
- Goal setting and progress tracking
