$(function () {
    $("#submit-button").click(async function () {
        const consultation = $("#consultation").val();

        try {
            // GPTのAPIに相談内容を送信して要約を取得
            const summary = await getSummary(consultation);
            console.log(summary);

            // GPTのAPIで要約から法的に重要な単語を抽出
            const keywords = await getImportantKeywords(summary);
            console.log(keywords);

            // e-Govの法令取得APIから民法の全条文を取得
            const xmlDoc = await getCivilLawArticles();

            // 重要単語を使って関連条文を抽出
            let legalArticles = searchArticlesByKeywords(xmlDoc, keywords).slice(0, 3); // 3つに限定

            // GPTのAPIに関係条文を送信して回答を取得
            const response = await getResponse(summary, legalArticles.join("\n"));

            // 最終結果（法令を踏まえた回答と関係条文）を表示
            displayResult(legalArticles, response);

            // Firebaseに最終結果を保存できるボタンを追加
            addSaveButton(legalArticles, response);
        } catch (error) {
            console.error("Error during consultation process:", error);
            $("#result").html(`
                <p>エラーが発生しました。再度お試しください。</p>
            `);
        }
    });
});

async function getSummary(text) {
    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo-0125",
            messages: [
                { role: "system", content: "あなたは司法書士事務所のパラリーガルです。次のテキストを司法書士に渡すつもりで、法律用語を使って要約してください：" },
                { role: "user", content: text }
            ],
            max_tokens: 80
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer sk-proj-eBu0cVxmdnjzUwrEhBfIT3BlbkFJnICx9wc4YhL2RXL78yXO`
            }
        });
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error("Error getting summary:", error);
        throw error;
    }
}

async function getImportantKeywords(summary) {
    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "以下の要約から法的に重要な単語を3つ以内で抽出してください。" },
                { role: "user", content: summary }
            ],
            max_tokens: 60
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer sk-proj-eBu0cVxmdnjzUwrEhBfIT3BlbkFJnICx9wc4YhL2RXL78yXO`
            }
        });
        return response.data.choices[0].message.content.trim().split(',').slice(0, 3).map(word => word.trim());
    } catch (error) {
        console.error("Error getting important keywords:", error);
        throw error;
    }
}

async function getCivilLawArticles() {
    try {
        const lawNum = "明治二十九年法律第八十九号";
        const apiEndpoint = `https://elaws.e-gov.go.jp/api/1/lawdata/${encodeURIComponent(lawNum)}`;

        const response = await $.ajax({
            url: apiEndpoint,
            type: "GET",
            dataType: "text",
        });

        // デバッグのためにレスポンス全体をコンソールに出力
        console.log("APIレスポンス:", response);

        // XMLレスポンスをパース
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response, "application/xml");
        console.log("Parsed XML:", xmlDoc); // パース結果の出力

        return xmlDoc;

    } catch (error) {
        console.error("Error getting civil law articles:", error);
        throw error;
    }
}


function searchArticlesByKeywords(xmlDoc, keywords) {
    const articles = xmlDoc.getElementsByTagName("Article");
    const results = [];

    for (let article of articles) {
        const articleText = article.textContent;
        const matchesRange = articleText.match(/第([一二三四五六七八九十百千]+)条/);
        if (matchesRange) {
            const articleNumber = convertKanjiToNumber(matchesRange[1]);
            if (articleNumber >= 882 && articleNumber <= 1050) {
                for (let keyword of keywords) {
                    if (articleText.includes(keyword)) {
                        results.push(new XMLSerializer().serializeToString(article));
                        break; // 一度キーワードが見つかったら他のキーワードのチェックをスキップ
                    }
                }
            }
        }
    }

    // 結果をシャッフルしてランダムに取得し、3つに限定
    return shuffleArray(results).slice(0, 3);
}

function convertKanjiToNumber(kanji) {
    const kanjiMap = {
        '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
        '百': 100, '千': 1000
    };
    let number = 0;
    let temp = 0;

    for (let char of kanji) {
        if (char === '十') {
            temp = temp === 0 ? 10 : temp * 10;
        } else if (char === '百') {
            temp = temp === 0 ? 100 : temp * 100;
        } else if (char === '千') {
            temp = temp === 0 ? 1000 : temp * 1000;
        } else {
            temp += kanjiMap[char];
        }
    }
    number += temp;
    return number;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


// デバッグ用の関数追加
function logXMLContent(xmlDoc) {
    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(xmlDoc);
    console.log("Serialized XML Content: ", xmlString);
}

async function getLegalArticles(lawNum, keyword) {
    try {
        const apiEndpoint = `https://elaws.e-gov.go.jp/api/1/articles?lawNum=${encodeURIComponent(lawNum)}&keyword=${encodeURIComponent(keyword)}`;

        const response = await $.ajax({
            url: apiEndpoint,
            type: "GET",
            dataType: "text",
        });

        // デバッグのためにレスポンス全体をコンソールに出力
        console.log("APIレスポンス:", response);

        // XMLレスポンスをパース
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response, "application/xml");

        // LawContentsを抽出
        const articles = xmlDoc.getElementsByTagName("Article");
        let lawContents = [];
        for (let article of articles) {
            lawContents.push(new XMLSerializer().serializeToString(article));
        }

        if (lawContents.length > 0) {
            return lawContents;
        } else {
            throw new Error("法令の条文を取得できませんでした");
        }
    } catch (error) {
        console.error("Error getting legal articles:", error);
        throw error;
    }
}

async function getResponse(summary, legalArticles) {
    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo-0125",
            messages: [
                { role: "system", content: "次の法令条文に基づいて相談に対する回答を作成してください。400文字以内で回答してください。" },
                { role: "user", content: `要約: ${summary}\n\n関係条文: ${legalArticles}` }
            ],
            max_tokens: 250
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer sk-proj-eBu0cVxmdnjzUwrEhBfIT3BlbkFJnICx9wc4YhL2RXL78yXO`
            }
        });
        return response.data.choices[0].message.content.trim().replace(/（民法第[0-9]+条）/g, '');
    } catch (error) {
        console.error("Error getting response:", error);
        throw error;
    }
}

function displayResult(legalArticles, response) {
    const articlesHTML = legalArticles.map(article => `<p style="color: #000;">${article}</p>`).join('');
    console.log("Displaying articles: ", articlesHTML); // 追加のデバッグ出力
    $("#answer-container").html(`<h2>回答</h2><p style="color: #000;">${response}</p>`);
    $("#law-container").html(`<h3>関係する法令（参考）</h3><p style="color: #000;">${articlesHTML}</p>`);
}

function addSaveButton(legalArticles, response) {
    const saveButton = $("<button>保存</button>");
    saveButton.click(function () {
        saveToFirebase(legalArticles, response);
    });
    $("#result").append(saveButton);
}

async function saveToFirebase(legalArticles, response) {
    try {
        await addDoc(collection(db, "consultations"), {
            legalArticles: legalArticles,
            response: response,
            timestamp: serverTimestamp()
        });
        console.log("Document successfully written!");
    } catch (error) {
        console.error("Error writing document:", error);
    }
}