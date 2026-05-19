import requests

API_key="6eedabfcdf83b9ad4816a9b99bd60d97"

def get_data(place,forecast_days=None,kind=None):
    url=f"https://api.openweathermap.org/data/2.5/forecast?q={place}&appid={API_key}&units=metric"
    response = requests.get(url)
    data=response.json()
    filtered_data=data["list"]
    nr_values=8*forecast_days
    filtered_data=filtered_data[:nr_values]
    return filtered_data

if __name__ == "__main__":
    print(get_data(place="Tokyo", forecast_days=3, kind="temperature"))