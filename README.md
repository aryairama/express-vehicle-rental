<br />
<p align="center">
<div align="center">
  <img height="150" src="https://raw.githubusercontent.com/aryairama/next-vehicle-rental/main/screenshots/logo.png"/>
</div>
  <h3 align="center">Backend Vehicle Rental</h3>
  <p align="center">
    <a href="https://github.com/aryairama/express-vehicle-rental"><strong>Explore the docs »</strong></a>
    <br />
    <a href="https://bit.ly/vehicle_rental">View Demo</a>
    ·
    <a href="https://github.com/aryairama/express-vehicle-rental/issues">Report Bug</a>
    ·
    <a href="https://github.com/aryairama/express-vehicle-rental/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Setup .env example](#setup-env-example)
- [Rest Api](#rest-api)
- [Contributing](#contributing)
- [Related Project](#related-project)
- [Contact](#contact)



<!-- ABOUT THE PROJECT -->
## About The Project

This api is for my Tokoku e-commerce application, one of which is for handling product sales, product purchases, user registration, and others.

### Built With

- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [JSON Web Tokens](https://jwt.io/)
- [Nodemailer]('https://nodemailer.com/about/')
- and other

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

* [nodejs](https://nodejs.org/en/download/)

### Requirements
* [Node.js](https://nodejs.org/en/)
* [Postman](https://www.getpostman.com/) for testing
* [Database](https://drive.google.com/drive/folders/1rqAcpEuxko9p-SaAcFL_ULFMRpp0LPOp?usp=sharing)

### Installation

- Clone This Back End Repo
```
git clone https://github.com/aryairama/express-vehicle-rental.git
```
- Go To Folder Repo
```
cd express-vehicle-rental
```
- Install Module
```
npm install
```
- Make a new database and import [rental.sql](https://drive.google.com/drive/folders/1rqAcpEuxko9p-SaAcFL_ULFMRpp0LPOp?usp=sharing)
- <a href="#setup-env-example">Setup .env</a>
- Starting application
```
npm run serve
```

### Setup .env example

Create .env file in your root project folder.

```env
# Database
DB_HOST = [DB_HOST]
DB_USER = = [DB_USER]
DB_NAME = [DB_NAME]
DB_PASSWORD = [DB_PASSWORD]
DB_PORT = [DB_PORT]
# Aplication
PORT = [PORT_APLICATION]
# Secret key for jwt token
ACCESS_TOKEN_SECRET = [SECRET_KEY_JWT]
REFRESH_TOKEN_SECRET = [SECRET_KEY_JWT]
VERIF_EMAIL_TOKEN_SECRET = [SECRET_KEY_JWT]
# Redis
HOST_REDIS = [REDIS_HOST]
PORT_REDIS = [REDIS_PORT]
AUTH_REDIS = [REDIS_AUTH]
PATH_REDIS = [REDIS_UNIX_SOCKET]
PREFIX_REDIS = [PREFIX-REDIS]
# IP/SOCKET
# Sendmailer SMTP
NODEMAILER_HOST = [SMTP_HOST]
NODEMAILER_PORT = [SMTP_PORT]
NODEMAILER_SECURE = [OPTION_SECURE_SMTP]
NODEMAILER_AUTH_USER = [USER_SMTP]
NODEMAILER_AUTH_PASS = [PASSWORD_SMTP]
# FrontEnd
URL_FRONTEND = [URL_FRONT_END]
# Origin Cookie
CORS_ORIGIN = ['http://localhost:3000','http://localhost:4000']
CREDENTIALS = [TRUE/FALSE]
```

## Rest Api

You can view my Postman collection [here](https://www.postman.com/crimson-meadow-842892/workspace/Vehicle-Rental~cf8567ad-c910-46f9-80ee-58f2ac916966/collection/10655215-316adfc1-1426-45b9-8135-364ec91cf1ea)
</br>
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/10655215-316adfc1-1426-45b9-8135-364ec91cf1ea?action=collection%2Ffork&collection-url=entityId%3D10655215-316adfc1-1426-45b9-8135-364ec91cf1ea%26entityType%3Dcollection%26workspaceId%3Dcf8567ad-c910-46f9-80ee-58f2ac916966)

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## Related Project
:rocket: [`Backend Vehicle Rental`](https://github.com/aryairama/express-vehicle-rental)

:rocket: [`Frontend Vehicle Rental`](https://github.com/aryairama/next-vehicle-rental)

:rocket: [`Demo Vehicle Rental`](https://bit.ly/vehicle_rental)

<!-- CONTACT -->
## Contact

My Email : aryairama987@gmail.com

Project Link: [https://github.com/aryairama/express-vehicle-rental](https://github.com/aryairama/express-vehicle-rental)





