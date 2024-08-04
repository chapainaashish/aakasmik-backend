# Aakasmik Backend

Aakasmik aims to centralize all the emergency contacts of Nepal in one place to make them accessible and open to the public. This is an open-source project and is open to any kind of contribution from people like you.


This github repository contains of backend express application of aakasmik. 
You can visit this application live on: https://aakasmik-backend.vercel.app/

Technologies used;
* NodeJS 
* ExpressJS
* Typescript
* Npm

To set up and run this application with locally, follow these steps:

1. **Ensure Node.js is Installed**:
   Make sure Node.js is installed on your machine. Check the version with:
   ```bash
   node -v
   ```
   If Node.js is not installed, download and install it from [nodejs.org](https://nodejs.org/).

2. **Clone the Repository**:
   Clone the project repository from github:
   ```bash
   git clone https://github.com/chapainaashish/aakasmik-backend.git
   cd aakasmik-backend
   ```

3. **Install Dependencies**:
   Install the project dependencies with npm:
   ```bash
   npm install
   ```


4. **Update the .env file**
    * Get the google captcha key and update the .env file. You can get the captcha key from: https://developers.google.com/recaptcha

    * Get the JSONBIN_API_KEY and bin id. You can get this from:  https://jsonbin.io/api-reference. After that update the .env file accordingly. 


4. **Run the Application in Development Mode**:
   Start the development server:
   ```bash
   npm run dev
   ```
   This will run the application and automatically restart the server on changes.


Finally, you can do the contributions, commit and push the changes and open a pull request. 