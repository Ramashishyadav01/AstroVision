const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  reportType: {
    type: String,
    enum: {
      values: ['planets-extended', 'western-planets', 'panchang'],
      message: 'Invalid report type. Must be one of: planets-extended, western-planets, panchang',
    },
    required: [true, 'Report type is required'],
  },
  reportName: {
    type: String,
    required: [true, 'Report name is required'],
    trim: true,
  },
  birthData: {
    year: { type: Number },
    month: { type: Number },
    date: { type: Number },
    hours: { type: Number },
    minutes: { type: Number },
    seconds: { type: Number },
    latitude: { type: Number },
    longitude: { type: Number },
    timezone: { type: Number },
    placeName: { type: String },
  },
  reportData: {
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
