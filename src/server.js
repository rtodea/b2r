const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const index = require('./index');
const path = require('path');

const app = express();
app.use(fileUpload());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/', (req, res) => {
  const hud = req.body.hud,
    cp = req.body.cp,
    fisar = req.body.fisar,
    fsus = req.body.fsus,
    fstrat = req.body.fstrat,
    rsrc = req.body.rsrc,
    user = req.body.user,
    file = req.files.jira;

  const timesheetInfo = {
    "ALG HUD": parseInt(hud) || 0,
    "Costpoint Integration": parseInt(cp) || 0,
    "FISAR": parseInt(fisar) || 0,
    "Fleet Status": parseInt(fsus) || 0,
    "Fleet Strategy": parseInt(fstrat) || 0,
    "Resource Mgmt & Optimization": parseInt(rsrc) || 0
  };

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

const port = 3000;

app.listen(port, () => {
  console.log('Endpoint started on port ' + port);
});
