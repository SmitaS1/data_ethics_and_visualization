import csv
import requests
import os

# replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
#CSV_URL = 'https://www.alphavantage.co/query?function=EARNINGS_CALENDAR&horizon=3month&apikey=8X7UWGNWWHENH3JF'
Eearningurl= 'https://www.alphavantage.co/query?function=EARNINGS&symbol=WMK&apikey=24B0JWGHHKVJZPXU'
with requests.Session() as s:
    #download = s.get(CSV_URL)
    download = s.get(Eearningurl)
    decoded_content = download.content.decode('utf-8')
    cr = csv.reader(decoded_content.splitlines(), delimiter=',')
    my_list = list(cr)
    for row in my_list:
        print(row)

# save the output file path
    output_file = os.path.join("D:\OneDrive\Desktop\Work\python\RBCDS\Challenge\Second-half\Project 3\CalendarEarning.csv")

# open the output file, create a header row, and then write the zipped object to the csv
    with open(output_file, "w", newline='') as datafile:
        writer = csv.writer(datafile)

        writer.writerows(my_list)