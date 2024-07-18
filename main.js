`use strict`;

{

  //立ち上げ時の処理
  // document.addEventListener("DOMContentLoaded", displayTateList());

  document.addEventListener("DOMContentLoaded", function () {
    fetch('checkword.csv')
      .then(response =>{
        if(!response.ok){
          throw new Error('Network response was not ok' + response.statusText);
        }
        return response.text();
      })
      .then(data => {
        let openCriteria = data;
        console.log(openCriteria);

        openCriteria = tateyoko(openCriteria);
        yomikomi(openCriteria);

        displayTateList();
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  });


  // チェックボタン押下の処理
  document.querySelector('#checkButton').addEventListener('click', () => {

    const inputText = document.querySelector('#input').value;
    const outputText = document.querySelector('#output');
    const chuukiText = document.querySelector('#chuuki');
    const criteriaInputRed = document.querySelector('#criteriaRed').value;
    const criteriaInputYellow = document.querySelector('#criteriaYellow').value;
    const criteriaInputBlue = document.querySelector('#criteriaBlue').value;
    const criteriaInputOrange = document.querySelector('#criteriaOrange').value;
    outputText.textContent = "";
    chuukiText.textContent = "";
    let countRed, countYellow, countBlue = {};

    const allList = document.getElementById("criteriaList");
    const yellowList = document.getElementById("criteriaYellowList");
    allList.textContent = "";
    yellowList.textContent = "";

    //検索ワードの取得
    let criteriaTextRed = criteriaInputRed.match(/[^,\s]+/g);
    let criteriaTextYellow = criteriaInputYellow.match(/[^,\s]+/g);
    let criteriaTextBlue = criteriaInputBlue.match(/[^,\s]+/g);
    let criteriaTextOrange = criteriaInputOrange.match(/[^,\s]+/g);

    let redLength = 0;
    let blueLength = 0;
    let yellowLength = 0;
    let orangeLength = 0;


    if (criteriaTextRed) {
      redLength = criteriaTextRed.length;
    } else {
      criteriaTextRed = [];
    }

    if (criteriaTextBlue) {
      blueLength = criteriaTextBlue.length;
    } else {
      criteriaTextBlue = [];
    }

    if (criteriaTextYellow) {
      yellowLength = criteriaTextYellow.length;
    } else {
      criteriaTextYellow = [];
    }

    if (criteriaTextOrange) {
      orangeLength = criteriaTextOrange.length;
    } else {
      criteriaTextOrange = [];
    }

    const maxLength = Math.max(redLength, blueLength);

    while (redLength < maxLength) {
      criteriaTextRed.push("");
      redLength = redLength + 1;
    }

    while (blueLength < maxLength) {
      criteriaTextBlue.push("");
      blueLength = blueLength + 1;
    }

    while (orangeLength < yellowLength) {
      criteriaTextOrange.push("");
      orangeLength = orangeLength + 1;
    }

    countRed = new Array(maxLength);
    countRed.fill(0);
    countBlue = new Array(maxLength);
    countBlue.fill(0);

    if (criteriaTextYellow) {
      countYellow = new Array(criteriaTextYellow.length);
      countYellow.fill(0);
    }

    //テキストとの照合
    for (let iplus = 0; iplus < inputText.length; iplus++) {
      let c = inputText.substring(iplus, iplus + 1);
      let klass = [];
      let checked = "";
      let chuki = "";

      //改行処理
      if (c === "\n") {
        outputText.insertAdjacentHTML('beforeend', '<br>');
        continue;
      }

      //色付け
      if (criteriaTextRed) {
        criteriaTextRed.forEach((value, index) => {
          if (inputText.startsWith(value, iplus) && checked === "" && value.length > 0) {
            c = value;
            iplus = iplus + value.length - 1;
            klass.push("akaami note-container");
            checked = "check";
            let checkit = countRed.at(index);
            countRed.fill(checkit + 1, index, index + 1);
            chuki = "▶︎" + criteriaTextBlue[index];
          }
        });
      }


      if (criteriaTextBlue) {
        criteriaTextBlue.forEach((value, index) => {
          if (inputText.startsWith(value, iplus) && checked === "" && value.length > 0) {
            c = value;
            iplus = iplus + value.length - 1;
            klass.push("aoami note-container");
            checked = "check";
            let checkit = countBlue.at(index);
            countBlue.fill(checkit + 1, index, index + 1);
            chuki = "◀︎" + criteriaTextRed[index];
          }
        });
      }

      if (criteriaTextYellow) {
        criteriaTextYellow.forEach((value, index) => {
          if (inputText.startsWith(value, iplus) && checked === "" && value.length > 0) {
            c = value;
            iplus = iplus + value.length - 1;
            klass.push("kiami note-container");
            checked = "check";
            let checkit = countYellow.at(index);
            countYellow.fill(checkit + 1, index, index + 1);
            if (criteriaTextOrange[index]) {
              chuki = criteriaTextOrange[index];
            } else {
              chuki = "";
            }
          }
        });
      }

      let spanElement = document.createElement("span");
      let spanChuElement = document.createElement("span");
      spanElement.textContent = c;
      spanElement.className = klass;
      spanChuElement.textContent = chuki;
      spanChuElement.className = "note";

      spanElement.appendChild(spanChuElement);
      outputText.appendChild(spanElement);
    }  // ループ終わり

    // console.log("outputText", outputText);

    //表を入れる
    const allTable = document.createElement("table");
    const alltbody = document.createElement("tbody");
    const alltr = document.createElement("tr");
    const alltd5 = document.createElement("td");
    const alltd1 = document.createElement("td");
    const alltd2 = document.createElement("td");
    const alltd3 = document.createElement("td");
    const alltd4 = document.createElement("td");

    alltd1.textContent = "No.";
    alltd2.textContent = "修正検討ワード";
    alltd3.textContent = "出現数";
    alltd4.textContent = "表記揃えワード";
    alltd5.textContent = "出現数";

    alltr.appendChild(alltd1);
    alltr.appendChild(alltd2);
    alltr.appendChild(alltd3);
    alltr.appendChild(alltd4);
    alltr.appendChild(alltd5);

    alltbody.appendChild(alltr);
    allTable.appendChild(alltbody);
    allList.appendChild(allTable);

    //2行目以降を入れる
    for (let i = 0; i < maxLength; i++) {

      // if (countRed.at(i) + countBlue.at(i) > 0) {
      if (countRed.at(i) > 0) {
        const row = document.createElement("tr");

        //第1列
        const cell = document.createElement("td");
        const cellText1 = document.createElement("td");
        const cellText2 = document.createElement("td");
        const cellText3 = document.createElement("td");
        const cellText4 = document.createElement("td");

        cell.textContent = i + 1;
        row.appendChild(cell);

        //第2列
        cellText1.innerHTML = criteriaTextRed.at(i);
        row.appendChild(cellText1);

        //第3列
        cellText2.innerHTML = countRed.at(i);
        row.appendChild(cellText2);

        //第4列
        cellText3.innerHTML = criteriaTextBlue.at(i);
        row.appendChild(cellText3);

        //第5列
        cellText4.innerHTML = countBlue.at(i);

        row.appendChild(cellText4);
        alltbody.appendChild(row);
        allTable.appendChild(alltbody);
        allList.appendChild(allTable);

      }
    }

    //黄色ワードの表を入れる
    const yellowTable = document.createElement("table");
    const yellowtbody = document.createElement("tbody");
    const yellowtr = document.createElement("tr");
    const yellowtd1 = document.createElement("td");
    const yellowtd2 = document.createElement("td");
    const yellowtd3 = document.createElement("td");
    const yellowtd4 = document.createElement("td");

    yellowtd1.textContent = "No.";
    yellowtd2.textContent = "要検討ワード";
    yellowtd3.textContent = "出現数";
    yellowtd4.textContent = "注記";

    yellowtr.appendChild(yellowtd1);
    yellowtr.appendChild(yellowtd2);
    yellowtr.appendChild(yellowtd3);
    yellowtr.appendChild(yellowtd4);

    yellowtbody.appendChild(yellowtr);
    yellowTable.appendChild(yellowtbody);
    yellowList.appendChild(yellowTable);

    //2行目以降を入れる
    if (criteriaInputYellow) {

      for (let i = 0; i < criteriaTextYellow.length; i++) {

        if (countYellow.at(i) > 0) {
          const row = document.createElement("tr");

          //第1列
          const cell = document.createElement("td");
          const cellText1 = document.createElement("td");
          const cellText2 = document.createElement("td");
          const cellText3 = document.createElement("td");

          cell.textContent = i + 1;
          row.appendChild(cell);

          //第2列
          cellText1.innerHTML = criteriaTextYellow.at(i);
          row.appendChild(cellText1);

          //第3列
          cellText2.innerHTML = countYellow.at(i);
          row.appendChild(cellText2);

          //第4列
          cellText3.innerHTML = criteriaTextOrange.at(i);
          row.appendChild(cellText3);

          // row.appendChild(cellText4);
          yellowtbody.appendChild(row);
          yellowTable.appendChild(yellowtbody);
          yellowList.appendChild(yellowTable);
        }
      }
    }
  });



  //検索ワードに変更があった際の対応
  document.querySelectorAll('.criterias').forEach(function (criterias) {
    criterias.addEventListener('change', () => {
      const criteriaInputFileName = document.getElementById('criteriaInputFileName');
      if (!criteriaInputFileName.textContent.match(/\+変更$/)) {
        criteriaInputFileName.insertAdjacentHTML('beforeend', "+変更");
      }
    });
  });


  // テキストクリアボタン押下の処理
  document.querySelector('#clearButton').addEventListener('click', () => {
    const outputText = document.querySelector('#output');
    const chuukiText = document.querySelector('#chuuki');
    document.getElementById('input').value = '';
    document.getElementById('input').focus();
    outputText.textContent = "";
    chuukiText.textContent = "";
    const allList = document.getElementById("criteriaList");
    allList.textContent = "";
    const yellowList = document.getElementById("criteriaYellowList");
    yellowList.textContent = "";
  });


  // 検索ワードクリアボタン押下の処理
  document.querySelector('#clearCriteriaButton').addEventListener('click', () => {
    const fileContentList = document.querySelector('pre');
    fileContentList.textContent = "";

    const criteriaInputRed = document.getElementById('criteriaRed');
    criteriaInputRed.value = "";

    const criteriaInputBlue = document.getElementById('criteriaBlue');
    criteriaInputBlue.value = "";

    const criteriaInputYellow = document.getElementById('criteriaYellow');
    criteriaInputYellow.value = "";

    const criteriaInputOrange = document.getElementById('criteriaOrange');
    criteriaInputOrange.value = "";

    const tateList = document.getElementById("tateList");
    tateList.textContent = "";

    const criteriaInputFileName = document.getElementById('criteriaInputFileName');
    criteriaInputFileName.textContent = "";

    const titleList = document.querySelector('.titleList');
    titleList.style.display = 'none';

  });


  //検索ワードの保存
  document.querySelector('#saveCriteriaButton').addEventListener('click', () => {
    const criteriaInputRed = document.querySelector('#criteriaRed').value;
    const criteriaInputYellow = document.querySelector('#criteriaYellow').value;
    const criteriaInputBlue = document.querySelector('#criteriaBlue').value;
    const criteriaInputOrange = document.querySelector('#criteriaOrange').value;

    let criteriaSave = '●修正検討ワード:,' + criteriaInputRed.replace(/^,+/, "") + '\n●表記揃えワード:,' + criteriaInputBlue.replace(/^,+/, "") + '\n●要検討ワード:,' + criteriaInputYellow.replace(/^,+/, "") + '\n●要検討ワードの注記:,' + criteriaInputOrange.replace(/^,+/, "");

    criteriaSave = tateyoko(criteriaSave);
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]) //ここでUTF-8を指定
    const blob = new Blob([bom, criteriaSave], { type: "text/csv" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "表記チェッカー検索ワード.csv";
    a.click();
    URL.revokeObjectURL(url);
  });


  //検索ワードの読み込み
  const fileInput = document.getElementById('fileInput');
  const fileContent = document.getElementById('fileContent');
  const criteriaInputFileName = document.getElementById('criteriaInputFileName');
  let newCriteria = "";

  document.getElementById('toFileInput').addEventListener("click", () => {
    document.getElementById("fileInput").click();
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const criteriaInputFile = fileInput.files;

    const titleList = document.querySelector('.titleList');
    titleList.style.display = 'inline';

    criteriaInputFileName.textContent = criteriaInputFile[0].name;

    if (file.type === "text/plain" || file.type === "text/csv") {
      if (file.size < 100000) {
        reader.onload = () => {
          fileContent.textContent = reader.result;
          newCriteria = fileContent.textContent;
          newCriteria = tateyoko(newCriteria);

          yomikomi(newCriteria);

          const tateList = document.getElementById("tateList");
          tateList.textContent = "";
          displayTateList();
        };
        reader.readAsText(file);
      } else { alert("ファイルが大きすぎます。100KB以下に抑えてください"); }
    } else { alert("CSVファイルではありません"); }
  }, false)


  //縦横変換関数
  function tateyoko(inputCsv) {
    const rows = inputCsv.trim().split('\n').map(row => row.split(',').map(cell => cell.trim()));
    const maxLength = Math.max(...rows.map(row => row.length));
    const normalizedRows = rows.map(row => {
      while (row.length < maxLength) {
        row.push('');
      }
      return row;
    });
    const transposedRows = normalizedRows[0].map((_, colIndex) => normalizedRows.map(row => row[colIndex]));
    return transposedRows.map(row => row.join(',')).join('\n').trim();
  }

  //検索ワード読み込み関数
  function yomikomi(newCriteria) {
    const critNew = newCriteria.match(/,.*/g);
    let criteriaInputRed = document.querySelector('#criteriaRed');
    let criteriaInputBlue = document.querySelector('#criteriaBlue');
    let criteriaInputYellow = document.querySelector('#criteriaYellow');
    let criteriaInputOrange = document.querySelector('#criteriaOrange');

    if (critNew[0]) {
      const critRed = critNew[0].slice(1);
      criteriaInputRed.value = critRed.replace(/^,+/, "");
    } else { criteriaInputRed.value = ""; }

    if (critNew[1]) {
      const critBlue = critNew[1].slice(1);
      criteriaInputBlue.value = critBlue.replace(/^,+/, "");
    } else { criteriaInputBlue.value = ""; }

    if (critNew[2]) {
      const critYellow = critNew[2].slice(1);
      criteriaInputYellow.value = critYellow.replace(/^,+/, "");
    } else { criteriaInputYellow.value = ""; }

    if (critNew[3]) {
      const critOrange = critNew[3].slice(1);
      criteriaInputOrange.value = critOrange.replace(/^,+/, "");
    } else { criteriaInputOrange.value = ""; }
  }


  //縦型リストの作成
  function displayTateList() {
    const tateList = document.getElementById("tateList");
    const tateTable = document.createElement("table");
    const tatethead = document.createElement("thead");
    const tatetbody = document.createElement("tbody");
    const tatetd1 = document.createElement("td");
    const tatetd2 = document.createElement("td");
    const tatetd3 = document.createElement("td");
    const tatetd4 = document.createElement("td");

    tatetd1.textContent = "修正検討ワード";
    tatetd2.textContent = "表記揃えワード";
    tatetd3.textContent = "要検討ワード";
    tatetd4.textContent = "要検討ワードの注記";

    tatethead.appendChild(tatetd1);
    tatethead.appendChild(tatetd2);
    tatethead.appendChild(tatetd3);
    tatethead.appendChild(tatetd4);

    tateTable.appendChild(tatethead);
    tateList.appendChild(tateTable);

    //2行目以降を入れる
    const criteriaInputRed = document.querySelector('#criteriaRed').value;
    const criteriaInputBlue = document.querySelector('#criteriaBlue').value;
    const criteriaInputYellow = document.querySelector('#criteriaYellow').value;
    const criteriaInputOrange = document.querySelector('#criteriaOrange').value;

    let criteriaTextRed = criteriaInputRed.match(/[^,\s]+/g);
    let criteriaTextBlue = criteriaInputBlue.match(/[^,\s]+/g);
    let criteriaTextYellow = criteriaInputYellow.match(/[^,\s]+/g);
    let criteriaTextOrange = criteriaInputOrange.match(/[^,\s]+/g);

    let redLength = 0;
    let blueLength = 0;
    let yellowLength = 0;
    let orangeLength = 0;

    if (criteriaTextRed) {
      redLength = criteriaTextRed.length;
    } else {
      criteriaTextRed = [];
    }

    if (criteriaTextBlue) {
      blueLength = criteriaTextBlue.length;
    } else {
      criteriaTextBlue = [];
    }

    if (criteriaTextYellow) {
      yellowLength = criteriaTextYellow.length;
    } else {
      criteriaTextYellow = [];
    }

    if (criteriaTextOrange) {
      orangeLength = criteriaTextOrange.length;
    } else {
      criteriaTextOrange = [];
    }

    const maxLength = Math.max(redLength, blueLength, yellowLength, orangeLength);

    while (redLength < maxLength) {
      criteriaTextRed.push("");
      redLength = redLength + 1;
    }

    while (blueLength < maxLength) {
      criteriaTextBlue.push("");
      blueLength = blueLength + 1;
    }

    while (yellowLength < maxLength) {
      criteriaTextYellow.push("");
      yellowLength = yellowLength + 1;
    }

    while (orangeLength < maxLength) {
      criteriaTextOrange.push("");
      orangeLength = orangeLength + 1;
    }

    for (let i = 0; i < maxLength; i++) {
      const row = document.createElement("tr");
      const cellText1 = document.createElement("td");
      const cellText2 = document.createElement("td");
      const cellText3 = document.createElement("td");
      const cellText4 = document.createElement("td");

      //第1列
      cellText1.innerHTML = criteriaTextRed.at(i);
      row.appendChild(cellText1);

      //第2列
      cellText2.innerHTML = criteriaTextBlue.at(i);
      row.appendChild(cellText2);

      //第3列
      cellText3.innerHTML = criteriaTextYellow.at(i);
      row.appendChild(cellText3);

      //第4列
      cellText4.innerHTML = criteriaTextOrange.at(i);
      row.appendChild(cellText4);

      tatetbody.appendChild(row);
      tateTable.appendChild(tatetbody);
      tateList.appendChild(tateTable);
    }
  }

  //アコーディオンメニュー
  document.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelectorAll('.js-accordion-title');
    for (let i = 0; i < title.length; i++) {
      let titleEach = title[i];
      let content = titleEach.nextElementSibling;
      titleEach.addEventListener('click', () => {
        titleEach.classList.toggle('is-active');
        content.classList.toggle('is-open');
      });
    }
  });

  //スマホ操作時のナビゲーション
  document.querySelector('#hamburger').addEventListener('click', () => {
    const nav = document.querySelector('.sp-nav');
    nav.classList.toggle('toggle');
  });

  document.querySelector('.close').addEventListener('click', () => {
    const nav = document.querySelector('.sp-nav');
    nav.classList.toggle('toggle');
  });

}