// this runs the app locally 
const { getApp } = require('./app')

getApp()
.then(app =>{
    app.listen(3000, () => console.log("running app!"))
})