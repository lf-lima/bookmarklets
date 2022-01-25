javascript: (async function () {
  const selection = document.getSelection();

  const text = selection.toString();

  try {
    const json = JSON.parse(text);

    if (!Array.isArray(json) && json.length) {
      throw new Error('Objeto não é um array!');
    }

    const baseObject = {};

    const firstObject = json[0];
    const keyNames = Object.keys(firstObject);

    for (const key of keyNames) {
      baseObject[key] = typeof firstObject[key];
    }

    for (const currentObject of json) {
      const currentKeyNames = Object.keys(currentObject);

      if (keyNames.length !== currentKeyNames.length) {
        throw new Error('Keys dont match!');
      }

      for (const currentKeyName of currentKeyNames) {
        if (!keyNames.find(keyName => keyName === currentKeyName)) {
          throw new Error('Keys dont match!');
        }
      }

      for (const key of keyNames) {
        if (baseObject[key] !== typeof currentObject[key]) {
          throw new Error('Values dont match!');
        }
      }
    }

    let csvText = '';

    for (let i = 0; i < keyNames.length; i++) {
      csvText = csvText + keyNames[i];

      if (i + 1 !== keyNames.length) {
        csvText = csvText + ';';
      } else {
        csvText = csvText + '\n';
      }
    }

    for (const currentObject of json) {
      for (let j = 0; j < keyNames.length; j++) {
        const currentKey = keyNames[j];

        csvText = csvText + currentObject[currentKey];

        if (j + 1 !== keyNames.length) {
          csvText = csvText + ';';
        } else {
          csvText = csvText + '\n';
        }
      }
    }

    console.log('JSON2CSV OBJECT');
    console.log(json);
    console.log('JSON2CSV CSV');
    console.log(csvText);

    const fileHandle = await window.showSaveFilePicker();
    const fileStream = await fileHandle.createWritable();
    await fileStream.write(new Blob([csvText], { type: 'text/csv' }));
    await fileStream.close();
  } catch (error) {
    const errorMessage = error.message;

    console.error(`JSON2CSV ERROR | ${errorMessage}`);

    if (errorMessage !== 'The user aborted a request.') {
      alert('Esse não é um objeto JSON válido!');
    }
  }
})();