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
-API - update the user
-Explore mongoose documentation for models methods 
-What are the option in Model.findoneAndUpdate method , explore more about it
-Api-update the user with emailId


-Explore Schema types options from the documentation
-add a required , unique , uppercase , lowercase , min , minLength ,default,trim
-add default value
-create a custom validation function for gender
-Improve the DB schema -Put all appropriate validation on each field in Schema
-Add timestamp to the user schema 
-Add Api level validation on patch request & singup post api 
-Data sanitiation -Add api validations for each fields
-Install validator 
-Explore use validator function
-Never trust req.body

-Validate data in singup API
-Install bcrypt package
-create a password hash using bcrypt.hash & save user with encrypted password
-create login API
-compare passwords and throw error if emails or password is invalid

-install cookie parser
-just sent a dummy cookie to user
create GET /profile API and check if you get cookie back
-install jsonwebtoken
-//In login API ,after email and password validation create a JWT token and send it to user in cookies
-read the cookies inside your profile API and find your logged in user
-userAuth middleware
-add the userAuth middleware in profile API and new sendConnection Request API
-Set the expiry of jwt token and cookies to 7days