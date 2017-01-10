const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const index = require('./../index');
const redPrefixToProjectName = require('../../db/red-prefix-to-project-name.json');

const app = express();
app.use(fileUpload());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.post('/', (req, res) => {
  const user = req.body.user;
  const file = req.files.jira;

  const timesheetInfo = {};
  Object.keys(redPrefixToProjectName).forEach((prefix) => {
    const projName = redPrefixToProjectName[prefix];
    timesheetInfo[projName] = parseInt(req.body[prefix]) || 0;
  });

  fs.writeFileSync('./timesheet-info.json', JSON.stringify(timesheetInfo), 'utf-8');

  file.mv('./exportData.csv', (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      index('./exportData.csv', './timesheet-info.json', user !== 'select' ? user : null);
      res.download('./time-entries.csv');
    }
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Endpoint started on port ${port}`);
});
