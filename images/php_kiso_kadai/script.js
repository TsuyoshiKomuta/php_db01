$(function () {
    const details = {
        "person-A": {
            name: "トラ",
            assets: "土地：100%、建物：100%",
            liabilities: "200万円",
            memo: "メモ内容"
        },
        "person-B": {
            name: "ネコ",
            assets: "",
            liabilities: "",
            memo: ""
        },
        "person-C": {
            name: "カバ",
            assets: "",
            liabilities: "",
            memo: ""
        },
        "person-D": {
            name: "ヒヨコ",
            assets: "",
            liabilities: "",
            memo: ""
        },
        "person-F": {
            name: "サル",
            assets: "",
            liabilities: "",
            memo: ""
        },
        "person-E": {
            name: "トリ",
            assets: "",
            liabilities: "",
            memo: ""
        }
    };

    const recipients = {
        "person-B": 'ネコ',
        "person-C": 'カバ',
        "person-D": 'ヒヨコ',
        "person-F": 'サル'
    };

    // トラの初期財産
    let initialAssets = {
        land: 100,
        building: 100
    };
    console.log("Initial assets (land):", initialAssets["land"]);
    console.log("Initial assets (building):", initialAssets["building"]);

    // 分配結果を各相続人に反映
    distributions.forEach(distribution => {
        const recipient = distribution['Recipient'];
        if (recipients[recipient]) {
            const assetText = distribution['Asset Name'] + '：' + distribution['Percentage'] + '%';
            details[recipient].assets += assetText + '<br>';
        }
        // トラの財産を減らす
        if (distribution['Asset Name'] === '土地') {
            initialAssets["land"] -= parseFloat(distribution['Percentage']);
        } else if (distribution['Asset Name'] === '建物') {
            initialAssets["building"] -= parseFloat(distribution['Percentage']);
        }
    });

    // トラの財産を更新
    $('#assets').html('土地：' + initialAssets["land"] + '%、建物：' + initialAssets["building"] + '%');

    // 詳細情報の表示
    $(".circle").click(function () {
        const personId = $(this).attr("id");
        console.log("Clicked person ID:", personId); // デバッグ用
        if (personId && details[personId]) {
            $("#name").text(details[personId].name || personId);
            $("#assets").html(details[personId].assets || '');
            $("#liabilities").text(details[personId].liabilities || '');
            $("#memo").text(details[personId].memo || '');
            $("#details").show();
        }
    });

    // 詳細表示のドラッグ関連の変数
    let isDragging = false;
    let offset = { x: 0, y: 0 };
    
    // ドラッグ開始
    $(".details").on('mousedown', function (e) {
        isDragging = true;
        offset.x = e.clientX - $(this).offset().left;
        offset.y = e.clientY - $(this).offset().top;
        $(this).addClass('draggable');
    });

    // ドラッグ中の処理
    $(document).on('mousemove', function (e) {
        if (isDragging) {
            $(".draggable").css({
                top: e.clientY - offset.y,
                left: e.clientX - offset.x,
            });
        }
    });

    // ドラッグ終了時の処理
    $(document).on('mouseup', function () {
        if (isDragging) {
            isDragging = false;
            $(".draggable").removeClass('draggable');
        }
    });

    // フォームの送信時の処理
    $('#asset-distribution-form').submit(function (event) {
        event.preventDefault();
        const landPercentage = parseFloat($('input[name="land_percentage"]').val()) || 0;
        const buildingPercentage = parseFloat($('input[name="building_percentage"]').val()) || 0;
        
        // 各資産の残りの割合を計算
        const remainingLand = initialAssets["land"] - landPercentage;
        const remainingBuilding = initialAssets["building"] - buildingPercentage;
        
        if (remainingLand < 0 || remainingBuilding < 0) {
            alert('合計が100％を超えています。');
            return;
        }

        // トラの財産を更新
        initialAssets["land"] = remainingLand;
        initialAssets["building"] = remainingBuilding;
        $('#assets').html('土地：' + initialAssets["land"] + '%、建物：' + initialAssets["building"] + '%');

        // 受取人の詳細に反映
        const landRecipient = $('#land_recipient').val();
        const buildingRecipient = $('#building_recipient').val();

        details[landRecipient].assets += '土地：' + landPercentage + '%<br>';
        details[buildingRecipient].assets += '建物：' + buildingPercentage + '%<br>';

        // エラーメッセージをクリア
        $('#error-message').text('');

        // データをサーバーに送信してCSVに保存
        $.post('submit_distribution.php', {
            land_percentage: landPercentage,
            land_recipient: landRecipient,
            building_percentage: buildingPercentage,
            building_recipient: buildingRecipient
        }).done(function (response) {
            console.log('保存されました:', response);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log('保存に失敗しました:', textStatus, errorThrown);
        });
    });
});