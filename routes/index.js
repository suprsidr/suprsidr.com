var express = require("express"),
  router = express.Router(),
  ItemProvider = require("../itemprovider-mongodb").ItemProvider,
  itemProvider = new ItemProvider(),
  uuid = require("uuid"),
  path = require("path");

itemProvider.open(function() {});

/* GET manifest. */
router.get("/manifest.json", function(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.sendFile(path.resolve(__dirname, "../manifest.json"));
});

/**
 *  Route params we are expecting
 *  q - query
 *  l - limit
 *  s - sort
 *  f - fields to return
 */
router.param("q", function(req, res, next, q) {
  req.params.q = handleRegex(checkParam(q));
  //console.log(req.params.q)
  next();
});

router.param("l", function(req, res, next, l) {
  req.params.l = parseInt(l) ? parseInt(l) : 0;
  //console.log(req.params.l)
  next();
});

router.param("s", function(req, res, next, s) {
  req.params.s = checkParam(s);
  //console.log(req.params.s)
  next();
});

router.param("f", function(req, res, next, f) {
  req.params.f = checkParam(f);
  //console.log(req.params.f)
  next();
});

/**
 * endpoint for delete student
 * @param {object} query of student to delete
 * {"sid": "8f7325f8-7b23-428b-bbed-d1650b216249"}
 */
router.post("/students/delete/:q", function(req, res) {
  if (req.params.q === "") {
    res.jsonp({ error: "Bad or missing param: query" });
    return res.end();
  }
  itemProvider.deleteItem(
    {
      collection: "students",
      query: req.params.q
    },
    function(err, result) {
      if (err) {
        console.log(err);
        res.jsonp({ error: "Not Found" });
        res.end();
      } else {
        res.jsonp({ result: result });
        res.end();
      }
    }
  );
});

/**
 * endpoint for insert student
 * @param {object}
 */
router.post(/^\/students\/insert\/(.+)/, function(req, res) {
  console.log(req.params);
  if (req.params[0] !== "") {
    req.params.q = JSON.parse(req.params[0]);
  }
  if (req.params.q === "") {
    res.jsonp({ error: "Bad or missing param: query" });
    return res.end();
  }
  var student = req.params.q.student;
  student.sid = uuid.v4();
  student.modified = Date.now();
  student.registered = Date.now();
  student.modifiedby = req.params.q.admin;
  student.dob - Date.parse(student.dob);
  itemProvider.save(
    {
      collection: "students"
    },
    student,
    function(err, result) {
      if (err) {
        console.log(err);
        res.jsonp({ error: "Not Found" });
        res.end();
      } else {
        res.jsonp({ result: result });
        res.end();
      }
    }
  );
});

/**
 * endpoint for edit student
 * @param {object} admin username, query of student data to update - must include sid
 * {admin: "admin username", student: {"sid": "8f7325f8-7b23-428b-bbed-d1650b216249", "gpa": "4.0"}}
 */
router.post(/^\/students\/update\/(.+)/, function(req, res) {
  if (req.params[0] !== "") {
    req.params.q = JSON.parse(req.params[0]);
  }
  if (req.params.q === "") {
    res.jsonp({ error: "Bad or missing param: query" });
    return res.end();
  }
  var student = req.params.q.student;
  student.modified = Date.now();
  student.modifiedby = req.params.q.admin;
  itemProvider.updateItem(
    {
      collection: "students",
      query: { sid: student.sid },
      action: { $set: student }
    },
    function(err, result) {
      if (err) {
        console.log(err);
        res.jsonp({ error: "Not Found" });
        res.end();
      } else {
        itemProvider.findOne(
          {
            collection: "students",
            query: { sid: student.sid }
          },
          function(err, retval) {
            if (err) {
              console.log("error", err);
            }
            delete retval._id;
            res.jsonp({ result: result, student: retval });
            res.end();
          }
        );
      }
    }
  );
});

/**
 * endpoint for students
 */
router.get("/students/:q/:l?/:s?/:f?", function(req, res) {
  itemProvider.findItems(
    {
      collection: "students",
      query: req.params.q || {},
      limit: req.params.l,
      sort: req.params.s,
      fields: req.params.f || {}
    },
    function(err, items) {
      if (err || items.length === 0) {
        //console.log(err)
        res.jsonp({ error: "Not Found" });
        res.end();
      } else {
        res.jsonp(items);
        res.end();
      }
    }
  );
});

/**
 * fallthrough route
 */
router.get(/^\//, function(req, res) {
  res.sendFile(path.resolve(__dirname, "../index.html"));
});

// handle RegExp
function handleRegex(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (prop.includes("$regex") && Array.isArray(obj[prop])) {
        obj[prop] = new RegExp(obj[prop][0], obj[prop][1] || "");
      } else if (typeof obj[prop] === "object") {
        handleRegex(obj[prop]);
      }
    }
  }
  return obj;
}

// validate param
var checkParam = function(a) {
  return void 0 === a ? {} : a.match(/^{/) ? JSON.parse(a) : objectify(a);
};

// turn simple string into object
var objectify = function(r) {
  for (var t = {}, a = r.split(","), n = 0; n < a.length; n++) {
    var e = a[n].split(":");
    t[e[0]] = parseInt(e[1]) ? parseInt(e[1]) : e[1];
  }
  return t;
};

module.exports = router;
