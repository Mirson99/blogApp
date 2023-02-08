#! /usr/bin/env node
// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const async = require("async");
const User = require("./models/user");
const Post = require("./models/post");
const Category = require("./models/category");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const users = [];
const posts = [];
const categories = [];

function userCreate(username, email, password, profilePic, cb) {
  userdetail = {
    username: username,
    email: email,
    password: password,
    profilePic: profilePic,
  };

  const user = new User(userdetail);

  user.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New User: " + user);
    users.push(user);
    cb(null, user);
  });
}

function categoryCreate(name, cb) {
  const category = new Category({ name: name });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Category: " + category);
    categories.push(category);
    cb(null, category);
  });
}

function postCreate(title, description, photo, author, category, cb) {
  postdetail = {
    title: title,
    description: description,
    photo: photo,
    author: author,
  };
  if (category != false) postdetail.category = category;

  const post = new Post(postdetail);
  post.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Post: " + post);
    posts.push(post);
    cb(null, post);
  });
}

function createUsers(cb) {
  async.series(
    [
      function (callback) {
        userCreate(
          "robert_kubica",
          "kubica@gmail.com",
          "12345678",
          "",
          callback
        );
      },
      function (callback) {
        userCreate("cris99", "cris@gmail.com", "12345678", "", callback);
      },
      function (callback) {
        userCreate("luki", "luki@gmail.com", "12345678", "", callback);
      },
    ],
    // optional callback
    cb
  );
}

function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate("Horror", callback);
      },
      function (callback) {
        categoryCreate("Fantasy", callback);
      },
      function (callback) {
        categoryCreate("Drama", callback);
      },
    ],
    // optional callback
    cb
  );
}

function createPosts(cb) {
  async.parallel(
    [
      function (callback) {
        postCreate(
          "title1",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque at ultricies purus. Aenean tempus mattis felis, vel gravida magna. Aenean in mauris venenatis, placerat diam et, fermentum mi. Vestibulum sollicitudin sapien ligula, nec lacinia leo efficitur quis. Etiam ac libero eu diam varius gravida. Phasellus id felis a nunc eleifend cursus vitae in ex. Maecenas quam mauris, gravida accumsan risus sed, vehicula efficitur erat. Sed tristique aliquam sagittis. Nam vehicula orci dolor, sed fringilla odio gravida eu. Etiam efficitur consequat libero, vel pellentesque neque bibendum facilisis. Pellentesque vitae mauris molestie, lobortis mi a, mattis felis. Donec varius eu erat eget porta. Phasellus iaculis pretium scelerisque. Duis mauris eros, molestie nec turpis vel, malesuada commodo ante. Proin arcu velit, faucibus a dolor nec, laoreet molestie nulla.",
          "",
          users[0],
          categories[0],
          callback
        );
      },
      function (callback) {
        postCreate(
          "title2",
          "Cras id metus sit amet urna porttitor congue. In placerat enim id imperdiet feugiat. Cras ullamcorper ligula ac arcu placerat facilisis. Morbi venenatis eget lectus vel efficitur. Nullam eu suscipit urna. Duis sit amet gravida quam. Duis lorem nisl, egestas ac tempus vel, molestie quis arcu. Praesent hendrerit nisi eget fringilla gravida. Proin fermentum accumsan neque id suscipit. Donec eu orci mi. Nullam maximus, diam in viverra vestibulum, erat sem convallis elit, pulvinar porttitor ex odio vitae tortor. Suspendisse et odio in metus accumsan tincidunt.",
          "",
          users[1],
          categories[1],
          callback
        );
      },
      function (callback) {
        postCreate(
          "title3",
          "Proin gravida eget risus quis aliquam. Praesent id ex sed nunc maximus aliquam sed in leo. Fusce ut lectus turpis. Integer ornare finibus odio, molestie eleifend tortor vulputate vel. Sed tristique ipsum sit amet viverra fermentum. Ut eu nulla condimentum, vestibulum orci mollis, pulvinar felis. Quisque malesuada scelerisque nisl, nec bibendum sapien aliquet ac. Morbi vitae pharetra mauris, non tincidunt diam. Fusce et sodales purus. Proin non nisi id ex lobortis finibus in vitae velit. Integer sit amet lorem porta, facilisis enim sit amet, scelerisque purus.",
          "",
          users[2],
          categories[2],
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createUsers, createCategories, createPosts],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } 
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
