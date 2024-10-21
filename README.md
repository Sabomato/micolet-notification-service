# micolet-notification-service

This project is a simple crawler that fetches new pre-defined product urls in micolet.pt and notifies the user via ntfy.sh.

It is currently deployed on AWS free tier as a lambda function, but can be easily decoupled from it to be locally deploy (with Docker, for example).

It is in a initial phase so a lot of aspects could be improved, such as:
- [ ] Improve error handling
- [ ] Add last checked timestamp on each url to acommodate the limited free resources from aws by increasing the scraping window 
- [ ] Add rate limiter to prevent too many notifications to users
- [ ] Separate aws logic from the rest 
- [ ] Add support for other websites
- [ ] Add rest endpoint fo easier insertion of items to crawl 
- [ ] Add aws deploy script to compile and package everything in a zip file
- [ ] Optimize crawling algorithm 
