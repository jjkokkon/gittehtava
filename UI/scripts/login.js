// login.html sivun toiminnallisuutta, vanilla-javascriptiä

// Generoi keksi -buttonin toiminta
document.getElementById("generoiKeksi").addEventListener("click", function () {
    const Http = new XMLHttpRequest();
    const url = 'http://127.0.0.1:3002/setuser';
    Http.open("GET", url);
    Http.send();
    document.getElementById("naytaKeksi").innerHTML = "";
    alert('Keksi generoitu!');

});
// Poista keksi -buttonin toiminta
document.getElementById("poistaKeksi").addEventListener("click", function () {
    const Http = new XMLHttpRequest();
    const url = 'http://127.0.0.1:3002/logout';
    Http.open("GET", url);
    Http.send();
    document.getElementById("naytaKeksi").innerHTML = "";
    alert('Keksi poistettu!');
});

// Tarkasta keksi -buttonin toiminta
document.getElementById("tsekkaaKeksi").addEventListener("click", function () {
    fetch('http://127.0.0.1:3002/getuser')
        .then(res => res.json())
        .then((out) => {
            console.log('Output: ', out);
            if (JSON.stringify(out) == "{}"){
                document.getElementById("naytaKeksi").style.color = "red";
                document.getElementById("naytaKeksi").innerHTML = "Keksiä ei löydetty";
            }
            else{
                 document.getElementById("naytaKeksi").innerHTML = JSON.stringify(out);
                document.getElementById("naytaKeksi").style.color = "";
            }
        }).catch(err => console.error(err));
});