from datetime import date
from turtle import title
import requests
import streamlit as st

api_key="N4B8J3L5AyJqlpHJ2aZ4ke4l5WVXvmxhrBD0q9ir"

# Streamlit app
st.title("Astronomy Picture of the Day")

# Get the astronomy picture of the day
url = f"https://api.nasa.gov/planetary/apod?api_key={api_key}"

try:
    with st.spinner("Fetching data from NASA..."):
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()

    #Extract the image title, url and explanation
    title=data["title"]
    image_url=data["url"]
    explanation=data["explanation"]

    # Download the image
    image_filepath = "image.jpg"
    with st.spinner("Downloading image..."):
        response = requests.get(image_url, timeout=30)
        response.raise_for_status()
        with open(image_filepath, "wb") as f:
            f.write(response.content)

except requests.exceptions.RequestException as e:
    st.error(f"Error fetching data: {e}")
    st.stop()

st.title(title)
st.image(image_filepath)
st.write(explanation)