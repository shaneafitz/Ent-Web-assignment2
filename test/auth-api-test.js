"use strict";

const assert = require("chai").assert;
const url = require("./poi-service");
const fixtures = require("./fixtures.json");
const utils = require("../app/api/utils.js");

suite("Authentication API tests", function () {
  let user = fixtures.users;
  let newUser = fixtures.newUser;

  const PoiService = new url(fixtures.poiService);

  setup(async function () {
    await PoiService.deleteAllUsers();
  });

  test("authenticate", async function () {
    const returnedUser = await PoiService.createUser(newUser);
    const response = await PoiService.authenticate(newUser);
    assert(response.success);
    assert.isDefined(response.token);
  });

  test("verify Token", async function () {
    const returnedUser = await PoiService.createUser(newUser);
    const response = await PoiService.authenticate(newUser);

    const userInfo = utils.decodeToken(response.token);
    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.userId, returnedUser._id);
  });

});




