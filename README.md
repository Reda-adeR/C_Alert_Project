# C_Alert_Project


 - Clone the Repo : git clone https://github.com/Reda-adeR/C_Alert_Project.git folder_name

 - cd folder_name

 - cd cropalert_frontend ; npm install ; npm start

 - cd cropalert_backend ; python3 -m venv venv ; source venv/bin/activate

 - pip install -r requirements.txt

 - daphne cropalert.asgi:application 







# Details of project plannification and day by day tasks


## - Day 1
Backend Tasks :
- Backend init using Django and Django Rest Framework
- Setup of SimpleJwt for Authentication
- 3 Endpoints created, register/, login/, refresh/


Frontend Tasks :
- Frontend init using react and Tailwind 3
- Pages -> Login / Register Routed
- Linked the Frontend <-With-> Backend

Register and Login finished
Conditional rendering - Role based Rendering

## - Day 2
Backend Tasks : 
- Create Model Alert
- CRUD API
- Feed Get

Frontend Tasks : 
- Create Alert Form (With map selection)
- Feed Listing + Filtre

Model alert + API GET/POST working
Alert Form created (manual entry of longitude latitude)

## - Day 3

Frontend and Backend Tasks :
- Fixed the MapBox issue
- Interactive Map fetching data - Showing the alerts on map and details on click
- Feed Component - Fetching data from a filtered API view 

- Init The real time notification :
    | setting-up django channels |
    | creation of consumers.py   |
    | creating a notification model + linking with alert model |
    | the real time init setup is done |

## - day 4

Frontend and Backend Tasks :
- Notifications are sent from backend once a new alert is created
- can click on an alert on feed to see it in the interactive map


## - Last Day 

- fixation des erreurs
- Finalisation et deploiment
- creation de video demo : https://www.youtube.com/watch?v=lrF0lUgG48w
- test en real time

