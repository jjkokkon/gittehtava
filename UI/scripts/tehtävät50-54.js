$(function () {
    haeTyypit();
    $('#haeTiedotBtn').click(function () {

        fetch();
    });

    $("#lisaaAsiakas").dialog({

        autoOpen: false,
        modal: true,
        buttons: {

            "Tallenna": function () {
                if (true) {
                    $.post(
                            "http://127.0.0.1:3002/Asiakas",
                            ($("#formLisaaAsiakas").serialize()),
                        )
                        // jos asiakkaan lisäys onnistuu
                        .done(function (msg) {
                            $("#lisaaAsiakas").dialog("close");
                            fetch();
                            console.log("Lisäys tietokantaan onnistui!");
                       //     console.log(msg);
                        })
                        // jos asiakkaan lisäys ei onnistu, serveriltä tulee virheviesti
                        .fail(function (xhr) {
                            console.log("Lisäys tietokantaan epäonnistui");
                            alert(xhr.responseText);  // back-endiltä tuleva virheviesti
                        });;

                }
            },
            "Poistu": function () {
                $("#lisaaAsiakas").dialog("close");
            }
        }
    });

    $("#lisaaBtn").click(function () {
        $("#dNimi").val("");
        $("#dOsoite").val("");
        $("#dPostinro").val("");
        $("#dPostipaikka").val("");
        $("#dAsTyypit").val("1");
        $("#lisaaAsiakas").dialog("open");
    });
});

function haeTyypit() {
    $.get(
        "http://127.0.0.1:3002/Types",
        function (data, status, xhr) {
            $("#astyHaku").append('<option value="-1">Kaikki asiakastyypit</option>');

            // optio lisätä tunnukseton (-1) asiakas
            // $("#dAsTyypit").append('<option value="-1">Tunnukseton</option>');

            $.each(data, function (index, data) {
                $("#astyHaku").append('<option value="' + data.Avain + '">' +
                    data.Selite + " " + data.Lyhenne + "</option>");

                $("#dAsTyypit").append('<option value="' + data.Avain + '">' +
                    data.Selite + " " + data.Lyhenne + "</option>");
            });
        })
}

function fetch() {
    let nimiArvo = $("#nimiHaku").val();
    let osoiteArvo = $("#osoiteHaku").val();
    let astyArvo = $("#astyHaku").val();

    let query = "";
    if (nimiArvo != "")
        query += "Nimi=" + nimiArvo + "&";
    if (osoiteArvo != "")
        query += "Osoite=" + osoiteArvo + "&";
    if (astyArvo != "-1")
        query += "asty_avain=" + astyArvo;
    //  console.log(query);
    $.get(
        "http://127.0.0.1:3002/Asiakas?" + query,

        function (data, status, xhr) {

            var asiakasData = "";
            $('#table').empty();
            asiakasData += '<tr>';
            asiakasData += '<th>' + 'Avain' + '</th>';
            asiakasData += '<th>' + 'Nimi' + '</th>';
            asiakasData += '<th>' + 'Osoite' + '</th>';
            asiakasData += '<th>' + 'Postinumero' + '</th>';
            asiakasData += '<th>' + 'Postipaikka' + '</th>';
            asiakasData += '<th>' + 'Luontipvm' + '</th>';
            asiakasData += '<th>' + 'As. tyyppi' + '</th>';
            asiakasData += '</tr>';

            $.each(data, function (index, data) {
                asiakasData += '<tr>'
                asiakasData += '<td>' + data.Avain + '</td>';
                asiakasData += '<td>' + data.Nimi + '</td>';
                asiakasData += '<td>' + data.Osoite + '</td>';
                asiakasData += '<td>' + data.Postinro + '</td>';
                asiakasData += '<td>' + data.Postitmp + '</td>';
                asiakasData += '<td>' + data.Luontipvm + '</td>';
                asiakasData += '<td>' + data.asty_avain + '</td>';
                asiakasData += '<td><button onclick="poista(' + data.Avain + ')">' + 'Poista' +
                    '</button></td>';
                asiakasData += '</tr>'
            });
            $('#table').append(asiakasData);
        })
}

function poista(id) {

    let result = null;

    $.ajax({
        url: 'http://127.0.0.1:3002/asiakas/' + id,
        method: 'DELETE'

    }).done(function (data, textStatus, jqXHR) {
        result = data;
        // console.log("result: ", data);
        // console.log("status code: ", jqXHR.status);
        fetch();

    }).fail(function (jqXHR, textStatus, errorThrown) {

        console.log("Poistaminen epäonnistui: " + errorThrown);
    });

    return result;
}

// Kirjaudu ulos -button, vanilla-javascriptiä
document.getElementById("logoutBtn").addEventListener("click", function () {
    // kutsutaan get:llä logout-urlia, jolloin poistetaan keksi ja ohjataan serverin alkusivulle
    const Http = new XMLHttpRequest();
    const url = 'http://127.0.0.1:3002/logout';
    Http.open("GET", url);
    Http.send();

    window.open("http://127.0.0.1:3002/", "_self");

    alert('Keksi poistettu ja kirjauduttu ulos!');
});