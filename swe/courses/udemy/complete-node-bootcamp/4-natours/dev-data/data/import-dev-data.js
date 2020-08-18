const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const { Tour } = require('../../models');

dotenv.config({ path: `${__dirname}/../../config.env` });

// Connect to DB
const DB = process.env.MONGO_URI.replace('<PWD>', process.env.MONGO_PWD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Database connection successful.');
  });

// Import all tours
async function importData() {
  try {
    const tours = JSON.parse(
      fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
    );
    await Tour.create(tours);
    console.log('Data successfully imported!');
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

// Delete all tours
async function deleteData() {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
  console.log('   node <path-to-script> (--import | --delete)');
  process.exit(0);
}
