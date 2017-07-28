## Node Angular4 CMS
A simple CMS using nodejs and Angular4

### Prerequisites
- **Platform:** node
- **Framework**: express
- **Template Engine**: handlebars
- **CSS Framework**: bootstrap
- **CSS Preprocessor**: sass
- **JavaScript Framework**: 
- **Build Tool**: npm
- **Unit Testing**: mocha
- **Database**: mongodb
- **Authentication**: email,facebook,google,twitter,github,vk
- **Deployment**: heroku

## Before start
```bash
$ mongo
> use nodejs-cms
> db.createUser({user: 'demouser', pwd: '123', roles: [ "readWrite", "dbAdmin" ]})
```

### Start development
```bash
$ npm i -g gulp
$ gulp
```

You can add more seed (each seed is a collection) to `app/seed folder`

### Features
- User authentication
- Multilanguage support