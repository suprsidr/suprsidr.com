import request from 'superagent';
import jsonp from 'superagent-jsonp';
import {FETCH_URL} from './globals';

/**
 * fetch data from the server
 * @param {Object} query
 * @param {object} sort
 * @param {Function} cb
 */
export const fetchData = (
  query = {},
  sort = {
    "name.last":1,
    "name.first":1
  },
  cb) => {
	console.log('getting data from the server');
	const q = JSON.stringify(query),
				s = JSON.stringify(sort),
				f = JSON.stringify({
					_id: 0
				});
	request
			.get(`${FETCH_URL}/${q}/0/${s}/${f}`)
			.use(jsonp)
			.end((err, res) => {
				if (err) {
					cb(err);
				} else {
					const data = res.body.error ? [] : res.body;
					cb(null, data);
				}
			});
};

/**
 * create new data on the server
 * @param {Object} query eg:
 * {
      admin: 'Jim Smith',
      student: {
          "gender": "female",
          "name": {
              "title": "mrs",
              "first": "abby",
              "last": "baby"
          },
          "location": {
              "street": "8229 plum st",
              "city": "salinas",
              "state": "wyoming",
              "postcode": 94983
          },
          "email": "catherine.bailey@example.com",
          "registered": 1323036434,
          "dob": 368692954,
          "phone": "(955)-735-0917",
          "cell": "(974)-694-2005",
          "picture": {
              "large": "/women/89.jpg",
              "medium": "/med/women/89.jpg",
              "thumbnail": "/thumb/women/89.jpg"
          },
          "gpa": "3.0",
          "major": "Multi/interdisciplinary Studies"
      }
    }
 * @param {Function} cb
 */
export const insertRemoteData = (
  query = {},
  cb) => {
  console.log('inserting data on the server');
  const q = JSON.stringify(query);
  request
    .post(`${FETCH_URL}/insert/${q}`)
    .end((err, res) => {
      console.log('error: ' + err, 'body: ' + JSON.stringify(res.body));
      if (err) {
        cb(err);
      } else {
        cb(null, res.body.result[0]);
      }
    });
};

/**
 * update data on the server
 * @param {Object} query
 * @param {Function} cb
 */
export const updateRemoteData = (
  query = {},
  cb) => {
  console.log('updating data on the server');
  const q = JSON.stringify(query);
  request
    .post(`${FETCH_URL}/update/${q}`)
    .end((err, res) => {
      if (err) {
        cb(err);
      } else {
        const data = res.body.result.nModified === 1 ? res.body.student : null;
        cb(null, data);
      }
    });
};

/**
 * delete item from data on the server
 * @param {Object} query {"sid": "942c2bf7-60f1-480b-b471-1f9b71f08e05"}
 * @param {Function} cb
 */
export const deleteRemoteData = (
  query = {},
  cb) => {
  console.log('deleting data on the server');
  const q = JSON.stringify(query);
  request
    .post(`${FETCH_URL}/delete/${q}`)
    .end((err, res) => {
      if (err) {
        cb(err);
      } else {
        const data = res.body.result.ok === 1;
        cb(null, data);
      }
    });
};

export const upsert = (db, data, cb) => {
	db.students.upsert(data, () => {
		console.log('data upserted');
    cb && cb();
	});
}

export const updateLocalStorage = (db) => {
  db.students.find({}, {
    limit: 0,
    sort: {},
    fields: {}
  }).fetch((data) => {
    localStorage.setItem('studentData', JSON.stringify({
      timeStamp: Math.round(new Date().getTime() / 1000),
      students: data
    }));
  });
};
