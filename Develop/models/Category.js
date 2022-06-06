const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

//localhost:3001/api/Category because everything that we did now links up here
class Category extends Model {}

Category.init(
  {
    // define columns
    //We have two:  `id` and `category_name`
    id: {
      //Function will be a number
      type: DataTypes.INTEGER,
      //We can't allow this to be empty
      allowNull: false,
      //We're going to increase the number by 1 for each new data
      autoIncrement: true,
      //Make this primary to track!
      primaryKey: true
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'category',
  }
);

module.exports = Category;
