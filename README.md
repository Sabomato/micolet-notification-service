# micolet-notification-service

This project is a simple scraper that fetches new pre-defined product urls in micolet.pt and notifies the user via ntfy.sh
It is currently deployed in AWS free tier as a lambda function, but can be easily decoupled from it to be locally deploy ( with Docker, for example)

It is in a initial phase so a lot of aspects could be improved, such as:
- [ ] improve error handling
- [ ] add last checked timestamp on each url to acommodate the limited free resources from aws by increasing the scraping window 
- [ ] add rate limiter to prevent too many notifications to users
- [ ] separate aws logic from the rest 
- [ ] add support for other websites
- [ ] add rest endpoint fo easier insertion of items to scrape 
- [ ] add aws deploy script to compile and package everything  
