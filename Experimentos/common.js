function toggleHelper() {
    console.log(document.getElementsByClassName("helper")[0].style)
    if (document.getElementsByClassName("helper")[0].style.display == "") {
        document.getElementsByClassName("helper")[0].style.display = "block"
    }
    else {
        document.getElementsByClassName("helper")[0].style.display = ""
    }
}