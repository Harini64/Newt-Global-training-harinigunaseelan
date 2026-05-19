import streamlit as st
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import plotly.express as px
import plotly.graph_objects as go
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import re
from collections import defaultdict
import warnings
warnings.filterwarnings('ignore')

st.set_page_config(
    page_title="Mood Across Days - Sentiment Analyzer",
    layout="wide",
    initial_sidebar_state="collapsed"
)

st.title("Mood Across Days - Sentiment Analyzer")
st.markdown("Track and analyze your mood patterns over time using sentiment analysis")

# Download NLTK data (only once)
try:
    nltk.data.find('sentiment/vader_lexicon.zip')
except LookupError:
    nltk.download('vader_lexicon')

# Initialize NLTK VADER
sia = SentimentIntensityAnalyzer()

# Initialize session state
if 'mood_data' not in st.session_state:
    st.session_state.mood_data = []
if 'current_date' not in st.session_state:
    st.session_state.current_date = datetime.now().date()

def analyze_sentiment(text):
    """Analyze sentiment of given text using NLTK VADER"""
    if not text.strip():
        return 0.0, "Neutral"
    
    # Get sentiment scores
    scores = sia.polarity_scores(text)
    compound_score = scores['compound']
    
    # Determine sentiment based on compound score
    if compound_score >= 0.05:
        sentiment = "Positive"
    elif compound_score <= -0.05:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"
    
    # Debug: show the scores (you can comment this out later)
    st.write(f"Debug - Compound score: {compound_score:.3f}, Sentiment: {sentiment}")
    
    return compound_score, sentiment

def get_sentiment_emoji(sentiment):
    """Get emoji for sentiment"""
    emoji_map = {
        "Positive": "😊",
        "Negative": "😔",
        "Neutral": "😐"
    }
    return emoji_map.get(sentiment, "😐")

def get_sentiment_color(sentiment):
    """Get color for sentiment"""
    color_map = {
        "Positive": "#4CAF50",
        "Negative": "#F44336",
        "Neutral": "#FFC107"
    }
    return color_map.get(sentiment, "#FFC107")

# Mood Entry Section
st.header("Enter your mood or thoughts")

col1, col2 = st.columns([1, 3])

with col1:
    # Date selector
    selected_date = st.date_input(
        "Select Date",
        value=st.session_state.current_date,
        max_value=datetime.now().date()
    )

with col2:
    # Text input for mood entry
    mood_text = st.text_area(
        "How are you feeling today?",
        placeholder="Describe your mood, what happened, how you feel...",
        height=100
    )

# Add entry button
col1, col2, col3 = st.columns([1, 2, 1])
with col2:
    if st.button("Add Mood Entry", type="primary", use_container_width=True):
        if mood_text.strip():
            polarity, sentiment = analyze_sentiment(mood_text)
            
            new_entry = {
                'date': selected_date,
                'text': mood_text,
                'polarity': polarity,
                'sentiment': sentiment,
                'timestamp': datetime.now()
            }
            
            st.session_state.mood_data.append(new_entry)
            st.session_state.current_date = selected_date
            
            st.success(f"Mood entry added! {get_sentiment_emoji(sentiment)} {sentiment}")
            st.rerun()
        else:
            st.error("Please enter some text about your mood")

st.divider()

