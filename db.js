import pkg from "sequelize";
const { Sequelize, DataTypes } = pkg;

const db = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
});

const Camp = db.define("Camps", {
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  location: DataTypes.STRING,
  date: DataTypes.DATE,
});

const SignUp = db.define("SignUps", {
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  email: DataTypes.STRING,
});

const Member = db.define("Members", {
  name: DataTypes.STRING,
  position: DataTypes.STRING,
  bio: DataTypes.STRING,
  image: DataTypes.STRING,
});

Camp.hasMany(SignUp);
SignUp.belongsTo(Camp);

await db.sync();

export { db, Camp, SignUp, Member };
