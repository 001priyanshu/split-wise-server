const  userModel = require("../models/userSchema");
const jwt = require('jsonwebtoken');
const { response } = require("express");

module.exports.addUser = async (userObject,response) => {
    console.log("Signup");
   
    try {
        const doc = await userModel.create(userObject);
        response.json({ Status: "S", record: doc });
      } catch (err) {
        console.log("ERR", err);
        response.json({ Status: "F" });
      }
};

module.exports.login = async (userObject,response) => {
    try {
        const doc = await userModel.findOne(userObject);
        if (doc) {
          const token = jwt.sign({ doc }, "secretkey", { expiresIn: "1h" });
          response.json({
            Status: "S",
            msg: "welcome bro " + doc.username,
            token: token,
          });
        } else {
          response.json({
            Status: "F",
            msg: "Invalid username or password",
          });
        }
      } catch (err) {
        console.log(err);
      }
};


module.exports.addFriend = async (userObject,response) => {
    try {
        // const check = await this.Find(userObject.username);
        const check = await userModel.findOne({username: userObject.username });
        console.log(check);

        const doc2 = await userModel.findOneAndUpdate(
          {username: userObject.username},
          
            {
              "$push": {
                "friends": userObject.defaultUser,
                "expensis": {
                  "name": userObject.defaultUser,
                  "data": {}
                }
              }
          }
        )
      
        if (check) {
          const doc = await userModel.findOneAndUpdate(
            { username: userObject.defaultUser },
            {
              "$push": {
                "friends": userObject.username,
                "expensis": {
                  "name": userObject.username,
                  "data": {}
                }
              }
            },
            { new: true }


           


          ).exec();




      
      
       
      
          // send mail to check.email => that userObject.default user has added you as his friend;
      
          response.json({ Status: "S", msg: "Added successfully", doc: doc });
        } else {
          console.log("status Fail");
          response.json({ Status: "F", msg: "Your friend is not registered yet" });
        }
      } catch (error) {
        console.error(error);
        response.status(500).json({ Status: "F", msg: "Internal server error" });
      }
      
  };

  module.exports.find = async (username) => {
    try {
      const doc = await userModel.findOne({ username });
      if (doc) {
        console.log(doc);
        // return true;
      } else {
        console.log("not Found");
        // return false;
      }
    } catch (err) {
      console.log(err);
      // return false;
    }
  };

  module.exports.addExp = async (userObject, response) => {
    try {

           const doc2 = await userModel.findByIdAndUpdate(
            { username: userObject.user, "expensis.name": userObject.username },
            {
              $set: {
                "expensis.$.data.desc": userObject.inp.description,
                "expensis.$.data.date": userObject.inp.date,
              },
              $inc: { "expensis.$.data.ammount": -userObject.inp.amount },
            },
           )

      const doc = await userModel.findOneAndUpdate(
        { username: userObject.username, "expensis.name": userObject.user },
        {
          $set: {
            "expensis.$.data.desc": userObject.inp.description,
            "expensis.$.data.date": userObject.inp.date,
          },
          $inc: { "expensis.$.data.ammount": userObject.inp.amount },
        },
        { new: true }
      );
      console.log(doc);
      response.json({ Status: "S", msg: "Added successfully", doc: doc });
    } catch (err) {
      console.log(err);
      response.json({ Status: "E", msg: "Error occurred" });
    }
  };
  
  module.exports.settle = async (userObject, response) => {
    try {
      const doc = await userModel.findOneAndUpdate(
        { username: userObject.username, "expensis.name": userObject.user },
        { $inc: { "expensis.$.data.ammount": userObject.val } },
        { new: true }
      );
      console.log(doc);
      response.json({ Status: "S", msg: "Added successfully", doc: doc });
    } catch (err) {
      console.log(err);
      response.json({ Status: "E", msg: "Error occurred" });
    }
  };
  
