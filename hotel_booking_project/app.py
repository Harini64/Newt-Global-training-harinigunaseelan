import uuid
from datetime import datetime

import pandas as pd
import streamlit as st

HOTELS_FILE = "C:\\Users\\harin\\Desktop\\Newt Global\\hotel_booking_project\\hotels.csv"
BOOKINGS_FILE = "C:\\Users\\harin\\Desktop\\Newt Global\\hotel_booking_project\\bookings.csv"


# ---------------- OOP CLASSES ----------------
class Hotel:
    def __init__(self, hotel_id, name, city, capacity, available):
        self.id = int(hotel_id)
        self.name = name
        self.city = city
        self.capacity = int(capacity)
        self.available = str(available).lower().strip()

    def is_available(self):
        return self.available == "yes"

    def book(self):
        self.available = "no"

    def cancel(self):
        self.available = "yes"

    def price(self):
        return 3000 + self.capacity * 900 if self.capacity >= 5 else 1500 + self.capacity * 500

    def room_type(self):
        return "Premium" if self.capacity >= 5 else "Standard"


class Customer:
    def __init__(self, name, phone, email=""):
        self.name = name.strip()
        self.phone = phone.strip()
        self.email = email.strip()


class BookingSystem:
    def __init__(self):
        self.hotels_df = pd.read_csv(HOTELS_FILE)
        self.bookings_df = self.load_bookings()

    def load_bookings(self):
        try:
            return pd.read_csv(BOOKINGS_FILE)
        except FileNotFoundError:
            return pd.DataFrame(columns=[
                "booking_id", "customer_name", "phone", "email", "hotel_id", "hotel_name",
                "city", "capacity", "amount", "status", "booking_time", "cancelled_time"
            ])

    def save_hotels(self):
        self.hotels_df.to_csv(HOTELS_FILE, index=False)

    def save_bookings(self):
        self.bookings_df.to_csv(BOOKINGS_FILE, index=False)

    def get_hotels(self, city="", only_available=False):
        df = self.hotels_df.copy()
        if city:
            df = df[df["city"].str.contains(city, case=False, na=False)]
        if only_available:
            df = df[df["available"].str.lower() == "yes"]
        return df

    def get_available_hotels(self):
        return self.hotels_df[self.hotels_df["available"].str.lower() == "yes"]

    def book_hotel(self, hotel_id, customer):
        if not customer.name or not customer.phone:
            return False, "Enter customer name and phone number."

        index_list = self.hotels_df.index[self.hotels_df["id"] == int(hotel_id)].tolist()
        if not index_list:
            return False, "Hotel not found."

        index = index_list[0]
        hotel = Hotel(*self.hotels_df.loc[index, ["id", "name", "city", "capacity", "available"]])

        if not hotel.is_available():
            return False, "This hotel is already booked."

        hotel.book()
        self.hotels_df.loc[index, "available"] = "no"
        self.save_hotels()

        booking_id = "BK-" + uuid.uuid4().hex[:6].upper()
        new_booking = {
            "booking_id": booking_id,
            "customer_name": customer.name,
            "phone": customer.phone,
            "email": customer.email,
            "hotel_id": hotel.id,
            "hotel_name": hotel.name,
            "city": hotel.city,
            "capacity": hotel.capacity,
            "amount": hotel.price(),
            "status": "active",
            "booking_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "cancelled_time": ""
        }
        self.bookings_df = pd.concat([self.bookings_df, pd.DataFrame([new_booking])], ignore_index=True)
        self.save_bookings()
        return True, f"Booking successful! Your booking ID is {booking_id}."

    def cancel_booking(self, booking_id, phone=""):
        booking_id = booking_id.strip().upper()
        matches = self.bookings_df.index[self.bookings_df["booking_id"].astype(str).str.upper() == booking_id].tolist()

        if not matches:
            return False, "Booking ID not found."

        booking_index = matches[0]
        if str(self.bookings_df.loc[booking_index, "status"]).lower() == "cancelled":
            return False, "This booking is already cancelled."

        if phone.strip():
            saved_phone = str(self.bookings_df.loc[booking_index, "phone"]).strip()
            if saved_phone != phone.strip():
                return False, "Phone number does not match."

        hotel_id = int(self.bookings_df.loc[booking_index, "hotel_id"])
        hotel_matches = self.hotels_df.index[self.hotels_df["id"] == hotel_id].tolist()
        if hotel_matches:
            self.hotels_df.loc[hotel_matches[0], "available"] = "yes"
            self.save_hotels()

        self.bookings_df.loc[booking_index, "status"] = "cancelled"
        self.bookings_df.loc[booking_index, "cancelled_time"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.save_bookings()
        return True, "Booking cancelled. Hotel is available again."

    def active_bookings(self):
        if self.bookings_df.empty:
            return self.bookings_df
        return self.bookings_df[self.bookings_df["status"].fillna("active").str.lower() == "active"]


# ---------------- STREAMLIT UI ----------------
st.set_page_config(page_title="Hotel Booking System", layout="wide")
st.title("Simple Hotel Booking System")
st.caption("One-page Streamlit app using Python OOP + CSV")

system = BookingSystem()

if "message" in st.session_state:
    msg_type, msg = st.session_state.pop("message")
    if msg_type == "success":
        st.success(msg)
    else:
        st.error(msg)

available_count = len(system.get_available_hotels())
active_count = len(system.active_bookings())

c1, c2, c3 = st.columns(3)
c1.metric("Total Hotels", len(system.hotels_df))
c2.metric("Available Hotels", available_count)
c3.metric("Active Bookings", active_count)

st.divider()

left, right = st.columns([2, 1])

with left:
    st.header("Hotels")
    f1, f2 = st.columns([2, 1])
    city = f1.text_input("Search city", placeholder="Chennai, Mumbai, Bangalore...")
    only_available = f2.checkbox("Only available", value=False)

    hotels = system.get_hotels(city, only_available)
    if hotels.empty:
        st.warning("No hotels found.")
    else:
        display_df = hotels.copy()
        display_df["price"] = display_df["capacity"].apply(lambda x: 3000 + int(x) * 900 if int(x) >= 5 else 1500 + int(x) * 500)
        display_df["room_type"] = display_df["capacity"].apply(lambda x: "Premium" if int(x) >= 5 else "Standard")
        st.dataframe(display_df, use_container_width=True, hide_index=True)

with right:
    st.header("Book Hotel")
    available_hotels = system.get_available_hotels()
    if available_hotels.empty:
        st.info("No hotels available now.")
    else:
        options = {
            f"{row['id']} - {row['name']} ({row['city']})": row["id"]
            for _, row in available_hotels.iterrows()
        }
        selected_hotel = st.selectbox("Choose hotel", list(options.keys()))
        name = st.text_input("Customer name")
        phone = st.text_input("Phone number")
        email = st.text_input("Email optional")

        if st.button("Confirm Booking", type="primary", use_container_width=True):
            customer = Customer(name, phone, email)
            success, message = system.book_hotel(options[selected_hotel], customer)
            st.session_state["message"] = ("success" if success else "error", message)
            st.rerun()

    st.divider()
    st.header("Cancel Booking")
    active = system.active_bookings()
    if active.empty:
        st.info("No active bookings.")
    else:
        booking_options = {
            f"{row['booking_id']} - {row['customer_name']} - {row['hotel_name']}": row["booking_id"]
            for _, row in active.iterrows()
        }
        selected_booking = st.selectbox("Choose booking", list(booking_options.keys()))
        cancel_phone = st.text_input("Phone number optional", key="cancel_phone")
        if st.button("Cancel Booking", use_container_width=True):
            success, message = system.cancel_booking(booking_options[selected_booking], cancel_phone)
            st.session_state["message"] = ("success" if success else "error", message)
            st.rerun()

st.divider()
st.header("Booking History")
if system.bookings_df.empty:
    st.info("No bookings yet.")
else:
    st.dataframe(system.bookings_df, use_container_width=True, hide_index=True)
