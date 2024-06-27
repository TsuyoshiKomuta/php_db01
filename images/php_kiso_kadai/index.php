<?php
$csvFile = 'asset_distribution.csv';
$distributions = [];

// CSVファイルが存在する場合のみデータを読み込む
if (file_exists($csvFile)) {
    if (($handle = fopen($csvFile, 'r')) !== FALSE) {
        // ヘッダー行をスキップ
        fgetcsv($handle);
        while (($data = fgetcsv($handle, 1000, ',')) !== FALSE) {
            $distributions[] = [
                'Asset Name' => $data[0],
                'Percentage' => $data[1],
                'Recipient' => $data[2]
            ];
        }
        fclose($handle);
    }
}
?>
<!DOCTYPE html>
<html lang='ja'>

<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>そうぞくMAP</title>
    <link rel='stylesheet' href='./styles.css'>
</head>

<body>
    <!-- ヘッダー -->
    <header class='header'>
        <div class='logo'>
            <a href='index.php'><img src='images/logo_souzokumap.png' alt='そうぞくMAPロゴ'></a>
        </div>
        <nav class='nav-links'>
            <!-- ナビゲーションリンクをここに追加する -->
        </nav>
        <div class='nav-buttons'>
            <button class='logout-button'>ログアウト</button>
        </div>
    </header>

    <div class='container'>
        <div class='row'>
            <div class='circle-container'>
                <div class='circle e-person highlight-third' id='person-E'></div>
                <span class='label'>トリ</span>
            </div>

            <div class='dotted-line with-vertical-line'></div>
            <div class='circle-container'>
                <div class='circle a-person highlight-decedent' id='person-A'></div>
                <span class='label'>トラ</span>
            </div>
            <div class='marriage with-vertical-line'></div>
            <div class='circle-container'>
                <div class='circle b-person highlight-heir' id='person-B'></div>
                <span class='label'>ネコ</span>
            </div>
        </div>
        <div class='row'>
            <div class='spacer'></div>
            <div class='circle-container'>
                <div class='circle f-person highlight-heir' id='person-F'></div>
                <span class='label'>サル</span>
            </div>
            <div class='spacer' style='margin-right: 30px'></div>
            <div class='circle-container'>
                <div class='circle c-person highlight-heir' id='person-C' style='margin-left: 10px;'></div>
                <span class='label'>カバ</span>
            </div>
            <div class='circle-container'>
                <div class='circle d-person highlight-heir' id='person-D'></div>
                <span class='label'>ヒヨコ</span>
            </div>
        </div>
    </div>

    <div id='details' class='details'>
        <h2 id='name'>トラの情報</h2>
        <p>財産：<span id='assets'>土地：100%、建物：100%</span></p>
        <p>負債：<span id='liabilities'>200万円</span></p>
        <p>メモ：<span id='memo'>メモ内容</span></p>
        <form id='asset-distribution-form' method='POST'>
            <div class='asset'>
                <label>土地：</label>
                <input type='number' id='land_percentage' name='land_percentage' min='0' max='100' step='1' required>%
                <select id='land_recipient' name='land_recipient'>
                    <option value='person-B'>ネコ</option>
                    <option value='person-C'>カバ</option>
                    <option value='person-D'>ヒヨコ</option>
                    <option value='person-F'>サル</option>
                </select>
            </div>
            <div class='asset'>
                <label>建物：</label>
                <input type='number' id='building_percentage' name='building_percentage' min='0' max='100' step='1' required>%
                <select id='building_recipient' name='building_recipient'>
                    <option value='person-B'>ネコ</option>
                    <option value='person-C'>カバ</option>
                    <option value='person-D'>ヒヨコ</option>
                    <option value='person-F'>サル</option>
                </select>
            </div>
            <button type='submit'>財産を分配する</button>
        </form>
        <div id='error-message' class='error'></div>
    </div>

    <div id='person-B-details' class='details'>
        <h2>ネコの情報</h2>
        <p>財産：<span id='person-B-assets'></span></p>
    </div>

    <div id='person-C-details' class='details'>
        <h2>カバの情報</h2>
        <p>財産：<span id='person-C-assets'></span></p>
    </div>

    <div id='person-D-details' class='details'>
        <h2>ヒヨコの情報</h2>
        <p>財産：<span id='person-D-assets'></span></p>
    </div>

    <div id='person-F-details' class='details'>
        <h2>サルの情報</h2>
        <p>財産：<span id='person-F-assets'></span></p>
    </div>

    <!-- フッター -->
    <footer>
        © 2024 com-office.
    </footer>

    <!-- jquery読み込み -->
    <script src='https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js'></script>
    <script>
        const distributions = <?php echo json_encode($distributions); ?>;
    </script>
    <script src='script.js'></script>
</body>

</html>