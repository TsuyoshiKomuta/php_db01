$(function () {
    // キャラクターごとのデフォルトデータ
    const defaultData = {
        "person-A": {
            name: "トラ",
            address: "福岡市",
            birth_date: "1973-01-01",
            death_date: "",
            land: "",
            building: "",
            money: ""
        },
        "person-B": {
            name: "ネコ",
            address: "福岡市",
            birth_date: "1973-02-01",
            death_date: "",
            land: "",
            building: "",
            money: ""
        },
        "person-C": {
            name: "カバ",
            address: "東京都",
            birth_date: "2007-01-01",
            death_date: "",
            land: "",
            building: "",
            money: ""
        },
        "person-D": {
            name: "ヒヨコ",
            address: "福岡市",
            birth_date: "2009-01-01",
            death_date: "",
            land: "",
            building: "",
            money: ""
        },
        "person-E": {
            name: "トリ",
            address: "大阪市",
            birth_date: "1973-03-01",
            death_date: "",
            land: "",
            building: "",
            money: ""
        },
        "person-F": {
            name: "サル",
            address: "神戸市",
            birth_date: "2005-01-01",
            death_date: "",
            land: "",
            building: "",
            money: ""
        }
    };

    let selectedCharacterId = null;

    // 円形メニューの表示
    $('.circle').on('click', function (event) {
        event.stopPropagation(); // イベントのバブリングを防ぐ
        const characterPosition = $(this).offset();
        $('#circular-menu').css({
            top: characterPosition.top + $(this).height() / 2 - $('#circular-menu').height() / 2,
            left: characterPosition.left + $(this).width() / 2 - $('#circular-menu').width() / 2
        }).show();
        selectedCharacterId = $(this).attr('id'); // 選択されたキャラクターのIDを保存
    });

    // メニュー外をクリックしたら非表示にする
    $(document).on('click', function (event) {
        if (!$(event.target).closest('.circle, #circular-menu').length) {
            $('#circular-menu').hide();
        }
    });

    // 入力メニューのクリックイベント
    $('#menu-input').on('click', function () {
        $('#circular-menu').hide();
        const characterData = defaultData[selectedCharacterId];
        $('#name').val(characterData.name);
        $('#address').val(characterData.address);
        $('#birth_date').val(characterData.birth_date);
        $('#death_date').val(characterData.death_date);
        $('#land').val(characterData.land);
        $('#building').val(characterData.building);
        $('#money').val(characterData.money);
        $('#input-form').dialog({
            modal: true,
            draggable: true,
            width: 400,
            title: "入力"
        });
    });

    // 詳細メニューのクリックイベント
    $('#menu-details').on('click', function () {
        $('#circular-menu').hide();
        $.ajax({
            url: 'get_details.php', // サーバーサイドのスクリプトのURL
            method: 'GET',
            data: { id: selectedCharacterId },
            dataType: 'json',
            success: function (data) {
                $('#details-name').text(data.name);
                $('#details-address').text(data.address);
                $('#details-birth-date').text(data.birth_date);
                $('#details-death-date').text(data.death_date);
                $('#details-land').text(data.land);
                $('#details-building').text(data.building);
                $('#details-money').text(data.money);
                $('#details').dialog({
                    modal: true,
                    draggable: true,
                    width: 400,
                    title: "詳細"
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('詳細情報の取得に失敗しました:', textStatus, errorThrown);
            }
        });
    });

    // フォームの送信イベント
    $('#asset-input-form').on('submit', function (event) {
        event.preventDefault();
        const formData = $(this).serialize() + "&id=" + selectedCharacterId;

        // サーバーにデータを送信
        $.ajax({
            url: 'create.php', // サーバーサイドのスクリプトのURL
            method: 'POST',
            data: formData,
            success: function (response) {
                alert('データが保存されました。');
                $('#input-form').dialog('close');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('データの保存に失敗しました:', textStatus, errorThrown);
            }
        });
    });
});
