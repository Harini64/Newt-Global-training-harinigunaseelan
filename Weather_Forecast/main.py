import streamlit as st
import plotly.express as px
from backend import get_data

# Add title, text input, slider, selectbox and subheader
st.title("Weather Forecast")
place=st.text_input("Enter the place:")
days=st.slider("Forecast Days",min_value=1,max_value=5, help="Select the number of days to forecast")
option=st.selectbox("Select data to view",("Temperature","Sky"))
st.subheader(f"{option} for the next {days} days in {place}")

if place:
    # Get the temperature/sky data
    try:
        filtered_data = get_data(place, days)
        if option == "Temperature":
            temperatures=[dict["main"]["temp"] for dict in filtered_data]
            date=[dict["dt_txt"] for dict in filtered_data]
            # create a temperature plot
            figure=px.line(x=date,y=temperatures,labels={"x":"Date","y":"Temperature (C)"})
            st.plotly_chart(figure)
        
        if option == "Sky": 
            emojis={
                "Clear": "☀️", 
                "Clouds": "☁️", 
                "Rain": "🌧️", 
                "Snow": "❄️",
                "Thunderstorm": "⛈️",
                "Drizzle": "🌦️",
                "Mist": "🌫️",
                "Fog": "🌫️",
                "Haze": "🌫️",
                "Atmosphere": "🌫️"
            }
            
            # Extract sky conditions and descriptions
            sky_conditions=[dict["weather"][0]["main"] for dict in filtered_data]
            descriptions=[dict["weather"][0]["description"] for dict in filtered_data]
            date_times=[dict["dt_txt"] for dict in filtered_data]
            
            # Create proper layout for sky conditions
            st.markdown("###Weather Conditions Timeline")
            
            # Display weather conditions in a clean card-based layout
            cols = st.columns(min(4, len(sky_conditions)))
            for i, (condition, description, datetime) in enumerate(zip(sky_conditions, descriptions, date_times)):
                if i < 12:  # Limit to 12 conditions for better display
                    with cols[i % len(cols)]:
                        # Weather card styling
                        st.markdown("""
                        <div style="
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            padding: 20px;
                            border-radius: 15px;
                            margin: 10px 0;
                            text-align: center;
                            color: white;
                            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                            transition: transform 0.3s ease;
                        ">
                        """, unsafe_allow_html=True)
                        
                        # Weather emoji
                        emoji = emojis.get(condition, "🌤️")
                        st.markdown(f"<h2 style='font-size: 60px; text-align: center; margin: 20px 0;'>{emoji}</h2>", unsafe_allow_html=True)
                        
                        # Time and description with better styling
                        time_str = datetime.split(' ')[1][:5]  # Get HH:MM format
                        date_str = datetime.split(' ')[0]  # Get date
                        
                        st.markdown(f"""
                        <div style="margin-top: 15px;">
                            <h4 style="margin: 5px 0; font-size: 18px; font-weight: bold;">{time_str}</h4>
                            <p style="margin: 5px 0; font-size: 14px; opacity: 0.9;">{description.title()}</p>
                            <p style="margin: 5px 0; font-size: 12px; opacity: 0.7; font-style: italic;">{date_str}</p>
                        </div>
                        </div>
                        """, unsafe_allow_html=True)
            
            # Weather condition summary with better UI
            st.markdown("###Weather Summary")
            condition_counts = {}
            for condition in sky_conditions:
                condition_counts[condition] = condition_counts.get(condition, 0) + 1
            
            # Show condition statistics in styled cards with emojis
            summary_cols = st.columns(min(4, len(condition_counts)))
            for i, (condition, count) in enumerate(condition_counts.items()):
                if i < 4:  # Limit to 4 conditions for display
                    with summary_cols[i]:
                        emoji = emojis.get(condition, "🌤️")
                        st.markdown(f"""
                        <div style="
                            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                            padding: 15px;
                            border-radius: 10px;
                            text-align: center;
                            color: white;
                            margin: 5px;
                            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        ">
                            <div style="font-size: 30px; margin-bottom: 10px;">{emoji}</div>
                            <h3 style="margin: 0 0 10px 0; font-size: 16px;">{condition}</h3>
                            <p style="margin: 0; font-size: 24px; font-weight: bold;">{count}</p>
                            <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">times</p>
                        </div>
                        """, unsafe_allow_html=True)
    except KeyError:
        st.write("Please enter a valid place")



