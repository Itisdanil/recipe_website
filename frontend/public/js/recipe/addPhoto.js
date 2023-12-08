document.getElementById('photo').addEventListener('change', function() {
    let file = this.files[0];
    let reader = new FileReader();

    reader.onload = function(e) {
        let image = document.getElementById('image');
        image.src = e.target.result;
    }

    reader.readAsDataURL(file);
});