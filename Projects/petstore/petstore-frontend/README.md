## Pet Store Project

- Technology Stack:
    - PostgresSQL
    - Language: Java(Spring Boot)
    - Maven
    - ReactJS

- Tools Used:
    - Git
    - N-tier Architecture(model, controller service, repository)
    - Postman


- Packages Used
    - React Router DOM
    - Axios
    - Material UI
    - Styled Components

#### Model Layer:

- Model/Entity Layer describes the structure of the database
- Every table in the database represents an entity class within my class


#### Repository Layer

- Repository Layer is the one able to access information in order to generate the SQL Queries


#### Service Layer

- This acts as the business logic of the application


#### Controller Layer

- This one does all the communication it sends messages to the Service layer 
- Then the service layer receives it and takes the necessary steps to execute the logic that my applciation needs


#### run frontend

```node
npm run preview
```


### Entity Folder

- All tables in the database should match the annotation if table name is "dog"
- undert the entity annotation it should be dog
- Entity1: booking
- Entity1: booking
