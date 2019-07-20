/**
 * Look to the options in NgCsv file for documentation
 */
export interface Options {
  fileNameSeparator?: string;
  eol?: string;
  bom?: string | null;
  quoteStrings?: boolean;
  fieldSeparator?: string;
  nullValue?: string;
  trueValue?: string;
  falseValue?: string;
  labels?: string[],
}

/**
 * @example new NgCSV([
 *  {
 *    id: 1,
 *    name: 'Test 1',
 *  },
 *  {
 *    id: 2,
 *    name: 'Test 2',
 *  }
 * ], 'users', {labels: [
 *   'ID',
 *   'Name',
 * ]}).download();
 *
 * Will download a CSV file with those rows using the labels option for the column headers
 */
export class NgCsv {
  // This is the string formatted data that goes into the CSV file
  csvData: string;
  // The internal representation of the CSV data, always array of objects
  private _data: any[];
  // These are the CSV options, using the Options interface
  private _options: Options = {
    // Replaces spaces in file names
    fileNameSeparator: '_',
    // End Of Line character, normally carriage return
    eol: '\r\n',
    // Byte Order Mark, make null to not use
    bom: '\ufeff',
    // Quote strings, by default yuo should normally leave this on
    quoteStrings: true,
    // Default CSV field separator is comma
    fieldSeparator: ',',
    // NULL will be converted to this
    nullValue: '',
    // True values will be converted to this
    trueValue: 'Yes',
    // False values will be converted to this
    falseValue: 'No',
    // A list of labels for columns
    labels: null,
  };
  // This is the file name for the CSV
  private _fileName: string;

  /**
   * Set the CSV data, will parse from JSON if string
   * @param data
   */
  set data(data: any[] | string) {
    this._data = typeof data === 'string' ? JSON.parse(data) : data;
  }

  get data() {
    return this._data;
  }

  /**
   * Set the CSV options, will set labels from the data if none provided
   * @param options
   */
  set options(options: Options) {
    options = options || {};

    if (!options.labels) {
      let labels: string[] = [];
      for (let index in this.data[0]) {
        labels[labels.length] = index;
      }
      options.labels = labels;
    }

    this._options = Object.assign(this.options, options);
  }

  get options() {
    return this._options;
  }

  /**
   * Set the CSV file name
   * @param filename
   */
  set fileName(filename: string) {
    this._fileName = filename.replace(/ /g, this.options.fileNameSeparator) + '.csv';
  }

  get fileName() {
    return this._fileName;
  }

  /**
   * Setup the class:
   *  - Set the data for the csv
   *  - Set the file name
   *  - apply the provided options (if any)
   *  - Automatically call to generate the CSV
   *
   * @param data
   * @param filename
   * @param options
   */
  constructor(
    data: any[] | string,
    filename: string,
    options?: Options
  ) {
    this.data = data;
    this.options = options;
    this.fileName = filename;
    this.csvData = this.generate();
  }

  /**
   * Download generated CSV
   */
  download() {
    let blob = new Blob([this.csvData], {type: 'text/csv;charset=utf8;'});

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, this.fileName);
    } else {
      let a = document.createElement("a");
      a.style.display = 'none';
      a.href = window.URL.createObjectURL(blob);
      a.download = this.fileName;

      document.body.appendChild(a);
      a.click();
    }
  }

  /**
   * This allows you to on-demand re-generate the CSV if that's your thang
   */
  generate() {
    let csvData: string  = this.options.bom ? this.options.bom : '',
      labels: string[] = [];

    for (let index in this.options.labels) {
      labels[labels.length] = this.options.labels[index];
    }
    csvData += labels.join(this.options.fieldSeparator) + this.options.eol;

    for (var i = 0; i < this.data.length; i++) {
      let line: string[] = [];
      for (var index in this.data[i]) {
        line[line.length] = this.formatValue(this.data[i][index]);
      }
      csvData += line.join(this.options.fieldSeparator) + this.options.eol;
    }

    return csvData;
  }

  /**
   * This formats a field value
   * Note: I don't deal with numbers and floats here
   * @param value
   */
  private formatValue(value: any) {
    if (value === null) {
      value = this.options.nullValue;
    }

    if (typeof value === 'boolean') {
      value = value ? this.options.trueValue : this.options.falseValue;
    }

    if (this.options.quoteStrings && typeof value === 'string') {
      value = value.replace(/"/g, '""');
      value = `"${value}"`;
    }
    return value;
  }
}
