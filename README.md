# b2r (Blue -> Red)
## Usage

### Install

    npm install / yarn install

### Run

  1. Download Blue data into a CSV file for the time interval(e.g. `exportData.csv`)
  1. Create a Red timesheet for possible project
  
#### Web Interface
  1. Start web server
      
          npm start
          
  1. Access server at [`http://localhost:3000`](`http://localhost:3000`)
  1. Set the timesheet id's to the affected projects
  1. Set User type (e.g. `WEB` for developer)
  1. Upload `exportData.csv`
  1. Click `Download` button and save `time-entries.csv`
  1. Import `time-entries.csv` the entries into Red app

#### Command Line Interface  
  1. If not created, create `timesheet-info.json` with the mapping between Red project and timesheet ID.
          
          cp sample-timesheet-info.json timesheet-info.json
          
  1. Edit the entries from `timesheet-info.json` with values from Red app
  
  1. Run
  
          npm run convert exportData.csv timesheet-info.json
          yarn run convert exportData.csv timesheet-info.json

  1. Import `time-entries.csv` the entries into Red app
    

## Description

Let's imagine the following scenario.

We have two apps, one called _Blue_, and another called _Red_, both used
in the life of a software developer.

### When is Blue useful?

* creating tickets for requested bugs and features
* logging work hours

### When is Red useful?

* billing the work hours to the client
* submitting timesheets

At a regular interval, one copies the entries from Blue to Red by hand.

It is a tedious process and very error prone.

You would not want to forget some work hours, use wrong task codes, etc.

Leaving aside a similar analysis to [_Is it worth the time_](https://xkcd.com/1205/)
we would like to automate the transition process.

## Breakdown

### Blue app
It has a CSV export feature that can provide the following columns:

* Project
* Issue Type
* Key
* Summary
* Priority
* "Billing - Project"
* Date Started
* Username
* Display Name
* Time Spent (h)
* Work Description

### Red app

_Add new timesheet_ form:

* Name --- it is actually the project name
* Start date --- it should be se to one 2 dates (1st or 16th of the current month)

_Edit timesheet_ form contains a _Time Entries_ table:

* Date
* Task code --- relevant ones are `*-EST`, `*-WEB`
* Blue number --- ticket identifier
* Task Description --- ticket title
* Hours

## FAQ

1. What happens when some tickets lack the "Billing - Project" field?
    1. To identify the project we use the following fields:
       
        1. `Billing - Project`
        1. `Project`
       
       If none was found the add `NO_PROJECT` and hope for the best.

1. Some are known to apply to different project regardless of the one assigned
    We need to think more about it.
    
    Some ideas:

    1. `special-tickets-in.csv` file for those must be provided
    1. `special-tickets-out.csv` file will be generated with the correct entries

1. How can we automatically import the CSV into Red app?

    If we lacked the `import` button we could explore the following:
    
    1. use a web driver to put the correct entries (e.g. [`webdriver.io`](http://webdriver.io/))
    1. use a [`*.user.js`](https://github.com/OpenUserJs/OpenUserJS.org/wiki/Userscript-beginners-HOWTO) 
    triggered by [`Tampermonkey`](https://github.com/OpenUserJs/OpenUserJS.org/wiki/Tampermonkey-for-Chrome)
