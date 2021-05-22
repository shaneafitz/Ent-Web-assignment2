"use strict";

const assert = require("chai").assert;
const axios = require("axios");
const fixtures = require("./fixtures.json");
const _ = require('lodash');
const PoiService = require("./poi-service");

suite("Poi API tests", function () {
  let poi = fixtures.poi;
  let newPoi = fixtures.newPoi;

  const poiService = new PoiService(fixtures.poiService);
  let newUser = fixtures.newUser;


  suiteSetup(async function () {
    await poiService.deleteAllUsers();
    const returnedUser = await poiService.createUser(newUser);
    const response = await poiService.authenticate(newUser);
  });

  suiteTeardown(async function () {
    await poiService.deleteAllUsers();
    poiService.clearAuth();
  })

  setup(async function () {
    await poiService.deleteAllPois();
  });

  teardown(async function () {
    await poiService.deleteAllPois();
  });

  test("Create a POI", async function () {
    const returnedPoi = await poiService.createPoi(newPoi);
    assert(_.some([returnedPoi], newPoi), "returnedPoi must be a superset of newPoi");
    assert.isDefined(returnedPoi._id);
  });

  test("Get Poi", async function () {
    const c1 = await poiService.createPoi(newPoi);
    const c2 = await poiService.getPoi(c1._id);
    assert.deepEqual(c1, c2);
  });

  test("Get invalid Poi", async function () {
    const c1 = await poiService.getPoi("1234");
    assert.isNull(c1);
    const c2 = await poiService.getPoi("012345678901234567890123");
    assert.isNull(c2);
  });

  test("Delete a Poi", async function () {
    let c = await poiService.createPoi(newPoi);
    assert(c._id != null);
    await poiService.deleteOnePoi(c._id);
    c = await poiService.getPoi(c._id);
    assert(c == null);
  });

  test("get all pois", async function () {
    for (let c of poi) {
      await poiService.createPoi(c);
    }

    const allPois = await poiService.getPois();
    assert.equal(allPois.length, poi.length);
  });
});



  // test("get Poi", async function () {
  //   const response = await axios.get("http://localhost:3000/api/poi");
  //   const pois = response.data;
  //   assert.equal(4, pois.length)
  //   assert.equal(pois[0].name, "Clare Island");
  //   assert.equal(pois[0].description, "Off the coast of mayo");
  //
  //   assert.equal(pois[1].name, "Skellig Islands");
  //   assert.equal(pois[1].description, "Off the coast of Kerry");
  // });
  // test("get one poi", async function () {
  //   let response = await axios.get("http://localhost:3000/api/poi");
  //   const pois = response.data;
  //   assert.equal(4, pois.length);
  //
  //   const onePoiUrl = "http://localhost:3000/api/poi/" + pois[0]._id;
  //   response = await axios.get(onePoiUrl);
  //   const onePoi = response.data;
  //
  //   assert.equal(onePoi.name, "Clare Island");
  //   assert.equal(onePoi.description, "Off the coast of mayo");
  // });
  // test("create a poi", async function () {
  //   const poiUrl = "http://localhost:3000/api/poi";
  //   const newPoi = {
  //     name: "ABCDE",
  //     description: "String",
  //   };
  //
  //   const response = await axios.post(poiUrl, newPoi);
  //   const returnedPoi = response.data;
  //   assert.equal(201, response.status);
  //
  //   assert.equal(returnedPoi.name, "ABCDE");
  //   assert.equal(returnedPoi.description, "String");
  // });
