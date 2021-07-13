# Dashboard for Incident Management

- Node server for incident management system.
- Mondo DB for database
- Layered, loosely coupled Architecture - (TypeDi for Dependency Injection)
- Multi-Document CRUD operations using MongoDB Transactions

##### readme URL - UI :

https://websure.github.io/incident-management-ui/

##### Application URL :

https://github.com/websure/express-server-incident-management
readme : https://websure.github.io/incident-management-api/

##### API Documentation :

https://github.com/websure/express-server-incident-management/tree/master/api_docs

##### Postman collection:

https://github.com/websure/express-server-incident-management/tree/master/postman-collection

#### Pre-Requisite

- MongoDB Transactions works on clustures. For development purpose only :- dependency on 'run-rs' is required.
- For windows users, Please update hostname to 'computer name' for mongod url in .env file.
- For details : https://www.npmjs.com/package/run-rs
- docker

#### Folder structure :

```

src /
    index.ts : Entry file
    server.ts : Configure Express server,routes and start the application
    config/ : Define your Environments variables, app congigurations settings here
    routes/ : Define application level routes here
    loaders/ : All dependency services , server configurations, middlewares are defined here like -
        DB setup, Logging Service
    middlewares/ : Define Application level middlewares here
    models/ : Define all object schemas here
    common/ : Deine constants and some common functions
    utils/ : Util functions come here
    db /
        modelSchemas/ : Define Mongoose schemas here
        DataAccessService : Wrapper service to manage DB sessions for CRUD operations
    module/ : All features / services are defined here
        /user
            domain/ : Define DAO and VO objects
            controller/ : Controllers for API endpoints. Handle request and response objects
            service/ : Each service performs a specific operation. Business logic goes here
            repositories/ : Service to access DB and perform CRUD operations.
                Have access to DB documents and returns response VO objects
            routes/ : Define feature level endpoints here
            validation/ : Define API request object validations schemas like (JOI, express-validation)
            middleware/ : Define middleware specific to feature level endpoints / API

tests/ : All tests come here
```

#### Control Flow

<img src="https://github.com/websure/express-server-incident-management/blob/master/assets/control-flow.png"  height="auto" alt="control flow"/>

#### Features

- Express Node server for incident management system - Runs on localhost:5000
- MongoDB for DB and Mongoose as ODM
- MongoDB transactions for Multi-documents CRUD

#### Stack

    Docker
    Express server
    typedi - Dependi injection
    Mongo dB
    Mongoose ODM
    JOI
    supertest
    React
    React-testing library

#### Bootstrapping Application

- clone the project : https://github.com/websure/express-server-incident-management.git
- Execute `docker-compose up` in terminal
- UI Application will run on http://localhost:3000/
- API Server will run on http://localhost:5000/

#### Docker Images

- UI - websure/incident-ui
- API - websure/incident-api

#### TODO

- Add unit tests for classes
- Implement interfaces for classes
- In production, Please use MongoDB Atlas
