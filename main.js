`use strict`;

{

  let criteriaTextRed = [];
  let criteriaTextBlue = [];
  let criteriaTextYellow = [];
  let criteriaTextOrange = [];
  let criteriaCSV = [];

  //立ち上げ時の処理
  // document.addEventListener("DOMContentLoaded", displayTateList());

  document.addEventListener("DOMContentLoaded", function () {
    const criteriaInputFileName = document.getElementById('criteriaInputFileName');
    const openCriteriaFile = criteriaInputFileName.textContent;
    fetch(openCriteriaFile)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok" + response.statusText);
        }
        return response.text();
      })
      .then(data => {
        let openCriteria = data;
        criteriaCSV = openCriteria;
        yomikomi2(openCriteria);
        displayTateList();
      })
      .catch(error => {
        console.error("fetchの動作に問題があります:", error);
        alert("立ち上げ時に使用する検索ワードファイルが見つかりません");
      });
  });


  // チェックボタン押下の処理
  document.querySelector('#checkButton').addEventListener('click', () => {

    const inputText = document.querySelector('#input').value;
    const outputText = document.querySelector('#output');
    const chuukiText = document.querySelector('#chuuki');
    outputText.textContent = "";
    chuukiText.textContent = "";
    let countRed, countYellow, countBlue = [];

    const allList = document.getElementById("criteriaList");
    const yellowList = document.getElementById("criteriaYellowList");
    allList.textContent = "";
    yellowList.textContent = "";


    //検索ワードの取得
    let redLength = criteriaTextRed.length;
    let blueLength = criteriaTextBlue.length;
    let yellowLength = criteriaTextYellow.length;
    let orangeLength = criteriaTextOrange.length;
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
      countYellow = new Array(yellowLength);
      countYellow.fill(0);
    }

    //テキストとの照合
    for (let i = 0; i < inputText.length; i++) {
      let c = inputText.substring(i, i + 1);
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
          if (inputText.startsWith(value, i) && checked === "" && value.length > 0) {
            c = value;
            i = i + value.length - 1;
            klass.push("akaami note-container");
            checked = "check";
            let checkit = countRed[index];
            countRed.fill(checkit + 1, index, index + 1);
            chuki = "▶︎" + criteriaTextBlue[index];
          }
        });
      }


      if (criteriaTextBlue) {
        criteriaTextBlue.forEach((value, index) => {
          if (inputText.startsWith(value, i) && checked === "" && value.length > 0) {
            c = value;
            i = i + value.length - 1;
            klass.push("aoami note-container");
            checked = "check";
            let checkit = countBlue[index];
            countBlue.fill(checkit + 1, index, index + 1);
            chuki = "◀︎" + criteriaTextRed[index];
          }
        });
      }

      if (criteriaTextYellow) {
        criteriaTextYellow.forEach((value, index) => {
          if (inputText.startsWith(value, i) && checked === "" && value.length > 0) {
            c = value;
            i = i + value.length - 1;
            klass.push("kiami note-container");
            checked = "check";
            let checkit = countYellow[index];
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
    const allhead = document.createElement("thead");
    const alltbody = document.createElement("tbody");
    const alltr = document.createElement("tr");
    const alltd1 = document.createElement("th");
    const alltd2 = document.createElement("th");
    const alltd3 = document.createElement("th");
    const alltd4 = document.createElement("th");
    const alltd5 = document.createElement("th");

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

    allhead.appendChild(alltr);
    allTable.appendChild(allhead);
    allList.appendChild(allTable);
    

    //2行目以降を入れる
    for (let i = 0; i < maxLength; i++) {

      // if (countRed[i] + countBlue[i] > 0) {
      if (countRed[i] > 0) {
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
        cellText1.innerHTML = criteriaTextRed[i];
        row.appendChild(cellText1);

        //第3列
        cellText2.innerHTML = countRed[i];
        row.appendChild(cellText2);

        //第4列
        cellText3.innerHTML = criteriaTextBlue[i];
        row.appendChild(cellText3);

        //第5列
        cellText4.innerHTML = countBlue[i];

        row.appendChild(cellText4);
        alltbody.appendChild(row);
        allTable.appendChild(alltbody);
        allList.appendChild(allTable);

      }
    }

    //黄色ワードの表を入れる
    const yellowTable = document.createElement("table");
    const yellowhead = document.createElement("thead");
    const yellowtbody = document.createElement("tbody");
    const yellowtr = document.createElement("tr");
    const yellowtd1 = document.createElement("th");
    const yellowtd2 = document.createElement("th");
    const yellowtd3 = document.createElement("th");
    const yellowtd4 = document.createElement("th");

    yellowtd1.textContent = "No.";
    yellowtd2.textContent = "要検討ワード";
    yellowtd3.textContent = "出現数";
    yellowtd4.textContent = "注記";

    yellowtr.appendChild(yellowtd1);
    yellowtr.appendChild(yellowtd2);
    yellowtr.appendChild(yellowtd3);
    yellowtr.appendChild(yellowtd4);

    yellowhead.appendChild(yellowtr);
    yellowTable.appendChild(yellowhead);
    yellowList.appendChild(yellowTable);

    //2行目以降を入れる
    // if (criteriaInputYellow) {

      for (let i = 0; i < criteriaTextYellow.length; i++) {

        if (countYellow[i] > 0) {
          const row = document.createElement("tr");

          //第1列
          const cell = document.createElement("td");
          const cellText1 = document.createElement("td");
          const cellText2 = document.createElement("td");
          const cellText3 = document.createElement("td");

          cell.textContent = i + 1;
          row.appendChild(cell);

          //第2列
          cellText1.innerHTML = criteriaTextYellow[i];
          row.appendChild(cellText1);

          //第3列
          cellText2.innerHTML = countYellow[i];
          row.appendChild(cellText2);

          //第4列
          cellText3.innerHTML = criteriaTextOrange[i];
          
          row.appendChild(cellText3);
          // row.appendChild(cellText4);
          yellowtbody.appendChild(row);
          yellowTable.appendChild(yellowtbody);
          yellowList.appendChild(yellowTable);
        }
      }
    // }
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

    const criteriaInputFileName = document.getElementById('criteriaInputFileName');
    criteriaInputFileName.textContent = "";

    const titleList = document.querySelector('.titleList');
    titleList.style.display = 'none';

    const tateList = document.getElementById('tateList');
    tateList.textContent = "";

  });


  //検索ワードの保存
  document.querySelector('#saveCriteriaButton').addEventListener('click', () => {
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]) //ここでUTF-8を指定
    const blob = new Blob([bom, criteriaCSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "表記チェッカー検索ワード.csv";
    a.click();
    URL.revokeObjectURL(url);
  });


  //検索ワードの読み込み
  const fileInput = document.getElementById('fileInput');
  const criteriaInputFileName = document.getElementById('criteriaInputFileName');

  document.getElementById('toFileInput').addEventListener("click", () => {
    document.getElementById("fileInput").click();
  });

  fileInput.addEventListener('change', (e) => {
    criteriaTextRed = [];
    criteriaTextBlue = [];
    criteriaTextYellow = [];
    criteriaTextOrange = [];
    criteriaCSV = [];
  
    const file = e.target.files[0];
    const reader = new FileReader();
    const criteriaInputFile = fileInput.files;

    const titleList = document.querySelector('.titleList');
    titleList.style.display = 'inline';

    criteriaInputFileName.textContent = criteriaInputFile[0].name;

    if (file.type === "text/csv") {
      if (file.size < 100000) {
        reader.onload = () => {
          let shinCriteria = reader.result;
          shinCriteria = shinCriteria.replace(/[ 　]/g, "");
          shinCriteria = shinCriteria.replace(/\n,*$/g, "");
          yomikomi2(shinCriteria);

          const tateList = document.getElementById("tateList");
          tateList.textContent = "";
          displayTateList();
          criteriaCSV = shinCriteria;
        };
        reader.readAsText(file);
      } else { alert("ファイルが大きすぎます。100KB以下に抑えてください"); }
    } else { alert("CSVファイルではありません"); }
  }, false)


  //検索ワード読み込み関数
  function yomikomi2(shinCriteria) {
    const rows = shinCriteria.split('\n');
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(',');
      criteriaTextRed[i] = row[0];
      criteriaTextBlue[i] = row[1];
      criteriaTextYellow[i] = row[2];
      criteriaTextOrange[i] = row[3];
    }
  }


  //縦型リストの作成
  function displayTateList() {
    const tateList = document.getElementById("tateList");
    const tateTable = document.createElement("table");
    const tatethead = document.createElement("thead");
    const tatetbody = document.createElement("tbody");
    const tatetd1 = document.createElement("th");
    const tatetd2 = document.createElement("th");
    const tatetd3 = document.createElement("th");
    const tatetd4 = document.createElement("th");

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
    let redLength = criteriaTextRed.length;
    let blueLength = criteriaTextBlue.length;
    let yellowLength = criteriaTextYellow.length;
    let orangeLength = criteriaTextOrange.length;
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

    for (let i = 1; i < maxLength; i++) {
      const row = document.createElement("tr");
      const cellText1 = document.createElement("td");
      const cellText2 = document.createElement("td");
      const cellText3 = document.createElement("td");
      const cellText4 = document.createElement("td");

      //第1列
      cellText1.innerHTML = criteriaTextRed[i];
      row.appendChild(cellText1);

      //第2列
      cellText2.innerHTML = criteriaTextBlue[i];
      row.appendChild(cellText2);

      //第3列
      cellText3.innerHTML = criteriaTextYellow[i];
      row.appendChild(cellText3);

      //第4列
      cellText4.innerHTML = criteriaTextOrange[i];
      row.appendChild(cellText4);

      tatetbody.appendChild(row);
      tateTable.appendChild(tatetbody);
      tateList.appendChild(tateTable);
    }
  }

  //クレジット
  document.querySelector('.qqq').addEventListener('click', () => {
    const qualityCenter = document.getElementById("qualityCenter");
    qualityCenter.style.display = "flex";
  });

  document.querySelector('#qualityCenter').addEventListener('click', () => {
    const qualityCenter = document.getElementById("qualityCenter");
    qualityCenter.style.display = "none";
  });

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