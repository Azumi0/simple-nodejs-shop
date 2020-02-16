# simple-nodejs-shop
This is just a simple project that displays a list of products and allows the user to add them to the cart and place an order for them.
The order is then send as an e-mail to address specified in the config.

## Technologies used
* TypeScript
* React
* NodeJS
* Express
* SQLite
* Gulp
* Webpack
* Sass
* Cash

Full list in file `package.json`

## Available commands
* Build frontend part of the project with production settings `npm run frontend-build`
* Build frontend part of the project with development settings `npm run frontend-build-dev`
* Build frontend part of the project and keep watching for changes `npm run frontend-dev`
* Run ESLint, a static code analysis on whole project `npm run check-lint`
* Run ESLint, and try to fix reported error on whole project `npm run check-lint:fix`
* Start backend web server `npm run backend-start`
* Start backend web server with debug messages `npm run backend-start-dev`
* Start backend web server and keep watching for changes `npm run backend-dev`

## Own settings
If you want to modify application settings (any you probably should), create a file `backend/app-config.local.json` containing only the settings that you wish to modify.

## Adding products
To add a product you need to prepare a photo for it in resolution `1280 x 720`, put it in directory `frontend/src/images/products/` and add a record to SQLite database. You can do so by executing command
```typescript
await sequelize.models.Product.create({
    name: 'ProductName',
    description: 'ProductDescription',
    photo: 'photo.png',
    price: 32.5,
});
``` 