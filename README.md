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

### Seed database
Using [node-mongo-seeds](https://github.com/toymachiner62/node-mongo-seeds)
(this helper to [generate object id](https://www.random.org/cgi-bin/randbyte?nbytes=12&format=h))
```bash
# install node-mongo-seeds
$ npm install -g node-mongo-seeds
# navigate to app folder
$ cd app
# Every time you run $ seed it will blow away all the data in your collections
$ seed
```
You can add more seed (each seed is a collection) to `app/seed folder`

### Features
- User authentication
- Multilanguage support