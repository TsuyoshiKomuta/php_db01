<!DOCTYPE html>
<html lang='ja'>

<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>そうぞくMAP</title>
    <link rel='stylesheet' href='styles.css'>
    <link rel='stylesheet' href='https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css'>
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

    <div id="circular-menu" class="circular-menu">
        <div class="menu-item" id="menu-details">詳細</div>
        <div class="menu-item" id="menu-input">入力</div>
        <div class="menu-item" id="menu-family">家族</div>
    </div>

    <!-- 入力フォーム -->
    <div id="input-form" class="details">
        <h2>入力</h2>
        <form id="asset-input-form">
            <div class="asset">
                <label>名前：</label>
                <input type="text" id="name" name="name" required>
            </div>
            <div class="asset">
                <label>住所：</label>
                <input type="text" id="address" name="address" required>
            </div>
            <div class="asset">
                <label>生年月日：</label>
                <input type="date" id="birth_date" name="birth_date" required>
            </div>
            <div class="asset">
                <label>死亡年月日：</label>
                <input type="date" id="death_date" name="death_date">
            </div>
            <div class="asset">
                <label>土地：</label>
                <input type="text" id="land" name="land">
            </div>
            <div class="asset">
                <label>建物：</label>
                <input type="text" id="building" name="building">
            </div>
            <div class="asset">
                <label>預貯金：</label>
                <input type="number" id="money" name="money">
            </div>
            <button type="submit">保存</button>
        </form>
    </div>

    <!-- 詳細表示 -->
    <div id="details" class="details">
        <h2 id="details-title">詳細</h2>
        <p>名前：<span id="details-name"></span></p>
        <p>住所：<span id="details-address"></span></p>
        <p>生年月日：<span id="details-birth-date"></span></p>
        <p>死亡年月日：<span id="details-death-date"></span></p>
        <p>土地：<span id="details-land"></span></p>
        <p>建物：<span id="details-building"></span></p>
        <p>預貯金：<span id="details-money"></span></p>
        <p>法定相続分：</p>
        <ul>
            <li>ネコ：2分の1</li>
            <li>トリ：なし</li>
            <li>サル：6分の1</li>
            <li>カバ：6分の1</li>
            <li>ヒヨコ：6分の1</li>
        </ul>
    </div>

    <!-- フッター -->
    <footer>
        © 2024 com-office.
    </footer>

    <!-- jquery読み込み -->
    <script src='https://code.jquery.com/jquery-3.7.1.min.js'></script>
    <script src='https://code.jquery.com/ui/1.12.1/jquery-ui.min.js'></script>
    <script src='script.js'></script>
</body>

</html>