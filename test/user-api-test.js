"use strict";

const assert = require("chai").assert;
//const axios = require("axios");
const fixtures = require("./fixtures.json");
const _ = require('lodash');
const PoiService = require("./poi-service");

suite("User API tests", function () {
  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const poiService = new PoiService(fixtures.poiService);

  setup(async function () {
    await poiService.deleteAllUsers();
  });

  teardown(async function () {
    await poiService.deleteAllUsers();
  });

  test("Create a User", async function () {
    const returnedUser = await poiService.createUser(newUser);
    assert(_.some([returnedUser], newUser), "returned user must be a superset of newUser");
    assert.isDefined(returnedUser._id);
  });

  test("Get User", async function () {
    const c1 = await poiService.createUser(newUser);
    const c2 = await poiService.getUser(c1._id);
    assert.deepEqual(c1, c2);
  });

  test("Get invalid User", async function () {
    const c1 = await poiService.getUser("1234");
    assert.isNull(c1);
    const c2 = await poiService.getUser("012345678901234567890123");
    assert.isNull(c2);
  });

  test("Delete a User", async function () {
    let c = await poiService.createUser(newUser);
    assert(c._id != null);
    await poiService.deleteOneUser(c._id);
    c = await poiService.getUser(c._id);
    assert(c == null);
  });

  test("Get all users", async function () {
    for (let c of users) {
      await poiService.createUser(c);
    }

    const allUsers = await poiService.getUsers();
    assert.equal(allUsers.length, users.length);
  });

  test("Get users detail", async function () {
    for (let c of users) {
      await poiService.createUser(c);
    }

    const allUsers = await poiService.getUsers();
    for (var i = 0; i < users.length; i++) {
      assert(_.some([allUsers[i]], users[i]), "returnedUser must be a superset of newUser");
    }
  });

  test("Get all users empty", async function () {
    const allUsers = await poiService.getUsers();
    assert.equal(allUsers.length, 0);
  });
});


