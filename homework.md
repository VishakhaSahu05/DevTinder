-Create a repository
-intialise the repository
-node_modules , package.json , package-lock.json
-install express
-Create a Server
-Listen to port 7777
-Write request handlers for /test , /hello
-Install nodemon and update scripts  inside package.json
-what are dependencies
-What is the use of "-g" while npm install
-Diffrence between ceret and Tidle


-intialize git-
-.gitignore
-create a remote repo on git
-Push all code to remote origin
-Play with routers and route extensions ex ./hello , ./hello/2 , /xyz
-Order of routers matter a lot
-Install postman app and make a workspace/collection > test API call
-Write logic to handel GET , POST , PATCH , DELETE API calls and test them on postman 
-explore routing ad use of ?, + , () , * in the routes
-use of regex in route /a/ , /.*fly$/
-reading the query params in route
-reading the dynamic routes


-Handling multiple route handlers - Play with the code
-next()
-next function errors along with res.send()
-What is middleware? Why do we need it?
-How is expressjs basically handels request behind the scenes
-app.use vs app.all
-write a dummy auth for admin 
-write a dummy auth for all userAuth except/user/login
-Error handling using app.use("/" , (err , req , res)=>{})


-Create a free cluster at mongoDb official website (Mongo Atlas)
-install mangoose library
-Connect you application to the dataBase "connection-url"/devTinder
-call the connectDB function connect the database before starting your application at port 5000

-create a userSchema & userModel
-create signup API to add data to database
-push some documents using API calls from postman
-error handling using try and catch


-Js object vs JSON obj (diffrence)
-Add the express.json middleware to your app
-Make your signup API dynamic to recive data from the end user
-user.findOne() with duplicate emailIds , which object is returned
-API - Feed API  -GET /feed-get all the users from the database
-GET user by ID 
-Create a delete user API
-Difference between PATCH and PUT