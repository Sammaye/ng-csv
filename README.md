# NgCsv

Making CSVs with Angular.

This library is really simple, just a single class with a small and slim API.

## Install

```
npm i @sammaye/ng-csv --save
```

## Use

Much of the documentation for the different options can be found directly in the code. It is very well documented and should be easy to read.

Here I will just give a quick example of usage:
```javascript
new NgCsv(
  [
    {
      address: "T",
      name: "T",
      email: "T",
      from: "T",
      to: "T",
      days: "T",
      hours: "T"
    }
  ],
  'Employee Details', 
  {
    labels: [
      'Address',
      'Name',
      'Email Address',
      'From',
      'To',
      'Days',
      'Hours',
    ]
  }
).download();
```

Will print and download a CSV which contains one row, with the labels as the column headers using the filename `employee_details.csv`.
