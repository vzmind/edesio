module.exports = function(app, express, mongoose){

  var config = this;

  // Configuration
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', {
      layout: false
    });
    
    //app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));


  return config;

};