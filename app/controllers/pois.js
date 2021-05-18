"use strict";
const Poi = require("../models/poi");
const User = require("../models/user");
const ImageStore = require("../utils/image-store");
const Joi = require("@hapi/joi");

const Pois = {
  home: {
    handler: function (request, h) {
      return h.view("home", { title: "Welcome" });
    },
  },

  report: {
    handler: async function (request, h) {
      const pois = await Poi.find().populate("creator").lean();
      return h.view("report", {
        title: "Islands",
        pois: pois,
      });
    },
  },

  create: {
    handler: async function (request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        const data = request.payload;
        let url;
        if (Object.keys(data.imagefile).length > 0) {
          url = await ImageStore.uploadImage(request.payload.imagefile);
        }
        const newPoi = new Poi({
          name: data.name,
          description: data.description,
          creator: user._id,
          imageUrl: url,
        });
        await newPoi.save();
        return h.redirect("/report");
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },
  deletePoi: {
    handler: async function (request, h) {
      try {
        Poi.findByIdAndRemove(request.params.id, function (err) {
          if (err) {
            console.log("Error: Poi not deleted");
          } else {
            console.log("Success: Poi deleted");
          }
        });
        return h.redirect("/report");
      } catch (e) {
        return h.view("main", { errors: [{ message: e.message }] });
      }
    },
  },
  showPoiSettings: {
    handler: async function (request, h) {
      try {
        const poi = await Poi.findById(request.params.id);
        return h.view("updatepoi", { title: "Update POI", poi: poi });
      } catch (e) {
        return h.view("main", { errors: [{ message: e.message }] });
      }
    },
  },
  updatePoi: {
    validate: {
      payload: {
        name: Joi.string().required(),
        description: Joi.string().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("updatePoi", {
            title: "Update error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const poiEdit = request.payload;
        const poi = await Poi.findById(request.params.id);
        poi.name = poiEdit.name;
        poi.description = poiEdit.description;
        await poi.save();
        return h.redirect("/report");
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    },
  },
};
module.exports = Pois;
