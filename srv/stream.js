var redis = require('redis').createClient();
var crypto = require('crypto');
/*
   Utility function taking two objects. Adds
   src's members to the dest object, overwriting
   any conflicts.  Maybe put in utility module?
*/
function mixin(dest, src){
  for(key in src){
    dest[key]=src[key];
  }
}
/*
   Utility function for currying arguments
*/
function curry(func) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function(){
    return func.apply(this, args.concat(Array.prototype.slice.call(arguments)));
  }
}
/*
   Logs user in and gets id for accessing user specific data
   in main database.
   Database 0: Main Database
   Database 1: Password storing database
   Database 2: ID storing database
*/
exports.createUser = function(){
  return {
    id : null,
       /*
          Verifies username and password.
          Upon success gets user's unique ID and
          mixes in user 'Actions' setting up user
          for gameplay
       */
    login: function(username, password, callback){
      var user = this;
      redis.select(1);
      redis.get(username, function(err, reply){
          if(reply==password){
            redis.select(2);
            redis.get(username, function(err, reply){
              if(reply!=null){
                user.id=reply;
                console.log(user);
                mixin(user, Actions);
              }
              redis.select(0);
              callback(err, user)
            });
          }
          else{
            redis.select(0);
            callback(err, user);
          }
          redis.select(0);
      });
      redis.select(0);
      return this;
    }
  };
}

Actions = {
  right: curry(redis.incr,this.id+":x"),
  left: curry(redis.decr, this.id+":x"),
  up: curry(redis.incr,this.id+":y"),
  down: curry(redis.decr, this.id+":y")
}
