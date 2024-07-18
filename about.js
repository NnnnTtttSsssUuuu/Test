`use strict`;

{

  // チェックボタン押下の処理
  document.querySelector('#checkButton').addEventListener('click', () => {
    const inputText = document.querySelector('#input').value;
    const outputText = document.querySelector('#output');
    const chuukiText = document.querySelector('#chuuki');
    const criteriaInputRed = document.querySelector('#criteriaRed').value;
    const criteriaInputYellow = document.querySelector('#criteriaYellow').value;
    const criteriaInputBlue = document.querySelector('#criteriaBlue').value;
    outputText.textContent = "";
    chuukiText.textContent = "";
    let countRed, countYellow, countBlue = {};

    const allList = document.getElementById("criteriaList");
    const yellowList = document.getElementById("criteriaYellowList");
    allList.textContent = "";
    yellowList.textContent = "";

    //検索ワードの取得
    const criteriaTextRed = criteriaInputRed.match(/\S+/g);
    const criteriaTextYellow = criteriaInputYellow.match(/\S+/g);
    const criteriaTextBlue = criteriaInputBlue.match(/\S+/g);


    let redMax = 0;
    let blueMax = 0;

    if (criteriaTextRed) {
      redMax = criteriaTextRed.length;
    }

    if (criteriaTextBlue) {
      blueMax = criteriaTextBlue.length;
    }

    const criteriaMax = Math.max(redMax, blueMax);
    const redPlus = new Array(criteriaMax - redMax);
    const bluePlus = new Array(criteriaMax - blueMax);

    // console.log("criteriaTextRed", criteriaTextRed, "criteriaTextBlue", criteriaTextBlue, "criteriaMax", criteriaMax, "redPlus", redPlus, "bluePlus", bluePlus);

    let criteriaTextRed2 = new Array(criteriaMax);
    let criteriaTextBlue2 = new Array(criteriaMax);

    if (criteriaTextRed) {
      criteriaTextRed2 = criteriaTextRed.concat(redPlus);
    }

    if (criteriaTextBlue) {
      criteriaTextBlue2 = criteriaTextBlue.concat(bluePlus);
    }

    // console.log("cretiriaMax", criteriaMax, "redMax", redMax, "blueMax", blueMax);
    // console.log("検索ワード 赤＝", criteriaTextRed2, "青＝", criteriaTextBlue2, "黄＝", criteriaTextYellow);

    countRed = new Array(criteriaMax);
    countRed.fill(0);
    countBlue = new Array(criteriaMax);
    countBlue.fill(0);

    if (criteriaTextYellow) {
      countYellow = new Array(criteriaTextYellow.length);
      countYellow.fill(0);
    }

    //テキストとの照合
    for (let i = 0; i < inputText.length; i++) {
      let c = inputText.substring(i, i + 1);
      let klass = [];
      let checked = "";


      //改行処理
      if (c === "\n") {
        outputText.insertAdjacentHTML('beforeend', '<br>');
        continue;
      }

      //色付け
      if (criteriaTextRed) {
        criteriaTextRed.forEach((value, index) => {
          if (inputText.startsWith(value, i) && checked === "") {
            c = value;
            i = i + value.length - 1;
            klass.push("akaami");
            checked = "check";
            let checkit = countRed.at(index);
            countRed.fill(checkit + 1, index, index + 1);

          }
        });
      }

      if (criteriaTextBlue) {
        criteriaTextBlue.forEach((value, index) => {
          if (inputText.startsWith(value, i) && checked === "") {
            c = value;
            i = i + value.length - 1;
            klass.push("aoami");
            checked = "check";
            let checkit = countBlue.at(index);
            countBlue.fill(checkit + 1, index, index + 1);
          }
        });
      }

      if (criteriaTextYellow) {
        criteriaTextYellow.forEach((value, index) => {
          if (inputText.startsWith(value, i) && checked === "") {
            c = value;
            i = i + value.length - 1;
            klass.push("kiami");
            checked = "check";
            let checkit = countYellow.at(index);
            countYellow.fill(checkit + 1, index, index + 1);

          }
        });
      }

      let spanElement = document.createElement("span");
      spanElement.textContent = c;
      spanElement.className = klass;
      outputText.appendChild(spanElement);
    }
    // ループ終わり

    console.log("outputText", outputText);
    // console.log("countRed", countRed);

    //表を入れる
    //  const allList = document.getElementById("criteriaList")[0];
    const allTable = document.createElement("table");
    const alltbody = document.createElement("tbody");
    const alltr = document.createElement("tr"); //tr=table row　表の行
    const alltd5 = document.createElement("td"); //th=table haeder　表の見出し
    const alltd1 = document.createElement("td"); //td=tabel data　表の内容
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
    // if (criteriaInputRed && criteriaInputBlue) {

    for (let i = 0; i < criteriaMax; i++) {

      if (countRed.at(i) + countBlue.at(i) > 0) {

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
        cellText1.innerHTML = criteriaTextRed2.at(i);
        row.appendChild(cellText1);

        //第3列
        cellText2.innerHTML = countRed.at(i);
        row.appendChild(cellText2);

        //第4列
        cellText3.innerHTML = criteriaTextBlue2.at(i);
        row.appendChild(cellText3);

        //第5列
        cellText4.innerHTML = countBlue.at(i);


        row.appendChild(cellText4);
        alltbody.appendChild(row);
        allTable.appendChild(alltbody);
        allList.appendChild(allTable);

      }
      // console.log("row", i, row);
    }
    // }
    // else{alert("修正検討ワードと推奨候補ワードは、空欄不可です")}
    // console.log("allList2", allList);



    //黄色ワードの表を入れる
    const yellowTable = document.createElement("table");
    const yellowtbody = document.createElement("tbody");
    const yellowtr = document.createElement("tr"); //tr=table row　表の行
    const yellowtd1 = document.createElement("td"); //td=tabel data　表の内容
    const yellowtd2 = document.createElement("td");
    const yellowtd3 = document.createElement("td");

    yellowtd1.textContent = "No.";
    yellowtd2.textContent = "要検討ワード";
    yellowtd3.textContent = "出現数";


    yellowtr.appendChild(yellowtd1);
    yellowtr.appendChild(yellowtd2);
    yellowtr.appendChild(yellowtd3);


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
          // const cellText3 = document.createElement("td");


          cell.textContent = i + 1;
          row.appendChild(cell);

          //第2列
          cellText1.innerHTML = criteriaTextYellow.at(i);
          row.appendChild(cellText1);

          //第3列
          cellText2.innerHTML = countYellow.at(i);
          row.appendChild(cellText2);



          // row.appendChild(cellText4);
          yellowtbody.appendChild(row);
          yellowTable.appendChild(yellowtbody);
          yellowList.appendChild(yellowTable);

        }
        // console.log("row", i, row);
      }
    }
    // console.log("allList2", allList);



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
    document.getElementById('criteriaRed').value = '';
    document.getElementById('criteriaYellow').value = '';
    document.getElementById('criteriaBlue').value = '';
  });

  //検索ワードの保存
  document.querySelector('#saveCriteriaButton').addEventListener('click', () => {
    const criteriaInputRed = document.querySelector('#criteriaRed').value;
    const criteriaInputYellow = document.querySelector('#criteriaYellow').value;
    const criteriaInputBlue = document.querySelector('#criteriaBlue').value;

    const text = '●赤字:' + criteriaInputRed + '\n●青字:' + criteriaInputBlue + '\n●黄色字:' + criteriaInputYellow;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "表記チェッカー検索ワード.txt";
    a.click();
    URL.revokeObjectURL(url);
  });

  //検索ワードの読み込み
  const fileInput = document.getElementById('fileInput');
  const fileContent = document.getElementById('fileContent');

  fileInput.addEventListener('change', (e) => {

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      fileContent.textContent = reader.result;


      console.log(fileContent);
      const newCriteria = fileContent;
      console.log("fileContent,newCriteria,reader",newCriteria.value);

    };
    reader.readAsText(file);









    // const redNew = fileContent.match(/:.+●/);
    // document.getElemenntById('criteriaTextRed').value = redNew;

    //  /:.+●/
    //  /:.+$/




  })


}