# Main content area
if st.session_state.mood_data:
    # Convert to DataFrame for easier manipulation
    df = pd.DataFrame(st.session_state.mood_data)
    df['date'] = pd.to_datetime(df['date']).dt.date
    
    # Statistics Dashboard
    st.header("Mood Statistics")
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Entries", len(df))
    with col2:
        st.metric("Average Sentiment", f"{df['polarity'].mean():.2f}")
    with col3:
        most_common_sentiment = df['sentiment'].mode().iloc[0]
        st.metric("Most Common", f"{get_sentiment_emoji(most_common_sentiment)} {most_common_sentiment}")
    with col4:
        st.metric("Date Range", f"{(df['date'].max() - df['date'].min()).days} days")
    
    st.divider()
    
    # Recent Entries and Charts Row
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.subheader("Recent Mood Entries")
        recent_entries = df.sort_values('date', ascending=False).head(5)
        
        for _, entry in recent_entries.iterrows():
            with st.container():
                col_a, col_b, col_c = st.columns([1, 4, 1])
                with col_a:
                    st.write(f"**{entry['date']}**")
                with col_b:
                    st.write(f"{entry['text'][:80]}{'...' if len(entry['text']) > 80 else ''}")
                with col_c:
                    sentiment_emoji = get_sentiment_emoji(entry['sentiment'])
                    st.markdown(f"<div style='text-align: center; font-size: 20px;'>{sentiment_emoji}</div>", unsafe_allow_html=True)
                st.divider()
    
    with col2:
        st.subheader("Sentiment Distribution")
        sentiment_counts = df['sentiment'].value_counts()
        
        fig_pie = px.pie(
            values=sentiment_counts.values,
            names=sentiment_counts.index,
            title="Overall Sentiment Distribution",
            color_discrete_map={
                "Positive": "#4CAF50",
                "Negative": "#F44336",
                "Neutral": "#FFC107"
            }
        )
        st.plotly_chart(fig_pie, use_container_width=True)
    
    st.divider()
    
    # Trends Section
    st.subheader("Mood Trends Over Time")
    
    # Prepare data for time series
    daily_sentiment = df.groupby('date').agg({
        'polarity': 'mean',
        'sentiment': lambda x: x.mode().iloc[0] if len(x.mode()) > 0 else 'Neutral'
    }).reset_index()
    
    # Sentiment over time line chart
    fig_trend = px.line(
        daily_sentiment,
        x='date',
        y='polarity',
        title='Average Sentiment Over Time',
        labels={'polarity': 'Sentiment Score', 'date': 'Date'},
        range_y=[-1, 1]
    )
    
    # Add reference line at 0
    fig_trend.add_hline(y=0, line_dash="dash", line_color="gray")
    fig_trend.update_layout(showlegend=False, height=300)
    
    st.plotly_chart(fig_trend, use_container_width=True)
    
    # Day of week analysis
    if len(daily_sentiment) > 1:
        col1, col2 = st.columns([2, 1])
        
        with col1:
            # Sentiment progression with rolling average
            st.subheader("Sentiment Progression")
            
            # Calculate rolling average
            df_sorted = df.sort_values('date')
            df_sorted['rolling_sentiment'] = df_sorted['polarity'].rolling(window=min(7, len(df_sorted)), min_periods=1).mean()
            
            fig_progression = go.Figure()
            
            # Add individual entries
            fig_progression.add_trace(go.Scatter(
                x=df_sorted['date'],
                y=df_sorted['polarity'],
                mode='markers',
                name='Daily Sentiment',
                marker=dict(
                    color=[get_sentiment_color(s) for s in df_sorted['sentiment']],
                    size=6
                ),
                text=df_sorted['text'],
                hovertemplate='<b>%{x}</b><br>Sentiment: %{y:.2f}<br>%{text}<extra></extra>'
            ))
            
            # Add rolling average
            fig_progression.add_trace(go.Scatter(
                x=df_sorted['date'],
                y=df_sorted['rolling_sentiment'],
                mode='lines',
                name='7-Day Rolling Average',
                line=dict(color='blue', width=2)
            ))
            
            fig_progression.add_hline(y=0, line_dash="dash", line_color="gray")
            fig_progression.update_layout(
                title='Sentiment Progression with Rolling Average',
                xaxis_title='Date',
                yaxis_title='Sentiment Score',
                yaxis=dict(range=[-1, 1]),
                height=300
            )
            
            st.plotly_chart(fig_progression, use_container_width=True)
        
        with col2:
            # Day of week sentiment
            st.subheader("Sentiment by Day")
            daily_sentiment['day_of_week'] = pd.to_datetime(daily_sentiment['date']).dt.day_name()
            
            day_sentiment = daily_sentiment.groupby('day_of_week')['polarity'].mean().reindex([
                'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
            ])
            
            fig_days = px.bar(
                x=day_sentiment.index,
                y=day_sentiment.values,
                title='Avg Sentiment by Day',
                labels={'x': 'Day', 'y': 'Score'},
                color=day_sentiment.values,
                color_continuous_scale=['#F44336', '#FFC107', '#4CAF50'],
                height=300
            )
            fig_days.update_layout(showlegend=False)
            st.plotly_chart(fig_days, use_container_width=True)
    
    st.divider()
    
    # Best and Worst Days
    st.subheader("Best and Worst Days")
    
    if len(df) > 0:
        col1, col2 = st.columns(2)
        
        with col1:
            st.write("**🌟 Best Days**")
            best_days = df.nlargest(3, 'polarity')[['date', 'text', 'polarity']]
            if len(best_days) > 0:
                for _, day in best_days.iterrows():
                    st.write(f"**{day['date']}** (Score: {day['polarity']:.2f})")
                    st.write(f"{day['text'][:100]}{'...' if len(day['text']) > 100 else ''}")
                    st.write("")
            else:
                st.write("No data available")
        
        with col2:
            st.write("**💔 Worst Days**")
            worst_days = df.nsmallest(3, 'polarity')[['date', 'text', 'polarity']]
            if len(worst_days) > 0:
                for _, day in worst_days.iterrows():
                    st.write(f"**{day['date']}** (Score: {day['polarity']:.2f})")
                    st.write(f"{day['text'][:100]}{'...' if len(day['text']) > 100 else ''}")
                    st.write("")
            else:
                st.write("No data available")
    else:
        st.write("No mood entries available yet")
    
    st.divider()
    
    # History Section
    st.subheader("Full Mood History")
    
    # Filter options
    col1, col2 = st.columns(2)
    with col1:
        sentiment_filter = st.multiselect(
            "Filter by Sentiment",
            options=['Positive', 'Negative', 'Neutral'],
            default=['Positive', 'Negative', 'Neutral'],
            key="sentiment_filter"
        )
    
    with col2:
        date_range = st.date_input(
            "Filter by Date Range",
            value=[df['date'].min(), df['date'].max()],
            min_value=df['date'].min(),
            max_value=df['date'].max(),
            key="date_range"
        )
    
    # Apply filters
    filtered_df = df[
        (df['sentiment'].isin(sentiment_filter)) &
        (df['date'] >= date_range[0]) &
        (df['date'] <= date_range[1])
    ].sort_values('date', ascending=False)
    
    # Display entries in a more compact format
    for i, (_, entry) in enumerate(filtered_df.iterrows()):
        if i < 10:  # Show first 10 entries by default
            with st.expander(f"{entry['date']} - {get_sentiment_emoji(entry['sentiment'])} {entry['sentiment']} (Score: {entry['polarity']:.2f})"):
                st.write(entry['text'])
                
                # Word count and character count
                col1, col2 = st.columns(2)
                with col1:
                    st.metric("Words", len(entry['text'].split()))
                with col2:
                    st.metric("Characters", len(entry['text']))
        else:
            break
    
    if len(filtered_df) > 10:
        st.info(f"Showing 10 of {len(filtered_df)} entries. Use filters to narrow down results.")
    
    # Clear data button
    if st.button("Clear All Data", type="secondary", use_container_width=True):
        st.session_state.mood_data = []
        st.rerun()

else:
    # Sample prompts
    st.subheader("What to write about?")
    sample_prompts = [
        "How did you sleep last night?",
        "What's on your mind today?",
        "How was work/school?",
        "What made you happy/sad today?",
        "What are you grateful for?",
        "Any challenges you're facing?"
    ]
    
    for prompt in sample_prompts:
        st.write(f"• {prompt}")

# Footer
st.markdown("---")
