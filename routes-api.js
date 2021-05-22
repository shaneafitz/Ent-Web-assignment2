const Poi = require('./app/api/poi');
const Users = require("./app/api/users");

module.exports = [
  { method: 'GET', path: '/api/poi', config: Poi.find },
  { method: 'GET', path: '/api/poi/{id}', config: Poi.findOne },
  { method: "POST", path: "/api/poi", config: Poi.create },
  { method: "DELETE", path: "/api/poi/{id}", config: Poi.deleteOne },
  { method: "DELETE", path: "/api/poi", config: Poi.deleteAll },

  { method: "GET", path: "/api/users", config: Users.find },
  { method: "GET", path: "/api/users/{id}", config: Users.findOne },
  { method: "POST", path: "/api/users", config: Users.create },
  { method: "DELETE", path: "/api/users/{id}", config: Users.deleteOne },
  { method: "DELETE", path: "/api/users", config: Users.deleteAll },
];