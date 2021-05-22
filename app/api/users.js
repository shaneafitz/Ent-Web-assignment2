'use strict';
const Boom = require('@hapi/boom');
const User = require('../models/user');

const Users = {
  find: {
    auth: false,
    handler: async function (request, h) {
      const users = await User.find();
      return users;
    },
  },

  findOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const users = await User.findOne({ _id: request.params.id });
        if (!users) {
          return Boom.notFound("No User with this id");
        }
        return users;
      } catch (err) {
        return Boom.notFound("No user with this id");
      }
    },
  },

  create: {
    auth: false,
    handler: async function (request, h) {
      const data = request.payload;
      const newUser = new User({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      const  user = await newUser.save();
      if (user) {
        console.log(user);
        return h.response(user).code(201);
      }
      return Boom.badImplementation("error creating user");
    },
  },

  deleteAll: {
    auth: false,
    handler: async function(request, h){
      await User.remove({});
      return {success: true};
    },
  },

  deleteOne: {
    auth: false,
    handler: async function(request, h) {
      const response = await User.deleteOne({ _id: request.params.id });
      if (response.deletedCount == 1) {
        return { success: true };
      }
      return Boom.notFound('id not found');
    },
  },

};

module.exports = Users;