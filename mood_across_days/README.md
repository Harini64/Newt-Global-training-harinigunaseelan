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
- **Positive sentiment** (compound score ≥ 0.05)
- **Negative sentiment** (compound score ≤ -0.05)
- **Neutral sentiment** (-0.05 < compound score < 0.05)


## Data Storage

All data is stored in the browser's session state. If you refresh the page, your data will be lost. For persistent storage, consider integrating with a database in future versions.

## Dependencies

- Streamlit: Web app framework
- Pandas: Data manipulation
- Plotly: Interactive visualizations
- TextBlob: Sentiment analysis
- NumPy: Numerical operations


