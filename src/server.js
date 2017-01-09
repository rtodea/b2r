const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const index = require('./index');

const app = express();
app.use(fileUpload());

app.get('/', (req, res) => {
  const html = '<form action="/" method="post" id="data" encType="multipart/form-data"></form>' +
    '<table>' +
    '<tr>' +
    '<td>ALG HUD:</td>' +
    '<td><input type="number" name="hud" form="data"/></td>' +
    '</tr>' +
    '<tr>' +
    '<td>Costpoint Integration:</td>' +
    '<td><input type="number" name="cp" form="data"/></td>' +
    '</tr>' +
    '<tr>' +
    '<td>FISAR:</td>' +
    '<td><input type="number" name="fisar" form="data"/></td>' +
    '</tr>' +
    '<tr>' +
    '<td>Fleet Status:</td>' +
    '<td><input type="number" name="fsus" form="data"/></td>' +
    '</tr>' +
    '<tr>' +
    '<td>Fleet Strategy:</td>' +
    '<td><input type="number" name="fstrat" form="data"/></td>' +
    '</tr>' +
    '<tr>' +
    '<td>Resource Mgmt & Optimization:</td>' +
    '<td><input type="number" name="rsrc" form="data"/></td>' +
    '</tr>' +
    '<tr>' +
    '<td>User type:</td>' +
    '<td><select name="user" form="data">' +
    '<option value="select" selected>Select...</option>' +
    '<option value="DEV">DEV</option>' +
    '<option value="QA">QA</option>' +
    '<option value="PMO">PMO</option>' +
    '<option value="DEVOPS">DEVOPS</option>' +
    '</select></td>' +
    '</tr>' +
    '<tr>' +
    '<td>JIRA CSV export:</td>' +
    '<td>' +
    '<input type="file" name="jira" accept=".csv" form="data">' +
    '</td>' +
    '</tr>' +
    '</table>' +
    '<button type="submit" form="data">Submit</button>';

  res.send(html);
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
    "ALG HUD": hud,
    "Costpoint Integration": cp,
    "FISAR": fisar,
    "Fleet Status": fsus,
    "Fleet Strategy": fstrat,
    "Resource Mgmt & Optimization": rsrc
  };

  fs.writeFile('./timesheet-info.json', JSON.stringify(timesheetInfo), 'utf-8');

  file.mv('./exportData.csv', (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });

  index('./timesheet-info.json', './exportData.csv');

  const html = '' +
    '<a href="/">Try again.</a>';
  res.send(html);
});

const port = 3000;

app.listen(port, () => {
  console.log('Endpoint started on port ' + port);
});
