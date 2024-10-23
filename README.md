# Micolet Notification Service

This project is a simple service that scrapes predefined paths in [micolet.pt](https://www.micolet.pt/) and notifies the user, via [ntfy.sh](https://ntfy.sh/), when new pre-defined products arrive.
## Deploy

It is currently deployed on AWS free tier as a Lambda function with the data layer on AWS Dynamo, but it can be easily decoupled to be locally deployed (with Docker, for example).

## Features
It is in a initial stage so a lot of aspects could be improved, such as:
- [x] Notify user's phone about a specific set of products previously defined
- [x] Store user's data (name and products to notify) in the database 
- [x] Improve error handling
- [ ] Add rest endpoint fo easier insertion/deletion of items to scrape 
- [ ] Separate aws logic from the rest 
- [ ] Move configuration variables to configuration file
- [ ] Optimize scraping algorithm 
- [ ] Add support for other websites
- [ ] Improve deployment process (add aws deploy script to compile and package everything in a zip file)
- [ ] Add last checked timestamp on each path, to prevent only the first paths to be scraped due to aws lambda function timeout
- [ ] Add rate limiter to prevent too many notifications per user
