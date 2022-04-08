'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    static associate(models) {
      
    }
  }
  Video.init({
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Video',
    timestamps: false
  });
  return Video;
};