* First install packages present in package.json by writting npm i in terminal
* create env file based on .env.example and write your credentials over there
* if you have docker installed in your system then write 
  - this command docker compose up -d mongodb on this project folder it will create a container
  - then check the container with docker ps if its not running get container_name from docker ps -a
  - then run the container docker start container_name or container_id
* then on terminal write this command npm run dev its start development server.
  - if you didnot saw any error then the server started and db connection done succesfully 

* open postman import this Book Review.postman_collection.json 
 - Test all apis over there

* ER daigram and Book Review postman file is in resources folder