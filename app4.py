import csv
import requests
import os

# Replace 'demo' with your actual Alpha Vantage API key
API_KEY = 'YOUR_API_KEY'
CSV_URL = f'https://www.alphavantage.co/query?function=EARNINGS_CALENDAR&horizon=3month&apikey=8X7UWGNWWHENH3JF'

# Perform the request and handle potential errors
try:
    with requests.Session() as s:
        response = s.get(CSV_URL)
        response.raise_for_status()  # Raise an exception for HTTP errors
        decoded_content = response.content.decode('utf-8')
except requests.RequestException as e:
    print(f"Error occurred during request: {e}")
    exit(1)  # Exit the script with a non-zero status code to indicate failure

# Parse the CSV content
cr = csv.reader(decoded_content.splitlines(), delimiter=',')
my_list = list(cr)

# Save the output file
output_file = "output.csv"  # Save in the same directory as the script
with open(output_file, "w", newline='') as datafile:
    writer = csv.writer(datafile)
    writer.writerows(my_list)

print(f"Output saved to {output_file}")