# micolet-notification-service

This project is a simple service that crawls predefined paths in micolet.pt and notifies the user when new products arrive via ntfy.sh.

It is currently deployed on AWS free tier as a lambda function with the data layer on AWS dynamo, but it can be easily decoupled to be locally deploy (with Docker, for example).

It is in a initial phase so a lot of aspects could be improved, such as:
- [x] Improve error handling
- [ ] Add rest endpoint fo easier insertion/deletion of items to crawl 
- [ ] Separate aws logic from the rest 
- [ ] Move configuration variables to configuration file
- [ ] Optimize crawling algorithm 
- [ ] Add support for other websites
- [ ] Add aws deploy script to compile and package everything in a zip file
- [ ] Add last checked timestamp on each url to acommodate the limited free resources from aws by increasing the scraping window 
- [ ] Add rate limiter to prevent too many notifications to users
